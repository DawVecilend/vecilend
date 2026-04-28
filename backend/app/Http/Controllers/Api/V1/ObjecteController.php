<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ObjecteResource;
use App\Http\Resources\ObjecteDetailResource;
use App\Models\Objecte;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Api\V1\StoreObjecteRequest;
use App\Models\ImatgeObjecte;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\Api\V1\UpdateObjecteRequest;
use App\Models\User;

class ObjecteController extends Controller
{
    public function __construct(
        private readonly CloudinaryService $cloudinary,
    ) {}

    /**
     * GET /api/v1/objects?search=&category=&sort=&page=&per_page=&lat=&lng=&radius=
     *
     * Endpoint públic — llistat d'objectes disponibles amb filtres, cerca,
     * ordenació i paginació.
     */
    public function index(Request $request)
    {
        $request->validate([
            'search'      => 'nullable|string|max:100',
            'category'    => 'nullable|integer|exists:categories,id',
            'subcategory' => 'nullable|integer|exists:subcategories,id',
            'sort'        => 'nullable|string|in:recent,oldest,price_asc,price_desc,rating',
            'page'        => 'nullable|integer|min:1',
            'per_page'    => 'nullable|integer|min:1|max:50',
            'lat'         => 'nullable|numeric|between:-90,90',
            'lng'         => 'nullable|numeric|between:-180,180',
            'radius'      => 'nullable|integer|min:500|max:50000',
        ]);

        $query = Objecte::query()
            ->ambCoordenades()
            ->disponible()
            ->with([
                'user:id,nom,avatar_url',
                'categoria:id,nom,icona',
                'subcategoria:id,nom,slug',
                'imatges',
            ]);

        if ($request->filled('search')) {
            $query->cerca($request->input('search'));
        }

        if ($request->filled('category')) {
            $query->perCategoria((int) $request->input('category'));
        }

        if ($request->filled('subcategory')) {
            $query->where('subcategoria_id', (int) $request->input('subcategory'));
        }

        if ($request->filled('lat') && $request->filled('lng')) {
            $radius = $this->resolveNearbyRadius($request, $request->all());

            $query->aProximitat(
                (float) $request->input('lat'),
                (float) $request->input('lng'),
                $radius
            );
        }

        $sort = $request->input('sort', 'recent');

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('preu_diari', 'asc');
                break;

            case 'price_desc':
                $query->orderBy('preu_diari', 'desc');
                break;

            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;

            case 'rating':
                $avgRatingSub = DB::table('valoracions')
                    ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
                    ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
                    ->select('solicituds.objecte_id', DB::raw('AVG(valoracions.puntuacio) as avg_rating'))
                    ->groupBy('solicituds.objecte_id');

                $query
                    ->leftJoinSub($avgRatingSub, 'ratings', 'ratings.objecte_id', '=', 'objectes.id')
                    ->orderByRaw('ratings.avg_rating DESC NULLS LAST')
                    ->orderByDesc('objectes.created_at');
                break;

            case 'recent':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $perPage = (int) $request->input('per_page', 20);
        $objectes = $query->paginate($perPage);

        return ObjecteResource::collection($objectes);
    }

    /**
     * GET /api/v1/objects/{id}
     *
     * Retorna el detall complet d'un objecte: propietari, categoria,
     * subcategoria, imatges, valoracions i dates ocupades.
     */
    public function show(int $id)
    {
        $objecte = Objecte::query()
            ->with([
                'user:id,nom,cognoms,avatar_url,created_at',
                'categoria:id,nom,icona',
                'subcategoria:id,nom,slug',
                'imatges',
            ])
            ->findOrFail($id);

        $objecte->user->valoracio_mitjana = $this->calcularValoracioPropietari($objecte->user_id);

        $stats = $this->obtenirEstadistiquesValoracio($id);
        $objecte->valoracio_mitjana = $stats->avg_rating;
        $objecte->total_valoracions = (int) $stats->count_ratings;

        $objecte->valoracions_data = $this->obtenirValoracionsObjecte($id);
        $objecte->dates_ocupades   = $this->obtenirDatesOcupades($id);

        return new ObjecteDetailResource($objecte);
    }

    /**
     * GET /api/v1/objects/nearby?lat=&lng=&radius=[&category=&subcategory=&per_page=]
     *
     * Endpoint públic — retorna els objectes disponibles dins d'un radi
     * (metres) d'una ubicació, ordenats per distància ascendent.
     */
    public function nearby(Request $request)
    {
        $validated = $request->validate([
            'lat'         => ['required', 'numeric', 'between:-90,90'],
            'lng'         => ['required', 'numeric', 'between:-180,180'],
            'radius'      => ['nullable', 'integer', 'min:100', 'max:50000'],
            'category'    => ['nullable', 'integer', 'exists:categories,id'],
            'subcategory' => ['nullable', 'integer', 'exists:subcategories,id'],
            'per_page'    => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $lat    = (float) $validated['lat'];
        $lng    = (float) $validated['lng'];
        $radius = $this->resolveNearbyRadius($request, $validated);

        $query = Objecte::query()
            ->disponible()
            ->with([
                'user:id,nom,avatar_url',
                'categoria:id,nom,icona',
                'subcategoria:id,nom,slug',
                'imatges',
            ])
            ->aProximitat($lat, $lng, $radius)
            ->ordreProximitat();

        if (!empty($validated['category'])) {
            $query->perCategoria((int) $validated['category']);
        }

        if (!empty($validated['subcategory'])) {
            $query->where('subcategoria_id', (int) $validated['subcategory']);
        }

        $perPage  = (int) ($validated['per_page'] ?? 20);
        $objectes = $query->paginate($perPage)->withQueryString();

        return ObjecteResource::collection($objectes);
    }

    /**
     * Resol el radi de cerca (en metres) per al nearby.
     *
     * Ordre de prioritat:
     *   1. Paràmetre radius enviat pel client (en metres).
     *   2. radi_proximitat del User autenticat (en km --> metres).
     *   3. Default públic: 5000 m.
     */
    private function resolveNearbyRadius(Request $request, array $validated): int
    {
        if (isset($validated['radius'])) {
            return (int) $validated['radius'];
        }

        $user = $request->user();
        if ($user && $user->radi_proximitat) {
            return ((int) $user->radi_proximitat) * 1000;
        }

        return 5000;
    }

    private function calcularValoracioPropietari(int $userId): ?float
    {
        $avg = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('objectes', 'objectes.id', '=', 'solicituds.objecte_id')
            ->where('objectes.user_id', $userId)
            ->avg('valoracions.puntuacio');

        return $avg !== null ? round((float) $avg, 1) : null;
    }

    /**
     * Estadístiques de valoracions d'un objecte concret.
     */
    private function obtenirEstadistiquesValoracio(int $objecteId): object
    {
        $result = DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->where('solicituds.objecte_id', $objecteId)
            ->selectRaw('AVG(puntuacio) as avg_rating, COUNT(*) as count_ratings')
            ->first();

        return (object) [
            'avg_rating'    => $result->avg_rating !== null ? round((float) $result->avg_rating, 1) : null,
            'count_ratings' => $result->count_ratings ?? 0,
        ];
    }

    /**
     * Dates ocupades per transaccions actives d'un objecte.
     */
    private function obtenirDatesOcupades(int $objecteId): array
    {
        return DB::table('solicituds')
            ->join('transaccions', 'transaccions.solicitud_id', '=', 'solicituds.id')
            ->where('solicituds.objecte_id', $objecteId)
            ->where('transaccions.estat', 'en_curs')
            ->select('solicituds.data_inici', 'solicituds.data_fi')
            ->orderBy('solicituds.data_inici')
            ->get()
            ->map(fn($row) => [
                'data_inici' => $row->data_inici,
                'data_fi'    => $row->data_fi,
            ])
            ->toArray();
    }

    /**
     * Llista de valoracions individuals d'un objecte amb autor.
     */
    private function obtenirValoracionsObjecte(int $objecteId): array
    {
        return DB::table('valoracions')
            ->join('transaccions', 'transaccions.id', '=', 'valoracions.transaccio_id')
            ->join('solicituds', 'solicituds.id', '=', 'transaccions.solicitud_id')
            ->join('users', 'users.id', '=', 'valoracions.autor_id')
            ->where('solicituds.objecte_id', $objecteId)
            ->select(
                'valoracions.id',
                'valoracions.puntuacio',
                'valoracions.comentari',
                'valoracions.created_at',
                'users.id as autor_id',
                'users.nom as autor_nom'
            )
            ->orderByDesc('valoracions.created_at')
            ->get()
            ->map(fn($row) => [
                'id'         => $row->id,
                'puntuacio'  => $row->puntuacio,
                'comentari'  => $row->comentari,
                'created_at' => $row->created_at,
                'autor'      => [
                    'id'  => $row->autor_id,
                    'nom' => $row->autor_nom,
                ],
            ])
            ->toArray();
    }

    /**
     * GET /api/v1/profile/{username}/objects
     *
     * Obté tots els objectes d'un usuari específic.
     */
    public function getUserObjects(string $username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Usuari no trobat.',
            ], 404);
        }

        $objectes = Objecte::query()
            ->ambCoordenades()
            ->with([
                'categoria:id,nom,icona',
                'subcategoria:id,nom,slug',
                'imatges',
            ])
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        return ObjecteResource::collection($objectes);
    }

    /**
     * POST /api/v1/objects
     *
     * Crea un nou objecte amb imatges pujades a Cloudinary.
     * Requereix autenticació (auth:sanctum).
     */
    public function store(StoreObjecteRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        // ── 1. Crear l'objecte (sense ubicació encara) ──
        $objecte = Objecte::create([
            'user_id'         => $user->id,
            'categoria_id'    => $validated['categoria_id'],
            'subcategoria_id' => $validated['subcategoria_id'],
            'nom'             => $validated['nom'],
            'descripcio'      => $validated['descripcio'],
            'tipus'           => $validated['tipus'],
            'preu_diari'      => $validated['preu_diari'] ?? null,
            'estat'           => 'disponible',
            // ubicacio es posa via SQL raw per PostGIS
            'ubicacio'        => DB::raw(sprintf(
                "ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography",
                $validated['lng'],
                $validated['lat']
            )),
        ]);

        // ── 2. Pujar imatges a Cloudinary i guardar-les ──
        $imatgesData = [];

        foreach ($request->file('imatges') as $index => $fitxer) {
            try {
                $result = $this->cloudinary->upload($fitxer, 'vecilend/objectes');

                $imatgesData[] = [
                    'objecte_id'           => $objecte->id,
                    'url_cloudinary'       => $result['url'],
                    'public_id_cloudinary' => $result['public_id'],
                    'ordre'                => $index,
                ];
            } catch (\Throwable $e) {
                // Si falla una pujada, eliminem l'objecte i les imatges ja pujades
                $this->rollbackImatges($imatgesData);
                $objecte->delete();

                Log::error('Cloudinary upload error', [
                    'objecte_nom' => $validated['nom'],
                    'index'       => $index,
                    'error'       => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Error en pujar les imatges. Torna-ho a provar.',
                ], 500);
            }
        }

        // Inserir totes les imatges d'un cop
        ImatgeObjecte::insert($imatgesData);

        // ── 3. Recarregar amb relacions i retornar ──
        $objecte->load([
            'user:id,nom,avatar_url',
            'categoria:id,nom,icona',
            'subcategoria:id,nom',
            'imatges',
        ]);
        $objecte->lat = $validated['lat'];
        $objecte->lng = $validated['lng'];

        return (new ObjecteResource($objecte))->response()->setStatusCode(201);
    }

    /**
     * Si falla la pujada a Cloudinary a meitat, eliminar les imatges
     * que s'hagin pujat correctament abans de l'error.
     */
    private function rollbackImatges(array $imatgesData): void
    {
        foreach ($imatgesData as $img) {
            try {
                $this->cloudinary->delete($img['public_id_cloudinary']);
            } catch (\Throwable $e) {
                Log::warning('Cloudinary rollback failed', [
                    'public_id' => $img['public_id_cloudinary'],
                    'error'     => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * PUT /api/v1/objects/{id}
     *
     * Actualitza un objecte existent. Només el propietari.
     * Suporta multipart/form-data per noves imatges.
     */
    public function update(UpdateObjecteRequest $request, int $id)
    {
        $objecte = Objecte::findOrFail($id);

        // Autorització via Policy
        $this->authorize('update', $objecte);

        $validated = $request->validated();

        // ── 1. Actualitzar camps bàsics ──
        $campsActualitzables = [
            'nom',
            'descripcio',
            'categoria_id',
            'subcategoria_id',
            'tipus',
            'preu_diari',
            'estat',
        ];

        $dades = collect($validated)->only($campsActualitzables)->toArray();

        if (!empty($dades)) {
            $objecte->update($dades);
        }

        // ── 2. Actualitzar ubicació (si s'envia) ──
        if (isset($validated['lat']) && isset($validated['lng'])) {
            Objecte::setUbicacio($objecte->id, $validated['lat'], $validated['lng']);
        }

        // ── 3. Eliminar imatges marcades ──
        if (!empty($validated['imatges_eliminar'])) {
            $imatgesAEliminar = ImatgeObjecte::where('objecte_id', $objecte->id)
                ->whereIn('id', $validated['imatges_eliminar'])
                ->get();

            foreach ($imatgesAEliminar as $img) {
                try {
                    $this->cloudinary->delete($img->public_id_cloudinary);
                } catch (\Throwable $e) {
                    Log::warning('Cloudinary delete error (update)', [
                        'public_id' => $img->public_id_cloudinary,
                        'error'     => $e->getMessage(),
                    ]);
                }
                $img->delete();
            }
        }

        // ── 4. Pujar noves imatges ──
        if ($request->hasFile('imatges_noves')) {
            // Determinar l'ordre actual més alt
            $ordreMax = $objecte->imatges()->max('ordre') ?? -1;

            foreach ($request->file('imatges_noves') as $fitxer) {
                try {
                    $result = $this->cloudinary->upload($fitxer, 'vecilend/objectes');

                    ImatgeObjecte::create([
                        'objecte_id'           => $objecte->id,
                        'url_cloudinary'       => $result['url'],
                        'public_id_cloudinary' => $result['public_id'],
                        'ordre'                => ++$ordreMax,
                    ]);
                } catch (\Throwable $e) {
                    Log::error('Cloudinary upload error (update)', [
                        'objecte_id' => $objecte->id,
                        'error'      => $e->getMessage(),
                    ]);
                    // Continuem amb les altres imatges — no fem rollback total
                }
            }
        }

        // ── 5. Verificar que queda almenys 1 imatge ──
        $objecte->refresh();
        if ($objecte->imatges()->count() === 0) {
            return response()->json([
                'message' => 'L\'objecte ha de tenir almenys una imatge.',
            ], 422);
        }

        // ── 6. Recarregar i retornar ──
        if (isset($validated['lat']) && isset($validated['lng'])) {
            $objecte->load([
                'user:id,nom,avatar_url',
                'categoria:id,nom,icona',
                'subcategoria:id,nom',
                'imatges',
            ]);
            $objecte->lat = $validated['lat'];
            $objecte->lng = $validated['lng'];
        } else {
            // Recarregar amb scope per obtenir lat/lng existents
            $objecte = Objecte::ambCoordenades()
                ->findOrFail($objecte->id)
                ->load([
                    'user:id,nom,avatar_url',
                    'categoria:id,nom,icona',
                    'subcategoria:id,nom',
                    'imatges',
                ]);
        }

        return new ObjecteResource($objecte);
    }

    /**
     * DELETE /api/v1/objects/{id}
     *
     * Elimina un objecte i totes les seves imatges de Cloudinary.
     * Només el propietari.
     */
    public function destroy(int $id)
    {
        $objecte = Objecte::findOrFail($id);

        // Autorització via Policy
        $this->authorize('delete', $objecte);

        // ── 1. Eliminar imatges de Cloudinary ──
        $imatges = $objecte->imatges;

        foreach ($imatges as $img) {
            try {
                $this->cloudinary->delete($img->public_id_cloudinary);
            } catch (\Throwable $e) {
                Log::warning('Cloudinary delete error (destroy)', [
                    'public_id' => $img->public_id_cloudinary,
                    'error'     => $e->getMessage(),
                ]);
                // Continuem — no volem que una imatge bloquegi l'eliminació
            }
        }

        // ── 2. Eliminar l'objecte (cascade elimina imatges de la BD) ──
        $objecte->delete();

        return response()->json([
            'message' => 'Objecte eliminat correctament.',
        ], 200);
    }
}
