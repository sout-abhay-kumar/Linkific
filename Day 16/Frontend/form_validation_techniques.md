# React Form Validation Techniques

## 1. What Is Form Validation?

**Form validation** means checking whether the information entered by a
user follows the application's rules before accepting or submitting it.

For example, a registration form may require:

-   Name must not be empty.
-   Email must have a reasonable email format.
-   Password must meet a minimum length.
-   Confirm password must match the password.

Validation helps users correct mistakes and helps the application avoid
processing incomplete or malformed data.

> Important: Frontend validation improves user experience, but it is not
> a security boundary. The backend must validate requests independently
> because frontend checks can be bypassed.

## 2. Common Validation Techniques

### A. Required Field Validation

Check whether a field is empty or contains only whitespace.

``` js
if (!name.trim()) {
  errors.name = "Name is required.";
}
```

`trim()` removes whitespace from the beginning and end of a string.

### B. Email Format Validation

A simple client-side pattern can catch common mistakes:

``` js
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(email)) {
  errors.email = "Enter a valid email address.";
}
```

This is a practical basic check, not a guarantee that the address exists
or can receive mail.

### C. Minimum Password Length

``` js
if (password.length < 8) {
  errors.password = "Password must be at least 8 characters.";
}
```

The application's backend should enforce the actual password policy too.

### D. Matching Fields

``` js
if (password !== confirmPassword) {
  errors.confirmPassword = "Passwords do not match.";
}
```

### E. Numeric Range Validation

``` js
const age = Number(ageInput);

if (!Number.isFinite(age) || age < 18 || age > 120) {
  errors.age = "Enter an age between 18 and 120.";
}
```

### F. Built-In HTML Validation

HTML provides attributes such as:

``` jsx
<input name="email" type="email" required />
<input name="password" type="password" minLength={8} required />
```

Useful attributes include:

-   `required`
-   `type="email"`
-   `minLength`
-   `maxLength`
-   `min`
-   `max`
-   `pattern`

Native browser validation is helpful, but custom validation may be
needed for clearer or more complex feedback.

## 3. Example: React Form With Validation

This example uses controlled inputs, validates required fields and email
format, and displays errors.

``` jsx
import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Clear the previous success message when the user edits the form.
    setSuccessMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setSuccessMessage("");

    if (Object.keys(validationErrors).length === 0) {
      // In a real application, send formData to the backend here.
      setSuccessMessage("Form validation passed.");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert">{errors.password}</p>
        )}
      </div>

      <button type="submit">Register</button>

      {successMessage && <p role="status">{successMessage}</p>}
    </form>
  );
}

export default RegisterForm;
```

### How the validation works

1.  The user enters values into controlled inputs.
2.  The user submits the form.
3.  `event.preventDefault()` prevents a page reload.
4.  `validateForm()` checks each field and returns an errors object.
5.  `setErrors()` stores the validation messages.
6.  If the errors object is empty, the form passes these frontend
    checks.
7.  In a real app, the form data can then be sent to the backend.

`noValidate` disables the browser's automatic validation UI so this
example can display its own messages. The input types and attributes can
still provide useful semantics.

## 4. When Should You Validate?

There are three common approaches.

### Validate on Submit

Check all fields after the user submits the form.

**Advantages:** - Simple to implement. - Avoids showing errors before
the user has tried to submit.

### Validate on Change

Check a field whenever its value changes.

**Advantages:** - Gives immediate feedback.

**Consideration:** - Showing errors too early can frustrate users.

### Validate on Blur

Check a field when the user leaves it.

**Advantages:** - Gives feedback after the user has finished interacting
with a field. - Often less distracting than validating every keystroke.

A common user-friendly approach is to validate on submit first, then
validate a field on change or blur after the user has interacted with
it.

## 5. Frontend vs. Backend Validation

  -----------------------------------------------------------------------
  Frontend Validation                 Backend Validation
  ----------------------------------- -----------------------------------
  Runs in the browser                 Runs on the server

  Gives quick user feedback           Enforces rules before processing
                                      data

  Can be bypassed                     Must be enforced for every relevant
                                      request

  Improves usability                  Protects data integrity and
                                      application security

  Example: required email field       Example: Pydantic schema checks
                                      request data
  -----------------------------------------------------------------------

### FastAPI Example

``` python
from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8)
```

FastAPI uses this schema to validate request data. Invalid data results
in a validation response, typically HTTP `422 Unprocessable Entity`.

The backend should also enforce business rules, such as whether an email
is already registered.

## 6. Good Error Message Practices

Prefer clear, actionable messages:

  Avoid            Prefer
  ---------------- --------------------------------------------------
  Invalid          Enter a valid email address.
  Error 422        Check the highlighted fields and try again.
  Bad input        Name is required.
  Request failed   We couldn't save your changes. Please try again.

Good feedback should:

-   Explain what went wrong.
-   Tell the user how to fix it.
-   Appear near the relevant field when possible.
-   Avoid exposing internal stack traces or sensitive server details.
-   Be accessible to users of assistive technology.

## 7. Key Takeaways

-   Validate required fields and input formats.
-   Use controlled components to manage React form values.
-   Store and display validation errors clearly.
-   Choose when to validate: submit, change, or blur.
-   Use frontend validation for user experience.
-   Always validate again on the backend.
-   Handle API failures separately from field validation errors.
