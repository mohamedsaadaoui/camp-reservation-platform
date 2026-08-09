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
- `emplacement-service` exposes campsite CRUD and image upload; it also aggregates reservation data from `reservation-service` via OpenFeign.
- `reservation-service` handles booking logic: Joi validation, double-booking prevention (exclusive date boundaries), and status management (`EN_ATTENTE`, `CONFIRMEE`, `ANNULEE`).
- `campbackoffice` is a stateless API gateway for the admin UI, aggregating data from the other services. All `/api/admin` endpoints require an `ADMIN` JWT.
- `front` is the Angular SPA. In production nginx proxies `/api` and `/uploads` to the backing services.

## Authentication

JWT-based, shared secret across services (`JWT_SECRET` environment variable). Login via `POST /api/auth/login` on `emplacement-service`.

- Public: browse campsites, check availability, create reservations.
- Admin: create/update/delete campsites, upload images, update reservation statuses. The default admin account is created on startup from `ADMIN_USERNAME` / `ADMIN_PASSWORD` (defaults: `admin` / `admin123`).

## Local development

Prerequisites: Java 17+, Maven (`mvnw`), Node 16/18, MySQL, MongoDB.

1. Start MySQL and MongoDB, then run each service:

```bash
cd eureka-server && mvnw spring-boot:run
cd emplacement-service && mvnw spring-boot:run
cd reservation-service && npm install && npm start
cd campbackoffice && mvnw spring-boot:run
cd front && npm install && npm start   # http://localhost:4200
```

2. Default ports: Eureka `8761`, emplacement `8061`, reservation `8082`, campbackoffice `8063`, front `4200`.

The Angular dev server proxies `/api` to the services via `src/proxy.conf.json`.

## Docker

```bash
docker compose up --build
```

- MySQL (port 3306) and MongoDB (port 27017) with persisted volumes.
- Eureka: http://localhost:8761
- Front: http://localhost:4200
- Campsite API: http://localhost:8061
- Reservation API: http://localhost:8082
- Admin API: http://localhost:8063

Configuration is provided through environment variables (see `docker-compose.yml`). Override secrets with:

```bash
JWT_SECRET=<strong-secret> ADMIN_PASSWORD=<admin-password> docker compose up --build
```
