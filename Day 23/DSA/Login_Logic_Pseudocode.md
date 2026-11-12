# Login Logic --- Problem Solving / DSA

## 1. Problem statement

Design the logic for a login feature.

The system receives an email and password. It should verify the user's
credentials and allow access only when authentication succeeds.

For your ExpenseTracker project, the current login method is Google
Sign-In. The email-and-password algorithm below is a general backend
authentication exercise. It is useful if you later add traditional
password login.

## 2. Inputs and outputs

**Inputs** - Email address - Password

**Possible outcomes** - Login successful - Invalid credentials - Input
validation error - Temporary service error

Use a generic invalid-credentials message so the login endpoint does not
reveal whether an email address is registered.

## 3. Login algorithm --- plain English

1.  Receive the email and password.
2.  Check that both values are present.
3.  Validate the email format and input limits.
4.  Find the user account using the email.
5.  If no account is found, return a generic invalid-credentials
    response.
6.  Verify the submitted password against the stored password hash.
7.  If verification fails, return the same generic response.
8.  If verification succeeds, create the application's authenticated
    session.
9.  Return the appropriate success response.

## 4. Pseudocode

``` text
FUNCTION login(email, password):

    IF email is empty OR password is empty:
        RETURN validation error

    NORMALIZE email
    VALIDATE email format
    VALIDATE input length limits

    user = FIND user by email

    IF user does not exist:
        RETURN "Invalid email or password"

    password_is_valid =
        VERIFY password against user.password_hash

    IF password_is_valid is FALSE:
        RETURN "Invalid email or password"

    session = CREATE authenticated session for user

    RETURN login success and session
```

The `VERIFY` operation must use the password-hashing library. Do not
compare a submitted password directly with a stored plaintext password.

## 5. Flowchart

``` mermaid
flowchart TD
    A([Start]) --> B[Receive email and password]
    B --> C{Both values provided?}
    C -- No --> D[Return validation error]
    C -- Yes --> E[Validate and normalize input]
    E --> F[Find user by email]
    F --> G{User found?}
    G -- No --> H[Return generic invalid credentials]
    G -- Yes --> I[Verify password against stored hash]
    I --> J{Password valid?}
    J -- No --> H
    J -- Yes --> K[Create authenticated session]
    K --> L[Return login success]
    D --> M([End])
    H --> M
    L --> M
```

## 6. Time and space complexity

Let:

-   `n` = number of user records in the database.
-   `m` = length of the password input.

If the database searches by an indexed, unique email column, finding the
user is typically approximately `O(log n)` with a B-tree index. Actual
query performance depends on the database and index.

Password verification takes time determined by the password-hashing
algorithm and its configured cost. It is deliberately more expensive
than an ordinary hash.

The algorithm's application-level extra space is approximately `O(1)`,
excluding internal memory used by the password-hashing algorithm and
database/runtime overhead.

Do not describe login as simply `O(1)` without considering database
lookup and password verification.

## 7. Edge cases to consider

  -----------------------------------------------------------------------
  Case                                Expected behavior
  ----------------------------------- -----------------------------------
  Email is empty                      Validation error

  Password is empty                   Validation error

  Email has invalid format            Validation error

  Account does not exist              Generic invalid-credentials
                                      response

  Password is incorrect               Generic invalid-credentials
                                      response

  Account is disabled                 Deny login according to account
                                      policy

  Database is unavailable             Service error; do not report
                                      invalid password

  Too many attempts                   Apply rate limiting or temporary
                                      throttling

  Password hash is malformed          Handle safely and log a server-side
                                      diagnostic without exposing secrets
  -----------------------------------------------------------------------

## 8. Google Sign-In pseudocode for current ExpenseTracker

Your current application uses Google Sign-In, so the actual flow is
different. The frontend sends a Google ID token rather than an email and
password.

``` text
FUNCTION google_login(google_id_token):

    IF token is missing:
        RETURN authentication error

    google_payload = VERIFY token using Google's library

    IF verification fails:
        RETURN authentication error

    CHECK token issuer
    CHECK token audience matches this application's Google Client ID
    CHECK token has not expired

    google_subject = google_payload.subject
    email = google_payload.email

    CHECK email is verified, as required by the app's policy

    user = FIND application user by Google subject

    IF user does not exist:
        CREATE application user from verified Google claims

    session = CREATE application's own authenticated session

    RETURN login success and session
```

Use the stable Google subject (`sub`) as the provider identity. Do not
rely on email alone as the permanent identity key. Account linking and
duplicate-email handling need an explicit policy.

## 9. DSA and problem-solving concepts

This exercise is mainly about control flow and data lookup, rather than
a complex DSA problem.

Concepts involved:

-   **Sequence:** execute validation, lookup and verification in order.
-   **Conditionals:** choose a result based on whether input, user and
    password are valid.
-   **Database lookup:** find a record using an indexed key.
-   **Early return:** stop processing as soon as a condition fails.
-   **Error handling:** distinguish invalid credentials from
    infrastructure failures.

## 10. Practice exercises

Try writing pseudocode for these:

1.  Registration: validate input, check whether the email already
    exists, hash the password and create a user.
2.  Logout: invalidate the current session and clear the client
    authentication state.
3.  Change password: verify the current password, validate the new
    password, hash it and update the stored hash.
4.  Google login: verify the ID token, find or create the user and issue
    an application session.
5.  Protected expense endpoint: authenticate the request and return only
    the current user's expenses.

## 11. Quick revision

-   Validate input before processing.
-   Look up the user using a unique, indexed email field.
-   Verify a password against its stored hash.
-   Return generic errors for invalid credentials.
-   Create a session only after successful authentication.
-   Treat database failures differently from invalid credentials.
-   Google Sign-In verifies a Google ID token; it does not use the
    user's Google password.
