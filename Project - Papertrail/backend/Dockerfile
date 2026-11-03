# Use an official Python image
FROM python:3.13-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend application code
COPY app ./app

# Expose the FastAPI port
EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
