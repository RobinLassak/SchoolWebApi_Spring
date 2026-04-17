# SchoolWebApi

Webová aplikace pro správu školní agendy – studentů, předmětů a jejich známek. Projekt je tvořen dvěma samostatnými částmi: REST API backendem postaveným na Spring Bootu a moderním React frontendem.

## O projektu

Aplikace umožňuje kompletní správu (CRUD) tří entit:

- **Studenti** – jméno, příjmení, datum narození
- **Předměty** – název předmětu
- **Známky** – vazba student + předmět, téma zkoušení, hodnota (1–5), datum

Projekt je záměrně navržen tak, aby byl připraven na budoucí rozšíření – přidání přihlašování, uživatelských rolí a dalších bezpečnostních prvků nevyžaduje přepis stávající architektury.

## Struktura projektu

```
SchoolWebApi_Spring/
├── backend/     <- Spring Boot REST API (Java 23, Maven, PostgreSQL)
├── frontend/    <- React SPA (Vite, TypeScript, Tailwind CSS)
├── docs/        <- Kompletní dokumentace projektu
└── secret/      <- Lokální přístupové údaje (není verzováno)
```

## Technologie

### Backend
- **Java 23** a **Spring Boot 3.5**
- **Spring Data JPA** + **Hibernate** (ORM)
- **PostgreSQL 17** (databáze)
- **Lombok** (redukce boilerplate kódu)
- **MapStruct** (mapování entity ↔ DTO)
- **Springdoc OpenAPI** (Swagger UI)

### Frontend
- **React 19** + **TypeScript 6**
- **Vite 8** (build nástroj a dev server)
- **TanStack Query 5** (správa server state a cache)
- **React Router 7** (klientské směrování)
- **Tailwind CSS 3** (stylování)
- **React Hook Form** + **Zod** (formuláře a validace)

## Rychlý start

### Požadavky
- Java 23+, Maven 3.x
- Node.js 18+, npm
- PostgreSQL 17 (instalace přes Homebrew: `brew install postgresql@17`)

### Spuštění

```bash
# 1. Spustit databázi
brew services start postgresql@17

# 2. Spustit backend (port 8080)
cd backend
mvn spring-boot:run

# 3. Spustit frontend (port 3000) – v novém terminálu
cd frontend
npm install   # pouze při prvním spuštění
npm run dev
```

Aplikace je dostupná na **http://localhost:3000**  
Swagger UI je dostupné na **http://localhost:8080/swagger-ui/index.html**

## Dokumentace

Podrobná dokumentace se nachází ve složce [`docs/`](docs/):

- [`docs/architektura.md`](docs/architektura.md) – přehled architektury a technologický stack
- [`docs/backend.md`](docs/backend.md) – popis backendových vrstev, entit a konfigurace
- [`docs/frontend.md`](docs/frontend.md) – popis komponent, stránek a stavového managementu
- [`docs/api-reference.md`](docs/api-reference.md) – kompletní REST API reference
- [`docs/spusteni.md`](docs/spusteni.md) – podrobný návod na instalaci a spuštění
