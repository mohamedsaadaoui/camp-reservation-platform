FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -q -B dependency:resolve
COPY src src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S app -G app && mkdir -p /app/uploads && chown app:app /app/uploads
USER app:app
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8061
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget -qO- http://localhost:8061/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
