# React Rendering Lifecycle

## 1. What is the React Rendering Lifecycle?

The React Rendering Lifecycle describes the different stages a React component goes through during its lifetime.

A React component generally goes through three major stages:

1. **Mounting** – The component is created and displayed for the first time.
2. **Updating** – The component re-renders when its state, props, or relevant context changes.
3. **Unmounting** – The component is removed from the UI.

React uses these stages to manage the user interface efficiently.

---

## 2. The Three Main Stages

### 2.1 Mounting

Mounting happens when a component is rendered for the first time.

Example:

```jsx
function Welcome() {
  return <h1>Welcome to ExpenseTracker!</h1>;
}

export default Welcome;
```

When React displays the `Welcome` component for the first time, it mounts the component.

During mounting:

1. React calls the component function.
2. React calculates what the UI should look like.
3. React updates the DOM to display the component.
4. Effects scheduled with `useEffect` run after the relevant commit.

### 2.2 Updating

Updating happens when a component needs to display new information.

Common reasons include:

- State changes.
- Props change.
- Context values used by the component change.
- A parent component re-renders, causing its child to render again.

Example:

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}

export default Counter;
```

When the button is clicked:

1. `setCount()` updates the state.
2. React schedules an update.
3. React renders the component again.
4. React compares the new result with the previous one.
5. React commits the necessary DOM changes.

### 2.3 Unmounting

Unmounting happens when a component is removed from the UI.

Example:

```jsx
import { useState } from "react";

function App() {
  const [show, setShow] = useState(true);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle Component</button>

      {show && <Welcome />}
    </div>
  );
}

function Welcome() {
  return <h2>Hello!</h2>;
}

export default App;
```

When `show` becomes `false`, React removes the `Welcome` component from the UI.

If the component has an effect cleanup function, React runs that cleanup when it unmounts.

---

## 3. Understanding the Render and Commit Phases

React rendering can be understood through two important phases.

### 3.1 Render Phase

During the render phase:

- React calls component functions.
- React calculates the next UI.
- React determines what changes are needed.

Example:

```jsx
function Expense({ amount }) {
  return <h2>₹{amount}</h2>;
}
```

React calls the component with the current `amount` prop to calculate its output.

**Important:** Rendering does not necessarily mean the browser DOM changes. React may render a component without needing to update the DOM.

Component rendering should be pure: do not perform side effects inside the component function.

### 3.2 Commit Phase

During the commit phase:

- React applies the required changes to the DOM.
- React updates references where necessary.
- React runs relevant layout effects.

After the commit, the browser can paint the updated screen.

Passive effects created with `useEffect` generally run after the browser has had an opportunity to paint.

---

## 4. Understanding useEffect()

`useEffect()` is a React Hook used to synchronize a component with external systems.

Examples include:

- Fetching data from an API.
- Setting up event listeners.
- Connecting to external services.
- Setting up timers.
- Synchronizing with browser APIs.

Syntax:

```jsx
useEffect(() => {
  // Side effect logic

  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

### 4.1 useEffect with an Empty Dependency Array

```jsx
useEffect(() => {
  console.log("Effect executed");
}, []);
```

The effect runs after the component mounts, subject to React's development Strict Mode behavior.

### 4.2 useEffect with Dependencies

```jsx
useEffect(() => {
  console.log("Count changed:", count);
}, [count]);
```

The effect runs after the initial commit and again when `count` changes.

### 4.3 useEffect Without a Dependency Array

```jsx
useEffect(() => {
  console.log("Effect executed");
});
```

The effect runs after every commit where the component has rendered.

Be careful when using this because it can cause unnecessary work.

---

## 5. Understanding Cleanup Functions

A cleanup function is returned from `useEffect()`.

React runs cleanup:

- Before an effect runs again with changed dependencies.
- When the component unmounts.

Example:

```jsx
import { useEffect } from "react";

function Timer() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log("Timer running...");
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log("Timer stopped");
    };
  }, []);

  return <h2>Timer Component</h2>;
}
```

Why is cleanup important?

Without cleanup:

- Timers may continue running.
- Event listeners may remain active.
- Subscriptions may not be removed.
- Resources may be wasted.

Cleanup helps prevent memory leaks and unwanted background activity.

---

## 6. React Rendering Lifecycle Flow

The following is a simplified lifecycle flow:

```text
        Component Created
                |
                v
          Initial Render
                |
                v
          Commit to DOM
                |
                v
        useEffect Executes
                |
                v
         State / Props Change?
                |
          +-----+-----+
          |           |
         Yes          No
          |           |
          v           v
     Re-render     Component
          |        Remains
          v
     Commit Changes
          |
          v
     Run Effect Cleanup
     (if dependencies changed)
          |
          v
     Run New useEffect
          |
          v
       Component
        Unmounts
          |
          v
     Effect Cleanup
```

Note: This is a conceptual flow. React may render components more than once, and rendering does not always result in a DOM update.

---

## 7. Example: Fetching API Data Using useEffect()

Consider an ExpenseTracker dashboard that needs to fetch transactions from a FastAPI backend.

```jsx
import { useEffect, useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("http://localhost:8000/api/transactions");

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();

        setTransactions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>My Transactions</h2>

      {transactions.map((transaction) => (
        <p key={transaction.id}>
          {transaction.title} - ₹{transaction.amount}
        </p>
      ))}
    </div>
  );
}

export default Transactions;
```

### What happens here?

1. React mounts the `Transactions` component.
2. Initial state is created.
3. React renders the loading message.
4. React commits the UI.
5. `useEffect()` executes.
6. The frontend sends a GET request to FastAPI.
7. The backend returns JSON data.
8. `response.json()` converts the response into JavaScript data.
9. `setTransactions()` updates the state.
10. React renders the component again.
11. The transaction list is displayed.

This is a common pattern for loading API data in React.

---

## 8. What Causes a Component to Re-render?

A component may re-render because of:

| Reason           | Explanation                                      |
| ---------------- | ------------------------------------------------ |
| State update     | A state setter schedules an update               |
| Props change     | The parent passes different props                |
| Context change   | A context value used by the component changes    |
| Parent re-render | A child can render again when its parent renders |

Important points:

- Calling a state setter with the same value may allow React to skip an unnecessary render.
- A re-render does not always mean the DOM changes.
- React can render components more than once in development.

---

## 9. React Strict Mode

React Strict Mode is a development tool that helps identify potential problems.

Example:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

In development, Strict Mode can:

- Call component functions an extra time to detect impure rendering.
- Run an extra Effect setup and cleanup cycle.
- Help identify missing cleanup logic.

This behavior helps developers find bugs before production.

**Important:** Strict Mode's extra checks do not happen in the same way in production builds.

If an API request appears to happen twice during development, check whether Strict Mode is enabled before assuming the backend is faulty.

---

## 10. Rendering Lifecycle vs useEffect()

These concepts are related but different.

| React Lifecycle                         | useEffect()                                    |
| --------------------------------------- | ---------------------------------------------- |
| Describes component stages              | A Hook for synchronizing with external systems |
| Includes mounting, updating, unmounting | Runs setup and cleanup based on dependencies   |
| Applies to component behavior           | Used for side effects                          |
| Describes the component's lifetime      | Manages an effect's lifetime                   |

Modern React primarily uses function components and Hooks instead of class lifecycle methods.

---

## 11. Class Component Lifecycle Methods

Older React class components use lifecycle methods.

| Class Lifecycle Method   | Purpose                              |
| ------------------------ | ------------------------------------ |
| `componentDidMount()`    | Runs after initial mounting          |
| `componentDidUpdate()`   | Runs after an update is committed    |
| `componentWillUnmount()` | Runs before the component is removed |

Modern function component equivalents are often implemented using `useEffect()`.

Example:

```jsx
useEffect(() => {
  // Similar setup role to componentDidMount

  return () => {
    // Similar cleanup role to componentWillUnmount
  };
}, []);
```

However, `useEffect()` is not a direct one-to-one replacement for every class lifecycle method.

---

## 12. Important React Rendering Concepts

### Reconciliation

Reconciliation is the process React uses to compare the previous UI result with the next one and determine what needs to change.

### Virtual DOM

The Virtual DOM is a commonly used term for React's in-memory representation of UI.

React uses its rendering and reconciliation process to determine the necessary updates to the actual DOM.

### State

State is component data that React tracks.

When state changes, React can schedule a re-render.

### Props

Props are values passed from a parent component to a child component.

When relevant props change, the child may render again.

### Keys

Keys help React identify elements in lists.

Example:

```jsx
{
  transactions.map((transaction) => (
    <p key={transaction.id}>{transaction.title}</p>
  ));
}
```

Use stable, unique keys when rendering lists.

---

## 13. Common Mistakes

### Mistake 1: Updating State During Rendering

Avoid:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  setCount(count + 1);

  return <p>{count}</p>;
}
```

This can cause repeated renders and an infinite render loop.

### Mistake 2: Missing Dependencies

Avoid ignoring values used inside an effect.

```jsx
useEffect(() => {
  console.log(userId);
}, []);
```

If `userId` changes, this effect will not re-run.

Use:

```jsx
useEffect(() => {
  console.log(userId);
}, [userId]);
```

### Mistake 3: Forgetting Cleanup

Avoid leaving timers or event listeners active after they are no longer needed.

### Mistake 4: Performing API Requests During Rendering

Do not directly fetch API data in the component body.

Use an appropriate data-fetching approach, such as `useEffect()` or a dedicated data-fetching library.

---

## 14. Practical Exercises

1. Create a counter component and observe how state updates cause re-renders.
2. Create a component that mounts and unmounts using conditional rendering.
3. Use `useEffect()` to log a message when a component mounts.
4. Use a dependency array to observe how an effect responds to state changes.
5. Create a timer using `setInterval()` and clean it up properly.
6. Fetch transactions from your ExpenseTracker FastAPI backend.
7. Add loading, success, and error states to the transaction component.
8. Enable React Strict Mode and observe the extra development checks.

---

## 15. Summary

React components generally go through three main stages:

1. **Mounting:** Component appears for the first time.
2. **Updating:** Component renders again when relevant inputs change.
3. **Unmounting:** Component is removed from the UI.

Remember these important concepts:

- Render phase calculates the next UI.
- Commit phase applies necessary changes.
- `useEffect()` synchronizes components with external systems.
- Cleanup functions prevent unwanted background work.
- State and props can trigger re-renders.
- Re-rendering does not necessarily mean the DOM changes.
- Strict Mode helps identify problems during development.

Understanding the rendering lifecycle is important for building efficient React applications and managing API requests, state, and side effects correctly.
