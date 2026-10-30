# React Controlled Components

## 1. What is a Controlled Component?

A **controlled component** is a form element in React whose value is
controlled by React state.

For example, a text input normally stores what the user types in the
browser. In a controlled component, React state stores the value, and
React updates the input whenever the state changes.

The common pattern is:

-   `value` connects the input to React state.
-   `onChange` updates that state when the user types.

## 2. Basic Example

``` jsx
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  function handleChange(event) {
    setName(event.target.value);
  }

  return (
    <form>
      <label htmlFor="name">Name:</label>

      <input
        id="name"
        type="text"
        value={name}
        onChange={handleChange}
      />

      <p>Your name is: {name}</p>
    </form>
  );
}

export default NameForm;
```

### How it works

1.  `useState("")` creates state named `name`, initially an empty
    string.
2.  `value={name}` tells React what value the input should display.
3.  When the user types, `onChange` calls `handleChange`.
4.  `event.target.value` reads the current input value.
5.  `setName(...)` updates React state.
6.  React renders the updated value in the input and paragraph.

The data flow is:

``` text
User types
   ↓
onChange event
   ↓
setName(newValue)
   ↓
React state updates
   ↓
Input displays the new value
```

## 3. Why Use Controlled Components?

Controlled components are useful because they let you:

-   Read form values easily.
-   Validate input as the user types or when the form is submitted.
-   Show conditional messages.
-   Disable the submit button when input is invalid.
-   Reset a form by updating state.
-   Keep the UI consistent with application state.

## 4. Controlled Form With Multiple Fields

``` jsx
import { useState } from "react";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />

      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;
```

### Important details

-   Each input's `name` should match a key in `formData`.
-   The computed property `[name]` updates only the field that changed.
-   `...previousData` preserves the other fields.
-   `event.preventDefault()` prevents the browser's default form
    submission and page reload.

## 5. Controlled vs. Uncontrolled Components

  -----------------------------------------------------------------------
  Controlled                          Uncontrolled
  ----------------------------------- -----------------------------------
  Value is managed by React state     Value is managed by the DOM

  Uses `value` and `onChange`         Often uses `defaultValue` or a ref

  Convenient for live validation      Can be useful for simple forms

  React has the current value         Read the value from the DOM when
                                      needed
  -----------------------------------------------------------------------

## 6. Common Mistakes

### Forgetting `onChange`

``` jsx
<input value={name} />
```

If `name` is state and there is no change handler, the input is
effectively read-only.

### Using `value` without initializing state

Prefer:

``` jsx
const [name, setName] = useState("");
```

For a controlled text input, keep its value a string rather than
switching between `undefined` and a string.

### Forgetting to preserve other state fields

Incorrect:

``` jsx
setFormData({ [name]: value });
```

This replaces the object and drops its other fields.

Correct:

``` jsx
setFormData((previousData) => ({
  ...previousData,
  [name]: value,
}));
```

## 7. Key Takeaway

A controlled component follows this pattern:

``` jsx
<input value={stateValue} onChange={handleChange} />
```

React state is the source of truth for the input value. This makes
controlled components especially useful for forms that need validation,
error messages, or conditional behavior.
