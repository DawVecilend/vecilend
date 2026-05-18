# Vecilend

Plataforma web de préstec i lloguer d'objectes entre veïns amb geolocalització. Connecta persones properes per compartir objectes de forma fàcil, segura i sostenible.

- 🌐 **Producció:** https://www.vecilend.com
- 🛠️ **Backoffice:** https://www.vecilend.com/backoffice

## Stack Tecnològic

| Capa                | Tecnologia                              |
|---------------------|-----------------------------------------|
| Frontend            | React 19 + Vite 7 + Tailwind CSS v4     |
| Backend             | Laravel 12 (PHP 8.4) + Sanctum 4        |
| Base de dades       | PostgreSQL 15 + PostGIS 3.3             |
| Client HTTP         | Axios                                   |
| Mapes               | Leaflet + React-Leaflet                 |
| Imatges             | Cloudinary                              |
| Auth                | Sanctum (API Bearer tokens)             |
| Correu              | SMTP (Mailtrap en dev, transaccional en prod) |
| Contenidors         | Docker + Docker Compose                 |

## Requisits previs

- [Docker](https://docs.docker.com/get-docker/) i Docker Compose
- [Git](https://git-scm.com/)

## Instal·lació i posada en marxa

```bash
# 1. Clonar el repositori
git clone https://github.com/DawVecilend/vecilend.git
cd vecilend

# 2. Copiar fitxers d'entorn
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Construir i aixecar els contenidors
docker compose build
docker compose up -d
```

El backend s'encarrega automàticament d'instal·lar dependències, generar l'`APP_KEY`, executar les migracions i poblar la base de dades amb les dades inicials (seeders) si la BD està buida. El primer arranc pot trigar uns minuts. Es pot seguir el progrés amb:

```bash
docker compose logs -f backend
```

Quan aparegui `🚀 Arrancant servidor Laravel...`, tot està llest.

Un cop aixecat, els serveis disponibles són:

| Servei      | URL                          | Descripció                                |
|-------------|------------------------------|-------------------------------------------|
| Frontend    | http://localhost:5173        | SPA React (portal de client + Backoffice) |
| Backend     | http://localhost:8000/api/v1 | API REST Laravel                          |
| PostgreSQL  | localhost:5432               | Base de dades (admin / admin)             |

> El servei `scheduler` també s'arrenca automàticament i executa `php artisan schedule:work` en un contenidor separat per a tasques programades (recordatoris, neteja de tokens caducats, etc.).

### Ús diari

```bash
docker compose up -d       # Arrencar
docker compose down        # Aturar
```

No cal reconstruir (`build`) tret que canviï un Dockerfile o el `docker-compose.yml`.

### Reinici net de la base de dades

Si vols tornar a començar amb dades fresques:

```bash
docker compose exec backend php artisan migrate:fresh --seed
```

## Estructura del Repositori

```
vecilend/
├── docker-compose.yml  # Orquestració de serveis (db, backend, scheduler, frontend)
├── backend/            # Laravel 12 API (amb Dockerfile + entrypoint.sh)
├── frontend/           # React 19 SPA - Vite + Tailwind (amb Dockerfile)
├── db/                 # PostgreSQL 15 + PostGIS 3.3 (Dockerfile)
├── docs/               # Documentació del projecte
├── .editorconfig       # Configuració d'editor compartida
└── README.md
```

---

## Convencions de Codi

### Backend (Laravel)

#### Estil i Formatació

S'utilitza **Laravel Pint** amb el preset `laravel` (basat en PSR-12). Per formatejar el codi:

```bash
docker compose exec backend ./vendor/bin/pint          # Formatejar tot el projecte
docker compose exec backend ./vendor/bin/pint --test   # Verificar sense modificar
```

#### Nomenclatura

| Element          | Convenció                        | Exemple                                     |
|------------------|----------------------------------|---------------------------------------------|
| Controller       | Singular, PascalCase, sufix      | `ObjecteController`                         |
| Model            | Singular, PascalCase             | `Objecte`, `User`, `Conversa`               |
| Migration        | snake_case, taula en plural      | `create_objectes_table`                     |
| Seeder           | Singular, sufix                  | `ObjecteSeeder`                             |
| Factory          | Singular, sufix                  | `ObjecteFactory`                            |
| Form Request     | Acció + Model + Request          | `StoreObjecteRequest`, `UpdateObjecteRequest` |
| API Resource     | Singular / Collection            | `ObjecteResource`, `ObjecteCollection`      |
| Policy           | Singular, sufix                  | `ObjectePolicy`                             |
| Notification     | PascalCase, descriptiu           | `NewMessageReceived`                        |
| Middleware       | PascalCase, descriptiu           | `EnsureEmpleat`                             |

#### Estructura de l'API

Totes les rutes van sota el prefix `/api/v1/` i es defineixen a `backend/routes/api_v1.php`. S'utilitzen **API Resources** per transformar les respostes.

```
GET    /api/v1/objects              → ObjecteController@index
POST   /api/v1/objects              → ObjecteController@store
GET    /api/v1/objects/{id}         → ObjecteController@show
PUT    /api/v1/objects/{id}         → ObjecteController@update
DELETE /api/v1/objects/{id}         → ObjecteController@destroy
```

Hi ha un segon grup de rutes sota `/api/v1/backoffice/` reservat als empleats (autenticats amb el middleware `empleat`). Els endpoints només accessibles per administradors duen, addicionalment, el middleware `empleat:admin`.

Respostes estandarditzades:

```json
// Èxit (200/201)
{
  "data": { ... }
}

// Col·lecció paginada
{
  "data": [ ... ],
  "meta": { "current_page": 1, "last_page": 5, "per_page": 15, "total": 73 },
  "links": { "first": "...", "last": "...", "prev": null, "next": "..." }
}

// Error (4xx/5xx)
{
  "message": "Descripció de l'error",
  "errors": { "camp": ["detall de validació"] }
}
```

#### Autenticació

Laravel Sanctum en mode **API Bearer token** (no SPA cookies, no `statefulApi()`). Cal incloure la capçalera `Authorization: Bearer <token>` a totes les peticions a rutes protegides.

- Login portal de client: `POST /api/v1/login` (autentica contra la taula `users`)
- Login Backoffice: `POST /api/v1/backoffice/login` (autentica contra la taula `empleats`)
- Les rutes protegides usen el middleware `auth:sanctum`
- Les rutes del Backoffice usen, a més, `empleat` (i opcionalment `empleat:admin`)

Els endpoints de login estan protegits amb rate limiting (`throttle:login`): 5 intents per minut per parella (`login`, IP).

#### Geolocalització (PostGIS)

La columna `users.ubicacio` és de tipus `geography(Point, 4326)`. La consulta de proximitat fa servir `ST_DWithin` (en metres directament, sense conversió) i `ST_Distance` per ordenar per distància.

- Cerca per proximitat: `GET /api/v1/objects/nearby?lat=...&lng=...&radius=...`
- L'API exposa `distancia_metres` quan la petició inclou `lat` i `lng`.

> ⚠️ **PHPUnit + PostGIS**: la BD per defecte de Laravel (SQLite en testing) no suporta PostGIS. Per executar tests d'espai, configureu `DB_CONNECTION=pgsql` al `phpunit.xml`.

---

### Frontend (React)

#### Estil i Formatació

S'utilitzen **ESLint** i **Prettier** de forma conjunta. Prettier gestiona el format, ESLint la qualitat del codi.

```bash
docker compose exec frontend npx eslint .               # Comprovar errors
docker compose exec frontend npx eslint . --fix         # Corregir automàticament
docker compose exec frontend npx prettier --write .     # Formatejar tot
```

Es recomana configurar l'editor perquè formategi al desar (Format on Save).

#### Nomenclatura

| Element          | Convenció                        | Exemple                              |
|------------------|----------------------------------|--------------------------------------|
| Component        | PascalCase, `.jsx`               | `ObjectCard.jsx`                     |
| Page             | PascalCase, `.jsx`               | `ObjectPage.jsx`                     |
| Hook             | camelCase, prefix `use`          | `useAuth.js`, `useObjects.js`        |
| Service/API      | camelCase, `.js`                 | `objectService.js`, `authService.js` |
| Context          | PascalCase, sufix `Context`      | `AuthContext.jsx`                    |
| Constants        | UPPER_SNAKE_CASE                 | `API_BASE_URL`, `MAX_UPLOAD_SIZE`    |
| Utilities        | camelCase, `.js`                 | `formatDate.js`, `geocoding.js`      |

#### Estructura de Carpetes

```
frontend/src/
├── components/         # Components reutilitzables
│   ├── ui/             # Botons, inputs, modals genèrics
│   ├── layouts/        # Header, Footer, Sidebar, BottomNav
│   └── admin/          # Components específics del Backoffice
├── pages/              # Vistes/pàgines (una per ruta)
│   ├── main/           # Pàgines públiques (Home, FAQ, Terms...)
│   ├── auth/           # Login, Register
│   ├── user/           # Perfil, ajustos, comandes, favorits
│   ├── objects/        # CRUD i detall d'objectes
│   ├── categories/     # Pàgina de categoria
│   ├── chats/          # Llistat i conversa de xats
│   ├── admin/          # Pàgines del Backoffice
│   └── mockups/        # Pantalles de pagament simulat
├── hooks/              # Custom hooks
├── services/           # Crides a l'API (axios)
├── contexts/           # React Context providers (Auth, Toast, UnreadCounts...)
├── mappers/            # Adaptadors de resposta API → format intern
├── utils/              # Funcions auxiliars
├── data/               # Constants i dades estàtiques
└── App.jsx, main.jsx   # Punts d'entrada
```

#### Regles Generals

- **Funcions fletxa** per a components: `const MyComponent = () => { ... }`
- **Desestructuració** de props: `const ObjectCard = ({ title, price }) => { ... }`
- Un component per fitxer, el nom del fitxer coincideix amb el nom del component.
- Estils amb classes de **Tailwind v4** directament al JSX. Evitar CSS custom tret de casos excepcionals.
- Variables d'entorn al fitxer `.env` amb prefix `VITE_` (ex: `VITE_API_URL`).
- **Axios** com a client HTTP. Instància centralitzada a `services/api.js` amb `baseURL`, interceptors per al token de Sanctum i gestió global d'errors (en particular, redirecció a login en cas de 401 via React Router).

---

### Git

#### Branques

| Branca              | Ús                                    | Exemple                 |
|---------------------|---------------------------------------|-------------------------|
| `main`              | Producció, codi estable               |                         |
| `develop`           | Integració, base per a noves features |                         |
| `feature/t-xxx`     | Noves funcionalitats (codi de tasca)  | `feature/t-002`         |
| `bugfix/t-xxx`      | Correccions de bugs                   | `bugfix/t-045`          |
| `hotfix/xxx`        | Correccions urgents a `main`          | `hotfix/login-crash`    |

El nom de la branca ha de coincidir amb el codi de la tasca al Kanban (ex: `feature/t-002` per a la tasca T-002).

#### Commits

Format: una sola línia descriptiva, en imperatiu.

```
afegir endpoint de cerca per proximitat
corregir token refresh en logout
aplicar prettier a components
documentar convencions de codi
actualitzar dependències de composer
```

#### Pull Requests

- Títol descriptiu seguint el format de commits.
- Associar la issue corresponent (`Closes #XX`).
- Mínim 1 reviewer abans de merge.
- Merge a `develop` via **squash merge**.

---

### Eines de Qualitat

| Eina               | Àmbit    | Fitxer de config             |
|--------------------|----------|------------------------------|
| Laravel Pint       | Backend  | `backend/pint.json`          |
| PHPUnit            | Backend  | `backend/phpunit.xml`        |
| ESLint             | Frontend | `frontend/eslint.config.js`  |
| Prettier           | Frontend | `frontend/.prettierrc`       |
| EditorConfig       | Global   | `.editorconfig`              |

---

## Documentació addicional

- **Manual d'usuari** (`docs/manual-usuari-vecilend.pdf`): guia funcional per a usuaris finals.

---

## Llicència

Aquest projecte està sota la llicència [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
