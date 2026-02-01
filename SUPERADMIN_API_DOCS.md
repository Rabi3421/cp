# Superadmin Credential Management API Documentation

## Overview
These APIs manage the superadmin credential in the system. Only ONE superadmin can exist at any time. These APIs are separate from the main authentication flow and provide full CRUD operations for the superadmin credential.

## Base URL
All endpoints are prefixed with `/api/superadmin`

---

## Endpoints

### 1. Create Superadmin Credential

**Endpoint:** `POST /api/superadmin/credential`

**Description:** Creates a new superadmin credential. Only one superadmin is allowed in the system.

**Request Body:**
```json
{
  "name": "Super Admin",
  "email": "superadmin@celebritypersona.com",
  "password": "securePassword123"
}
```

**Validation:**
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Superadmin credential created successfully",
  "superadmin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "superadmin@celebritypersona.com",
    "role": "superadmin"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or validation error
- `400 Bad Request`: Superadmin already exists
- `400 Bad Request`: Email already in use
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/superadmin/credential \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@celebritypersona.com",
    "password": "securePassword123"
  }'
```

---

### 2. Check Superadmin Existence

**Endpoint:** `GET /api/superadmin/credential`

**Description:** Checks if a superadmin credential exists in the system.

**Request:** No body required

**Success Response (200) - Exists:**
```json
{
  "exists": true,
  "superadmin": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "superadmin@celebritypersona.com",
    "role": "superadmin",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Success Response (200) - Does Not Exist:**
```json
{
  "exists": false,
  "message": "No superadmin credential found"
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl http://localhost:3000/api/superadmin/credential
```

---

### 3. Update Superadmin Password

**Endpoint:** `PUT /api/superadmin/credential/update-password`

**Description:** Updates the superadmin password. Requires current password for verification.

**Request Body:**
```json
{
  "email": "superadmin@celebritypersona.com",
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword456"
}
```

**Validation:**
- `email`: Required
- `currentPassword`: Required
- `newPassword`: Required, minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Superadmin password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or validation error
- `401 Unauthorized`: Current password is incorrect
- `404 Not Found`: Superadmin not found
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X PUT http://localhost:3000/api/superadmin/credential/update-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@celebritypersona.com",
    "currentPassword": "oldPassword123",
    "newPassword": "newSecurePassword456"
  }'
```

---

### 4. Delete Superadmin Credential

**Endpoint:** `DELETE /api/superadmin/credential/delete`

**Description:** Deletes the superadmin credential. Requires password verification.

**Request Body:**
```json
{
  "email": "superadmin@celebritypersona.com",
  "password": "currentPassword123"
}
```

**Validation:**
- `email`: Required
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Superadmin credential deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields
- `401 Unauthorized`: Password is incorrect
- `404 Not Found`: Superadmin not found
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X DELETE http://localhost:3000/api/superadmin/credential/delete \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@celebritypersona.com",
    "password": "currentPassword123"
  }'
```

---

### 5. Forgot Password (Generate Reset Token)

**Endpoint:** `POST /api/superadmin/credential/forgot-password`

**Description:** Generates a password reset token for the superadmin. Token is valid for 1 hour.

**Request Body:**
```json
{
  "email": "superadmin@celebritypersona.com"
}
```

**Validation:**
- `email`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset token generated successfully",
  "resetToken": "7f3d8c9a2b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  "expiresIn": "1 hour"
}
```

**Note:** In production, the `resetToken` should be sent via email only and NOT returned in the response.

**Error Responses:**
- `400 Bad Request`: Missing email
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/superadmin/credential/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@celebritypersona.com"
  }'
```

---

### 6. Reset Password (Using Token)

**Endpoint:** `POST /api/superadmin/credential/reset-password`

**Description:** Resets the superadmin password using the reset token from forgot-password endpoint.

**Request Body:**
```json
{
  "token": "7f3d8c9a2b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
  "newPassword": "newSecurePassword789"
}
```

**Validation:**
- `token`: Required
- `newPassword`: Required, minimum 8 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Superadmin password reset successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Missing fields or validation error
- `400 Bad Request`: Invalid or expired reset token
- `404 Not Found`: Superadmin not found
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/superadmin/credential/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "7f3d8c9a2b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    "newPassword": "newSecurePassword789"
  }'
```

---

### 7. Superadmin Login (Separate Endpoint)

**Endpoint:** `POST /api/superadmin/login`

**Description:** Separate login endpoint specifically for superadmin. Returns both access token and refresh token.

**Request Body:**
```json
{
  "email": "superadmin@celebritypersona.com",
  "password": "securePassword123"
}
```

**Validation:**
- `email`: Required
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Superadmin logged in successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "superadmin@celebritypersona.com",
    "role": "superadmin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set:**
- `accessToken`: HTTP-only, expires in 15 minutes
- `refreshToken`: HTTP-only, expires in 7 days

**Error Responses:**
- `400 Bad Request`: Missing fields
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/superadmin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@celebritypersona.com",
    "password": "securePassword123"
  }' \
  -c cookies.txt
```

---

## Security Features

### 1. Single Superadmin Constraint
- Only one superadmin can exist in the system at any time
- Enforced at both application and database level (pre-save hook in User model)

### 2. Password Security
- Minimum 8 characters required
- Passwords are hashed using bcrypt before storage
- Current password verification required for password updates and deletions

### 3. Token Security
- Reset tokens are randomly generated using crypto module (32 bytes)
- Tokens expire after 1 hour
- Tokens are deleted after use
- In production, tokens should be stored in Redis for distributed systems

### 4. Authentication Tokens
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are stored in HTTP-only cookies
- HTTPS required in production

---

## Usage Flow

### Initial Setup
1. **Check if superadmin exists:**
   ```bash
   GET /api/superadmin/credential
   ```

2. **Create superadmin if not exists:**
   ```bash
   POST /api/superadmin/credential
   ```

### Login Flow
3. **Login as superadmin:**
   ```bash
   POST /api/superadmin/login
   ```

### Password Management
4. **Update password (when logged in):**
   ```bash
   PUT /api/superadmin/credential/update-password
   ```

5. **Forgot password flow:**
   ```bash
   # Step 1: Request reset token
   POST /api/superadmin/credential/forgot-password
   
   # Step 2: Reset password using token
   POST /api/superadmin/credential/reset-password
   ```

### Credential Deletion
6. **Delete superadmin credential:**
   ```bash
   DELETE /api/superadmin/credential/delete
   ```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Successful operation
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input or validation error
- `401 Unauthorized`: Authentication failed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

---

## Production Considerations

### 1. Reset Token Storage
Currently, reset tokens are stored in-memory. For production:
- Use Redis or similar for distributed systems
- Implement token cleanup for expired tokens

### 2. Email Integration
- Integrate with email service (SendGrid, AWS SES, etc.)
- Send reset tokens via email instead of returning in response
- Add email templates for better UX

### 3. Rate Limiting
- Implement rate limiting on all endpoints
- Especially important for login and forgot-password endpoints

### 4. Logging
- Log all superadmin operations
- Monitor failed login attempts
- Track credential changes

### 5. HTTPS
- Enforce HTTPS in production
- Set `secure: true` for cookies

### 6. Environment Variables
Ensure these are set:
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_REFRESH_SECRET`: Secret key for refresh token
- `NODE_ENV`: Set to 'production' in production

---

## Testing with Postman

### Collection Structure
```
Superadmin APIs
├── 1. Check Superadmin Exists (GET)
├── 2. Create Superadmin (POST)
├── 3. Login as Superadmin (POST)
├── 4. Update Password (PUT)
├── 5. Forgot Password (POST)
├── 6. Reset Password (POST)
└── 7. Delete Superadmin (DELETE)
```

### Environment Variables (Postman)
- `BASE_URL`: http://localhost:3000
- `SUPERADMIN_EMAIL`: superadmin@celebritypersona.com
- `SUPERADMIN_PASSWORD`: Your password
- `ACCESS_TOKEN`: {{accessToken}} (auto-set from login response)

---

## API Files Created

1. `/src/app/api/superadmin/credential/route.ts` - Create & Check
2. `/src/app/api/superadmin/credential/update-password/route.ts` - Update Password
3. `/src/app/api/superadmin/credential/delete/route.ts` - Delete Credential
4. `/src/app/api/superadmin/credential/forgot-password/route.ts` - Generate Reset Token
5. `/src/app/api/superadmin/credential/reset-password/route.ts` - Reset Password
6. `/src/app/api/superadmin/login/route.ts` - Superadmin Login

---

## Database Schema

The superadmin uses the existing User model with these properties:

```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'superadmin' (enforced to be unique)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Unique Constraint:** Only one document with `role: 'superadmin'` can exist in the database.
