
# Protected Routes

## What Are Protected Routes?

A protected route is a page or API endpoint that can only be accessed by an authenticated user.

Some pages in a web application are public, while others require the user to log in.

### Examples

| Public Routes | Protected Routes |
|---|---|
| Home Page | Dashboard |
| Login Page | User Profile |
| Registration Page | My Books |
| About Page | Admin Dashboard |

### How Protected Routes Work

1. A user tries to access a protected page.
2. The application checks whether the user is authenticated.
3. If the user is authenticated, access is allowed.
4. If the user is not authenticated, they are redirected to the Login page.
5. The backend independently validates authentication before returning protected data.

### React Example

```jsx
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
```

### Using the Protected Route

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/my-books" element={<MyBooks />} />
</Route>
```

### Important Points

- Protected routes prevent unauthenticated users from accessing restricted pages through the application UI.
- Frontend protection alone is not sufficient.
- The backend must validate the user's token and permissions.
- A user can be authenticated but still lack permission to access certain resources.

### Conclusion

Protected routes help control access to pages and resources based on the user's authentication status.
