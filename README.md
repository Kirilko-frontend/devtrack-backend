# DevTrack Backend

REST API for **DevTrack**, a job application tracker that replaces the messy Excel sheet: companies, vacancies, interviews and a dashboard with statistics in one place.

- **Live API:** https://devtrack-backend-314v.onrender.com
- **Live app:** https://devtrack-frontend-e0ru.onrender.com
- **Frontend repository:** https://github.com/Kirilko-frontend/devtrack-frontend

> The API is hosted on Render's free plan. After 15 minutes of inactivity it goes to sleep, so the first request can take 30-60 seconds.

## Features

- Cookie-based JWT authentication (register, login, logout, current user)
- Companies: create, edit, list, delete
- Vacancies linked to companies, with statuses (`SAVED`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `REJECTED`)
- Vacancy status history (every status change is recorded)
- Interviews linked to vacancies (date, type, notes)
- Dashboard endpoint with aggregated statistics
- Per-user data isolation: every resource is checked against the authenticated user
- Request validation with `class-validator` DTOs
- Swagger decorators on DTOs

## Tech stack

- **NestJS** + **TypeScript**
- **PostgreSQL** + **Prisma 7** (migrations, typed client)
- **JWT** authentication stored in an httpOnly cookie
- **class-validator** for input validation
- Deployed on **Render** (Web Service + managed PostgreSQL)

## Getting started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (local or hosted)

### Installation

```bash
git clone <repo-url>
cd devtrack-backend
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devtrack
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=1d
PORT=3000
FRONTEND_URL=http://localhost:5173
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `15m`, `1d` |
| `PORT` | Server port (Render sets this automatically) |
| `FRONTEND_URL` | Allowed CORS origin (no trailing slash) |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Database

```bash
npx prisma generate
npx prisma migrate dev
```

### Run

```bash
# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Companies | CRUD under `/companies` |
| Vacancies | CRUD under `/vacancies` |
| Interviews | CRUD under `/interviews` |
| Dashboard | `GET /dashboard` |

All endpoints except register and login require authentication.

## Deployment (Render)

1. Create a **PostgreSQL** instance and copy its *Internal Database URL*.
2. Create a **Web Service** from this repo, in the same region as the database.
3. Build command:
   ```
   npm install --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
4. Start command: `npm run start:prod`
5. Add the environment variables listed above.

### Cookies across domains

The frontend and the API live on different `onrender.com` subdomains, which browsers treat as different sites and often block third-party cookies between them. The frontend therefore proxies API calls through its own domain (`/api/*` rewritten to this service), which makes the auth cookie first-party.

## Project status

Actively developed. Planned: notification manager, Docker setup and CI/CD.

## Author

**Kyrylo Kakulia**, Frontend / Fullstack Developer
<your GitHub / LinkedIn / email>
