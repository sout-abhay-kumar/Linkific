# Authentication Flow --- Frontend / React

## 1. What is authentication?

Authentication answers the question:

> Who are you?

A user proves their identity, for example by signing in with Google or
by entering an email and password.

Authentication is different from authorization:

-   **Authentication:** identifies the user.
-   **Authorization:** determines what that authenticated user is
    allowed to do.

For example, signing in identifies a user. Checking whether that user
may view a particular expense record is an authorization decision.

## 2. Typical React authentication flow

A common application flow looks like this:

1.  The user opens the application.
2.  React checks whether a valid session is available.
3.  If not authenticated, React displays the login page.
4.  The user signs in.
5.  The frontend sends the authentication credential to the backend.
6.  The backend validates the credential.
7.  The backend returns an application session or token.
8.  React updates its authentication state.
9.  Protected pages become available.
10. When the user signs out, the session is cleared or invalidated.

The backend must enforce authentication. Hiding a page in React is not
security by itself.

## 3. Google Sign-In flow in ExpenseTracker

Your ExpenseTracker uses Google Identity Services with a Google ID
token.

``` text
User
  |
  | clicks "Sign in with Google"
  v
React frontend
  |
  | Google Identity Services sign-in
  v
Google
  |
  | returns Google ID token (credential)
  v
React frontend
  |
  | POST /api/auth/google with credential
  v
FastAPI backend
  |
  | verifies token signature, issuer, audience and expiry
  v
PostgreSQL
  |
  | finds or creates the application user
  v
FastAPI backend
  |
  | returns application authentication result
  v
React frontend
  |
  | updates auth state and shows dashboard
  v
ExpenseTracker dashboard
```

The Google ID token proves the user's identity to your backend. Your
backend should verify it with Google's supported library. Do not trust
user details merely because the browser sent them.

## 4. What is authentication state in React?

React needs to know whether the user is:

-   Still checking their session.
-   Authenticated.
-   Not authenticated.

A simple conceptual state is:

``` jsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

Possible interpretation:

-   `loading === true`: session check is in progress.
-   `loading === false` and `user === null`: no authenticated user.
-   `user !== null`: a user is signed in.

A real application should also handle errors from the session check.

## 5. Why use an Auth Context?

If many components need authentication information, passing the user and
login/logout functions through every component becomes inconvenient.
This is called prop drilling.

React Context can provide shared authentication state.

A simplified example:

``` jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

This is a learning example, not a complete secure authentication
implementation. It does not persist or validate a session.

## 6. Protected routes

A protected route prevents unauthenticated users from viewing a page
that requires sign-in.

Conceptual React Router example:

``` jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

Example route structure:

``` jsx
<Route path="/login" element={<Login />} />

<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/transactions" element={<Transactions />} />
  <Route path="/budgets" element={<Budgets />} />
</Route>
```

For a real app, include a loading state while the frontend checks the
session. Otherwise, React may redirect a user before the session check
finishes.

**Important:** The backend must independently protect private API
endpoints. A user can call an API directly without using your React
page.

## 7. What happens when a page refreshes?

React component state is reset when the browser reloads. Therefore, a
production application needs a session strategy that survives page
refreshes.

Common approaches include:

### HttpOnly secure cookies

The backend sets a cookie with suitable security attributes, such as
`HttpOnly`, `Secure` in HTTPS environments, and an appropriate
`SameSite` policy.

Advantages: - JavaScript cannot read an HttpOnly cookie. - The browser
sends the cookie automatically when its rules allow.

Considerations: - Configure CORS and credentials correctly. - Protect
cookie-authenticated state-changing requests against CSRF. - Choose
cookie scope and SameSite settings carefully.

### Bearer token

The frontend sends a token in an `Authorization: Bearer ...` header.

Considerations: - Avoid storing sensitive long-lived tokens in
`localStorage` because JavaScript can read them if an XSS vulnerability
occurs. - Use a deliberate token expiry, refresh and revocation
strategy. - Keep access tokens short-lived where appropriate.

Choose one coherent session design rather than mixing approaches
accidentally.

## 8. Logout flow

A logout should do more than navigate to the login page.

Depending on the session design, it should:

1.  Call the backend logout endpoint if the server maintains a session
    or refresh token.
2.  Invalidate or revoke the relevant session/token when supported.
3.  Clear client-side authentication state.
4.  Navigate to the login page.
5.  Ensure protected API requests are rejected after logout.

## 9. Common authentication problems

  -----------------------------------------------------------------------
  Problem                             Possible cause
  ----------------------------------- -----------------------------------
  Login returns 401                   Invalid, expired or incorrectly
                                      verified credential

  CORS error                          Frontend origin or backend CORS
                                      configuration is incorrect

  Dashboard redirects to login after  Session is not restored correctly
  refresh                             

  API returns 401 after login         Token is missing, expired or not
                                      sent correctly

  User sees another user's expenses   Backend authorization or user
                                      filtering is incorrect
  -----------------------------------------------------------------------

For ExpenseTracker, every transaction and budget query must be scoped to
the authenticated user on the backend.

## 10. Quick revision

-   Authentication identifies the user.
-   Authorization checks permissions.
-   React Context can share auth state.
-   Protected routes control frontend navigation.
-   Backend endpoints must enforce authentication independently.
-   A session strategy is needed to survive refreshes.
-   Logout should clear or invalidate the session.
-   Never trust user identity supplied only by the frontend.

## Practice questions

1.  What is the difference between authentication and authorization?
2.  Why might React Context be useful for authentication?
3.  Why are protected React routes not enough to secure an API?
4.  Why does authentication state disappear after a page refresh?
5.  What is the role of the backend in Google Sign-In?
6.  Why should every expense query be filtered by the authenticated
    user?
