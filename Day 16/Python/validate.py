def validate_user(name, email, age):
    errors = []

    # Validate name
    if not name.strip():
        errors.append("Name is required.")

    # Validate email
    if not email.strip():
        errors.append("Email is required.")
    elif "@" not in email or "." not in email:
        errors.append("Please enter a valid email address.")

    # Validate age
    if age <= 0:
        errors.append("Age must be greater than 0.")

    if errors:
        return errors

    return "User input is valid."


name = input("Enter your name: ")
email = input("Enter your email: ")
age = int(input("Enter your age: "))

result = validate_user(name, email, age)

print(result)