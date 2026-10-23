# Difference Between `useState` and `useEffect` in React

## 1. What is `useState`?

`useState` is a React Hook used to **store and update data** inside a component.

### Syntax

```jsx
const [count, setCount] = useState(0);
```

- `count` — current state value.
- `setCount` — function used to update the state.
- `0` — initial value.

### Example: Counter

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increase
      </button>
    </div>
  );
}

export default Counter;
```

### How it works

1. Initially, the count is `0`.
2. When the button is clicked, `setCount()` updates the value.
3. React re-renders the component to display the new count.

### Uses

- Counters
- Form inputs
- Search inputs
- Dropdowns
- Showing or hiding menus

---

## 2. What is `useEffect`?

`useEffect` is a React Hook used to **perform side effects and synchronize with external systems** after a component renders.

Examples include updating the browser tab title, setting up timers, managing subscriptions, and fetching data from an API.

### Syntax

```jsx
useEffect(() => {
  // Side-effect code
}, [dependencies]);
```

### Example: Updating the browser tab title

```jsx
import { useState, useEffect } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

export default Counter;
```

### How it works

1. The component renders with `count = 0`.
2. `useEffect` updates the browser tab title to `Count: 0`.
3. When the button is clicked, the count changes.
4. React renders the updated component.
5. Since `count` changed, the Effect runs again and updates the tab title.

### Uses

- Updating browser APIs
- Fetching data from an API
- Setting up timers
- Managing subscriptions
- Synchronizing with external systems

---

## 3. Main Differences

| Feature | `useState` | `useEffect` |
|---|---|---|
| Purpose | Store and update data | Synchronize with external systems |
| Returns | State value and setter function | Nothing directly useful to the component |
| When it works | State is initialized and updated | After rendering, according to dependencies |
| Re-render | Updating state normally causes a re-render | Running an Effect alone does not cause a re-render |
| Example | Store a counter value | Update the browser tab title |
| Cleanup | Not applicable | Can return a cleanup function |

---

## 4. Understanding the Dependency Array

### A. Empty dependency array `[]`

```jsx
useEffect(() => {
  console.log("Component mounted");
}, []);
```

Runs after the component mounts. In React Strict Mode, development may include an extra setup-and-cleanup cycle.

### B. With a dependency `[count]`

```jsx
useEffect(() => {
  console.log("Count changed:", count);
}, [count]);
```

Runs after the initial mount and again when `count` changes.

### C. Without a dependency array

```jsx
useEffect(() => {
  console.log("Effect ran");
});
```

Runs after every render.

---

## 5. Using Both Hooks Together

For example, when fetching data from an API:

```jsx
import { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default Users;
```

### Explanation

- `useState` stores the users received from the API.
- `useEffect` starts the API request after the component mounts.
- `setUsers(data)` updates the state.
- React re-renders the component to display the users.

This is a basic learning example. Production code should also handle loading states, errors, and request cleanup where appropriate.

---

## 6. Common Mistakes

### Mistake 1: Updating state during every render

Avoid calling a state setter unconditionally while rendering:

```jsx
// Avoid this
setCount(count + 1);
```

This can cause repeated renders. Update state in an event handler or an appropriate Effect instead.

### Mistake 2: Using `useEffect` for simple calculations

Instead of storing a derived value in separate state:

```jsx
const [firstName, setFirstName] = useState("Abhay");
const [lastName, setLastName] = useState("Kumar");
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

Calculate it directly during rendering:

```jsx
const fullName = `${firstName} ${lastName}`;
```

This avoids unnecessary state and an extra render.

### Mistake 3: Forgetting cleanup

If an Effect starts a timer or subscription, clean it up when it is no longer needed.

```jsx
useEffect(() => {
  const timerId = setInterval(() => {
    console.log("Timer running");
  }, 1000);

  return () => {
    clearInterval(timerId);
  };
}, []);
```

---

## 7. Quick Revision

- **`useState` = store and update data.**
- **`useEffect` = synchronize with external systems.**
- Updating state normally causes a re-render.
- The dependency array controls when an Effect runs again.
- Use event handlers for actions triggered directly by user interaction.
- Avoid using `useEffect` for calculations that can be performed during rendering.

---

## 8. Interview Question

**Q: What is the difference between `useState` and `useEffect`?**

**Answer:** `useState` is a React Hook used to manage a component's state. When its setter updates the state, React normally re-renders the component. `useEffect` is used to synchronize the component with external systems, such as browser APIs, timers, subscriptions, or network requests. It runs after rendering according to its dependency array and can return a cleanup function.

---

## 9. Practice Questions

1. Which Hook would you use to show or hide a sidebar? Why?
2. Which Hook could update the browser tab title when a counter changes?
3. What is the purpose of the dependency array in `useEffect`?
4. Why might an Effect need a cleanup function?
5. Why is calculating `fullName` during rendering usually better than storing it in separate state?

---

## 10. Official Documentation

- [React `useState`](https://react.dev/reference/react/useState)
- [React `useEffect`](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)