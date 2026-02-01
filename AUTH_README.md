# CelebrityPersona Authentication System

## Overview
Complete JWT-based authentication system with role-based access control (RBAC) for CelebrityPersona.

## Features
- ✅ User registration and login
- ✅ JWT access & refresh tokens
- ✅ Role-based authorization (user, admin, superadmin)
- ✅ Password hashing with bcryptjs
- ✅ MongoDB integration
- ✅ HTTP-only cookies for tokens
- ✅ Token refresh mechanism
- ✅ Protected API routes

## User Roles

### 1. User (Default)
- Basic access to platform
- View content
- Save favorites (future feature)

### 2. Admin
- Manage users
- Access admin dashboard
- View analytics
- CRUD operations on content

### 3. Superadmin (Only One)
- Full system access
- Change user roles
- System statistics
- Cannot be deleted or downgraded

## API Routes

### Public Routes (No Authentication Required)

#### POST /api/auth/signup
Create a new user account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signin
Login to existing account.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Routes (Authentication Required)

#### GET /api/auth/me
Get current user profile.
Headers: `Authorization: Bearer <accessToken>`

#### POST /api/auth/logout
Logout current user.
Headers: `Authorization: Bearer <accessToken>`

#### POST /api/auth/refresh
Refresh access token using refresh token.
```json
{
  "refreshToken": "<refreshToken>"
}
```

### Admin Routes (Admin & Superadmin Only)

#### GET /api/admin/users
Get all users in the system.
Headers: `Authorization: Bearer <accessToken>`

### Superadmin Routes (Superadmin Only)

#### POST /api/superadmin
Change user role.
```json
{
  "userId": "user_id_here",
  "role": "admin" // or "user"
}
```

#### GET /api/superadmin
Get system statistics.
Headers: `Authorization: Bearer <accessToken>`

## Environment Variables

```env
MONGODB_URI=mongodb+srv://celebritypersona:GRFA287342114@celebritypersona.wuahw7q.mongodb.net/celebritypersona
JWT_ACCESS_SECRET=celebritypersona_access_secret_key_2026_secure
JWT_REFRESH_SECRET=celebritypersona_refresh_secret_key_2026_secure
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Token Flow

1. **Login** → Receive access + refresh tokens
2. **Access Token** → Use for API requests (15 min expiry)
3. **Refresh Token** → Get new access token (7 day expiry)
4. **Logout** → Clear both tokens

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiry
- HTTP-only cookies
- Token stored in database for verification
- Role-based middleware protection
- Superadmin uniqueness enforcement

## Usage Examples

### Frontend Authentication

```typescript
// Sign Up
const signup = async (name, email, password) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  const data = await res.json()
  // Tokens automatically set in cookies
  localStorage.setItem('user', JSON.stringify(data.user))
}

// Sign In
const signin = async (email, password) => {
  const res = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  localStorage.setItem('user', JSON.stringify(data.user))
}

// Protected API Call
const getProfile = async () => {
  const res = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  return await res.json()
}
```

### Creating Superadmin (Manual)

```javascript
// Run in MongoDB shell or connect directly
use celebritypersona

db.users.insertOne({
  name: "Super Admin",
  email: "superadmin@celebritypersona.com",
  password: "$2a$10$hashed_password_here", // Hash with bcrypt first
  role: "superadmin",
  avatar: "/images/team/user1.svg",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## File Structure

```
src/
├── lib/
│   ├── mongodb.ts          # MongoDB connection
│   ├── jwt.ts              # JWT utilities
│   └── auth.ts             # Auth middleware
├── models/
│   └── User.ts             # User model
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   ├── signin/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   └── me/route.ts
│   │   ├── admin/
│   │   │   └── users/route.ts
│   │   └── superadmin/route.ts
│   └── components/
│       └── Auth/
│           ├── SignIn/index.tsx
│           └── SignUp/index.tsx
```

## Testing

### 1. Create a User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Notes

- Change JWT secrets in production
- Use HTTPS in production
- Set secure: true for cookies in production
- Superadmin must be created manually in database
- Tokens automatically refresh on frontend
- Role changes require re-login to take effect
