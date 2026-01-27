FROM openjdk:17-alpine

RUN apk update && apk add --no-cache curl
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

VOLUME /tmp

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8061/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]