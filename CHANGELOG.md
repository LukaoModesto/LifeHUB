# Changelog

All important changes to the LifeHUB project will be documented here.

The project follows an incremental development approach, where features are developed, tested and released over time.

## [Unreleased]

### Added

* Reminder Engine module.
* Endpoint to list due reminders.
* Endpoint to mark reminders as sent.
* Automatic notification behavior based on reminder time.
* Alert notification level for reminders with 120 minutes or less.
* Normal notification level for longer reminders.
* `sent_at` field to prevent repeated reminder alerts.

### Changed

* Backend folder normalized from `Backend/` to `backend/`.

### Planned

* Basic frontend/PWA.
* Browser notification integration.
* Improved reminder delivery flow.
* Custom notification priority.
* Custom notification sounds.
* User feedback/report feature.
* Shared events.
* Group notifications.
* Team and company event support.

## [0.7.0] - 2026-06-22

### Added

* Activity Sessions module.
* CRUD for activity sessions.
* Optional link between sessions and goals.
* Start and end time validation.
* User ownership validation.

## [0.6.0] - 2026-06-20

### Added

* Goals module.
* CRUD for goals.
* Target hours field.
* Goal period validation: daily, weekly and monthly.
* Protected goal routes by authenticated user.

## [0.5.0] - 2026-06-19

### Added

* Event Reminders module.
* Create reminders for events.
* List event reminders.
* Delete event reminders.
* Duplicate reminder validation.
* Reminder time validation.

## [0.4.0] - 2026-06-19

### Added

* Event date filters.
* Event time validation.
* Safer event scheduling rules.

### Changed

* Improved event validation before saving data.

## [0.3.0] - 2026-06-17

### Added

* Authenticated event creation.
* Event listing for authenticated users.
* Event detail route.
* Event update route.
* Event deletion route.
* User ownership validation for event access.

## [0.2.0] - 2026-06-17

### Added

* User input validation.
* Login with JWT.
* Protected `/users/me` route.
* Bearer token authentication.
* Environment variable configuration for JWT settings.

### Changed

* Moved JWT settings to environment variables.

## [0.1.0] - 2026-06-16

### Added

* Initial FastAPI backend structure.
* SQLite database setup.
* SQLAlchemy configuration.
* User model.
* User registration.
* Password hashing.
* Initial project README.

## Product Direction

### Decided

* LifeHUB should prioritize a PWA approach before native mobile app stores.
* The first public version should focus on the core agenda, events and reminders experience.
* Secondary features such as goals, activity sessions and dashboards should be released incrementally.
* Future versions may support shared events, group notifications, teams, companies and custom notification behavior.

## [0.4.0] - 2026-06-26

### Added
- Added Google Login authentication.
- Added backend validation for events and reminders.
- Added environment-based configuration for frontend and backend.

### Changed
- Improved README documentation.
- Improved backend security configuration.
- Improved frontend API configuration using environment variables.

### Security
- Moved sensitive backend settings to environment variables.
- Added Google ID token validation on the backend.
- Added backend-side validation for event and reminder rules.