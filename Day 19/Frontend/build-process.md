What Is the React Build Process?
The React build process converts a development React application into optimized files that can be served to users in production.

During development, we use tools such as Vite to run the React application locally.

For example:
npm run dev

This starts the development server, usually at:
http://localhost:5173

However, when deploying the application, we generally create a production build.
npm run build

This generates optimized static files that can be hosted on a web server or deployment platform.
2.1 Development vs Production
Development Production
Used while writing code Used by real users
Runs using npm run dev Created using npm run build
Supports hot module replacement Contains optimized output
Provides development tools Intended for deployment
Usually runs locally Runs on a hosting platform

2.2 Understanding the Build Process
For your Papertrail React application, the workflow looks like this:
React Source Code
|
v
Components, Pages, CSS, JavaScript
|
v
npm run build
|
v
Vite Production Build
|
v
Optimized Static Files
|
v
dist/
|
v
Deployment Platform
|
v
Users Access the Application

The build process typically:

- Bundles JavaScript modules.
- Processes CSS and assets.
- Removes development-only code where applicable.
- Minifies JavaScript and CSS.
- Generates optimized static files.
- Creates the dist/ directory.
  2.3 Create a React Production Build
  Navigate to your frontend folder:
  cd frontend

Install the dependencies:
npm install

Run the development server:
npm run dev

When your application is ready for production, create the build:
npm run build

For a standard Vite React application, the output looks similar to this:
frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── App.jsx
│ └── main.jsx
│
├── public/
├── package.json
├── vite.config.js
└── dist/
├── index.html
└── assets/
├── index-xxxxx.js
└── index-xxxxx.css

The dist/ directory contains the production-ready frontend files.

The exact filenames depend on your build.
2.4 Preview the Production Build
Vite provides a preview command.
npm run preview

This allows you to test the production build locally.

The preview server commonly runs at:
http://localhost:4173

The preview server is intended for checking the production build locally. It is not generally the production hosting server itself.
2.5 Understanding React Environment Variables
Your React frontend may need to know the URL of the backend API.

For example:

File: frontend/.env.development
VITE_API_URL=http://localhost:8000

File: frontend/.env.production
VITE_API_URL=https://your-production-backend.example.com

In your React code:
const API_URL = import.meta.env.VITE_API_URL;

export async function getBooks() {
const response = await fetch(`${API_URL}/api/books`);

if (!response.ok) {
throw new Error("Failed to fetch books");
}

return response.json();
}

Why Use VITE*?
Vite exposes environment variables prefixed with VITE* to frontend code.

For example:
import.meta.env.VITE_API_URL

The variable is available in the frontend build.

Important: Frontend environment variables are not secret. Their values can be included in the generated JavaScript files and inspected by users.

Never put database passwords, JWT signing secrets, or private API keys in React environment variables.
2.6 React Build and Backend Deployment
Your Papertrail application has two main parts:

- React frontend
- FastAPI backend
  They can be deployed separately.
  User's Browser
  |
  v
  React Frontend
  |
  | HTTP Request
  v
  FastAPI Backend
  |
  v
  PostgreSQL Database

A typical deployment workflow:

1. Build the React application.
2. Deploy the generated frontend files.
3. Build the FastAPI backend Docker image.
4. Deploy the backend.
5. Configure the frontend API URL.
6. Configure backend environment variables.
7. Configure CORS to allow the deployed frontend origin.
8. Test login, registration, book listing, and CRUD functionality.
   React Build Best Practices

- Run npm run build before deployment.
- Check for build errors and warnings.
- Test the production build using npm run preview.
- Configure the production API URL correctly.
- Do not expose secrets in frontend environment variables.
- Configure backend CORS for the correct frontend origin.
- Make sure client-side routes work correctly on the hosting platform.
- Keep development and production settings separate.
  Conclusion
  The React build process transforms the development application into optimized static files that can be deployed. Environment variables allow the frontend to use the correct backend API URL in different environments.

For Papertrail, the React frontend can be deployed independently while the FastAPI backend runs inside a Docker container and connects to PostgreSQL.
