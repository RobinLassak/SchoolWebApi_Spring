# Architektura projektu

## Přehled

Aplikace je rozdělena do dvou samostatných částí v rámci jednoho repozitáře (monorepo):

```
SchoolWebApi_Spring/
├── backend/          <- Spring Boot REST API (Java 23, Maven)
├── frontend/         <- React SPA (Vite, TypeScript)
├── docs/             <- Dokumentace
└── secret/           <- Lokální přístupové údaje (ignorováno Gitem)
```

Obě části jsou nezávislé – backend poskytuje REST API, frontend ho konzumuje přes HTTP. V lokálním vývojovém prostředí frontend proxy-uje volání `/api/*` na `http://localhost:8080`.

---

## Technologický stack

### Backend

| Technologie | Verze | Účel |
|-------------|-------|------|
| Java | 23 | Programovací jazyk |
| Spring Boot | 3.5.0 | Aplikační framework |
| Spring Data JPA | (via Boot) | Vrstva pro přístup k databázi |
| Hibernate | (via Boot) | ORM |
| PostgreSQL | 17 | Relační databáze |
| Lombok | 1.18.38 | Redukce boilerplate kódu (gettery, settery, konstruktory) |
| MapStruct | 1.6.3 | Mapování mezi entitami a DTO |
| Springdoc OpenAPI | 2.8.9 | Swagger UI a OpenAPI specifikace |
| Maven | 3.x | Build a správa závislostí |

### Frontend

| Technologie | Verze | Účel |
|-------------|-------|------|
| React | 19 | UI framework |
| TypeScript | 6.0 | Typovaný JavaScript |
| Vite | 8 | Build nástroj a dev server |
| React Router | 7 | Klientské směrování |
| TanStack Query | 5 | Stavový management pro server state, cache, synchronizace |
| Axios | 1.x | HTTP klient |
| React Hook Form | 7 | Správa formulářů |
| Zod | 4 | Schéma validace formulářů |
| Tailwind CSS | 3 | Utility-first CSS framework |
| Sonner | 2 | Toast notifikace |
| Lucide React | 1.x | Ikonová knihovna |

---

## Architektonické vrstvy

### Backend – vrstvená architektura

```
HTTP Request
     |
     v
Controller         <- REST endpointy, HTTP vstup/výstup
     |
     v
Service            <- Byznys logika, orchestrace
     |
     v
Repository         <- Přístup k databázi (Spring Data JPA)
     |
     v
Entity             <- JPA entity (tabulky v DB)

+ DTO              <- Datové objekty pro přenos přes API
+ Mapper           <- Konverze Entity <-> DTO (MapStruct)
```

### Frontend – komponentová architektura

```
App.tsx
  |
  |- Layout
  |    |- Sidebar (navigace)
  |    |- <Outlet> (obsah stránky)
  |
  |- Pages (StudentsPage, SubjectsPage, GradesPage)
       |
       |- TanStack Query (useQuery, useMutation)
       |    |- API Service (Axios client)
       |         |- /api/* proxy -> backend :8080
       |
       |- Components (formuláře, modaly, UI)
            |- React Hook Form + Zod (validace)
```

---

## Databázový model

```
Student
  - id (PK, autoincrement)
  - firstName
  - lastName
  - dateOfBirth

Subject
  - id (PK, autoincrement)
  - name

Grade
  - id (PK, autoincrement)
  - student_id (FK -> Student.id)
  - subject_id (FK -> Subject.id)
  - topic
  - mark (1–5)
  - date
```

Relace: Grade má `@ManyToOne` vazbu na Student i Subject.  
Hibernate automaticky vytváří/aktualizuje schéma (`ddl-auto=update`).

---

## Komunikace frontend - backend

```
Prohlížeč (localhost:3000)
    |
    |  GET /api/students
    v
Vite Dev Server (proxy)
    |
    |  GET /api/students  ->  localhost:8080
    v
Spring Boot (localhost:8080)
    |
    v
JSON Response
```

Vite proxy je nakonfigurovaná ve `frontend/vite.config.ts`:

```ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

Axios klient ve frontenduje nastavuje `baseURL: '/api'`, takže volání jako `axios.get('/students')` jde na `localhost:3000/api/students`, které proxy přesměruje na `localhost:8080/api/students`.

---

## CORS

Backend povoluje všechny originy pro lokální vývoj přes `WebConfiguration.java`:

```java
registry.addMapping("/**")
        .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedOriginPatterns("**")
        .allowCredentials(true);
```

Pro produkci je nutné toto omezit pouze na konkrétní doménu frontendu.

---

## Připravenost na rozšíření

Projekt je navržen s ohledem na budoucí scaling:

- **Autentizace (JWT)**: Axios interceptory v `frontend/src/api/client.ts` jsou připraveny pro vložení `Authorization: Bearer <token>` hlavičky.
- **Spring Security**: Backend je bez Security závislosti, její přidání nevyžaduje přepis existující logiky.
- **Role a oprávnění**: Oddělení Controller / Service / Repository usnadní přidání anotací `@PreAuthorize`.
- **Prostředí**: `application.properties` lze rozšířit na profily (`dev`, `prod`) nebo nahradit environment variables.
