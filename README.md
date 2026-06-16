# LifeHUB

LifeHUB is a personal productivity application focused on time organization, calendar management, goals, reminders and activity tracking.

The project is being developed as a full-stack study and portfolio project, using a Python backend with FastAPI and a mobile/web interface planned for future versions.

## Project Status

The project is currently in early development.

Current features:

* FastAPI backend structure
* SQLite database configuration
* User model
* User registration endpoint
* Password hashing
* Interactive API documentation with Swagger

## Main Features Planned

* User registration and login
* Calendar and event management
* Custom reminders
* Goals based on target hours
* Activity timer
* Productivity dashboard
* Statistics and progress tracking
* Mobile/PWA interface

## Technologies

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Passlib
* Bcrypt

### Future Technologies

* PostgreSQL
* JWT Authentication
* Flutter or PWA frontend
* Firebase Cloud Messaging for notifications

## Project Structure

```text
LifeHUB/
│
├── Backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── main.py
│
├── README.md
└── .gitignore
```

## API Endpoints

### Users

#### Register User

```http
POST /users/register
```

Example request:

```json
{
  "name": "Lucas Andrade",
  "email": "lucas@example.com",
  "password": "123456"
}
```

Example response:

```json
{
  "id": 1,
  "name": "Lucas Andrade",
  "email": "lucas@example.com"
}
```

## How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/LukaoModesto/LifeHUB.git
```

### 2. Access the project folder

```bash
cd LifeHUB
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

### 4. Activate the virtual environment

Windows:

```bash
.venv\Scripts\activate
```

### 5. Install dependencies

```bash
python -m pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib[bcrypt] email-validator bcrypt==4.0.1
```

### 6. Run the backend server

```bash
cd Backend
python -m uvicorn main:app --reload
```

### 7. Open the API documentation

```text
http://127.0.0.1:8000/docs
```

## Next Steps

* Add user listing endpoint
* Add duplicate email validation
* Create login endpoint
* Implement JWT authentication
* Create event/calendar models
* Create goals and activity tracking models

## Author

Developed by Lucas Andrade.
