users = [
    {"id": 1, "name": "Abhay"},
    {"id": 2, "name": "Rahul"},
    {"id": 3, "name": "Priya"}
]

def find_user(user_id):
    for user in users:
        if user["id"] == user_id:
            return user

    return None

print(find_user(2))

def find_user(user_id):
    return users.get(user_id)

print(find_user(2))