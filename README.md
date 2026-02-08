**NestJS + React + Vite + Tailwind + Turbo Template**

This repository is a **full-stack monorepo template** using **npm workspaces** and **Turborepo** to manage a React frontend and a NestJS backend in a single repository.

The goal of this template is to provide:

- A minimal but correct monorepo setup
- Clear separation of frontend and backend concerns
- Centralized dependency management
- Coordinated development scripts without over-engineering

This is a **template**, not a production-ready system.

---

## Repository Structure

```
.
├── apps/
│   ├── backend/          # NestJS backend application
│   └── frontend/         # React + Vite + Tailwind frontend
├── packages/             # Optional shared packages (empty by default)
├── package.json          # Root workspace + Turbo configuration
├── package-lock.json     # Single lockfile for the entire monorepo
├── turbo.json            # Turbo task pipeline
└── README.md
```

### Key Structural Notes

- This **is a monorepo**
- Dependency management is centralized at the **root**
- Each app remains a **standalone project**
- No code is shared by default
- Shared packages are optional, not assumed

---

## Tech Stack

### Backend (`apps/backend`)

- NestJS
- TypeScript
- Basic “Hello World” API

### Frontend (`apps/frontend`)

- React
- Vite
- TailwindCSS
- TypeScript

### Tooling

- npm workspaces (monorepo management)
- Turborepo (task orchestration and caching)

---

## Prerequisites

You need:

- Node.js (LTS recommended)
- npm (v7+ required for workspaces)

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

This command:

- Uses Turbo to run the `dev` script in each app
- Starts the NestJS backend
- Starts the Vite frontend
- Streams logs with app prefixes

### Default Ports

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Environment Variables & Firebase Setup

This template **requires several environment variables** to be defined for both the backend and frontend.
If any required variable is missing or malformed, the app **will fail at startup**.

---

## Common Startup Error (Firebase Admin)

If you see an error like this when starting the backend:

```
SyntaxError: "undefined" is not valid JSON
    at JSON.parse (<anonymous>)
    at firebase.module.ts
```

### What this means

This error happens because **Firebase Admin expects a service account JSON**, but the environment variable that should contain it is either:

* Missing
* Named incorrectly
* Not wrapped in quotes
* Not valid JSON

Internally, the backend does something like:

```ts
JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
```

If `FIREBASE_SERVICE_ACCOUNT` is `undefined`, `JSON.parse` crashes immediately — which is why the error mentions `"undefined"` instead of Firebase directly.

### Fix

You **must provide a valid Firebase service account JSON** via the `FIREBASE_SERVICE_ACCOUNT` environment variable, wrapped in quotes.

---

## Backend Environment Variables

Create a `.env` file in `apps/backend` and ensure **all** of the following exist:

```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=xxx
PORT=3000
MONGO_URI=mongodb_connection_string
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT='{ ... }'
FRONTEND_URL=your_frontend_url
```

### Important notes

* `JWT_EXPIRES` **must be an integer**, not a string
  Example: `604800000` (7 days in milliseconds)
* `NODE_ENV` **must** be set to `development` for local dev
* `FIREBASE_SERVICE_ACCOUNT` **must**:

  * Be valid JSON
  * Be wrapped in **single quotes**
  * Contain the **entire service account object** from Firebase

Example (shortened):

```env
FIREBASE_SERVICE_ACCOUNT='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@your-project-id.iam.gserviceaccount.com"
}'
```

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
VITE_BACKEND_BASE_URL=your_backend_url
```

These values come from your **Firebase Web App configuration**, not the service account.

---

## Firebase Project Setup (Required)

This template **will not work** unless Firebase is configured correctly.

### 1. Create a Firebase Project

1. Go to the Firebase Console
2. Click **Add project**
3. Follow the setup steps (Analytics optional)

---

### 2. Enable Authentication

1. In Firebase Console → **Authentication**
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Google**
5. Save changes

This is required for Google OAuth to work.

---

### 3. Create a Firebase Web App (Frontend)

1. Firebase Console → Project Settings
2. Scroll to **Your apps**
3. Click the **Web (`</>`)** icon
4. Register the app
5. Copy the config values into your frontend `.env`

---

### 4. Generate a Service Account (Backend)

1. Firebase Console → **Project Settings**
2. Go to **Service accounts**
3. Click **Generate new private key**
4. Download the JSON file
5. Copy **the entire JSON object**
6. Paste it into `FIREBASE_SERVICE_ACCOUNT` in your backend `.env`
7. Wrap it in **single quotes**

⚠️ **Never commit this file or value to GitHub.**
It grants full admin access to your Firebase project.

---

## Why This Is Required

* Firebase **client SDK** → used in the frontend
* Firebase **Admin SDK** → used in the backend for:

  * Token verification
  * Secure user management
  * Server-side auth logic

The Admin SDK **cannot initialize** without a service account, and the app will crash immediately if it’s missing.

## App Independence

Even though this is a monorepo:

- Frontend and backend **do not depend on each other**
- They can be deployed independently
- They can be developed in isolation
- No API client or shared types are included by default

If you want frontend ↔ backend communication, you must:

- Configure CORS in the backend
- Add environment variables in the frontend
- Implement API calls manually

This is intentional.

---

## Turbo Configuration

Turbo is configured via `turbo.json` and operates on **script names**, not commands.

If an app does not define a script (e.g. `dev`, `build`, `lint`), Turbo will skip it.

Turbo is used only for:

- Task orchestration
- Caching
- Parallel execution

It does not manage dependencies or enforce architecture.

---

## Shared Packages (Optional)

If you want shared code (e.g. types, utilities):

```
packages/
└── shared/
    ├── src/
    └── package.json
```

Shared packages are:

- Explicit opt-in
- Versioned like normal npm packages
- Imported normally by frontend/backend

Nothing is shared by default.

---

## What This Template Intentionally Does NOT Include

- Authentication
- Database setup
- API clients
- Shared domain models
- Docker or deployment configs
- CI/CD pipelines

Those decisions are left to the user.

---

## Design Philosophy

This template prioritizes:

- Explicit boundaries
- Minimal assumptions
- Correct monorepo fundamentals
- Ease of extension without lock-in

It avoids:

- Over-abstracted tooling
- Implicit coupling
- Opinionated infrastructure choices
