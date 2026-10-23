# React Component Lifecycle

## 1. What is the React Component Lifecycle?

The **React component lifecycle** describes the stages a component
goes through during its existence in a React application.

The three main stages are:

1. **Mounting** — the component appears on the page.
2. **Updating** — the component re-renders when its state or props change.
3. **Unmounting** — the component is removed from the page.

## 2. Mounting Phase

Mounting occurs when React first displays a component.

Example:

​```jsx
import { useEffect } from "react";

function Welcome() {
useEffect(() => {
console.log("Component mounted");
}, []);

return <h1>Welcome to React!</h1>;
}

export default Welcome;
​```

## 3. Updating Phase

Updating happens when a component's state or props change.

## 4. Unmounting Phase

Unmounting happens when React removes a component from the UI.

## 5. Quick Revision

- Mounting: component appears.
- Updating: component re-renders.
- Unmounting: component is removed.
- `useEffect`: synchronizes with external systems.
- Cleanup functions: release resources and undo Effect setup.
