# Memonic

**AI That Never Forgets You**

Memonic is a privacy-first AI personal assistant that helps you record your day, process data locally, and maintain complete ownership of your information.

## Overview

This repository contains the landing page and waitlist backend for Memonic, designed to collect early interest and build a community of privacy-conscious users.

## Features

- **Privacy-First**: All data processing happens locally on your device
- **Never Forgets**: Intelligent memory system that learns from your daily interactions
- **User Data Ownership**: You own and control all your data
- **Local Processing**: No cloud dependency for core functionality

## Project Structure

```
memonic/
├── index.html          # Main landing page
├── thankyou.html       # Post-signup confirmation page
├── images/             # Image assets and SVG files
└── backend/
    ├── main.py         # FastAPI application
    ├── requirements.txt
    └── emails.txt      # Collected email addresses
```

## Technology Stack

### Frontend
- Static HTML/CSS
- Custom design with sky blue color palette
- Google Fonts (DM Sans, Sora)
- Responsive design

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **SQLite**: Lightweight database for email storage
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

## Getting Started

### Prerequisites

- Python 3.7+
- pip

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd memonic
```

2. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

2. Open the frontend:
```bash
# From the root directory
open index.html
# Or serve with a simple HTTP server:
python -m http.server 8080
```

Then navigate to `http://localhost:8080`

## API Endpoints

### POST /users/
Create a new user (add to waitlist)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "email": "user@example.com"
}
```

**Error Responses:**
- `400`: Email already registered

## Database Schema

### Users Table
| Column | Type   | Description        |
|--------|--------|--------------------|
| email  | String | Primary key, indexed |

## Development

The backend includes CORS middleware configured to allow all origins for development purposes. Consider restricting this in production.

## Current Status

This is an early-stage project focused on building a waitlist for the Memonic AI assistant. The core AI functionality is under development.

## Contributing

This project is currently in private development. Stay tuned for contribution guidelines.

## License

All rights reserved.

## Contact

For inquiries, please sign up through the landing page to join our waitlist.
