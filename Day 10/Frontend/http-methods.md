
# HTTP Methods Explained

## 1. What Are HTTP Methods?

HTTP methods are instructions sent by a client to a server that describe the intended action for a resource.

HTTP stands for **Hypertext Transfer Protocol**. It is a protocol used for communication between clients and servers on the web.

HTTP methods are used when building REST APIs and backend applications.

For example, in a student management system, we may want to:

- Retrieve student information.
- Register a new student.
- Update an existing student's details.
- Delete a student.

HTTP methods help us specify which operation we want to perform.

---

## 2. How Do HTTP Methods Work?

HTTP communication generally follows a request-response model.

1. The client sends an HTTP request.
2. The request contains a method and a URL, and may contain headers and a body.
3. The server receives the request.
4. The backend processes the request.
5. The server sends an HTTP response with a status code, headers, and possibly a body.

### Example

```http
GET /students HTTP/1.1
Host: localhost:8000
```

In this request:

- `GET` is the HTTP method.
- `/students` is the resource path.
- `HTTP/1.1` specifies the HTTP protocol version.
- `Host` identifies the requested host.

The server might respond with:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

Response body:

```json
[
  {"id": 1, "name": "Aman"},
  {"id": 2, "name": "Priya"}
]
```

The client requested student data, and the server returned it.

---

## 3. Types of HTTP Methods

The most commonly used HTTP methods in backend development are:

| Method | Main Purpose |
|---|---|
| GET | Retrieve data |
| POST | Submit data, commonly to create a resource |
| PUT | Replace a resource |
| PATCH | Partially update a resource |
| DELETE | Delete a resource |
| HEAD | Retrieve response headers without the response body |
| OPTIONS | Discover supported communication options |

GET, POST, PUT, PATCH, and DELETE are particularly important when building REST APIs.

---

## 4. GET Method

### Definition

The GET method requests a representation of a resource from the server.

It is commonly used to retrieve information without changing the resource's state.

### Example

```http
GET /students
```

This requests the list of students.

Another example:

```http
GET /students/1
```

This requests the student whose ID is 1.

### FastAPI Example

```python
from fastapi import FastAPI

app = FastAPI()

students = [
    {"id": 1, "name": "Aman"},
    {"id": 2, "name": "Priya"}
]

@app.get("/students")
def get_students():
    return students
```

When the client sends a GET request to `/students`, FastAPI returns the student list.

### Common Uses

- Displaying products on an online store.
- Retrieving user profiles.
- Viewing student records.
- Loading posts from a social media platform.

### Important Points

- GET requests should not be used to modify server-side resources.
- GET is a safe and idempotent HTTP method.
- Request bodies have no generally defined semantics for GET and should usually be avoided.

---

## 5. POST Method

### Definition

The POST method submits data to a resource for processing.

It is commonly used to create a new resource, although it can also be used for other operations.

### Example

```http
POST /students
Content-Type: application/json
```

Request body:

```json
{
  "name": "Abhay",
  "course": "Python"
}
```

The server receives the student information and may create a new student record.

### FastAPI Example

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

students = []

class Student(BaseModel):
    name: str
    course: str

@app.post("/students", status_code=201)
def create_student(student: Student):
    new_student = student.model_dump()
    students.append(new_student)

    return {
        "message": "Student created successfully",
        "student": new_student
    }
```

### Explanation

- `@app.post("/students")` defines a POST endpoint.
- `Student` defines the expected JSON structure.
- FastAPI validates the incoming request body.
- `student.model_dump()` converts the validated model into a Python dictionary.
- The endpoint returns a confirmation and the created student data.
- `status_code=201` indicates successful creation.

### Common Uses

- User registration.
- Creating a new product.
- Submitting a form.
- Creating a blog post.
- Sending login credentials to a backend.

### Important Points

- POST is not idempotent by definition.
- Repeating the same POST request may create multiple resources.
- A POST request can return `201 Created`, `200 OK`, or another appropriate status code depending on the result.

---

## 6. PUT Method

### Definition

The PUT method creates or replaces the state of a resource at a specified URL.

When used to update an existing resource, PUT generally replaces its representation with the supplied representation.

### Example

```http
PUT /students/1
Content-Type: application/json
```

Request body:

```json
{
  "name": "Abhay",
  "course": "Backend Development"
}
```

This sends a replacement representation for student 1.

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

students = {
    1: {"name": "Aman", "course": "Python"}
}

class Student(BaseModel):
    name: str
    course: str

@app.put("/students/{student_id}")
def replace_student(student_id: int, student: Student):
    if student_id not in students:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    students[student_id] = student.model_dump()

    return {
        "message": "Student replaced successfully",
        "student": students[student_id]
    }
```

### Common Uses

- Replacing a user's profile information.
- Replacing a product's details.
- Updating an entire resource representation.

### Important Points

- PUT is idempotent: repeating the same request should have the same intended effect as making it once.
- PUT usually represents a full replacement, not a partial update.
- The exact handling of omitted fields depends on the API's contract and implementation.

---

## 7. PATCH Method

### Definition

The PATCH method applies a partial modification to a resource.

It is useful when only selected fields need to be changed.

### Example

```http
PATCH /students/1
Content-Type: application/json
```

Request body:

```json
{
  "course": "FastAPI"
}
```

Only the course is being updated. The student's name remains unchanged.

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

students = {
    1: {"name": "Aman", "course": "Python"}
}

class StudentUpdate(BaseModel):
    name: str | None = None
    course: str | None = None

@app.patch("/students/{student_id}")
def update_student(student_id: int, student: StudentUpdate):
    if student_id not in students:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    updates = student.model_dump(exclude_unset=True)
    students[student_id].update(updates)

    return {
        "message": "Student updated successfully",
        "student": students[student_id]
    }
```

### Explanation

- `StudentUpdate` allows the client to submit only the fields it wants to change.
- `exclude_unset=True` excludes fields that were not included in the request.
- `.update(updates)` modifies only the supplied fields.

### Common Uses

- Changing a user's email address.
- Updating a product's price.
- Changing a student's course.
- Updating a profile picture URL.

### Important Points

- PATCH is intended for partial modification.
- PATCH is not necessarily idempotent; its behavior depends on the patch operation.
- A PATCH endpoint should define how omitted fields and explicit `null` values are handled.

---

## 8. DELETE Method

### Definition

The DELETE method requests the removal of a resource.

### Example

```http
DELETE /students/1
```

This requests deletion of student 1.

### FastAPI Example

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

students = {
    1: {"name": "Aman", "course": "Python"},
    2: {"name": "Priya", "course": "Java"}
}

@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    if student_id not in students:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    del students[student_id]

    return {"message": "Student deleted successfully"}
```

### Common Uses

- Deleting a user account.
- Removing a product.
- Deleting a post.
- Removing an item from a collection.

### Important Points

- DELETE is idempotent in HTTP semantics.
- Repeating a DELETE request should leave the resource in the same intended state.
- The response to a repeated deletion may differ; for example, the server might return `404 Not Found`.
- A successful DELETE request may return `200 OK` with a response body or `204 No Content` without one.

---

## 9. HEAD Method

### Definition

HEAD works similarly to GET, but the server does not return the response body.

It is useful when the client needs response headers without downloading the entire resource.

### Example

```http
HEAD /students
```

The server might return:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 120
```

There is no response body.

### Common Uses

- Checking whether a resource exists.
- Inspecting metadata.
- Checking response headers before downloading a resource.

---

## 10. OPTIONS Method

### Definition

OPTIONS asks the server which communication options are supported for a resource.

### Example

```http
OPTIONS /students
```

A server may respond with an `Allow` header:

```http
Allow: GET, POST, OPTIONS
```

The exact response depends on the server configuration.

### Common Uses

- Discovering supported HTTP methods.
- Supporting browser CORS preflight requests.
- Checking communication options for an endpoint.

**Note:** Browsers may send an OPTIONS request before certain cross-origin requests to check whether the server permits the requested method and headers. This is called a CORS preflight request.

---

## 11. Difference Between PUT and PATCH

PUT and PATCH are both used to modify resources, but their intended semantics differ.

Suppose a student record is:

```json
{
  "name": "Aman",
  "course": "Python",
  "city": "Dehradun"
}
```

### PUT Example

Request:

```json
{
  "name": "Aman",
  "course": "FastAPI",
  "city": "Dehradun"
}
```

This supplies a replacement representation of the student.

### PATCH Example

Request:

```json
{
  "course": "FastAPI"
}
```

This changes only the course field, leaving the other fields unchanged under the API's defined patch behavior.

| Feature | PUT | PATCH |
|---|---|---|
| Purpose | Replace a resource representation | Partially modify a resource |
| Typical payload | Complete representation | Only required changes |
| Idempotent | Yes, by HTTP semantics | Not necessarily |
| Example | Replace all profile details | Change only the email |

---

## 12. What Is CRUD?

CRUD stands for:

- **C — Create**
- **R — Read**
- **U — Update**
- **D — Delete**

CRUD describes four common data operations. HTTP methods are commonly mapped to them in REST APIs.

| CRUD Operation | Common HTTP Method | Example |
|---|---|---|
| Create | POST | `POST /students` |
| Read | GET | `GET /students` |
| Update fully | PUT | `PUT /students/1` |
| Update partially | PATCH | `PATCH /students/1` |
| Delete | DELETE | `DELETE /students/1` |

This mapping is common, but HTTP methods and CRUD are not exactly the same concept.

---

## 13. Important HTTP Status Codes

An HTTP status code indicates the result of a request.

| Status Code | Meaning |
|---|---|
| 200 OK | Request succeeded |
| 201 Created | Resource created successfully |
| 204 No Content | Request succeeded with no response body |
| 400 Bad Request | Request is invalid |
| 401 Unauthorized | Authentication is missing or invalid |
| 403 Forbidden | Client is not permitted to perform the operation |
| 404 Not Found | Resource or endpoint was not found |
| 405 Method Not Allowed | The method is not supported for that endpoint |
| 422 Unprocessable Content | Request content failed validation in this FastAPI example |
| 500 Internal Server Error | Unexpected server-side error |

The appropriate status code depends on the request and the server's implementation.

---

## 14. How to Test HTTP Methods in FastAPI

FastAPI automatically provides interactive API documentation.

### Step 1: Start your application

```bash
fastapi dev main.py
```

### Step 2: Open the documentation

```text
http://127.0.0.1:8000/docs
```

### Step 3: Select an endpoint

Choose a GET, POST, PUT, PATCH, or DELETE endpoint.

### Step 4: Click "Try it out"

Enter path parameters or a JSON request body if required.

### Step 5: Click "Execute"

Inspect the response status code, headers, and body.

You can also test these endpoints using Postman.

---

## 15. Best Practices

1. Use resource-oriented URLs, such as `/students/1`.
2. Use GET to retrieve data rather than modify it.
3. Use POST when submitting data for creation or processing.
4. Use PUT for complete replacement and PATCH for partial updates.
5. Use DELETE to request resource deletion.
6. Return appropriate HTTP status codes.
7. Validate incoming request data.
8. Check authentication and authorization before allowing protected operations.
9. Document request and response formats.
10. Test successful requests, invalid input, missing resources, and permission errors.

---

## 16. Conclusion

HTTP methods describe the intended operation a client wants to perform on a server resource.

The most important methods to learn for backend development are:

- GET — Retrieve data.
- POST — Submit data, commonly to create a resource.
- PUT — Replace a resource.
- PATCH — Partially modify a resource.
- DELETE — Remove a resource.

HEAD and OPTIONS are also useful for metadata and communication capabilities.

When building APIs with FastAPI, you can define endpoints using decorators such as `@app.get()`, `@app.post()`, `@app.put()`, `@app.patch()`, and `@app.delete()`.

**Key takeaway:** HTTP methods help clients and servers communicate consistently about the operations being requested.
