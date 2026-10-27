import hashlib

password = input("Enter your password: ")

# Convert password into bytes and generate SHA-256 hash
password_hash = hashlib.sha256(password.encode()).hexdigest()

print("Original password:", password)
print("Hashed password:", password_hash)