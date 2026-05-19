# Smart Leads Dashboard — API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this shape:
```json
{
  "success": true | false,
  "message": "string",
  "data": <payload>,
  "meta": { "total", "page", "limit", "totalPages", "hasNextPage", "hasPrevPage" },
  "errors": [{ "field": "string", "message": "string" }]
}
```

---

## Authentication

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "sales"
}
```
`role` is optional — defaults to `"sales"`. Accepted values: `"admin"`, `"sales"`.

**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" },
    "token": "<jwt>"
  }
}
```

---

### POST /auth/login
Authenticate and receive a JWT.

**Body:**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" },
    "token": "<jwt>"
  }
}
```

---

### GET /auth/me
Returns the authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales" }
}
```

---

## Leads

All lead endpoints require `Authorization: Bearer <token>`.

### GET /leads
Fetch a paginated, filtered list of leads.

**Query Parameters:**

| Param    | Type   | Description                                          |
|----------|--------|------------------------------------------------------|
| `status` | string | Filter by status: `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | Filter by source: `Website`, `Instagram`, `Referral` |
| `search` | string | Search by name or email (case-insensitive)           |
| `sort`   | string | `latest` (default) or `oldest`                       |
| `page`   | number | Page number, default `1`                             |
| `limit`  | number | Records per page, default `10`, max `100`            |

Sales users only see leads they created. Admins see all.

**Response 200:**
```json
{
  "success": true,
  "data": [ /* Lead objects */ ],
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

### POST /leads
Create a new lead.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "source": "Instagram",
  "status": "New"
}
```
`status` is optional — defaults to `"New"`.

**Response 201:** Returns the created lead object.

---

### GET /leads/:id
Fetch a single lead by ID.

Sales users may only view their own leads.

**Response 200:** Returns the lead object.

---

### PUT /leads/:id
Update a lead. All fields are optional.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@new.com",
  "status": "Qualified",
  "source": "Referral"
}
```

Sales users may only update their own leads.

**Response 200:** Returns the updated lead object.

---

### DELETE /leads/:id
Delete a lead. **Admin only.**

**Response 200:**
```json
{ "success": true, "message": "Lead deleted successfully", "data": null }
```

---

### GET /leads/export
Export leads as CSV. Supports the same filters as `GET /leads` (except pagination).

**Response:** `text/csv` file download (`leads-export.csv`).

---

## Users (Admin only)

All user management endpoints require an admin JWT.

### GET /users
List all users (passwords excluded).

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Jane Doe", "email": "jane@example.com", "role": "sales", "createdAt": "..." }
  ]
}
```

---

### DELETE /users/:id
Delete a user. Admins cannot delete their own account.

**Response 200:**
```json
{ "success": true, "message": "User deleted successfully", "data": null }
```

---

## Error Responses

| Status | Meaning                        |
|--------|--------------------------------|
| 400    | Bad request / validation error |
| 401    | Missing or invalid JWT         |
| 403    | Insufficient permissions       |
| 404    | Resource not found             |
| 409    | Conflict (e.g. duplicate email)|
| 422    | Validation failed              |
| 500    | Internal server error          |

**Validation error shape (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```
