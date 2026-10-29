import hashlib

def hash_password(password):
    password_bytes = password.encode("utf-8")
    hashed = hashlib.sha256(password_bytes).hexdigest()
    return hashed

password = "mySecret123"

hashed_password = hash_password(password)

print("Original Password:", password)
print("Hashed Password:", hashed_password)

# verify 

def hash_password(password):
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(password, stored_hash):
    return hash_password(password) == stored_hash

stored_hash = hash_password("mySecret123")

print(verify_password("mySecret123", stored_hash))  # True
print(verify_password("wrongPassword", stored_hash))  # False