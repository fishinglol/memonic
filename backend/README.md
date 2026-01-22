# Memonic Waitlist Backend

Python Flask backend for storing waitlist email addresses with SQLite database.

## Features

- ✅ Email validation
- ✅ Duplicate email prevention
- ✅ SQLite database storage
- ✅ CORS enabled for frontend integration
- ✅ RESTful API endpoints

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### POST /api/waitlist

Add an email to the waitlist.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success):**

```json
{
  "message": "Successfully added to waitlist",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "timestamp": "2026-01-14T04:03:52.123456"
  }
}
```

**Response (Error):**

```json
{
  "error": "Email already registered"
}
```

### GET /api/waitlist

Retrieve all waitlist emails (admin endpoint).

**Response:**

```json
{
  "count": 10,
  "emails": [
    {
      "id": 1,
      "email": "user@example.com",
      "timestamp": "2026-01-14T04:03:52.123456"
    }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

## Database

The application uses SQLite with a file named `waitlist.db` that will be created automatically in the backend directory.

### Database Schema

**Table: waitlist_emails**

- `id` (INTEGER, PRIMARY KEY)
- `email` (STRING, UNIQUE, NOT NULL)
- `timestamp` (DATETIME, NOT NULL)

## Frontend Integration

Update your frontend JavaScript to send POST requests to `http://localhost:5000/api/waitlist` when the waitlist form is submitted.

## Production Deployment

For production use, consider:

1. Using PostgreSQL or MySQL instead of SQLite
2. Adding authentication for admin endpoints
3. Implementing rate limiting
4. Using environment variables for configuration
5. Deploying with Gunicorn or uWSGI
