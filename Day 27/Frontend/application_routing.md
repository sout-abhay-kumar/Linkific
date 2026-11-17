# Application Routing

## 1. What Is Application Routing?

**Application Routing** is the process of determining which page, component, or function should be displayed or executed when a user visits a particular URL or sends a request to an application.

In simple words:

> Routing decides what should happen when someone visits a particular URL.

For example, in an ExpenseTracker application:

| URL             | Page              |
| --------------- | ----------------- |
| `/`             | Home page         |
| `/login`        | Login page        |
| `/register`     | Registration page |
| `/dashboard`    | Dashboard         |
| `/transactions` | Transactions page |
| `/budgets`      | Budgets page      |
| `/settings`     | Settings page     |

When a user visits `/dashboard`, the application displays the Dashboard page.

This process is called **Application Routing**.

---

## 2. Why Do We Need Application Routing?

Imagine an application with multiple pages.

Without routing, you would have to manually manage which component should appear whenever the user navigates to another page.

Routing makes navigation easier and more organized.

### Benefits of Routing

1. **Navigation:** Allows users to move between different pages.
2. **URL Management:** Each page can have its own URL.
3. **User Experience:** Supports navigation without completely reloading the website.
4. **Code Organization:** Keeps page components separate.
5. **Protected Pages:** Prevents unauthorized users from accessing restricted pages.
6. **Dynamic URLs:** Allows URLs to contain parameters, such as `/transactions/101`.
7. **Browser History:** Supports back and forward navigation.

---

## 3. Types of Application Routing

There are two important routing areas in a full-stack application:

1. Frontend Routing
2. Backend Routing

Both are important, but they serve different purposes.

---

## 4. Frontend Routing

Frontend routing determines which page or React component should be displayed when a user visits a particular URL.

In React applications, a commonly used routing library is **React Router**.

### 4.1 What Is React Router?

React Router is a JavaScript library used to manage navigation and routing in React applications.

It allows users to navigate between different pages without reloading the entire website.

This behavior is commonly associated with Single Page Applications (SPAs).

### 4.2 What Is a Single Page Application?

A **Single Page Application (SPA)** is a web application that loads a main HTML document and dynamically updates its content as users navigate.

For example:

- User opens `/dashboard`.
- React displays the Dashboard component.
- User clicks Transactions.
- React displays the Transactions component.
- The browser does not need to reload the entire HTML document.

### 4.3 Installing React Router

Install React Router in your React project:

```bash
npm install react-router-dom
```

### 4.4 Basic Routing Example

Consider an application with three pages:

- Home
- Login
- Dashboard

**Example: `App.jsx`**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Explanation

| Component       | Purpose                                       |
| --------------- | --------------------------------------------- |
| `BrowserRouter` | Enables browser-based routing                 |
| `Routes`        | Groups route definitions                      |
| `Route`         | Defines a URL and its corresponding component |
| `path`          | Specifies the URL                             |
| `element`       | Specifies the component to display            |

For example:

```jsx
<Route path="/dashboard" element={<Dashboard />} />
```

This means whenever a user visits `/dashboard`, React Router renders the Dashboard component.

---

## 5. Navigation Between Pages

React Router provides different ways to navigate between pages.

### 5.1 Link Component

The `Link` component allows users to navigate between routes.

Example:

```jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}

export default Navbar;
```

**Why use Link instead of a normal anchor tag?**

A normal HTML anchor:

```html
<a href="/dashboard">Dashboard</a>
```

Usually triggers a full-page navigation.

React Router's `Link` performs client-side navigation, avoiding a complete page reload for normal internal route changes.

### 5.2 useNavigate Hook

The `useNavigate` hook allows navigation through JavaScript.

Example:

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    // Perform login operation

    navigate("/dashboard");
  }

  return <button onClick={handleLogin}>Login</button>;
}

export default Login;
```

Here, after a successful login operation, the user is redirected to the Dashboard page.

**Difference:**

| Link                                | useNavigate                                      |
| ----------------------------------- | ------------------------------------------------ |
| Used for clickable navigation       | Used for programmatic navigation                 |
| Commonly used in navigation menus   | Commonly used after form submission or login     |
| Navigation is initiated by the user | Navigation can be triggered by application logic |

---

## 6. Dynamic Routing

Sometimes, we need URLs that contain dynamic values.

For example:

```text
/transactions/101
/transactions/102
/transactions/103
```

Here, `101`, `102`, and `103` represent transaction IDs.

Instead of creating a separate route for every transaction, we can create one dynamic route.

Example:

```jsx
import { Routes, Route } from "react-router-dom";
import TransactionDetails from "./pages/TransactionDetails";

function App() {
  return (
    <Routes>
      <Route path="/transactions/:id" element={<TransactionDetails />} />
    </Routes>
  );
}
```

To access the dynamic ID, use the `useParams` hook.

Example:

```jsx
import { useParams } from "react-router-dom";

function TransactionDetails() {
  const { id } = useParams();

  return <h1>Transaction ID: {id}</h1>;
}

export default TransactionDetails;
```

If the user visits:

```text
/transactions/101
```

The application displays:

```text
Transaction ID: 101
```

---

## 7. Nested Routing

Nested routing allows one route to contain other routes.

For example, an ExpenseTracker dashboard may have:

- Dashboard Overview
- Transactions
- Budgets
- Categories
- Settings

All these pages can share a common layout containing:

- Header
- Sidebar
- Footer

Example:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="transactions" element={<Transactions />} />

          <Route path="budgets" element={<Budgets />} />

          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

The parent layout needs an `Outlet` component to display the selected child page.

Example: `DashboardLayout.jsx`

```jsx
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div>
      <header>ExpenseTracker Header</header>

      <aside>Sidebar</aside>

      <main>
        <Outlet />
      </main>

      <footer>Footer</footer>
    </div>
  );
}

export default DashboardLayout;
```

### What Is Outlet?

`Outlet` is a React Router component that renders the matching child route inside its parent layout.

For example:

```text
/dashboard
```

Displays:

```text
DashboardLayout
    ├── Header
    ├── Sidebar
    ├── Dashboard
    └── Footer
```

And:

```text
/transactions
```

Displays:

```text
DashboardLayout
    ├── Header
    ├── Sidebar
    ├── Transactions
    └── Footer
```

The header, sidebar, and footer remain shared.

---

## 8. Protected Routes

Some pages should only be accessible to authenticated users.

For example:

- Dashboard
- Transactions
- Budgets
- Account Settings

If a user is not logged in, they should not be allowed to access these pages.

This is called **Protected Routing**.

### Example

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

Now use the protected route in your application:

```jsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />

  <Route path="/transactions" element={<Transactions />} />

  <Route path="/budgets" element={<Budgets />} />
</Route>
```

### How It Works

1. User visits `/dashboard`.
2. ProtectedRoute checks whether an access token exists.
3. If a token exists, the requested page is rendered.
4. If no token exists, the user is redirected to `/login`.

**Important Security Note:**

Frontend protected routes are not sufficient for security.

A user can bypass frontend restrictions or manipulate browser storage. Therefore, the backend must independently verify the JWT and authorize every protected API request.

---

## 9. Backend Routing – FastAPI

Frontend routing decides which React page should be displayed.

Backend routing decides which Python function should handle an incoming HTTP request.

FastAPI provides routing through decorators such as:

- `@app.get()`
- `@app.post()`
- `@app.put()`
- `@app.delete()`

### 9.1 Basic FastAPI Routing

Example:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to ExpenseTracker"}

@app.get("/transactions")
def get_transactions():
    return {"message": "All transactions"}

@app.post("/transactions")
def create_transaction():
    return {"message": "Transaction created"}
```

### Explanation

| HTTP Method | Purpose                     |
| ----------- | --------------------------- |
| GET         | Retrieve data               |
| POST        | Create data                 |
| PUT         | Update an existing resource |
| PATCH       | Partially update a resource |
| DELETE      | Delete a resource           |

For example:

```python
@app.get("/transactions")
```

This tells FastAPI to execute the associated function when it receives a GET request at `/transactions`.

### 9.2 FastAPI APIRouter

In larger applications, defining every endpoint inside `main.py` makes the code difficult to maintain.

FastAPI provides `APIRouter` to organize endpoints into separate modules.

Example structure:

```text
backend/
│
└── app/
    ├── main.py
    │
    └── routers/
        ├── auth.py
        ├── transactions.py
        ├── budgets.py
        └── categories.py
```

Example: `routers/transactions.py`

```python
from fastapi import APIRouter

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)

@router.get("/")
def get_transactions():
    return {"message": "All transactions"}

@router.post("/")
def create_transaction():
    return {"message": "Transaction created"}
```

Register the router in `main.py`:

```python
from fastapi import FastAPI
from app.routers import transactions

app = FastAPI()

app.include_router(
    transactions.router,
    prefix="/api"
)
```

Now the endpoints become:

```text
GET  /api/transactions/
POST /api/transactions/
```

### Why Use APIRouter?

- Organizes endpoints into separate files.
- Makes code easier to maintain.
- Separates different application modules.
- Helps multiple developers work independently.

---

## 10. Frontend Routing vs Backend Routing

Both are called routing, but their responsibilities are different.

| Frontend Routing                 | Backend Routing                             |
| -------------------------------- | ------------------------------------------- |
| Determines which page to display | Determines which function handles a request |
| Usually managed by React Router  | Managed by FastAPI                          |
| Works with React components      | Works with Python functions                 |
| Handles browser navigation       | Handles API requests                        |
| Example: `/dashboard`            | Example: `/api/transactions`                |

### Example

A user opens the ExpenseTracker dashboard.

**Frontend route:**

```text
/dashboard
```

React Router displays the Dashboard component.

The Dashboard component then requests transaction data from the backend.

**Backend route:**

```text
GET /api/transactions
```

FastAPI handles the request and returns transaction data.

These two routes work together, but they have different responsibilities.

---

## 11. How Routing Works in ExpenseTracker

Consider a user who wants to view their transactions.

### Complete Workflow

1. User opens the website.
2. React Router displays the Home page.
3. User signs in using Google.
4. Backend verifies the Google ID token.
5. Backend returns a JWT access token.
6. User navigates to `/dashboard`.
7. React Router checks frontend authentication state.
8. Dashboard component is displayed.
9. Dashboard requests data from FastAPI.
10. FastAPI verifies the JWT.
11. FastAPI retrieves the user's transactions from PostgreSQL.
12. Backend returns JSON data.
13. React displays the transactions.

### Simplified Architecture

```text
                 USER
                   |
                   v
             REACT FRONTEND
                   |
                   v
             REACT ROUTER
                   |
          ---------------------
          |                   |
          v                   v
       /login             /dashboard
                              |
                              v
                       PROTECTED PAGE
                              |
                              v
                         API REQUEST
                              |
                              v
                         FASTAPI
                              |
                              v
                      AUTHENTICATION
                              |
                              v
                       BUSINESS LOGIC
                              |
                              v
                         SQLALCHEMY
                              |
                              v
                         POSTGRESQL
                              |
                              v
                         JSON RESPONSE
                              |
                              v
                       REACT FRONTEND
```

---

## 12. Important Routing Concepts

| Concept         | Meaning                                         |
| --------------- | ----------------------------------------------- |
| Route           | A URL pattern associated with a page or handler |
| Router          | A system that manages route definitions         |
| BrowserRouter   | Enables browser-based routing in React          |
| Routes          | Groups route definitions in React Router        |
| Route           | Maps a path to a React component                |
| Link            | Navigates between frontend routes               |
| useNavigate     | Navigates programmatically                      |
| useParams       | Reads dynamic route parameters                  |
| Outlet          | Displays matching nested child routes           |
| Protected Route | Restricts frontend page access                  |
| APIRouter       | Organizes FastAPI endpoints                     |
| HTTP Method     | Defines the operation requested from an API     |

---

## 13. Common Routing Mistakes

### 1. Using the Wrong URL

If a route is defined as:

```jsx
<Route path="/dashboard" element={<Dashboard />} />
```

Visiting `/home` will not display the Dashboard.

### 2. Forgetting Outlet

Nested child routes will not appear in the parent layout if the parent component does not render `<Outlet />`.

### 3. Confusing Frontend and Backend Routes

These are different:

```text
/dashboard
/api/dashboard
```

The first can be a React page route.

The second can be a FastAPI API endpoint.

### 4. Protecting Only Frontend Routes

Frontend restrictions do not replace backend authentication and authorization.

Always secure protected API endpoints on the backend.

### 5. Forgetting the Not Found Route

Applications should handle URLs that do not match any defined route.

Example:

```jsx
<Route path="*" element={<NotFound />} />
```

This displays a Not Found page for unknown frontend routes.

---

## 14. What Should You Learn Next?

Recommended learning order:

1. URL and HTTP fundamentals
2. React Router basics
3. BrowserRouter, Routes, and Route
4. Link and useNavigate
5. Dynamic Routing and useParams
6. Nested Routing and Outlet
7. Protected Routes
8. FastAPI Routing
9. FastAPI APIRouter
10. Authentication and Authorization

---

## 15. Quick Revision

- Application routing determines what happens when a particular URL is accessed.
- React Router manages frontend navigation.
- FastAPI manages backend API endpoints.
- `BrowserRouter` enables browser-based routing.
- `Routes` and `Route` define frontend routes.
- `Link` navigates between pages.
- `useNavigate` performs programmatic navigation.
- `useParams` reads dynamic URL parameters.
- `Outlet` renders nested routes.
- Protected routes restrict access to frontend pages.
- `APIRouter` organizes FastAPI endpoints.
- Backend authentication and authorization protect actual application data.

---

## 16. Practical Exercise

Build a simple routing system for your ExpenseTracker.

Create these frontend routes:

| Route           | Component    |
| --------------- | ------------ |
| `/`             | Home         |
| `/login`        | Login        |
| `/register`     | Register     |
| `/dashboard`    | Dashboard    |
| `/transactions` | Transactions |
| `/budgets`      | Budgets      |
| `/settings`     | Settings     |
| `*`             | NotFound     |

Then:

1. Create a navigation menu using `Link`.
2. Use `useNavigate` after a successful login.
3. Create a nested dashboard layout using `Outlet`.
4. Add protected routes for dashboard pages.
5. Create a dynamic route `/transactions/:id`.
6. Organize FastAPI endpoints using `APIRouter`.

**Goal:** Understand how React Router and FastAPI routing work together in a full-stack application.
