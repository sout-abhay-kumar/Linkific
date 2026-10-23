# A list is mutable and stores multiple items in a specific order. You access an item using its index, starting from 0.

numbers = [10, 20, 30]

# Access an item
print(numbers[0])      # 10

# Add an item at the end
numbers.append(40)
print(numbers)         # [10, 20, 30, 40]

# Change an item
numbers[1] = 25
print(numbers)         # [10, 25, 30, 40]

# Remove an item by value
numbers.remove(30)
print(numbers)         # [10, 25, 40]


# A dictionary is also mutable which stores data as key-value pairs. You access a value using its key rather
# than a numeric index.

student = {
    "name": "Alex",
    "age": 20
}

# Access a value
print(student["name"])  # Alex

# Add a new key-value pair
student["city"] = "London"

# Update an existing value
student["age"] = 21

# Safely access a key that may not exist
print(student.get("email", "Not provided"))

# Remove a key-value pair
student.pop("age")

print(student)