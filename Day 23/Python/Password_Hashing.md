# Password Hashing --- Python / Backend

## 1. What is password hashing?

Password hashing is the process of converting a password into a
fixed-format string using a one-way cryptographic algorithm.

For example, a user chooses a password:

``` text
MyPassword123
```

The backend hashes it and stores a result similar to:

``` text
$argon2id$v=19$...
```

The exact output depends on the algorithm and its settings.

**Hashing is not encryption.** Encryption is designed to be reversible
with a key. A secure password hash is intentionally one-way: the
application should not be able to recover the original password.

## 2. Why should passwords be hashed?

Imagine storing passwords directly in a database:

  user_id   email              password
  --------- ------------------ ---------------
  1         user@example.com   MyPassword123

If the database is exposed, attackers immediately see users' passwords.
This is called storing passwords in plaintext.

Instead, store a password hash:

  user_id   email              password_hash
  --------- ------------------ -----------------
  1         user@example.com   `$argon2id$...`

If the database is exposed, attackers do not immediately get the
original passwords.

## 3. Hashing versus encryption versus encoding

  -----------------------------------------------------------------------
  Concept                 Reversible?             Typical use
  ----------------------- ----------------------- -----------------------
  Hashing                 No practical reversal   Password verification,
                                                  integrity checks

  Encryption              Yes, with the key       Protecting data that
                                                  must later be read

  Encoding                Yes                     Representing data in
                                                  another format, such as
                                                  Base64
  -----------------------------------------------------------------------

Base64 is **not** password protection. Never store passwords using
Base64.

## 4. Why use Argon2id or bcrypt?

Passwords are often short or predictable. Fast general-purpose hashes
such as SHA-256 are not suitable on their own for password storage
because attackers can test huge numbers of guesses quickly.

Use a password-hashing algorithm designed to be deliberately expensive:

-   **Argon2id** --- a strong modern choice; it uses configurable memory
    and computation.
-   **bcrypt** --- a widely used password-hashing algorithm.
-   **scrypt** --- another password-hashing option designed to make
    large-scale guessing more expensive.

Use a well-maintained library. Do not implement the algorithm yourself.

## 5. How registration works

1.  The user submits an email and password over HTTPS.
2.  The backend validates the input.
3.  The backend hashes the password using Argon2id or bcrypt.
4.  The backend stores the email and password hash in the database.
5.  The backend never stores the original password.

Conceptual Python example using `pwdlib` with Argon2:

``` python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def hash_password(password: str) -> str:
    return password_hash.hash(password)
```

Install the library:

``` powershell
pip install "pwdlib[argon2]"
```

The generated hash should be saved in a database column such as
`password_hash`, not `password`.

## 6. How login verification works

The backend does **not** decrypt or recreate the original password.

Instead:

1.  Find the user by email.
2.  Read the stored password hash.
3.  Verify the submitted password against that hash using the library.
4.  If verification succeeds, authenticate the user.
5.  Otherwise, return a generic login error.

Example:

``` python
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

def verify_password(plain_password: str, stored_hash: str) -> bool:
    return password_hash.verify(plain_password, stored_hash)
```

The library handles the salt and algorithm parameters encoded in the
stored hash.

## 7. What is a salt?

A salt is a random value used by the password-hashing algorithm so that
identical passwords do not produce identical stored hashes.

A good password-hashing library generates and stores the salt as part of
the encoded hash. You generally should not invent your own salt-handling
scheme.

## 8. How this relates to ExpenseTracker

Your current ExpenseTracker uses **Google Sign-In**. In that flow:

-   Google authenticates the user.
-   Your FastAPI backend verifies Google's ID token.
-   Your application identifies or creates the user in PostgreSQL.
-   Your application issues its own session token, according to its
    authentication design.

You do not receive or store the user's Google password, so you should
not hash it.

Password hashing becomes necessary if you later add your own
email-and-password registration and login feature.

## 9. Important security practices

-   Use Argon2id or bcrypt through a trusted library.
-   Never store plaintext passwords.
-   Never log passwords or authentication tokens.
-   Use HTTPS in production.
-   Validate input and use parameterized database operations / an ORM.
-   Apply rate limiting to login attempts.
-   Return generic errors such as `Invalid email or password`; avoid
    revealing whether an account exists.
-   Keep secrets out of source control.
-   Do not use a fast hash such as plain SHA-256 as your
    password-storage solution.

## 10. Quick revision

-   Hashing is one-way; encryption is reversible with a key.
-   Store a password hash, never the original password.
-   Use a password-specific algorithm such as Argon2id or bcrypt.
-   Registration hashes the password.
-   Login verifies the submitted password against the stored hash.
-   Google Sign-In does not give your application the user's Google
    password.

## Practice questions

1.  Why is hashing preferable to plaintext password storage?
2.  What is the difference between hashing and encryption?
3.  Why is plain SHA-256 unsuitable as a password-storage algorithm?
4.  What is a salt?
5.  Does a Google Sign-In application need to hash the user's Google
    password? Why?
