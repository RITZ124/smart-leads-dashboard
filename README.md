# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Tech Stack

**Frontend:** React 18, TypeScript, TailwindCSS, React Router v6, Axios, React Hot Toast  
**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, bcryptjs  
**DevOps:** Docker, Docker Compose, Nginx

---

## Features

- JWT-based authentication with role-based access control (Admin / Sales)
- Full CRUD for leads with status and source tracking
- Advanced filtering: status, source, debounced search, sort by date
- Backend pagination (10 records per page)
- CSV export with active filters applied
- Dark mode support
- Responsive design

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

---

### Option 1 — Local Development

**Backend**

```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

### Option 2 — Docker Compose

```bash
cp .env.example .env
# Set JWT_SECRET in .env
docker-compose up --build
```

App available at `http://localhost`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Description                    | Default                            |
|----------------|--------------------------------|------------------------------------|
| PORT           | Server port                    | 5000                               |
| MONGODB_URI    | MongoDB connection string      | mongodb://localhost:27017/smart-leads |
| JWT_SECRET     | Secret for signing JWTs        | —                                  |
| JWT_EXPIRES_IN | JWT expiry duration            | 7d                                 |
| NODE_ENV       | Environment                    | development                        |
| CLIENT_ORIGIN  | Allowed CORS origin            | http://localhost:5173              |

---

## API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require:  
`Authorization: Bearer <token>`

---

### Auth

#### POST `/auth/register`

Register a new user.

**Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "name": "Jane Smith", "email": "jane@example.com", "role": "sales" },
    "token": "<jwt>"
  }
}
```

---

#### POST `/auth/login`

**Body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response `200`:** same shape as register.

---

#### GET `/auth/me` 🔒

Returns the authenticated user's profile.

---

### Leads

#### GET `/leads` 🔒

Fetch paginated leads with optional filters.

**Query params:**

| Param   | Type                               | Description         |
|---------|------------------------------------|---------------------|
| status  | New \| Contacted \| Qualified \| Lost | Filter by status |
| source  | Website \| Instagram \| Referral  | Filter by source    |
| search  | string                             | Search name/email   |
| sort    | latest \| oldest                   | Sort direction      |
| page    | number                             | Page number (default 1) |
| limit   | number                             | Records per page (default 10) |

**Response `200`:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

#### POST `/leads` 🔒

Create a lead.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

---

#### GET `/leads/:id` 🔒

Get a single lead by ID.

---

#### PUT `/leads/:id` 🔒

Update a lead (partial updates supported).

---

#### DELETE `/leads/:id` 🔒 Admin only

Delete a lead.

---

#### GET `/leads/export` 🔒

Export leads as CSV. Accepts same filter params as `GET /leads` (except pagination).

---

### Users (Admin only)

#### GET `/users` 🔒 Admin

List all users.

#### DELETE `/users/:id` 🔒 Admin

Delete a user (cannot delete self).

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/        # DB connection
│       ├── controllers/   # Route handlers
│       ├── middlewares/   # auth, validate, errorHandler
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── types/         # TypeScript interfaces
│       ├── utils/         # jwt, response helpers
│       └── index.ts       # Entry point
├── frontend/
│   └── src/
│       ├── api/           # Axios API modules
│       ├── components/
│       │   ├── auth/      # ProtectedRoute
│       │   ├── layout/    # Sidebar, AppLayout
│       │   ├── leads/     # LeadForm, LeadRow, etc.
│       │   └── ui/        # Button, Input, Modal, etc.
│       ├── context/       # Auth & Theme context
│       ├── hooks/         # useLeads, useDebounce
│       ├── pages/         # Page components
│       ├── types/         # Shared TypeScript types
│       └── main.tsx
└── docker-compose.yml
```

---

## Role Permissions

| Action             | Admin | Sales |
|--------------------|-------|-------|
| View own leads     | ✅    | ✅    |
| View all leads     | ✅    | ❌    |
| Create lead        | ✅    | ✅    |
| Edit own lead      | ✅    | ✅    |
| Delete any lead    | ✅    | ❌    |
| Export CSV         | ✅    | ✅    |
| Manage users       | ✅    | ❌    |
