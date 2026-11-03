What Are Environment Variables?
Environment variables are configuration values stored outside the application's source code.

They allow an application to use different settings depending on the environment in which it runs.

For example, a backend application may need:

- Database URL
- Database username and password
- JWT secret key
- API keys
- Application environment
- Debug mode configuration
  Instead of writing these values directly in Python code, we can store them in environment variables.
  Example: Without Environment Variables
  DATABASE_URL = "postgresql+psycopg://papertrail_user:password123@localhost:5432/papertrail_db"

This is not a good practice because:

- Credentials are exposed in the source code.
- Changing the database requires modifying the code.
- Different environments become difficult to configure.
- Secrets may accidentally be pushed to GitHub.
  Example: With Environment Variables
  import osDATABASE_URL = os.getenv("DATABASE_URL")

Now the database URL is provided externally.
1.1 Using a .env File
A .env file is commonly used to store environment variables during local development.

Example:

File: backend/.env
DATABASE_URL=postgresql+psycopg://papertrail_user:your_password@localhost:5432/papertrail_db

JWT_SECRET_KEY=your_secret_key

APP_ENV=development

DEBUG=True

The .env file should not be committed to GitHub.

Add it to .gitignore:
.env
.env.\*
!.env.example

You can create a safe example file for other developers:

File: backend/.env.example
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/database_name

JWT_SECRET_KEY=replace_with_a_secret_key

APP_ENV=development

DEBUG=True

This file documents the required configuration without exposing real secrets.
1.2 Reading Environment Variables in Python
Python provides the built-in os module to read environment variables.
import osdatabase_url = os.getenv("DATABASE_URL")jwt_secret_key = os.getenv("JWT_SECRET_KEY")app_environment = os.getenv("APP_ENV", "development")print(app_environment)

Explanation
os.getenv("DATABASE_URL")

Reads the DATABASE_URL environment variable.
os.getenv("APP_ENV", "development")

Reads APP_ENV. If it does not exist, the function returns "development".

Important: os.getenv() does not automatically read a .env file. It reads environment variables already available to the Python process.
1.3 Using python-dotenv
To load values from a .env file during local development, we can use the python-dotenv package.

Install it:
pip install python-dotenv

Add it to requirements.txt:
python-dotenv

Example:
import osfrom dotenv import load_dotenvload_dotenv()DATABASE_URL = os.getenv("DATABASE_URL")JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")print("Database configuration loaded")

The load_dotenv() function loads values from the .env file into the process environment.

Avoid printing actual passwords or secret keys in application logs.
1.4 Using Environment Variables with FastAPI
In your Papertrail project, you can configure the database connection using environment variables.

Example:

# app/database.pyimport osfrom dotenv import load_dotenvfrom sqlalchemy import create_enginefrom sqlalchemy.orm import declarative_base, sessionmakerload_dotenv()DATABASE_URL = os.getenv("DATABASE_URL")if not DATABASE_URL: raise RuntimeError("DATABASE_URL environment variable is missing")engine = create_engine(DATABASE_URL)SessionLocal = sessionmaker( autocommit=False, autoflush=False, bind=engine,)Base = declarative_base()

This allows the backend to use different database URLs without changing the Python source code.

For example:

Development:
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/papertrail_db

Production:
DATABASE_URL=postgresql+psycopg://user:password@production-host:5432/production_db

The production value should be configured through the deployment platform's environment variable settings.
1.5 Environment Variables in Docker
Environment variables can also be passed to a Docker container.

Example:
docker run -d \
 --name papertrail-api \
 -p 8000:8000 \
 --env-file .env \
 papertrail-backend

The --env-file option passes configuration values from the .env file to the container.

The application can then read them using:
import osDATABASE_URL = os.getenv("DATABASE_URL")

Environment Variables Best Practices

- Never hardcode passwords or secret keys.
- Never commit .env files to GitHub.
- Use .env.example to document required variables.
- Use environment variables for database configuration.
- Use strong, randomly generated secret keys.
- Keep development and production configuration separate.
- Avoid printing secrets in logs.
- Use deployment platform settings to configure production variables.
  Conclusion
  Environment variables help keep application configuration separate from source code. They make it easier to run the same backend in development, testing, Docker, and production environments without modifying the application code.

2. Frontend / React Build Process
   Suggested file name: react-build-process.md
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
