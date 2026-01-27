🏕 Camping Reservation Platform

This is a microservices-based camping reservation application built with Spring Boot and a front-end module. It allows users to browse campsites, check availability, make reservations, and manage the camping services.

Project Modules
1️⃣ campbackoffice

Type: Backend (Admin/Management)

Description: Manages campsite data, user accounts, and reservation management for the camping platform.

Technology: Spring Boot, JPA, MySQL

2️⃣ emplacement-service

Type: Backend (Emplacement Management)

Description: Handles campsite locations, availability, and details of each emplacement.

Technology: Spring Boot, REST API, MySQL

3️⃣ reservation-service

Type: Backend (Reservation Management)

Description: Handles reservations, booking logic, and payment tracking.

Technology: Spring Boot, REST API, MySQL

4️⃣ eureka-server

Type: Service Discovery

Description: Registers all microservices and enables discovery and load balancing between them.

Technology: Spring Cloud Netflix Eureka

5️⃣ front

Type: Front-end Application

Description: User interface for campers to browse campsites, make reservations, and view availability.

Technology: Angular 
