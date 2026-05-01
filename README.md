# Backend API — Express.js + MongoDB

A REST API with authentication and CRUD functionality built with **Express.js**, **MongoDB**, and **JWT**.

---

## Features

- **Signup** — Schema validation (Joi), sends verification email
- **Email Verification** — Secure token-based verification via email link
- **Login** — Issues JWT Access Token + Refresh Token
- **JWT Middleware** — Protects private routes, auto-rejects expired tokens
- **Tasks CRUD** — Fully functional, scoped to authenticated user

---

## Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| Framework    | Express.js               |
| Database     | MongoDB + Mongoose       |
| Auth         | JWT (Access + Refresh)   |
| Validation   | Joi                      |
| Email        | Nodemailer               |
| Password     | bcryptjs                 |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Fill in your values
```

### 3. Run the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint             | Description                        | Auth Required |
|--------|----------------------|------------------------------------|---------------|
| POST   | `/signup`            | Register new user                  | No            |
| GET    | `/verify-email`      | Verify email via token             | No            |
| POST   | `/login`             | Login and receive tokens           | No            |
| POST   | `/refresh-token`     | Get new access token               | No            |
| POST   | `/logout`            | Invalidate refresh token           | Yes           |
| GET    | `/me`                | Get current user profile           | Yes           |

### Task Routes — `/api/tasks` *(all require auth)*

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| GET    | `/`            | Get all tasks (filter + paginate)  |
| POST   | `/`            | Create a new task                  |
| GET    | `/:id`         | Get one task by ID                 |
| PUT    | `/:id`         | Update a task                      |
| DELETE | `/:id`         | Delete a task                      |

---

## Request & Response Examples

### POST `/api/auth/signup`
```json
// Request
{
  "name": "Sandara Tajanlangit",
  "email": "tajanlangitsandara32@gmail.com",
  "password": "Stajan123!",
  "confirmPassword": "Stajan123!"
}

// Response 201
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "user": { "id": "...", "name": "Sandara Tajanlangit", "email": "tajanlangitsandara32@gmail.com" }
}
```

### POST `/api/auth/login`
```json
// Request
{
  "email": "tajanlangitsandara32@gmail.com",
  "password": "Stajan123!"
}

// Response 200
{
  "success": true,
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": { "id": "...", "name": "Sandara Tajanlangit", "email": "tajanlangitsandara32@gmail.com" }
}
```

### POST `/api/auth/refresh-token`
```json
// Request
{ "refreshToken": "eyJhbGci..." }

// Response 200
{ "success": true, "accessToken": "eyJhbGci..." }
```

### POST `/api/tasks` *(Bearer Token required)*
```json
// Request
{
  "title": "Finish the backend activity",
  "description": "Build Express API with auth and CRUD",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2024-12-31"
}

// Response 201
{ "success": true, "message": "Task created successfully.", "task": { ... } }
```

### GET `/api/tasks?status=pending&priority=high&page=1&limit=5`
```json
// Response 200
{
  "success": true,
  "total": 12,
  "page": 1,
  "totalPages": 3,
  "tasks": [ ... ]
}
```

---

## Authentication Flow

```
1. POST /signup  →  Creates user, sends verification email
2. GET  /verify-email?token=...  →  Marks user as verified
3. POST /login  →  Returns { accessToken, refreshToken }
4. Use accessToken in header:  Authorization: Bearer <accessToken>
5. When accessToken expires  →  POST /refresh-token with refreshToken
6. POST /logout  →  Invalidates refreshToken in DB
```

---

## Project Structure

```
backend-api/
├── server.js                   # App entry point
├── package.json
├── .env.example
└── src/
    ├── config/
    │   └── db.js               # MongoDB connection
    ├── middleware/
    │   └── auth.js             # JWT protect middleware
    ├── models/
    │   ├── User.js             # User schema + password hashing
    │   └── Task.js             # Task schema linked to User
    ├── routes/
    │   ├── auth.js             # Auth route definitions
    │   └── tasks.js            # Task route definitions
    ├── controllers/
    │   ├── authController.js   # Signup, verify, login, refresh, logout
    │   └── taskController.js   # CRUD operations for tasks
    └── utils/
        └── email.js            # Nodemailer email sender
```

---

## Email Setup (for testing)

Use **Mailtrap** (free) to catch emails without sending them to real inboxes:
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Copy your SMTP credentials to `.env`

For production, replace with Gmail (App Password) or SendGrid.
