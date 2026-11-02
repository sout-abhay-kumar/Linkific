What Is Folder Organization?
Folder organization means arranging files and folders in a project in a structured and logical way.

In a React and FastAPI application, frontend and backend code have different responsibilities. Organizing them properly makes the project easier to understand, develop, debug, and maintain.
Why Is Folder Organization Important?

- Makes files easier to find.
- Separates different responsibilities.
- Improves code readability.
- Makes collaboration easier.
- Helps prevent large files from becoming difficult to maintain.
- Makes it easier to add new features.
  2.1 Basic Full-Stack Project Structure
  A React + FastAPI project can be organized like this:
  papertrail/
  │
  ├── frontend/
  │ ├── public/
  │ ├── src/
  │ │ ├── assets/
  │ │ ├── components/
  │ │ ├── pages/
  │ │ ├── layouts/
  │ │ ├── hooks/
  │ │ ├── services/
  │ │ ├── context/
  │ │ ├── utils/
  │ │ ├── App.jsx
  │ │ └── main.jsx
  │ │
  │ ├── package.json
  │ └── vite.config.js
  │
  ├── backend/
  │ ├── app/
  │ │ ├── routers/
  │ │ ├── services/
  │ │ ├── models/
  │ │ ├── schemas/
  │ │ ├── dependencies/
  │ │ ├── utils/
  │ │ ├── database.py
  │ │ └── main.py
  │ │
  │ └── requirements.txt
  │
  ├── .gitignore
  └── README.md

This is an example structure. A small application does not need every folder immediately.

2.2 Frontend Folder Organization
The frontend contains the React user interface.
components/
Contains reusable UI components.

Examples:
components/
├── Header.jsx
├── Footer.jsx
├── Sidebar.jsx
├── BookCard.jsx
├── BookModal.jsx
└── LoadingSpinner.jsx

Purpose: Avoid repeating the same UI code in multiple pages.

Example:
function BookCard({ title, author }) {
return (

<div className="rounded-lg border p-4">
<h2>{title}</h2>
<p>{author}</p>
</div>
);
}

export default BookCard;

pages/
Contains components that represent application pages.
pages/
├── Home.jsx
├── Books.jsx
├── About.jsx
├── Contact.jsx
├── Login.jsx
└── Register.jsx

Purpose: Keep page-level UI separate from reusable components.
services/
Contains functions responsible for communicating with the backend API.
services/
└── api.js

Example:
const API_URL = "http://127.0.0.1:8000";

export async function getBooks() {
const response = await fetch(`${API_URL}/api/books`);

if (!response.ok) {
throw new Error("Failed to fetch books");
}

return response.json();
}

Purpose: Avoid writing API request logic repeatedly inside different components.
hooks/
Contains reusable custom React hooks.

Example:
hooks/
└── useBooks.js

A custom hook can contain reusable logic for fetching books, handling loading states, or managing form behavior.
utils/
Contains general helper functions.

Examples:
utils/
├── formatDate.js
├── validateEmail.js
└── formatCurrency.js

Purpose: Keep reusable logic outside components.
layouts/
Contains shared page layouts.

Examples:
layouts/
├── MainLayout.jsx
└── AuthLayout.jsx

A MainLayout might contain the header, sidebar, and footer. An AuthLayout might provide a common design for login and registration pages.

2.3 Backend Folder Organization
The backend contains API endpoints, database logic, validation, and business rules.
routers/
Contains API route definitions.
routers/
├── auth.py
├── books.py
└── stats.py

Example:
from fastapi import APIRouterrouter = APIRouter(prefix="/api/books", tags=["Books"])@router.get("/")def get_books(): return {"message": "Get all books"}

Purpose: Keep API endpoints organized by feature.
models/
Contains SQLAlchemy database models.

Example:
from sqlalchemy import Column, Integer, Stringfrom app.database import Baseclass Book(Base): **tablename** = "books" id = Column(Integer, primary_key=True, index=True) title = Column(String, nullable=False) author = Column(String, nullable=False)

Purpose: Define how application data is stored in the database.
schemas/
Contains Pydantic schemas used for request validation and response formatting.

Example:
from pydantic import BaseModelclass BookCreate(BaseModel): title: str author: strclass BookResponse(BaseModel): id: int title: str author: str

Purpose: Validate incoming data and define the structure of API responses.
services/
Contains business logic.

For example, a book service might:

- Create a book.
- Update book details.
- Check whether a book exists.
- Apply search or filtering rules.
  Purpose: Keep business logic separate from API route definitions.
  dependencies/
  Contains reusable FastAPI dependencies.

Examples:

- Database session dependency.
- Current-user authentication dependency.
- Permission checking dependency.
  Purpose: Avoid repeating dependency logic in multiple endpoints.
  database.py
  Contains database connection and session configuration.

Example:
from sqlalchemy import create_enginefrom sqlalchemy.orm import declarative_base, sessionmakerDATABASE_URL = "postgresql+psycopg://user:password@localhost/database"engine = create_engine(DATABASE_URL)SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine,)Base = declarative_base()

In a real project, database credentials should be stored in environment variables rather than hardcoded in source code.

main.py
The main entry point of the FastAPI application.

It typically:

- Creates the FastAPI application.
- Configures middleware.
- Includes routers.
- Configures application startup behavior.
  Example:
  from fastapi import FastAPIfrom app.routers import books, authapp = FastAPI(title="Papertrail Book Library API")app.include_router(books.router)app.include_router(auth.router)@app.get("/")def root(): return {"message": "Papertrail API is running"}

  2.4 Separation of Responsibilities
  A well-organized project separates different responsibilities.

For example, when a user requests books:
React Books Page
|
v
API Service
|
v
FastAPI Router
|
v
Service Layer
|
v
Database Model / SQLAlchemy
|
v
PostgreSQL Database

Each layer has a specific role:
Layer Responsibility
React Page Displays books
API Service Sends HTTP requests
FastAPI Router Handles the API endpoint
Service Layer Executes business logic
SQLAlchemy Model Represents database data
PostgreSQL Stores persistent data

This separation makes the application easier to test, debug, and extend.
2.5 Folder Organization Best Practices

- Use meaningful folder and file names.
- Keep components small and reusable.
- Separate frontend and backend code.
- Keep API calls inside service files.
- Separate database models from Pydantic schemas.
- Keep business logic out of large route functions.
- Avoid creating too many folders for a small project.
- Keep secrets and environment files out of GitHub.
- Update the README when the project structure changes.
  Conclusion
  Folder organization provides a clear structure for a project. By separating components, pages, API services, database models, schemas, and business logic, developers can maintain and extend applications more easily.

For a project like Papertrail, a clean folder structure becomes increasingly useful as authentication, book search, user-specific data, and additional features are added.
