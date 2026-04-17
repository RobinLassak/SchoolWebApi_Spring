# Spuštění projektu

## Požadavky

Před spuštěním se ujisti, že máš nainstalované:

| Nástroj | Verze | Ověření |
|---------|-------|---------|
| Java | 23+ | `java -version` |
| Maven | 3.x | `mvn -version` |
| Node.js | 18+ | `node -version` |
| npm | 9+ | `npm -version` |
| PostgreSQL | 17 | `psql --version` |

---

## 1. Databáze (PostgreSQL)

### Instalace (macOS – Homebrew)

```bash
brew install postgresql@17
```

### Spuštění serveru

```bash
brew services start postgresql@17
```

Ověření, zda běží:

```bash
brew services list | grep postgresql
```

### Vytvoření databáze a uživatele

Spusť jednou (pouze při první instalaci):

```bash
createdb schoolapi
psql -d schoolapi -c "CREATE USER postgres WITH PASSWORD 'postgres' SUPERUSER;"
```

> Pokud uživatel `postgres` již existuje (vypíše `ERROR: role "postgres" already exists`), pokračuj dál – tabulky vytvoří Hibernate automaticky při prvním spuštění backendu.

### Zastavení serveru

```bash
brew services stop postgresql@17
```

---

## 2. Backend (Spring Boot)

### Spuštění vývojového serveru

```bash
cd backend
mvn spring-boot:run
```

Backend nastartuje na portu `8080`. Hibernate automaticky vytvoří/aktualizuje tabulky v databázi.

### Kompilace bez spuštění

```bash
cd backend
mvn clean compile
```

### Build WAR souboru

```bash
cd backend
mvn clean package
```

Výstupní soubor: `backend/target/SchoolWebApi-1.0-SNAPSHOT.war`

### Ověření, že backend běží

```bash
curl http://localhost:8080/api/students
```

Měl by vrátit `[]` (prázdné pole, pokud ještě nejsou žádní studenti).

Swagger UI:

```
http://localhost:8080/swagger-ui/index.html
```

---

## 3. Frontend (React + Vite)

### Instalace závislostí (jednou)

```bash
cd frontend
npm install
```

### Spuštění vývojového serveru

```bash
cd frontend
npm run dev
```

Frontend nastartuje na portu `3000`. Aplikace je dostupná na:

```
http://localhost:3000
```

Vite proxy automaticky přesměruje všechna volání `/api/*` na `http://localhost:8080`.

### Build pro produkci

```bash
cd frontend
npm run build
```

Výstupní soubory: `frontend/dist/`

### Preview produkčního buildu

```bash
cd frontend
npm run preview
```

---

## 4. Pořadí spuštění

Pro plnou funkčnost je nutné spustit v tomto pořadí:

1. PostgreSQL databáze
2. Backend (Spring Boot) – port `8080`
3. Frontend (Vite) – port `3000`

---

## 5. Struktura portů

| Služba | Port | URL |
|--------|------|-----|
| PostgreSQL | 5432 | `jdbc:postgresql://localhost:5432/schoolapi` |
| Backend | 8080 | `http://localhost:8080` |
| Frontend | 3000 | `http://localhost:3000` |
| Swagger UI | 8080 | `http://localhost:8080/swagger-ui/index.html` |

---

## 6. Časté problémy

### Backend nespustí – `No POM in this directory`

Maven musíš spouštět ze složky `backend/`, ne z kořene projektu:

```bash
cd backend
mvn spring-boot:run
```

### Backend nespustí – `Connection refused` (port 5432)

PostgreSQL server neběží. Spusť:

```bash
brew services start postgresql@17
```

### Backend nespustí – `password authentication failed`

Ověř přihlašovací údaje v `backend/src/main/resources/application.properties` – musí odpovídat skutečnému uživateli v databázi.

### Frontend nevidí data z backendu

- Ověř, že backend běží na portu `8080`
- Ověř proxy konfiguraci v `frontend/vite.config.ts`
- Zkontroluj konzoli prohlížeče (F12) pro síťové chyby

### Chyba `npm: command not found`

Node.js není nainstalován. Nainstaluj přes [nodejs.org](https://nodejs.org) nebo Homebrew:

```bash
brew install node
```

---

## 7. Proměnné prostředí (pro budoucí use)

Pro produkční nasazení je vhodné přesunout přihlašovací údaje z `application.properties` do proměnných prostředí nebo Spring profilů:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/schoolapi
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=moje_heslo
```

Spring Boot tyto proměnné automaticky rozpozná a použije místo hodnot v `application.properties`.
