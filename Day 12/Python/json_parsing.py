
import json
from pathlib import Path

# File used to store book data
FILE_PATH = Path("books.json")

# Sample Python dictionary
book = {
    "id": 1,
    "title": "Python Basics",
    "author": "Alex",
    "price": 299,
    "available": True,
    "tags": ["Python", "Programming"]
}


# 1. json.dumps() - Python object to JSON string
print("\n1. json.dumps()")

json_string = json.dumps(book, indent=4)
print(json_string)

print("Type:", type(json_string))


# 2. json.loads() - JSON string to Python object
print("\n2. json.loads()")

python_data = json.loads(json_string)
print(python_data)
print("Book title:", python_data["title"])
print("Type:", type(python_data))


# 3. json.dump() - Write Python object to a JSON file
print("\n3. json.dump()")

with FILE_PATH.open("w", encoding="utf-8") as file:
    json.dump(book, file, indent=4)

print(f"Book data written to {FILE_PATH}")


# 4. json.load() - Read JSON data from a file
print("\n4. json.load()")

with FILE_PATH.open("r", encoding="utf-8") as file:
    loaded_book = json.load(file)

print(loaded_book)
print("Book author:", loaded_book["author"])


# 5. json.dumps() options
print("\n5. JSON formatting options")

compact_json = json.dumps(book, separators=(",", ":"))
print("Compact JSON:", compact_json)

sorted_json = json.dumps(book, indent=4, sort_keys=True)
print("Sorted JSON:")
print(sorted_json)

unicode_json = json.dumps(
    {"language": "café"},
    ensure_ascii=False
)
print("Unicode JSON:", unicode_json)


# 6. Update data and save it again
print("\n6. Updating JSON data")

loaded_book["price"] = 399
loaded_book["available"] = False

with FILE_PATH.open("w", encoding="utf-8") as file:
    json.dump(loaded_book, file, indent=4)

print("Updated price:", loaded_book["price"])


# 7. Handle invalid JSON
print("\n7. Error handling")

invalid_json = '{"title": "Python Basics", author: "Alex"}'

try:
    data = json.loads(invalid_json)
    print(data)
except json.JSONDecodeError as error:
    print("Invalid JSON:", error)


# 8. Convert JSON null to Python None
print("\n8. JSON null")

null_data = json.loads('{"publisher": null}')
print(null_data)
print("Publisher:", null_data["publisher"])
print("Type:", type(null_data["publisher"]))


# 9. Check whether a Python object is JSON serializable
print("\n9. JSON serialization check")

try:
    json.dumps({"price": 299, "tags": ["Python", "Coding"]})
    print("Data can be converted to JSON.")
except TypeError as error:
    print("Cannot convert to JSON:", error)
