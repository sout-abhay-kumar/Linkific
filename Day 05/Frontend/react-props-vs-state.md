# React Props vs State — Complete Guide

## Table of Contents

1. [Introduction](#1-introduction)
2. [What Are Props?](#2-what-are-props)
3. [What Is State?](#3-what-is-state)
4. [Props vs State: Main Differences](#4-props-vs-state-main-differences)
5. [How Props and State Work Together](#5-how-props-and-state-work-together)
6. [Passing Different Types of Props](#6-passing-different-types-of-props)
7. [Passing Functions as Props](#7-passing-functions-as-props)
8. [Updating State Correctly](#8-updating-state-correctly)
9. [State, Re-rendering, and Component Instances](#9-state-re-rendering-and-component-instances)
10. [Common Mistakes](#10-common-mistakes)
11. [Props and State in a Login Form](#11-props-and-state-in-a-login-form)
12. [When Should You Use Each?](#12-when-should-you-use-each)
13. [Best Practices](#13-best-practices)
14. [Quick Revision](#14-quick-revision)
15. [Practice Questions](#15-practice-questions)

---

## 1. Introduction

**Props** and **state** are two core concepts in React. They both hold data used to render a component, but they serve different purposes.

- **Props** let a component receive data or callbacks from its parent.
- **State** lets a component (or the component that owns the state) remember information that can change over time.
- When props or state change, React may render the component again to update the UI.

A useful mental model:

- **Props = inputs received by a component.**
- **State = changing information managed by a component.**

Example uses in an application:

- Props: a user's name passed to a profile card.
- State: whether a modal is open.
- Props: a callback that tells a parent the user clicked Login.
- State: the text currently entered into an email field.

## 2. What Are Props?

**Props** (short for *properties*) are values passed from a parent component to a child component.

Props make components reusable. Instead of hard-coding the same information into every component, the parent supplies the values that each instance needs.

### 2.1 Basic example

Create `Greeting.jsx`:

```jsx
function Greeting(props) {
  return <h1>Hello, {props.username}!</h1>;
}

export default Greeting;
```

Use it in `App.jsx`:

```jsx
import Greeting from "./Greeting";

function App() {
  return (
    <main>
      <Greeting username="Abhay" />
      <Greeting username="Rahul" />
    </main>
  );
}

export default App;
```

The two `Greeting` instances receive different values:

- First instance: `username` is `"Abhay"`.
- Second instance: `username` is `"Rahul"`.

The same component can display different content because the parent passes different props.

### 2.2 Destructuring props

Instead of writing `props.username`, you can destructure the property in the function parameters:

```jsx
function Greeting({ username }) {
  return <h1>Hello, {username}!</h1>;
}
```

This is equivalent to receiving the `props` object and reading its `username` property.

### 2.3 Props are read-only

A child component should not directly change its props.

Incorrect:

```jsx
function Greeting({ username }) {
  username = "New Name"; // Do not mutate a prop
  return <h1>Hello, {username}</h1>;
}
```

Instead, the parent should update the value it passes, usually by updating its own state.

### 2.4 Props can have default values

You can provide a default value through JavaScript parameter destructuring:

```jsx
function Greeting({ username = "Guest" }) {
  return <h1>Hello, {username}!</h1>;
}
```

If the parent omits `username` or passes `undefined`, the component uses `"Guest"`.

```jsx
<Greeting />
<Greeting username="Abhay" />
```

### 2.5 Props can be any JavaScript value

Props can include strings, numbers, booleans, arrays, objects, functions, and even JSX elements.

```jsx
<UserCard
  name="Abhay"
  age={21}
  isOnline={true}
  skills={["React", "Node.js", "Python"]}
  profile={{ city: "Dehradun", role: "Student" }}
/>
```

Use curly braces to pass JavaScript values such as numbers, booleans, arrays, objects, and function references. A string can be passed using quotes.

The receiving component might look like this:

```jsx
function UserCard({ name, age, isOnline, skills, profile }) {
  return (
    <section>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
      <p>Skills: {skills.join(", ")}</p>
      <p>City: {profile.city}</p>
    </section>
  );
}
```

### 2.6 The special `children` prop

Anything placed between a component's opening and closing tags is passed through the `children` prop.

```jsx
function Panel({ children }) {
  return <section className="panel">{children}</section>;
}

function App() {
  return (
    <Panel>
      <h2>Welcome to Connectly</h2>
      <p>Connect with your community.</p>
    </Panel>
  );
}
```

`Panel` does not need to know which elements it will contain. It simply renders whatever it receives as `children`.

## 3. What Is State?

**State is information React keeps track of between renders.** It is useful for data that changes as the user interacts with an application.

Examples include:

- Whether a modal is open.
- A counter's current value.
- The contents of a form field.
- Whether a post is liked.
- The currently selected tab.
- A loading indicator or validation message.

Function components commonly use the `useState` Hook to add state.

### 3.1 Basic state example

```jsx
import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);

  function handleLike() {
    setLikes((previousLikes) => previousLikes + 1);
  }

  return (
    <div>
      <p>Likes: {likes}</p>
      <button onClick={handleLike}>Like</button>
    </div>
  );
}

export default LikeButton;
```

When the button is clicked:

1. `handleLike` runs.
2. `setLikes` requests a state update.
3. React renders the component again with the updated value.
4. The displayed count changes.

### 3.2 Understanding `useState`

```jsx
const [likes, setLikes] = useState(0);
```

- `useState(0)` initializes the state to `0` on the component's initial render.
- `likes` is the current state value for that render.
- `setLikes` is the setter used to request an update.
- React preserves the state between renders of the same component instance.

The names `likes` and `setLikes` are conventions; you choose them.

### 3.3 State is updated with a setter

Incorrect:

```jsx
likes = likes + 1;
```

Do not assign directly to a state variable. Doing so does not tell React to update the UI and the variable is just a constant binding in the current render.

Correct:

```jsx
setLikes(likes + 1);
```

When the next value depends on the previous value, prefer the functional updater:

```jsx
setLikes((previousLikes) => previousLikes + 1);
```

This is especially helpful when multiple updates are queued or when the update depends on the most recent state.

### 3.4 State can store different kinds of values

String:

```jsx
const [email, setEmail] = useState("");
```

Boolean:

```jsx
const [isOpen, setIsOpen] = useState(false);
```

Number:

```jsx
const [count, setCount] = useState(0);
```

Array:

```jsx
const [tasks, setTasks] = useState([]);
```

Object:

```jsx
const [user, setUser] = useState({
  name: "",
  email: "",
});
```

### 3.5 Updating objects and arrays in state

Treat objects and arrays held in state as immutable. Create a new object or array instead of mutating the existing value.

Updating an object:

```jsx
setUser((previousUser) => ({
  ...previousUser,
  name: "Abhay",
}));
```

Updating an array by adding an item:

```jsx
setTasks((previousTasks) => [
  ...previousTasks,
  "Learn React",
]);
```

Updating an array by removing an item:

```jsx
setTasks((previousTasks) =>
  previousTasks.filter((task) => task !== "Learn React")
);
```

These examples create new references, allowing React to detect the state update reliably.

## 4. Props vs State: Main Differences

| Feature | Props | State |
|---|---|---|
| Main purpose | Pass information into a component | Store information that can change over time |
| Where does the value come from? | Usually the parent component | Managed by the component that owns the state |
| How is it updated? | The parent supplies a new prop value | Use a state setter, such as `setCount` |
| Can the receiving component mutate it directly? | No | No; update it through the setter |
| Typical examples | `username`, `title`, `onLogin` | `isOpen`, `count`, `email` |
| Reusability | Lets one component receive different inputs | Lets a component respond to interactions |
| Does a change affect rendering? | A new prop can cause a render | A state update can cause a render |

**Remember:** Props are read-only inputs. State is changing information managed by the state owner. Both are used to determine what the component renders.

## 5. How Props and State Work Together

A common React pattern is:

1. A parent stores state.
2. The parent passes the current state value to a child as a prop.
3. The parent also passes a callback as a prop.
4. The child calls the callback when an event occurs.
5. The callback updates the parent's state.
6. React renders the parent and affected child UI with the new value.

### Example: Parent owns the count

```jsx
import { useState } from "react";

function CounterDisplay({ count, onIncrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <CounterDisplay
      count={count}
      onIncrement={() => setCount((previous) => previous + 1)}
    />
  );
}

export default App;
```

In this example:

- `App` owns the state.
- `count` is passed to `CounterDisplay` as a prop.
- `onIncrement` is a function prop.
- The child does not directly change `count`; it calls the supplied callback.
- The callback updates state in `App`, and the new count flows down to the child.

This pattern is often described as **lifting state up** when state is moved to a parent so multiple children can share it.

## 6. Passing Different Types of Props

### 6.1 String prop

```jsx
<Profile name="Abhay" />
```

### 6.2 Number prop

```jsx
<Profile age={21} />
```

### 6.3 Boolean prop

```jsx
<Profile isOnline={true} />
```

For a boolean prop, shorthand is also possible:

```jsx
<Profile isOnline />
```

This passes `true`.

### 6.4 Array and object props

```jsx
<SkillList skills={["React", "JavaScript", "CSS"]} />

<UserProfile user={{ name: "Abhay", city: "Dehradun" }} />
```

### 6.5 Function prop

```jsx
<SaveButton onSave={() => console.log("Saved")} />
```

### 6.6 JSX or component content as a prop

The common `children` pattern:

```jsx
<Card>
  <h2>Profile</h2>
  <p>Frontend developer</p>
</Card>
```

## 7. Passing Functions as Props

Functions as props are important because they let child components notify their parent that something happened.

Example:

```jsx
function LoginForm({ onLogin }) {
  return (
    <button onClick={onLogin}>
      Login
    </button>
  );
}

function App() {
  function handleLogin() {
    console.log("Login button clicked");
  }

  return <LoginForm onLogin={handleLogin} />;
}
```

Here, `App` defines `handleLogin` and passes it to `LoginForm`. Clicking the button invokes the function.

**Important distinction:**

```jsx
<LoginForm onLogin={handleLogin} />
```

Passes the function for later execution.

```jsx
<LoginForm onLogin={handleLogin()} />
```

Calls the function immediately during rendering and passes its return value. This is usually not what you want for an event handler.

## 8. Updating State Correctly

### 8.1 Use the functional updater when appropriate

For a counter:

```jsx
setCount((previousCount) => previousCount + 1);
```

This tells React how to calculate the next value from the previous value.

### 8.2 State values belong to a render

A state variable is the value for the current render. Calling its setter requests a future render; it does not change that variable immediately in the already-running function.

```jsx
function handleClick() {
  setCount((previous) => previous + 1);
  console.log(count); // The current render's value
}
```

The log may show the old value. This is expected.

### 8.3 Avoid redundant state when possible

If a value can be calculated from existing props or state, you often do not need to store it separately.

Instead of maintaining a separate `fullName` state synchronized with `firstName` and `lastName`:

```jsx
const fullName = `${firstName} ${lastName}`;
```

Derived values can be calculated during rendering. This avoids keeping multiple pieces of state in sync.

## 9. State, Re-rendering, and Component Instances

### 9.1 What is a re-render?

A re-render means React runs a component function again to determine the UI for the current props and state. React then updates the necessary parts of the rendered interface.

A state update can trigger a re-render. A parent re-render can also lead React to render its children again, subject to React's normal rendering and optimization behavior.

### 9.2 Each component instance has its own state

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((n) => n + 1)}>
      Count: {count}
    </button>
  );
}

function App() {
  return (
    <>
      <Counter />
      <Counter />
    </>
  );
}
```

Each `Counter` instance maintains its own `count`. Clicking one does not automatically change the other.

### 9.3 State is not automatically saved permanently

React state normally exists while that component instance remains mounted. It is not automatically stored in a database or preserved after a full page reload.

To persist data, an application may need storage such as `localStorage`, a backend API, or a database, depending on the data and security requirements.

## 10. Common Mistakes

### Mistake 1: Mutating props

Incorrect:

```jsx
function User({ name }) {
  name = "Other Name";
  return <p>{name}</p>;
}
```

Correct: let the parent supply the desired name.

### Mistake 2: Mutating state directly

Incorrect:

```jsx
user.name = "Abhay";
setUser(user);
```

Correct:

```jsx
setUser((previous) => ({
  ...previous,
  name: "Abhay",
}));
```

### Mistake 3: Expecting state to change immediately

Incorrect assumption:

```jsx
setCount(count + 1);
console.log(count); // Not necessarily the new count
```

The variable refers to the current render's state value.

### Mistake 4: Passing a function call instead of a function

Usually incorrect for a click handler:

```jsx
<button onClick={handleClick()}>Click</button>
```

Usually correct:

```jsx
<button onClick={handleClick}>Click</button>
```

Use an arrow function when you need to pass arguments:

```jsx
<button onClick={() => handleDelete(item.id)}>Delete</button>
```

### Mistake 5: Duplicating derived state

Avoid separately storing values that can be calculated from existing state or props unless there is a clear reason.

### Mistake 6: Treating props as secure

Props and state are frontend values, not security boundaries. Never rely on them alone to authorize sensitive actions. The backend must enforce authorization and validate data.

## 11. Props and State in a Login Form

In a modular React app, such as Connectly, the parent component may control which form is shown, while the login component manages its input values.

### `LoginForm.jsx`

```jsx
import { useState } from "react";

function LoginForm({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    onLogin({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button type="submit">Login</button>

      <button type="button" onClick={onSwitchToSignup}>
        Create an account
      </button>
    </form>
  );
}

export default LoginForm;
```

### `App.jsx`

```jsx
import { useState } from "react";
import LoginForm from "./components/LoginForm";

function App() {
  const [currentView, setCurrentView] = useState("login");

  function handleLogin(credentials) {
    // Demo only: this does not authenticate a real user.
    console.log("Submitted login form", {
      email: credentials.email,
      passwordProvided: Boolean(credentials.password),
    });
  }

  if (currentView === "login") {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentView("signup")}
      />
    );
  }

  return (
    <section>
      <h2>Signup view</h2>
      <button onClick={() => setCurrentView("login")}>
        Back to login
      </button>
    </section>
  );
}

export default App;
```

In this example:

**Props received by `LoginForm`:**

- `onLogin`: callback to report the submitted credentials to the parent.
- `onSwitchToSignup`: callback to request switching to the signup view.

**State inside `LoginForm`:**

- `email`: current email input.
- `password`: current password input.

**State inside `App`:**

- `currentView`: which screen is currently displayed.

The example demonstrates component communication, not real authentication. For a production login system, submit credentials securely to a backend over HTTPS, validate them server-side, and use an appropriate session or token strategy. Do not log real passwords or store them in frontend state longer than necessary.

## 12. When Should You Use Each?

### Use props when:

- A component needs data from its parent.
- You want to reuse a component with different content.
- A child needs to notify a parent of an event using a callback.
- You want to customize a component's behavior or appearance.

Examples:

```jsx
<Avatar imageUrl="/avatar.png" size={48} />
<Button label="Sign up" variant="primary" />
<LoginForm onLogin={handleLogin} />
```

### Use state when:

- A value changes because of user interaction.
- The interface must respond to changes.
- You need to track a form input, modal, counter, selected tab, or loading state.

Examples:

```jsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [email, setEmail] = useState("");
const [activeTab, setActiveTab] = useState("posts");
```

### Sometimes both are appropriate

A parent can own state and pass the value and setter-related callback to a child as props:

```jsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

Here, `isModalOpen` is state owned by the parent and a prop received by `Modal`. `onClose` is also a prop.

## 13. Best Practices

1. **Keep components focused.** Give each component a clear responsibility.
2. **Treat props as read-only.** Do not modify props inside the child.
3. **Update state through its setter.** Do not mutate state objects or arrays directly.
4. **Keep state close to where it is needed.** Move it to a common parent when several components need to share it.
5. **Use callbacks for child-to-parent communication.** A child calls a function provided by the parent.
6. **Avoid unnecessary state.** Calculate derived values where practical.
7. **Use clear names.** Examples: `isOpen`, `setIsOpen`, `onLogin`, and `userName`.
8. **Do not confuse UI state with backend data.** A local `isLoggedIn` boolean is not proof that the server authenticated a user.
9. **Keep secrets out of client-side code.** Frontend props and state can be inspected by the user.
10. **Use React Developer Tools** to inspect component props, state, and render behavior while debugging.

## 14. Quick Revision

| Term | One-line definition | Example |
|---|---|---|
| Props | Inputs passed to a component | `<Greeting username="Abhay" />` |
| State | Data managed over time by the state owner | `const [count, setCount] = useState(0)` |
| State setter | Requests a state update | `setCount((n) => n + 1)` |
| Callback prop | Function passed to a child | `<LoginForm onLogin={handleLogin} />` |
| `children` | Content passed between component tags | `<Card><p>Hello</p></Card>` |
| Re-render | React recalculates a component's UI | Happens after relevant state updates |
| Lifting state up | Moving shared state to a common parent | Parent owns `activeTab` and passes it to children |

**Final memory trick:**

- **JSX** describes what the UI should look like.
- **Props** pass data and callbacks into a component.
- **State** stores changing information that React tracks.
- **Callbacks** let a child request an action from its parent.

## 15. Practice Questions

Try answering these without looking at the earlier sections.

1. What are props, and why are they useful?
2. Why should a child not modify its props?
3. What does `useState(0)` do?
4. Why should you call `setCount` instead of assigning directly to `count`?
5. What is the difference between `onClick={handleClick}` and `onClick={handleClick()}`?
6. In a login form, should the email input value be state or props? Explain.
7. If two sibling components need the same selected tab, where could you keep that state?
8. Can props contain functions?
9. Does React state automatically persist after a page reload?
10. Why is a frontend `isLoggedIn` boolean not enough to secure a real application?

### Suggested answers

1. Props are inputs passed from a parent to a child; they make components reusable.
2. Props are read-only inputs; the parent should supply updated values.
3. It initializes a state variable to `0` on the initial render and returns the state value and setter.
4. The setter tells React to schedule an update and render the UI with the new state.
5. The first passes the function; the second invokes it immediately during rendering.
6. Usually state in the component that owns the editable input, or state in a parent passed down as props when shared control is needed.
7. In a common parent of the two components, then pass the value and callbacks as props.
8. Yes. Callback props are a common way for children to notify parents.
9. No. Persistence requires an explicit mechanism such as suitable browser storage or a backend.
10. Frontend values can be changed or inspected by users; the backend must enforce authentication and authorization.
