# LifeHUB

LifeHUB is a productivity and organization application focused on events, reminders, goals and time tracking.

The main goal of the project is to help users organize important events with dates, times and customizable reminders. The application is being developed incrementally, with new features being added through versioned releases.

## Current Status

The backend is currently under development and already includes:

* User registration
* User login with JWT authentication
* Protected user route
* Event management
* Event reminders
* Reminder engine
* Goals management
* Activity sessions

The project is being built as a real-world full stack application, with a focus on clean architecture, security, version control and future frontend/PWA integration.

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* JWT Authentication
* Pydantic
* Uvicorn

### Future Frontend

* PWA
* Responsive web interface
* Event and reminder management screens
* Browser notifications

## Project Structure

```text
LifeHUB/
├── backend/
│   ├── main.py
│   └── app/
│       ├── core/
│       ├── models/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       ├── database.py
│       └── main.py
├── README.md
├── CHANGELOG.md
└── .gitignore
```

## Main Features

### Authentication

* User registration
* User login
* JWT access token
* Protected routes

### Events

* Create events
* List events
* Search event by ID
* Update events
* Delete events
* Filter events by date
* Validate event start and end time

### Event Reminders

* Create reminders for events
* List event reminders
* Delete reminders
* Prevent duplicate reminders
* Validate reminder time

### Reminder Engine

The reminder engine checks which reminders are currently due.

It returns reminder information such as:

* Event title
* Event date and time
* Reminder time
* Minutes before event
* Notification level
* Sound type

Current notification behavior:

```text
24 hours before → normal notification
12 hours before → normal notification
6 hours before  → normal notification
2 hours before  → alert notification
Less than 2h    → alert notification
```

### Goals

* Create goals
* List goals
* Update goals
* Delete goals
* Define target hours
* Define goal period: daily, weekly or monthly

### Activity Sessions

* Create activity sessions
* Link sessions to goals
* List sessions
* Update sessions
* Delete sessions
* Validate session start and end time

## API Routes

### Users

```text
POST /users/register
POST /users/login
GET  /users/me
GET  /users/
```

### Events

```text
POST   /events/
GET    /events/
GET    /events/{event_id}
PUT    /events/{event_id}
DELETE /events/{event_id}
```

### Event Reminders

```text
POST   /events/{event_id}/reminders/
GET    /events/{event_id}/reminders/
DELETE /events/{event_id}/reminders/{reminder_id}
```

### Reminder Engine

```text
GET   /reminders/due
PATCH /reminders/{reminder_id}/sent
```

### Goals

```text
POST   /goals/
GET    /goals/
GET    /goals/{goal_id}
PUT    /goals/{goal_id}
DELETE /goals/{goal_id}
```

### Activity Sessions

```text
POST   /activity-sessions/
GET    /activity-sessions/
GET    /activity-sessions/{session_id}
PUT    /activity-sessions/{session_id}
DELETE /activity-sessions/{session_id}
```

## How to Run the Project

Clone the repository:

```bash
git clone https://github.com/LukaoModesto/LifeHUB.git
```

Enter the project folder:

```bash
cd LifeHUB
```

Enter the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv .venv
```

On Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
python -m uvicorn main:app --reload
```

Open the API documentation:

```text
http://127.0.0.1:8000/docs
```

## Environment Variables

Create a `.env` file in the project root based on `.env.example`.

Example:

```env
SECRET_KEY=change_this_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Sensitive files such as `.env`, local databases and virtual environments must not be committed.

## Development Roadmap

### MVP

* Authentication
* Event management
* Event reminders
* Reminder engine
* Basic frontend/PWA
* Browser notifications

### Future Releases

* Custom notification priority
* Custom notification sounds
* Shared events
* Group notifications
* Team and company events
* User feedback/report system
* Goal progress dashboard
* Mobile app version

## Product Vision

LifeHUB started as a personal agenda and reminder application, but the long-term vision is to evolve it into a productivity platform for individuals, groups and teams.

Future versions may support shared events, group reminders, team notifications and company-level organization features.

## Author

Developed by Lucas Andrade.
