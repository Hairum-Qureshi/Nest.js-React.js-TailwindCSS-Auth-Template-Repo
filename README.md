# NestJS + React + Vite + Tailwind + Turbo (with Google Auth)

This repository is a **full-stack monorepo template** using **npm workspaces** and **Turborepo** to manage a React frontend and a NestJS backend in a single repository.

It is based on a minimal monorepo foundation, with **Google authentication pre-wired using Firebase** so you don’t have to build auth plumbing from scratch.

This is a **template**, not a production-ready system.

---

## What This Template Is

This template provides:

* A correct, minimal **monorepo setup**
* Clear separation of frontend and backend concerns
* Centralized dependency management
* Coordinated development scripts
* **Working Google OAuth (Firebase) across frontend and backend**

Authentication is included, but only to the extent required to:

* Sign users in with Google on the frontend
* Verify and trust those users on the backend

Everything else remains intentionally unopinionated.

---

## What This Template Is *Not*

This template does **not** try to be a full application starter.

It does **not** include:

* User roles or permissions
* Auth-based authorization rules
* Session persistence strategies
* Database schemas or migrations
* API clients or shared domain models
* Deployment, Docker, or CI/CD

Those decisions are left to the user.

---

## Repository Structure

```
.
├── apps/
│   ├── backend/          # NestJS backend (Firebase Admin + JWT + Mongo)
│   └── frontend/         # React + Vite + Tailwind (Firebase client)
├── packages/             # Optional shared packages (empty by default)
├── package.json          # Root workspace + Turbo configuration
├── package-lock.json     # Single lockfile for the entire monorepo
├── turbo.json            # Turbo task pipeline
└── README.md
```

### Key Structural Notes

* This **is a monorepo**
* Dependency management is centralized at the **root**
* Each app remains a **standalone project**
* No shared code is assumed
* Shared packages are optional and explicit

---

## Tech Stack

### Backend (`apps/backend`)

* NestJS
* TypeScript
* Firebase Admin SDK
* JWT-based session tokens
* MongoDB (wired, no schemas assumed)

### Frontend (`apps/frontend`)

* React
* Vite
* TailwindCSS
* TypeScript
* Firebase Client SDK (Google sign-in)

### Tooling

* npm workspaces
* Turborepo

---

## Prerequisites

You need:

* Node.js (LTS recommended)
* npm (v7+ for workspaces)

---

## Installation

From the **repository root**:

```bash
npm install
```

This installs dependencies for **all workspace packages** and generates a **single `package-lock.json`**.

Do not run `npm install` inside individual apps.

---

## Development

Run all development servers concurrently:

```bash
npm run dev
```

This uses Turbo to:

* Start the NestJS backend
* Start the Vite frontend
* Stream logs with app prefixes

### Default Ports

* Backend: `http://localhost:3000`
* Frontend: `http://localhost:5173`

---

## Environment Variables & Firebase Setup

This template **will not start** unless required environment variables are present and valid.

Both frontend and backend rely on Firebase, but for **different purposes**:

* Frontend → Firebase **client SDK**
* Backend → Firebase **Admin SDK**

---

## Common Startup Error (Firebase Admin)

If the backend crashes with:

```
SyntaxError: "undefined" is not valid JSON
    at JSON.parse (<anonymous>)
    at firebase.module.ts
```

### What’s happening

The backend expects a Firebase **service account JSON** via:

```ts
JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
```

If the variable is missing, misnamed, or malformed, the process crashes immediately.

---

### Fix

You **must** provide a valid Firebase service account JSON via the
`FIREBASE_SERVICE_ACCOUNT` environment variable, wrapped in **single quotes**.

---

## Another Common Startup Error (MongoDB)

You may also see an error similar to:

```
MongoParseError: URI must be provided
```

or:

```
MongooseError: The `uri` parameter to `openUri()` must be a string
```

### What this means

This error simply means that **no MongoDB connection string was provided**.

The backend expects a MongoDB URI via the `MONGO_URI` environment variable.
If it’s missing, empty, or misspelled, Nest will fail during startup.

This error is **not related to Firebase or Google Auth**.

---

### Fix

Make sure your backend `.env` file includes:

```env
MONGO_URI=mongodb_connection_string
```

This can be:

* A local MongoDB instance

  ```
  mongodb://localhost:27017/your-db-name
  ```

* Or a hosted provider (e.g. MongoDB Atlas)

Once `MONGO_URI` is defined, the backend should start normally.

## Backend Environment Variables

Create a `.env` file in `apps/backend`:

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=604800000
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb_connection_string
FIREBASE_SERVICE_ACCOUNT='{ ... }'
```

### Important Notes

* `JWT_EXPIRES` must be a **number**, not a string
* `NODE_ENV` must be `development` for local dev
* `FIREBASE_SERVICE_ACCOUNT` must:

  * Be valid JSON
  * Be wrapped in **single quotes**
  * Contain the **entire service account object**

Example (truncated):

```env
FIREBASE_SERVICE_ACCOUNT='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@your-project-id.iam.gserviceaccount.com"
}'
```

⚠️ **Never commit this value.**
It grants full admin access to your Firebase project.

---

## Frontend Environment Variables

Create a `.env` file in `apps/frontend`:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:3000
```

These values come from your **Firebase Web App configuration**, not the service account.

---

## Firebase Project Setup (Required)

### 1. Create a Firebase Project

* Firebase Console → Add project

### 2. Enable Google Authentication

* Authentication → Sign-in method → Enable **Google**

### 3. Create a Firebase Web App

* Project Settings → Web app
* Copy config into frontend `.env`

### 4. Generate a Service Account (Backend)

* Project Settings → Service accounts
* Generate new private key
* Paste JSON into `FIREBASE_SERVICE_ACCOUNT`
* Wrap in single quotes

---

## App Independence (Still True)

Even with auth included:

* Frontend and backend are **not tightly coupled**
* They can be deployed independently
* No shared packages are required
* API communication is explicit

Auth establishes **trust**, not architectural dependency.

---

## Turbo Configuration

Turbo operates on **script names**, not commands.

If an app doesn’t define `dev`, `build`, or `lint`, Turbo skips it.

Turbo is used only for:

* Task orchestration
* Caching
* Parallel execution

It does not enforce architecture.
