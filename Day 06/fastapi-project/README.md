# Basic FastAPI API

A beginner-friendly REST API built with FastAPI. It demonstrates GET, POST, PUT, PATCH, and DELETE methods using a simple item resource.

## Project structure

```text
fastapi-project/
├── main.py
├── requirements.txt
├── README.md
├── .gitignore
└── postman/
    └── fastapi_collection.json
```

## Requirements

- Python 3.10 or newer
- pip

## 1. Create and activate a virtual environment

Open a terminal in this project folder.

### Windows Command Prompt

```bat
python -m venv venv
venv\Scripts\activate
```

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 2. Install dependencies

```bash
python -m pip install -r requirements.txt
```

## 3. Start the API

```bash
fastapi dev main.py
```

The API runs locally at:

- Base URL: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs
- Alternative documentation: http://127.0.0.1:8000/redoc

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/items` | List all items |
| GET | `/items/{item_id}` | Get one item |
| POST | `/items` | Create an item |
| PUT | `/items/{item_id}` | Replace an item's fields |
| PATCH | `/items/{item_id}` | Update selected fields |
| DELETE | `/items/{item_id}` | Delete an item |

## Example: create an item

Send a `POST` request to `http://127.0.0.1:8000/items` with this JSON body:

```json
{
  "name": "Notebook",
  "description": "A ruled notebook",
  "price": 4.99
}
```

Example response (`201 Created`):

```json
{
  "name": "Notebook",
  "description": "A ruled notebook",
  "price": 4.99,
  "id": 1
}
```

## Test with Postman

1. Start the API using `fastapi dev main.py`.
2. In Postman, select **Import**.
3. Import `postman/fastapi_collection.json`.
4. Run requests against `http://127.0.0.1:8000`.

Create an item before trying GET, PUT, PATCH, or DELETE requests for its ID. The collection uses item ID `1` as its example.

## Important note about storage

This project uses a Python dictionary as in-memory storage so you can focus on API basics. Data is lost when the server restarts, and this storage is not suitable for production. A later version could use a database such as PostgreSQL or SQLite.
