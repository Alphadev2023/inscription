FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copie le wrapper Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw

# Télécharge les dépendances d'abord (cache Docker)
RUN ./mvnw dependency:go-offline -q

# Copie le code source et build
COPY src ./src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]