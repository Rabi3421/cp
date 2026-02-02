# Superadmin Users & Admins Management APIs

Complete documentation for the user and admin management endpoints available to superadmin users.

## Authentication

All endpoints require a valid superadmin access token in an HTTP-only cookie named `accessToken`. If the token is missing, invalid, or not from a superadmin account, the API will return a 401 Unauthorized error.

---

## Users Management APIs

### 1. Get All Users

**Endpoint:** `GET /api/superadmin/users`

**Description:** Retrieve a paginated list of all users (excludes superadmin from the list).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role ('user', 'admin', or 'all')
- `isActive` (optional): Filter by active status ('true', 'false')

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "isActive": true,
        "avatar": "/images/team/user1.svg",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

---

### 2. Get Single User

**Endpoint:** `GET /api/superadmin/users/[id]`

**Description:** Retrieve details of a specific user by ID.

**Path Parameters:**
- `id`: User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "avatar": "/images/team/user1.svg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404`: User not found
- `403`: Cannot access superadmin details

---

### 3. Update User

**Endpoint:** `PUT /api/superadmin/users/[id]`

**Description:** Update user information.

**Path Parameters:**
- `id`: User ID

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin",
  "isActive": true,
  "avatar": "/images/team/user2.svg"
}
```

**Notes:**
- All fields are optional
- Cannot modify superadmin users
- Cannot promote users to superadmin role
- Email must be unique

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "admin",
      "isActive": true,
      "avatar": "/images/team/user2.svg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T15:45:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: Email already exists
- `403`: Cannot modify superadmin / Cannot promote to superadmin
- `404`: User not found

---

### 4. Delete User

**Endpoint:** `DELETE /api/superadmin/users/[id]`

**Description:** Permanently delete a user.

**Path Parameters:**
- `id`: User ID

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `403`: Cannot delete superadmin
- `404`: User not found

---

## Admins Management APIs

### 1. Get All Admins

**Endpoint:** `GET /api/superadmin/admins`

**Description:** Retrieve a paginated list of all admin users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `isActive` (optional): Filter by active status ('true', 'false')

**Response:**
```json
{
  "success": true,
  "data": {
    "admins": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "isActive": true,
        "avatar": "/images/team/user1.svg",
        "createdAt": "2024-01-10T08:20:00.000Z",
        "updatedAt": "2024-01-10T08:20:00.000Z"
      }
    ],
    "pagination": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

### 2. Create Admin

**Endpoint:** `POST /api/superadmin/admins`

**Description:** Create a new admin user.

**Request Body:**
```json
{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "secure_password",
  "avatar": "/images/team/user3.svg",
  "isActive": true
}
```

**Validation:**
- `name`, `email`, `password` are required
- Password must be at least 6 characters
- Email must be unique
- `avatar` is optional (defaults to '/images/team/user1.svg')
- `isActive` is optional (defaults to true)

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "New Admin",
      "email": "newadmin@example.com",
      "role": "admin",
      "isActive": true,
      "avatar": "/images/team/user3.svg",
      "createdAt": "2024-01-25T12:00:00.000Z",
      "updatedAt": "2024-01-25T12:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: Missing required fields / Email already exists / Password too short

---

### 3. Get Single Admin

**Endpoint:** `GET /api/superadmin/admins/[id]`

**Description:** Retrieve details of a specific admin by ID.

**Path Parameters:**
- `id`: Admin ID

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true,
      "avatar": "/images/team/user1.svg",
      "createdAt": "2024-01-10T08:20:00.000Z",
      "updatedAt": "2024-01-10T08:20:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: User is not an admin
- `404`: Admin not found

---

### 4. Update Admin

**Endpoint:** `PUT /api/superadmin/admins/[id]`

**Description:** Update admin information.

**Path Parameters:**
- `id`: Admin ID

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "email": "updatedemail@example.com",
  "password": "new_password",
  "isActive": false,
  "avatar": "/images/team/user4.svg"
}
```

**Notes:**
- All fields are optional
- Password will be hashed automatically
- Password must be at least 6 characters if provided
- Email must be unique

**Response:**
```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": {
    "admin": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Updated Admin Name",
      "email": "updatedemail@example.com",
      "role": "admin",
      "isActive": false,
      "avatar": "/images/team/user4.svg",
      "createdAt": "2024-01-10T08:20:00.000Z",
      "updatedAt": "2024-01-25T16:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400`: Email already exists / User is not an admin / Password too short
- `404`: Admin not found

---

### 5. Delete Admin

**Endpoint:** `DELETE /api/superadmin/admins/[id]`

**Description:** Permanently delete an admin user.

**Path Parameters:**
- `id`: Admin ID

**Response:**
```json
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

**Error Responses:**
- `400`: User is not an admin
- `404`: Admin not found

---

## Frontend Implementation

Both the **All Users** (`/dashboard/superadmin/users`) and **Admins** (`/dashboard/superadmin/admins`) pages have been fully implemented with:

### Features:
- ✅ Real-time data fetching from APIs
- ✅ Search functionality
- ✅ Role/status filters
- ✅ Pagination
- ✅ Create new admin modal
- ✅ Edit user/admin modal
- ✅ Delete confirmation
- ✅ Toggle active/inactive status
- ✅ Change user roles (for users page)
- ✅ Dynamic statistics cards
- ✅ Loading states
- ✅ Error handling

### User Interactions:
1. **Search**: Type in the search box to filter by name or email
2. **Filter**: Click filter buttons to show all/active/inactive/specific roles
3. **Edit**: Click the pencil icon to edit user/admin details
4. **Delete**: Click the delete icon to remove a user/admin
5. **Toggle Status**: Click the status badge to activate/deactivate
6. **Change Role** (Users page only): Use the dropdown to change user role
7. **Create Admin** (Admins page only): Click "Add Admin" button to create new admin
8. **Pagination**: Navigate through pages using pagination controls

---

## Security Notes

1. All endpoints verify superadmin authentication via JWT access token
2. Superadmin users cannot be modified or deleted through these APIs
3. Only one superadmin can exist in the system (enforced at database level)
4. Users cannot be promoted to superadmin role
5. Passwords are automatically hashed before storage
6. Password field is excluded from responses by default

---

## Testing the APIs

You can test these APIs using:
1. **Browser DevTools**: Open Network tab and interact with the dashboard pages
2. **Postman/Insomnia**: Import endpoints and add authentication cookies
3. **curl**: Include cookie header with valid superadmin access token

Example curl command:
```bash
curl -X GET 'http://localhost:3000/api/superadmin/users?page=1&limit=10' \
  -H 'Cookie: accessToken=your_token_here'
```

---

## Build Status

✅ Build successful with 47 routes
✅ All TypeScript types validated
✅ All APIs compiled successfully
✅ Frontend pages integrated and functional
