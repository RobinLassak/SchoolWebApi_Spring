# SchoolWebApi – Backend

REST API server pro školní systém správy studentů, předmětů a známek. Postaven na Spring Bootu s vrstvená architekturou Controller → Service → Repository.

## Technologie

| Technologie | Verze | Účel |
|-------------|-------|------|
| Java | 23 | Programovací jazyk |
| Spring Boot | 3.5.0 | Aplikační framework |
| Spring Data JPA | (via Boot) | Přístup k databázi |
| PostgreSQL | 17 | Relační databáze |
| Lombok | 1.18.38 | Generování getterů, setterů a konstruktorů |
| MapStruct | 1.6.3 | Automatické mapování entit na DTO |
| Springdoc OpenAPI | 2.8.9 | Swagger UI a API dokumentace |
| Maven | 3.x | Build a správa závislostí |

## Struktura projektu

```
backend/
├── pom.xml
└── src/main/
    ├── java/cz/schoolweb/
    │   ├── Main.java                    <- vstupní bod aplikace
    │   ├── configuration/
    │   │   └── WebConfiguration.java   <- CORS konfigurace
    │   ├── controller/                  <- REST endpointy
    │   ├── dto/                         <- datové objekty pro API
    │   ├── entity/                      <- JPA entity (tabulky v DB)
    │   ├── mapper/                      <- MapStruct konverze entity ↔ DTO
    │   ├── repository/                  <- Spring Data JPA repozitáře
    │   └── service/                     <- byznys logika
    └── resources/
        └── application.properties      <- konfigurace databáze a JPA
```

## Spuštění

### Požadavky

- Java 23+
- Maven 3.x
- PostgreSQL 17 – musí běžet před spuštěním backendu

### Příprava databáze (jednou)

```bash
brew services start postgresql@17
createdb schoolapi
psql -d schoolapi -c "CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;"
```

### Spuštění vývojového serveru

```bash
mvn spring-boot:run
```

Backend nastartuje na portu **8080**. Hibernate automaticky vytvoří databázové tabulky.

### Build

```bash
mvn clean package
```

Výstup: `target/SchoolWebApi-1.0-SNAPSHOT.war`

## Konfigurace databáze

Nastavení se nachází v `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/schoolapi
spring.datasource.username=postgres
spring.datasource.password=postgres
```

## REST API endpointy

Všechny endpointy jsou pod prefixem `/api`. Interaktivní dokumentaci najdeš na Swagger UI po spuštění backendu:

```
http://localhost:8080/swagger-ui/index.html
```

### Přehled

| Metoda | Endpoint | Popis |
|--------|----------|-------|
| GET | `/api/students` | Seznam studentů |
| POST | `/api/students` | Přidat studenta |
| PUT | `/api/students/{id}` | Editovat studenta |
| DELETE | `/api/students/{id}` | Smazat studenta |
| GET | `/api/subjects` | Seznam předmětů |
| POST | `/api/subjects` | Přidat předmět |
| PUT | `/api/subjects/{id}` | Editovat předmět |
| DELETE | `/api/subjects/{id}` | Smazat předmět |
| GET | `/api/grades` | Seznam všech známek |
| GET | `/api/grades/{id}` | Detail jedné známky |
| POST | `/api/grades` | Přidat známku |
| PUT | `/api/grades/{id}` | Editovat známku |
| DELETE | `/api/grades/{id}` | Smazat známku |

Podrobná API reference včetně request/response příkladů: [`docs/api-reference.md`](../docs/api-reference.md)

## Architektura

Backend používá klasickou vrstvenou architekturu:

```
HTTP Request -> Controller -> Service -> Repository -> Databáze
                    |               |
                   DTO           Entity
                    |               |
                 Mapper <----------->
```

- **Controller** – přijímá HTTP požadavky, předává DTO do service
- **Service** – obsahuje byznys logiku, orchestruje operace
- **Repository** – přistupuje k databázi přes Spring Data JPA
- **Entity** – JPA třídy mapované na databázové tabulky
- **DTO** – datové objekty vystavené přes API (oddělené od entit)
- **Mapper** – automaticky konvertuje entity na DTO a zpět (MapStruct)
