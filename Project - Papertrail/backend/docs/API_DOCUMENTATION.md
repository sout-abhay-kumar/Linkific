# Papertrail API Documentation

The API is served by FastAPI. During local development its base URL is `http://127.0.0.1:8000`. Interactive Swagger documentation is available at `/docs`, and the OpenAPI document is at `/openapi.json`.

All JSON request bodies use `Content-Type: application/json`. Successful authenticated responses return the user or resource data described below; the JWT itself is never returned in JSON.

## Authentication and request security

- Authentication uses the `papertrail_access` HttpOnly cookie. Signup and login set it; logout, password change, and password reset clear it.
- `GET /api/auth/csrf` initializes the `papertrail_csrf` cookie and returns its token. Every `POST`, `PUT`, `PATCH`, or `DELETE` endpoint listed below requires the matching `X-CSRF-Token` header and a valid `Origin`. The frontend API client obtains and sends this token.
- A request without an authenticated session returns `401`. An invalid origin or CSRF token returns `403`.
- Public book reads, statistics, categories, health, and root endpoints do not require authentication. Optional authentication on book reads only affects the `is_owner` and `can_manage` response fields.
- Error responses generally use `{"detail":"..."}`. Request validation errors return `422` with a `detail` array.

Example CSRF response:

```json
{
  "csrf_token": "csrf-token-returned-by-the-server"
}
```

The token and cookie above are illustrative. Do not copy tokens from documentation into a real request.

## Shared response schemas

### Book

```json
{
  "id": 12,
  "title": "The Left Hand of Darkness",
  "author": "Ursula K. Le Guin",
  "category": "Science Fiction",
  "published_year": 1969,
  "description": "A novel about an envoy on the planet Gethen.",
  "total_copies": 3,
  "borrowed_copies": 1,
  "available_copies": 2,
  "is_owner": true,
  "can_manage": true
}
```

`published_year` may be `null`. `is_owner` and `can_manage` are calculated for the current request; both are false for anonymous users.

### User

```json
{
  "id": 7,
  "full_name": "Avery Reader",
  "email": "avery@example.com",
  "role": "user",
  "created_at": "2025-01-15T10:30:00Z"
}
```

New public registrations receive the `user` role. The API does not expose a public role-promotion endpoint.

## Authentication

### Initialize CSRF token

**GET `/api/auth/csrf`**

- **Purpose:** Set the CSRF cookie and return its token.
- **Authentication:** Not required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** `{"csrf_token":"..."}`
- **Errors:** No endpoint-specific errors are defined.

### Sign up

**POST `/api/auth/signup`**

- **Purpose:** Create a user account and sign the new user in.
- **Authentication:** Not required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "full_name": "Avery Reader",
  "email": "avery@example.com",
  "password": "StrongPassword123"
}
```

`full_name` must be 1–120 characters after trimming. Passwords must be 12–128 characters and include an uppercase letter, a lowercase letter, and a number. Additional fields such as `role` are rejected.

- **Success — `201`:** A [User](#user) object; the response also sets the authentication cookie.
- **Errors:** `403` invalid origin/CSRF; `409` email already registered (`{"detail":"An account with this email already exists."}`); `422` invalid body.

### Sign in

**POST `/api/auth/login`**

- **Purpose:** Authenticate an active account.
- **Authentication:** Not required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "email": "avery@example.com",
  "password": "StrongPassword123"
}
```

- **Success — `200`:** A [User](#user) object; the response also sets the authentication cookie.
- **Errors:** `401` invalid credentials or inactive account (`{"detail":"Email or password is incorrect."}`); `403` invalid origin/CSRF; `422` invalid body.

### Get current user

**GET `/api/auth/me`**

- **Purpose:** Return the currently authenticated user.
- **Authentication:** Required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** A [User](#user) object.
- **Errors:** `401` missing, invalid, expired, or revoked authentication cookie.

### Sign out

**POST `/api/auth/logout`**

- **Purpose:** Clear the current browser's authentication and CSRF cookies.
- **Authentication:** Required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `204`:** Empty response.
- **Errors:** `401` authentication required; `403` invalid origin/CSRF.

### Request a password reset

**POST `/api/auth/forgot-password`**

- **Purpose:** Request a single-use password-reset token; tokens expire after 30 minutes.
- **Authentication:** Not required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "email": "avery@example.com"
}
```

- **Success — `200`:** A generic response that does not reveal whether the account exists. In development, an existing active account receives a `reset_token` in the response for testing; outside development the token is not returned and the reset flow uses email.

```json
{
  "message": "If an account exists for that email, password reset instructions will be sent.",
  "reset_token": "development-only-reset-token"
}
```

Outside development, `reset_token` is `null`.

- **Errors:** `403` invalid origin/CSRF; `422` invalid email; `503` email delivery is not configured in a non-development environment.

If email delivery fails after SMTP settings pass the initial configuration check, the implementation logs the delivery failure and still returns the generic `200` response.

### Reset password

**POST `/api/auth/reset-password`**

- **Purpose:** Set a new password with an unused, unexpired reset token. This invalidates existing sessions.
- **Authentication:** No login required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "token": "development-only-reset-token",
  "new_password": "AnotherStrong123"
}
```

The token must be 32–200 characters. The new password must be 12–128 characters and contain uppercase, lowercase, and numeric characters.

- **Success — `200`:** `{"message":"Password reset successfully. Please sign in."}`
- **Errors:** `400` invalid, expired, or previously used token (`{"detail":"This reset link is invalid or expired."}`); `403` invalid origin/CSRF; `422` invalid body.

### Change password

**POST `/api/auth/change-password`**

- **Purpose:** Change the authenticated user's password and invalidate active sessions.
- **Authentication:** Required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "current_password": "StrongPassword123",
  "new_password": "AnotherStrong123"
}
```

- **Success — `200`:** `{"message":"Password changed. Please sign in again."}`. The response clears authentication cookies.
- **Errors:** `400` current password is incorrect or the new password is unchanged; `401` authentication required; `403` invalid origin/CSRF; `422` invalid body.

## Books

### List and filter books

**GET `/api/books`**

- **Purpose:** Return the catalogue ordered by descending book ID.
- **Authentication:** Public; optional cookie authentication sets ownership flags.
- **Path parameters:** None.
- **Query parameters:**
  - `search` (string, optional, default empty): case-insensitive match against the title.
  - `category` (string, optional, default `All`): exact category filter.
  - `availability` (string, optional, default `All`): `Available` filters to books with available copies; `Borrowed` filters to books with at least one borrowed copy.
- **Request body:** None.
- **Success — `200`:** Array of [Book](#book) objects; an empty catalogue returns `[]`.
- **Errors:** No endpoint-specific errors are defined.

Example: `GET /api/books?search=darkness&category=Science%20Fiction&availability=Available`

### Get a book

**GET `/api/books/{book_id}`**

- **Purpose:** Return one book.
- **Authentication:** Public; optional cookie authentication sets ownership flags.
- **Path parameters:** `book_id` (integer, required).
- **Query parameters:** None.
- **Request body:** None.
- **Success — `200`:** A [Book](#book) object.
- **Errors:** `404` book not found (`{"detail":"Book not found."}`); `422` invalid path parameter.

### Create a book

**POST `/api/books`**

- **Purpose:** Add a book owned by the authenticated user.
- **Authentication:** Required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:**

```json
{
  "title": "The Left Hand of Darkness",
  "author": "Ursula K. Le Guin",
  "category": "Science Fiction",
  "published_year": 1969,
  "description": "A novel about an envoy on the planet Gethen.",
  "total_copies": 3
}
```

`category`, `published_year`, `description`, and `total_copies` are optional; their defaults are `General`, `null`, an empty string, and `1`. Field lengths and numeric ranges are validated by the request schema.

- **Success — `201`:** The created [Book](#book) object.
- **Errors:** `401` authentication required; `403` invalid origin/CSRF; `422` invalid body.

### Update a book

**PUT `/api/books/{book_id}`**

- **Purpose:** Replace the editable fields of a book.
- **Authentication:** Book owner or administrator; CSRF cookie/header and valid `Origin` required.
- **Path parameters:** `book_id` (integer, required).
- **Query parameters:** None.
- **Request body:** Same fields and validation as [Create a book](#create-a-book).
- **Success — `200`:** Updated [Book](#book) object.
- **Errors:** `400` total copies less than copies currently borrowed; `401` authentication required; `403` invalid origin/CSRF; `404` missing book or caller is neither its owner nor an administrator; `422` invalid body/path parameter.

### Delete a book

**DELETE `/api/books/{book_id}`**

- **Purpose:** Delete a book.
- **Authentication:** Book owner or administrator; CSRF cookie/header and valid `Origin` required.
- **Path parameters:** `book_id` (integer, required).
- **Query parameters:** None.
- **Request body:** None.
- **Success — `204`:** Empty response.
- **Errors:** `401` authentication required; `403` invalid origin/CSRF; `404` missing book or caller is neither its owner nor an administrator; `422` invalid path parameter.

### Borrow a copy

**POST `/api/books/{book_id}/borrow`**

- **Purpose:** Increment the book's borrowed-copy count.
- **Authentication:** Book owner or administrator; CSRF cookie/header and valid `Origin` required.
- **Path parameters:** `book_id` (integer, required).
- **Query parameters:** None.
- **Request body:** None.
- **Success — `200`:** Updated [Book](#book) object.
- **Errors:** `400` no copies are available (`{"detail":"No copies are available to borrow."}`); `401` authentication required; `403` invalid origin/CSRF; `404` missing book or caller is neither its owner nor an administrator; `422` invalid path parameter.

### Return a copy

**POST `/api/books/{book_id}/return`**

- **Purpose:** Decrement the book's borrowed-copy count.
- **Authentication:** Book owner or administrator; CSRF cookie/header and valid `Origin` required.
- **Path parameters:** `book_id` (integer, required).
- **Query parameters:** None.
- **Request body:** None.
- **Success — `200`:** Updated [Book](#book) object.
- **Errors:** `400` no borrowed copies to return (`{"detail":"No borrowed copies to return."}`); `401` authentication required; `403` invalid origin/CSRF; `404` missing book or caller is neither its owner nor an administrator; `422` invalid path parameter.

## Statistics and categories

### Get library statistics

**GET `/api/stats`**

- **Purpose:** Return library-wide title, copy, available-copy, and borrowed-copy totals.
- **Authentication:** Public.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:**

```json
{
  "total_titles": 12,
  "total_copies": 20,
  "available_copies": 17,
  "borrowed_copies": 3
}
```

- **Errors:** No endpoint-specific errors are defined.

### List categories

**GET `/api/categories`**

- **Purpose:** Return the built-in categories combined with categories currently present in the database.
- **Authentication:** Public.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** JSON array of category strings, for example `["Biography","Fiction","General","History","Personal Growth","Science","Technology"]`.
- **Errors:** No endpoint-specific errors are defined.

## User management

### Update the current user's profile

**PATCH `/api/users/me`**

- **Purpose:** Update the authenticated user's full name, email, or both.
- **Authentication:** Required; CSRF cookie/header and valid `Origin` required.
- **Path/query parameters:** None.
- **Request body:** At least one of the fields must be provided. Unknown fields are rejected.

```json
{
  "full_name": "Avery R. Reader",
  "email": "avery.reader@example.com"
}
```

- **Success — `200`:** Updated [User](#user) object.
- **Errors:** `401` authentication required; `403` invalid origin/CSRF; `409` email already in use; `422` no fields, invalid values, or `null` values.

### List users (administrator)

**GET `/api/admin/users`**

- **Purpose:** List all users in ascending ID order.
- **Authentication:** Administrator role required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** Array of [User](#user) objects.
- **Errors:** `401` authentication required; `403` authenticated user is not an administrator.

## Other endpoints

### API root

**GET `/`**

- **Purpose:** Return a service message and the Swagger UI path.
- **Authentication:** Not required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** `{"message":"Papertrail API is running","docs":"/docs"}`
- **Errors:** No endpoint-specific errors are defined.

### Health check

**GET `/health`**

- **Purpose:** Return the API process health response.
- **Authentication:** Not required.
- **Path/query parameters:** None.
- **Request body:** None.
- **Success — `200`:** `{"status":"ok"}`
- **Errors:** No endpoint-specific errors are defined.
