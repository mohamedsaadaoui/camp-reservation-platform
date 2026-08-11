# Camping Reservation Platform

Microservices-based camping reservation application: users can browse campsites on a map, check availability, and make reservations, while admins manage campsites and reservations through a dedicated back-office API.

## Modules

| Module | Type | Technology |
| ------ | ---- | ---------- |
| `eureka-server` | Service discovery | Spring Cloud Netflix Eureka |
| `emplacement-service` | Campsite management | Spring Boot, JPA, MySQL |
| `reservation-service` | Reservation management | Node.js, Express, MongoDB |
| `campbackoffice` | Admin aggregation/reporting | Spring Boot, OpenFeign |
| `front` | Web application | Angular |

## Architecture

- `eureka-server` registers all microservices.
- `emplacement-service` exposes campsite CRUD and image upload; it also aggregates reservation data from `reservation-service` via OpenFeign. The booking price is recomputed server-side from the campsite rate (the client-sent price is ignored).
- `reservation-service` handles booking logic: Joi validation, double-booking prevention (exclusive date boundaries + an in-process per-campsite lock), and status management (`EN_ATTENTE`, `CONFIRMEE`, `ANNULEE`). Public endpoints only expose aggregated data; any endpoint returning client data requires an `ADMIN` JWT.
- `campbackoffice` is a stateless API gateway for the admin UI, aggregating data from the other services. All `/api/admin` endpoints require an `ADMIN` JWT.
- `front` is the Angular SPA. In production nginx proxies `/api` and `/uploads` to the backing services.

## Authentication

JWT-based, shared secret across services (`JWT_SECRET` environment variable). Login via `POST /api/auth/login` on `emplacement-service`.

- Public: browse campsites, check availability, create reservations.
- Admin: create/update/delete campsites, upload images, update reservation statuses. The admin account is created on startup from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

> **Required secrets**: services **fail to start** if `JWT_SECRET` (>= 32 chars, not a placeholder) or `ADMIN_PASSWORD` (>= 8 chars, not `admin123`) is missing or weak. There is no default secret baked in.

## Local development

Prerequisites: Java 17+, Maven (`mvnw`), Node 16/18, MySQL, MongoDB.

1. Set the shared secrets in your shell, then start MySQL and MongoDB:

```bash
export JWT_SECRET='<32+ char random string>'   # Windows: set JWT_SECRET=...
export ADMIN_PASSWORD='<strong admin password>'
```

2. Start each service:

```bash
cd eureka-server && mvnw spring-boot:run
cd emplacement-service && mvnw spring-boot:run
cd reservation-service && npm install && npm start   # reads .env (see .env.example)
cd campbackoffice && mvnw spring-boot:run
cd front && npm install && npm start   # http://localhost:4200
```

3. Default ports: Eureka `8761`, emplacement `8061`, reservation `8082`, campbackoffice `8063`, front `4200`.

The Angular dev server proxies `/api` to the services via `src/proxy.conf.json`.

## Docker

```bash
JWT_SECRET='<32+ char random string>' ADMIN_PASSWORD='<strong admin password>' docker compose up --build
```

Both variables are **required** (no defaults); `docker compose up` refuses to start without them.

- MySQL (port 3306) and MongoDB (port 27017) with persisted volumes.
- Eureka: http://localhost:8761
- Front: http://localhost:4200
- Campsite API: http://localhost:8061
- Reservation API: http://localhost:8082
- Admin API: http://localhost:8063

## API overview

| Endpoint | Access |
| -------- | ------ |
| `GET /api/emplacements`, `GET /api/emplacements/{id}`, `GET /api/emplacements/disponibles` | Public |
| `GET /api/emplacements/{id}/disponible` | Public (delegates to reservation-service) |
| `GET /api/emplacements/{id}/statistiques` | Public (aggregated only, no client data) |
| `POST /api/emplacements/reserver` | Public (server-side price, date validation) |
| `POST/PUT/DELETE /api/emplacements/**`, `POST /api/emplacements/{id}/upload-image` | Admin |
| `POST /api/auth/login`, `POST /api/auth/register` | Public |
| `POST /api/reservations` | Public (Joi-validated, race-safe) |
| `GET /api/reservations/emplacement/{id}/disponible`, `GET /api/reservations/emplacement/{id}/stats` | Public (stats are aggregated) |
| `GET /api/reservations`, `GET /api/reservations/{id}`, `PUT /api/reservations/{id}/status`, `DELETE /api/reservations/{id}` | Admin |
| `GET /api/admin/**` | Admin |

## Security

- `JWT_SECRET` and `ADMIN_PASSWORD` are required and validated at startup (fail-fast, no insecure defaults).
- Booking price is recomputed server-side; the client-sent price is never trusted.
- Reservation reads and status changes require an `ADMIN` JWT; public endpoints only return aggregated data (no names, emails or phone numbers).
- Concurrent bookings for the same campsite are serialized per instance to prevent double-booking.
- Image uploads are validated (content type + max 5 MB) and stored under a random file name.
- Leaflet map popups render campsite data through `textContent` (XSS-safe).
