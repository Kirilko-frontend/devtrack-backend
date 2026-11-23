# DevTrack Backend

REST API for **DevTrack**, a job application tracker that replaces the messy Excel sheet: companies, vacancies, interviews, resumes and a dashboard with statistics in one place.

- **Live API:** https://devtrack-backend-sxcc.onrender.com (health check: `/health`, Swagger docs: `/api`)
- **Live app:** https://devtrack-frontend-e0ru.onrender.com
- **Frontend repository:** https://github.com/Kirilko-frontend/devtrack-frontend

> The API is hosted on Render's free plan. After 15 minutes of inactivity it goes to sleep, so the first request can take 30-60 seconds.

## Features

- Cookie-based JWT authentication (register, login, logout, current user)
- Short-lived access token + rotating refresh token (stored hashed in DB, revoked on logout and password change)
- Password reset via emailed single-use link (Brevo in production, Mailpit locally)
- Companies: create, edit, list, delete
- Vacancies linked to companies, with statuses (`SAVED`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `REJECTED`)
- Vacancy status history (every status change is recorded)
- Interviews linked to vacancies (date, type, notes)
- Resume upload and download (files stored on disk via `multer`)
- Dashboard endpoint with aggregated statistics
- Per-user data isolation: every resource is checked against the authenticated user
- Request validation with `class-validator` DTOs
- Swagger documentation at `/api`
- Health check endpoint at `/health`

## Tech stack

- **NestJS** + **TypeScript**
- **PostgreSQL** + **Prisma 7** (migrations, typed client)
- **JWT** authentication stored in an httpOnly cookie
- **class-validator** for input validation
- **Docker** and **Docker Compose** (multi-stage build, non-root user, health check)
- Deployed on **Render** (Docker Web Service + managed PostgreSQL)

## Getting started

There are two ways to run the project: with Docker (recommended) or locally with Node.js.

### Option 1: Docker (recommended)

Runs the whole stack (PostgreSQL, backend, frontend) with one command. No Node.js or PostgreSQL installation needed.

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running).

The Compose files live in a separate repository that ties the frontend and backend together:

```bash
git clone https://github.com/Kirilko-frontend/devtrack.git devtrack
cd devtrack
git clone https://github.com/Kirilko-frontend/devtrack-backend
git clone https://github.com/Kirilko-frontend/devtrack-frontend

cp .env.example .env     # then set DB_PASSWORD and JWT_SECRET
docker compose up --build
```

- App: http://localhost:5173
- API: http://localhost:3000 (Swagger: http://localhost:3000/api)

Useful commands:

```bash
docker compose down        # stop containers, keep database data and uploads
docker compose down -v     # stop containers and delete database data and uploads
docker compose logs -f backend
```

**Development mode with hot reload** (code is mounted into the containers):

```bash
docker compose -f docker-compose.dev.yml up
```

What happens on start:

1. PostgreSQL starts and passes its health check.
2. A one-off `migrate` service runs `prisma migrate deploy`.
3. The backend starts as a non-root user and reports `healthy` once `/health` responds.

Database data and uploaded resumes are stored in Docker volumes, so they survive container restarts.

### Option 2: Local (without Docker)

**Prerequisites:**

- Node.js 20+
- A PostgreSQL database (local or hosted)

```bash
git clone https://github.com/Kirilko-frontend/devtrack-backend
cd devtrack-backend
npm install
```

Create a `.env` file in the project root (see `.env.example`):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/devtrack
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
PORT=3000
FRONTEND_URL=http://localhost:5173
BREVO_API_KEY=
MAIL_FROM=your-verified-sender@example.com
MAILPIT_URL=http://localhost:8025
```

Set up the database and run:

```bash
npx prisma generate
npx prisma migrate dev

# development
npm run start:dev

# production build
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `JWT_EXPIRES_IN` | Access token lifetime, e.g. `15m`, `1h` (default `15m`) |
| `REFRESH_TOKEN_EXPIRES_DAYS` | Refresh token lifetime in days (default `7`) |
| `PORT` | Server port (Render sets this automatically) |
| `FRONTEND_URL` | Allowed CORS origin and base URL for links in emails (no trailing slash) |
| `BREVO_API_KEY` | Brevo API key, used to send emails in production |
| `MAIL_FROM` | Sender email, must be verified in Brevo |
| `MAIL_FROM_NAME` | Sender name (default `DevTrack`) |
| `MAILPIT_URL` | Local Mailpit URL for development, e.g. `http://localhost:8025` |
| `PASSWORD_RESET_EXPIRES_MINUTES` | Reset link lifetime in minutes (default `30`) |
| `NODE_ENV` | Set to `production` to enable `secure` cookies |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit `.env`. Use `.env.example` as the template.

## Docker files in this repository

| File | Purpose |
|---|---|
| `Dockerfile` | Production image: multi-stage build, production dependencies only, runs as the `node` user, has a `HEALTHCHECK` |
| `Dockerfile.dev` | Development image: all dependencies, runs `npm run start:dev` |
| `.dockerignore` | Keeps `node_modules`, `dist`, `.env` and `.git` out of the image |

The production image does not contain the Prisma CLI, so migrations are applied separately (by the `migrate` service in Compose, or manually, see Deployment).

## API overview

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| Users | `GET /users/me`, `PATCH /users/me`, `DELETE /users/me` |
| Companies | CRUD under `/companies` |
| Vacancies | CRUD under `/vacancies` |
| Interviews | CRUD under `/interviews` |
| Resumes | Upload, list and download under `/resumes` |
| Dashboard | `GET /dashboard` |
| Health | `GET /health` |

All endpoints except register, login, refresh, forgot-password, reset-password and health require authentication. Full documentation is available in Swagger at `/api`.

## Emails

Render's free plan blocks outbound SMTP ports, so emails are sent over HTTP:

- **Production:** create a free [Brevo](https://www.brevo.com) account, verify a sender email, create an API key (permission: transactional emails) and set `BREVO_API_KEY` and `MAIL_FROM`.
- **Local:** `docker compose` starts [Mailpit](https://mailpit.axllent.org); open http://localhost:8025 to see sent emails.
- If neither is configured in development, the email text (with the link) is printed to the server log.

## Deployment (Render)

The backend is deployed as a **Docker** Web Service.

1. Create a **PostgreSQL** instance and copy its *Internal Database URL*.
2. Apply migrations to the new database once, from your machine, using the *External Database URL*:
   ```bash
   export DATABASE_URL="<external database url>"
   npx prisma migrate deploy
   unset DATABASE_URL
   ```
3. Create a **Web Service** from this repo, **Language: Docker**, in the same region as the database. Render builds the `Dockerfile` from the repository root.
4. Add the environment variables: `DATABASE_URL` (Internal URL), `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT=3000`, `NODE_ENV=production`, `FRONTEND_URL`, `BREVO_API_KEY`, `MAIL_FROM`.
5. Set **Health Check Path** to `/health`.

Limitations of the free plan: the service sleeps after inactivity, and the file system is ephemeral, so uploaded resumes are lost on every restart or redeploy. For production use, files should go to external object storage (S3, Cloudflare R2).

### Cookies across domains

In production the auth cookie is `httpOnly`, `secure` and `sameSite: 'none'`, so it works when the frontend and the API are on different `onrender.com` subdomains. In development it is `sameSite: 'lax'`.

The frontend also proxies API calls through its own domain (`/api/*` rewritten to this service), which makes the cookie first-party and avoids third-party cookie blocking in browsers.

## Project status

Actively developed. Planned: notification manager, external storage for resumes, CI with GitHub Actions.

## Author

**Kyrylo Kakulia**, Frontend / Fullstack Developer
https://github.com/Kirilko-frontend
https://www.linkedin.com/in/kyrylo-kakulia-3557b9371/
kkir614@gmail.com
