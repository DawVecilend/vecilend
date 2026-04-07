# Vecilend

Plataforma web de préstec i lloguer d'objectes entre veïns amb geolocalització. Connecta persones properes per compartir objectes de forma fàcil, segura i sostenible.

## Stack Tecnològic

| Capa                | Tecnologia                              |
|---------------------|-----------------------------------------|
| Frontend            | React + Vite + Tailwind CSS             |
| Backend             | Laravel (PHP 8.4) + Sanctum             |
| Base de dades       | PostgreSQL 15 + PostGIS 3.3             |
| Client HTTP         | Axios                                   |
| Mapes               | Leaflet                                 |
| Imatges             | Cloudinary                              |
| Auth                | Sanctum (API tokens) + Google OAuth2    |
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

> [!NOTE]
> También funciona para cargar todos los datos

El backend s'encarrega automàticament d'instal·lar dependències, generar l'APP_KEY, executar les migracions i poblar la base de dades amb les dades inicials (seeders). El primer arranc pot trigar ~30 segons. Es pot seguir el progrés amb:

```bash
docker compose logs -f backend
```

Quan aparegui `🚀 Arrancant servidor Laravel...`, tot està llest.

Un cop aixecat:

| Servei    | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:5173        |
| Backend   | http://localhost:8000/api/v1 |
| PostgreSQL| localhost:5432               |

### Ús diari

```bash
docker compose up -d      # Arrencar
docker compose down        # Aturar
```

No cal reconstruir (`build`) tret que canviï un Dockerfile o el `docker-compose.yml`.

## Estructura del Repositori

```
vecilend/
├── docker-compose.yml  # Orquestració de serveis
├── backend/            # Laravel API (amb Dockerfile + entrypoint.sh)
├── frontend/           # React SPA - Vite + Tailwind (amb Dockerfile)
├── db/                 # PostgreSQL + PostGIS (Dockerfile)
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
cd backend
./vendor/bin/pint          # Formatejar tot el projecte
./vendor/bin/pint --test   # Verificar sense modificar
```

#### Nomenclatura

| Element          | Convenció                        | Exemple                                     |
|------------------|----------------------------------|---------------------------------------------|
| Controller       | Singular, PascalCase, sufix      | `ObjectController`                          |
| Model            | Singular, PascalCase             | `Object`, `User`, `Conversation`            |
| Migration        | snake_case, taula en plural      | `create_objects_table`                      |
| Seeder           | Singular, sufix                  | `ObjectSeeder`                              |
| Factory          | Singular, sufix                  | `ObjectFactory`                             |
| Form Request     | Acció + Model + Request          | `StoreObjectRequest`, `UpdateObjectRequest` |
| API Resource     | Singular / Collection            | `ObjectResource`, `ObjectCollection`        |
| Policy           | Singular, sufix                  | `ObjectPolicy`                              |
| Event            | PascalCase, descriptiu           | `ObjectPublished`                           |
| Notification     | PascalCase, descriptiu           | `NewMessageReceived`                        |
| Middleware       | PascalCase, descriptiu           | `EnsureEmailIsVerified`                     |

#### Estructura de l'API

Totes les rutes van sota el prefix `/api/v1/`. S'utilitzen **API Resources** per transformar les respostes.

```
GET    /api/v1/objects              → ObjectController@index
POST   /api/v1/objects              → ObjectController@store
GET    /api/v1/objects/{object}     → ObjectController@show
PUT    /api/v1/objects/{object}     → ObjectController@update
DELETE /api/v1/objects/{object}     → ObjectController@destroy
```

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

Laravel Sanctum en mode API token (no SPA cookies). Totes les rutes protegides usen el middleware `auth:sanctum`.

---

### Frontend (React)

#### Estil i Formatació

S'utilitzen **ESLint** i **Prettier** de forma conjunta. Prettier gestiona el format, ESLint la qualitat del codi.

```bash
cd frontend
npx eslint .               # Comprovar errors
npx eslint . --fix         # Corregir automàticament
npx prettier --write .     # Formatejar tot
```

Es recomana configurar l'editor perquè formategi al desar (Format on Save).

#### Nomenclatura

| Element          | Convenció                        | Exemple                              |
|------------------|----------------------------------|--------------------------------------|
| Component        | PascalCase, `.jsx`               | `ObjectCard.jsx`                     |
| Page             | PascalCase, `.jsx`               | `ObjectDetail.jsx`                   |
| Hook             | camelCase, prefix `use`          | `useAuth.js`, `useObjects.js`        |
| Service/API      | camelCase, `.js`                 | `objectService.js`, `authService.js` |
| Context          | PascalCase, sufix                | `AuthContext.jsx`                    |
| Constants        | UPPER_SNAKE_CASE                 | `API_BASE_URL`, `MAX_UPLOAD_SIZE`    |
| Utilities        | camelCase, `.js`                 | `formatDate.js`, `geocoding.js`      |

#### Estructura de Carpetes

```
frontend/src/
├── components/         # Components reutilitzables
│   ├── ui/             # Botons, inputs, modals genèrics
│   └── layout/         # Header, Footer, Sidebar, BottomNav
├── pages/              # Vistes/pàgines (una per ruta)
├── hooks/              # Custom hooks
├── services/           # Crides a l'API (axios)
├── contexts/           # React Context providers
├── utils/              # Funcions auxiliars
├── assets/             # Imatges, fonts, SVGs
└── styles/             # Tailwind config, globals
```

#### Regles Generals

- **Funcions fletxa** per a components: `const MyComponent = () => { ... }`
- **Desestructuració** de props: `const ObjectCard = ({ title, price }) => { ... }`
- Un component per fitxer, el nom del fitxer coincideix amb el nom del component.
- Estils amb classes de **Tailwind** directament al JSX. Evitar CSS custom tret de casos excepcionals.
- Variables d'entorn al fitxer `.env` amb prefix `VITE_` (ex: `VITE_API_URL`).
- **Axios** com a client HTTP. Configurar una instància centralitzada a `services/api.js` amb `baseURL`, interceptors per al token de Sanctum i gestió global d'errors.

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

Format: `descripció breu`

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
| ESLint             | Frontend | `frontend/eslint.config.js`  |
| Prettier           | Frontend | `frontend/.prettierrc`       |
| EditorConfig       | Global   | `.editorconfig`              |

---

## Llicència

Aquest projecte està sota la llicència [Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
