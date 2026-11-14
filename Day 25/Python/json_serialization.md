
# JSON Serialization

## 1. What is JSON Serialization?

JSON Serialization is the process of converting data structures or objects into a JSON (JavaScript Object Notation) formatted string so that the data can be transmitted between applications, stored in files, or exchanged through APIs.

For example, consider a Python dictionary:

```python
expense = {
    "id": 1,
    "title": "Lunch",
    "amount": 250,
    "category": "Food"
}
```

This is a Python dictionary. To exchange this data with another application, we can convert it into JSON:

```json
{
    "id": 1,
    "title": "Lunch",
    "amount": 250,
    "category": "Food"
}
```

Converting the Python dictionary into JSON is called **JSON Serialization**.

---

## 2. Why Do We Need JSON Serialization?

Different programming languages and applications use different data structures.

For example:

- Python uses dictionaries and lists.
- JavaScript uses objects and arrays.
- Java uses classes and objects.
- Databases store data in their own formats.

JSON provides a common format that different applications can understand.

### Main Uses

1. **API Communication:** Allows frontend and backend applications to exchange data.
2. **Data Storage:** Allows structured data to be stored in JSON files.
3. **Data Exchange:** Makes it easier to exchange information between different programming languages.
4. **Configuration:** Used in configuration files for many applications.
5. **Web Development:** Commonly used for sending and receiving HTTP request and response bodies.

---

## 3. Serialization and Deserialization

Serialization and deserialization are opposite processes.

### A. Serialization

Serialization converts a Python object into a JSON string.

**Python Object → JSON String**

Example:

```python
import json

expense = {
    "title": "Lunch",
    "amount": 250
}

json_data = json.dumps(expense)

print(json_data)
print(type(json_data))
```

Output:

```text
{"title": "Lunch", "amount": 250}
<class 'str'>
```

Notice that the result is a Python string containing JSON data.

### B. Deserialization

Deserialization converts a JSON string back into a Python object.

**JSON String → Python Object**

Example:

```python
import json

json_data = '{"title": "Lunch", "amount": 250}'

expense = json.loads(json_data)

print(expense)
print(type(expense))
```

Output:

```text
{'title': 'Lunch', 'amount': 250}
<class 'dict'>
```

Now the JSON string has been converted into a Python dictionary.

---

## 4. Python JSON Module

Python provides a built-in module called `json` for working with JSON data.

Import it using:

```python
import json
```

The module provides four commonly used functions:

| Function | Purpose |
|---|---|
| `json.dumps()` | Converts a Python object into a JSON string. |
| `json.loads()` | Converts a JSON string into a Python object. |
| `json.dump()` | Writes a Python object into a JSON file. |
| `json.load()` | Reads JSON data from a file and converts it into a Python object. |

### A. json.dumps()

Converts Python data into a JSON string.

```python
import json

student = {
    "name": "Rahul",
    "age": 21,
    "course": "Computer Science"
}

json_data = json.dumps(student, indent=4)

print(json_data)
```

### B. json.loads()

Converts JSON text into a Python object.

```python
import json

json_data = '{"name": "Rahul", "age": 21}'

student = json.loads(json_data)

print(student["name"])
print(student["age"])
```

Output:

```text
Rahul
21
```

### C. json.dump()

Writes Python data into a JSON file.

```python
import json

expense = {
    "title": "Electricity Bill",
    "amount": 1200
}

with open("expense.json", "w") as file:
    json.dump(expense, file, indent=4)
```

This creates an `expense.json` file containing the data.

### D. json.load()

Reads JSON data from a file.

```python
import json

with open("expense.json", "r") as file:
    expense = json.load(file)

print(expense)
```

This reads the JSON file and converts its contents into a Python dictionary.

---

## 5. Python Data Types and JSON Data Types

JSON supports a limited set of data types.

| Python Type | JSON Type |
|---|---|
| `dict` | Object |
| `list` | Array |
| `str` | String |
| `int` | Number |
| `float` | Number |
| `True` | `true` |
| `False` | `false` |
| `None` | `null` |

Example:

```python
import json

data = {
    "name": "Rahul",
    "age": 21,
    "is_student": True,
    "marks": None,
    "subjects": ["Python", "JavaScript"]
}

json_data = json.dumps(data, indent=4)

print(json_data)
```

JSON output:

```json
{
    "name": "Rahul",
    "age": 21,
    "is_student": true,
    "marks": null,
    "subjects": [
        "Python",
        "JavaScript"
    ]
}
```

Notice:

- Python `True` becomes JSON `true`.
- Python `False` becomes JSON `false`.
- Python `None` becomes JSON `null`.

---

## 6. JSON Serialization in APIs

JSON serialization is especially important in REST API development.

Consider a React frontend communicating with a FastAPI backend.

### Step 1: User Enters Data

The user enters the following expense:

```javascript
const expense = {
    title: "Lunch",
    amount: 250
};
```

### Step 2: Frontend Sends JSON

The frontend sends the data to the backend through an HTTP POST request.

```javascript
fetch("http://localhost:8000/api/transactions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(expense)
});
```

`JSON.stringify()` converts the JavaScript object into a JSON string.

### Step 3: FastAPI Receives JSON

FastAPI parses the incoming JSON request body and validates it using a Pydantic model.

```python
from pydantic import BaseModel

class ExpenseCreate(BaseModel):
    title: str
    amount: float
```

Example endpoint:

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/expenses")
def create_expense(expense: ExpenseCreate):
    return {
        "message": "Expense created",
        "expense": expense
    }
```

### Step 4: Backend Sends JSON Response

FastAPI serializes the returned Python data into a JSON HTTP response.

Example:

```json
{
    "message": "Expense created",
    "expense": {
        "title": "Lunch",
        "amount": 250
    }
}
```

### Complete Workflow

```text
React Frontend
      |
      | JavaScript Object
      v
JSON.stringify()
      |
      | JSON Request
      v
FastAPI Backend
      |
      | JSON Parsing
      v
Pydantic Validation
      |
      | Python Data
      v
Database Operation
      |
      | Python Response Data
      v
FastAPI JSON Serialization
      |
      | JSON Response
      v
React Frontend
      |
      | Response Parsing
      v
response.json()
```

---

## 7. JSON Serialization in FastAPI

FastAPI automatically handles JSON parsing and response serialization in ordinary API workflows.

You generally do not need to manually use `json.dumps()` or `json.loads()` for normal FastAPI request and response bodies.

Example:

```python
@app.get("/expenses")
def get_expenses():
    return {
        "id": 1,
        "title": "Lunch",
        "amount": 250
    }
```

FastAPI converts the returned Python dictionary into a JSON response.

For more complex data, FastAPI also supports Pydantic models and response models.

Example:

```python
from pydantic import BaseModel

class ExpenseResponse(BaseModel):
    id: int
    title: str
    amount: float

@app.get("/expense", response_model=ExpenseResponse)
def get_expense():
    return {
        "id": 1,
        "title": "Lunch",
        "amount": 250
    }
```

The response model helps validate and structure the API response.

---

## 8. JSON Serialization vs JSON Deserialization

| Feature | Serialization | Deserialization |
|---|---|---|
| Meaning | Converts an object into JSON | Converts JSON into an object |
| Direction | Object → JSON | JSON → Object |
| Python function | `json.dumps()` | `json.loads()` |
| File function | `json.dump()` | `json.load()` |
| Purpose | Sending or storing data | Reading or using data |

---

## 9. Common Errors and Important Points

### A. Invalid JSON

JSON requires double quotes around property names and string values.

Invalid:

```json
{
    'name': 'Rahul'
}
```

Valid:

```json
{
    "name": "Rahul"
}
```

### B. Non-Serializable Objects

Not every Python object can be directly converted into JSON.

For example:

```python
import json
from datetime import datetime

data = {
    "created_at": datetime.now()
}

json.dumps(data)
```

This raises a `TypeError` because a Python `datetime` object is not directly JSON serializable by the standard JSON encoder.

One solution is to convert it into a string:

```python
data = {
    "created_at": datetime.now().isoformat()
}
```

### C. JSON Is Not a Database

JSON is a data exchange format. It does not replace PostgreSQL or another database.

Your ExpenseTracker can use:

- JSON for frontend-backend communication.
- PostgreSQL for persistent data storage.
- SQLAlchemy for database operations.
- Pydantic for data validation and serialization.

---

## 10. Important Terms to Remember

| Term | Meaning |
|---|---|
| JSON | JavaScript Object Notation; a structured data format. |
| Serialization | Converting an object into a transferable or storable format. |
| Deserialization | Converting serialized data back into an object. |
| JSON Object | A collection of key-value pairs. |
| JSON Array | An ordered collection of values. |
| JSON String | Text containing JSON-formatted data. |
| JSON.stringify() | JavaScript method for converting a value into a JSON string. |
| JSON.parse() | JavaScript method for parsing JSON text into a JavaScript value. |
| Pydantic | Python library used for data validation and serialization. |

---

## 11. Summary

- JSON is a common format for exchanging structured data.
- Serialization converts Python objects into JSON strings.
- Deserialization converts JSON strings into Python objects.
- Python provides the built-in `json` module.
- `json.dumps()` and `json.loads()` work with JSON strings.
- `json.dump()` and `json.load()` work with JSON files.
- JavaScript uses `JSON.stringify()` and `JSON.parse()`.
- FastAPI automatically handles JSON parsing and response serialization in normal API workflows.
- JSON is commonly used for communication between React frontends and FastAPI backends.
