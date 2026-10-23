# Explain React Routing

## 1. What Is React Routing?

React Routing is the process of navigating between different pages or views in a React application without reloading the entire webpage.

For example, a Book Library application might have these pages:

- Home
- Books
- About
- Contact

React Routing lets users move between these pages while the application continues running.

**Example:** When a user clicks "Books" in the navigation menu, the Books page appears without a full browser page reload.

---

## 2. Why Do We Need React Routing?

Without routing, we would need to manage which content appears on the screen manually.

React Router makes navigation easier by connecting URLs to React components.

### Benefits

- Navigate between different pages.
- Update the URL in the browser.
- Avoid full-page reloads during normal client-side navigation.
- Support browser Back and Forward buttons.
- Create dynamic routes, such as `/books/10`.
- Organize applications into reusable page components.

---

## 3. What Is React Router?

React Router is a library that enables routing in React applications.

Install it using:

```bash
npm install react-router-dom
```

It provides components and hooks such as:

| Component or Hook | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `BrowserRouter`   | Enables browser-based routing                              |
| `Routes`          | Groups route definitions                                   |
| `Route`           | Connects a URL path to a component                         |
| `Link`            | Navigates to another route                                 |
| `NavLink`         | Creates a navigation link that can detect the active route |
| `useNavigate`     | Navigates programmatically                                 |
| `useParams`       | Reads dynamic URL parameters                               |

---

## 4. Basic React Routing Example

Suppose we want to create a website with Home, About, and Contact pages.

### Step 1: Create the page components

Create these files inside `src/pages/`.

**Home.jsx**

```jsx
function Home() {
  return <h1>Welcome to Home Page</h1>;
}

export default Home;
```

**About.jsx**

```jsx
function About() {
  return <h1>About Us</h1>;
}

export default About;
```

**Contact.jsx**

```jsx
function Contact() {
  return <h1>Contact Us</h1>;
}

export default Contact;
```

### Step 2: Configure routing in `App.jsx`

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/about">About</Link>
        {" | "}
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Step 3: Run the application

```bash
npm run dev
```

Open the local URL shown by Vite in your terminal.

Now you can navigate between:

- `/` — Home page
- `/about` — About page
- `/contact` — Contact page

---

## 5. Understanding the Important Components

### A. `BrowserRouter`

It enables browser-based routing for the application.

```jsx
<BrowserRouter>{/* Application and routes */}</BrowserRouter>
```

Usually, wrap the application in `BrowserRouter` once, commonly in `main.jsx` or `App.jsx`. Do not wrap it twice unnecessarily.

### B. `Routes`

It groups the route definitions.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

React Router selects the route that matches the current URL.

### C. `Route`

It connects a URL path with the component to display.

```jsx
<Route path="/books" element={<Books />} />
```

When the URL matches `/books`, React Router renders the `Books` component.

### D. `Link`

It navigates to another route without a full-page reload during normal client-side navigation.

```jsx
<Link to="/books">View Books</Link>
```

Use `Link` instead of a regular anchor tag for internal navigation in a React Router application.

### E. `NavLink`

It is useful for navigation menus because it can identify the active route.

```jsx
<NavLink to="/books">Books</NavLink>
```

You can use its `className` callback to apply different styling to the active link.

---

## 6. Dynamic Routing

Dynamic routing allows a route to handle different values.

For example, each book can have its own URL:

- `/books/1`
- `/books/2`
- `/books/3`

Define a dynamic route using `:id`.

```jsx
<Route path="/books/:id" element={<BookDetails />} />
```

Use `useParams()` to read the ID.

**BookDetails.jsx**

```jsx
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams();

  return <h1>Book ID: {id}</h1>;
}

export default BookDetails;
```

If the user visits `/books/5`, the page displays:

```text
Book ID: 5
```

The ID is a URL parameter. You can use it to request the corresponding book from your backend API.

---

## 7. Programmatic Navigation with `useNavigate`

Sometimes, navigation should happen after an action, such as submitting a form.

```jsx
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  function handleLogin() {
    // Perform login and validate the result first.
    navigate("/dashboard");
  }

  return <button onClick={handleLogin}>Login</button>;
}

export default Login;
```

`useNavigate()` returns a function that allows you to navigate programmatically.

**Common uses:**

- Navigate to a dashboard after successful login.
- Redirect after creating a book.
- Return to a previous page.
- Navigate to a details page after selecting an item.

For real authentication, only navigate to a protected page after confirming that login succeeded.

---

## 8. React Routing vs Traditional Navigation

| Feature                  | Traditional page navigation                        | React client-side routing                                  |
| ------------------------ | -------------------------------------------------- | ---------------------------------------------------------- |
| Navigation               | Usually requests a new document                    | Usually updates the view without requesting a new document |
| Full-page reload         | Common                                             | Usually avoided                                            |
| Page content             | Loaded as a new document                           | React renders the matched component                        |
| URL                      | Changes                                            | Changes                                                    |
| Back and Forward buttons | Supported                                          | Supported                                                  |
| Example                  | Navigate using a regular link to another HTML page | Navigate using React Router's `Link`                       |

**Important:** Client-side routing still uses URLs. Refreshing or opening a route directly also requires the web server to be configured to serve the application correctly.

---

## 9. React Routing in a Book Library Project

A Book Library website could use the following routes:

| URL          | Component     | Purpose                                |
| ------------ | ------------- | -------------------------------------- |
| `/`          | `Home`        | Display dashboard and book statistics  |
| `/books`     | `Books`       | Display and search the book collection |
| `/books/:id` | `BookDetails` | Show details for one book              |
| `/about`     | `About`       | Explain the project                    |
| `/contact`   | `Contact`     | Display contact information or a form  |

Example project structure:

```text
src/
├── components/
│   ├── Header.jsx
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx
│   ├── Books.jsx
│   ├── BookDetails.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── App.jsx
└── main.jsx
```

This structure separates reusable components from full-page views.

---

## 10. Quick Revision

- **React Routing:** Navigating between views based on URLs.
- **React Router:** Library used to implement routing in React.
- **BrowserRouter:** Enables browser-based routing.
- **Routes:** Groups route definitions.
- **Route:** Maps a URL path to a component.
- **Link:** Navigates between routes.
- **NavLink:** Supports active-link styling.
- **useNavigate:** Navigates programmatically.
- **useParams:** Reads dynamic route parameters.

### Interview Question

**Q: What is React Routing, and why do we use React Router?**

**Answer:** React Routing connects URLs to components in a React application. React Router provides tools such as `BrowserRouter`, `Routes`, `Route`, and `Link` to create navigation between views without a full-page reload during normal client-side navigation. It also supports dynamic routes and programmatic navigation.

---

## 11. Official Documentation

- [React Router Documentation](https://reactrouter.com/)
- [React Router `BrowserRouter`](https://reactrouter.com/api/declarative-routers/BrowserRouter)
- [React Router `useParams`](https://reactrouter.com/api/hooks/useParams)
- [React Router `useNavigate`](https://reactrouter.com/api/hooks/useNavigate)
