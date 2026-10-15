import json

# Python dictionary
student = {
    "name": "Abhay",
    "age": 21,
    "course": "Computer Science"
}

# Convert Python dictionary to JSON string
json_data = json.dumps(student, indent=4)
print(json_data)

# Convert JSON string back to Python dictionary
data = json.loads(json_data)
print(data["name"])