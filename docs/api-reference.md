# REST API Reference

Základní URL backendu: `http://localhost:8080`  
Všechny endpointy jsou pod prefixem `/api`.  
Swagger UI: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

Formát dat: `application/json`

---

## Studenti (`/api/students`)

### GET `/api/students`

Vrátí seznam všech studentů.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "firstName": "Jan",
    "lastName": "Novák",
    "dateOfBirth": "2005-03-15"
  },
  {
    "id": 2,
    "firstName": "Petra",
    "lastName": "Svobodová",
    "dateOfBirth": "2006-07-22"
  }
]
```

---

### POST `/api/students`

Vytvoří nového studenta.

**Request body:**
```json
{
  "firstName": "Jan",
  "lastName": "Novák",
  "dateOfBirth": "2005-03-15"
}
```

**Response `200 OK`** – vrátí uložený objekt včetně vygenerovaného `id`:
```json
{
  "id": 1,
  "firstName": "Jan",
  "lastName": "Novák",
  "dateOfBirth": "2005-03-15"
}
```

---

### PUT `/api/students/{id}`

Aktualizuje existujícího studenta.

**Path parametr:** `id` – identifikátor studenta

**Request body:**
```json
{
  "firstName": "Jan",
  "lastName": "Novák",
  "dateOfBirth": "2005-03-15"
}
```

**Response `200 OK`** – vrátí aktualizovaný objekt.

**Response `500`** – pokud student s daným `id` neexistuje (`EntityNotFoundException`).

---

### DELETE `/api/students/{id}`

Smaže studenta.

**Path parametr:** `id` – identifikátor studenta

**Response `200 OK`** – vrátí smazaný objekt:
```json
{
  "id": 1,
  "firstName": "Jan",
  "lastName": "Novák",
  "dateOfBirth": "2005-03-15"
}
```

**Response `500`** – pokud student neexistuje.

---

## Předměty (`/api/subjects`)

### GET `/api/subjects`

Vrátí seznam všech předmětů.

**Response `200 OK`:**
```json
[
  { "id": 1, "name": "Matematika" },
  { "id": 2, "name": "Fyzika" }
]
```

---

### POST `/api/subjects`

Vytvoří nový předmět.

**Request body:**
```json
{ "name": "Matematika" }
```

**Response `200 OK`:**
```json
{ "id": 1, "name": "Matematika" }
```

---

### PUT `/api/subjects/{id}`

Aktualizuje předmět.

**Path parametr:** `id` – identifikátor předmětu

**Request body:**
```json
{ "name": "Matematika (aktualizováno)" }
```

**Response `200 OK`** – vrátí aktualizovaný objekt.

---

### DELETE `/api/subjects/{id}`

Smaže předmět.

**Path parametr:** `id` – identifikátor předmětu

**Response `200 OK`** – vrátí smazaný objekt.

---

## Známky (`/api/grades`)

### GET `/api/grades`

Vrátí seznam všech známek, každá obsahuje vnořené objekty studenta a předmětu.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "student": {
      "id": 1,
      "firstName": "Jan",
      "lastName": "Novák",
      "dateOfBirth": "2005-03-15"
    },
    "subject": {
      "id": 1,
      "name": "Matematika"
    },
    "studentId": 1,
    "subjectId": 1,
    "topic": "Kvadratické rovnice",
    "mark": 2,
    "date": "2026-04-17T09:30:00"
  }
]
```

---

### GET `/api/grades/{id}`

Vrátí jednu konkrétní známku.

**Path parametr:** `id` – identifikátor známky

**Response `200 OK`** – viz výše (jeden objekt).

---

### POST `/api/grades`

Vytvoří novou známku.

**Request body** – používá `studentId` a `subjectId` (cizí klíče), nikoli vnořené objekty:
```json
{
  "studentId": 1,
  "subjectId": 1,
  "topic": "Kvadratické rovnice",
  "mark": 2,
  "date": "2026-04-17T09:30:00"
}
```

**Response `200 OK`** – vrátí uložený objekt s vnořenými objekty studenta a předmětu.

> `student` a `subject` v request body lze vynechat nebo zadat jako `null`.  
> Backend plní vazby pomocí `studentId` / `subjectId`.

---

### PUT `/api/grades/{id}`

Aktualizuje existující známku.

**Path parametr:** `id` – identifikátor známky

**Request body:**
```json
{
  "studentId": 1,
  "subjectId": 2,
  "topic": "Integrály",
  "mark": 3,
  "date": "2026-04-17T10:00:00"
}
```

**Response `200 OK`** – vrátí aktualizovaný objekt.

---

### DELETE `/api/grades/{id}`

Smaže známku.

**Path parametr:** `id` – identifikátor známky

**Response `200 OK`** – vrátí smazaný objekt.

---

## Chybové odpovědi

Backend aktuálně nevrací strukturované chybové body – při chybě vrátí Spring Boot výchozí error response (HTTP 500 nebo 404). Příklad výchozí Spring Boot chybové odpovědi:

```json
{
  "timestamp": "2026-04-17T09:00:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "path": "/api/students/999"
}
```

Výjimky vyvolávané backendem:
- `EntityNotFoundException` – záznam nenalezen (PUT, DELETE operace)
- `EntityExistsException` – používáno v `GradeService` místo `EntityNotFoundException` (technická nesrovnalost)

---

## Přehled endpointů

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

---

## Testování API

### Curl – příklady

```bash
# Seznam studentů
curl http://localhost:8080/api/students

# Přidat studenta
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jan","lastName":"Novák","dateOfBirth":"2005-03-15"}'

# Editovat studenta (id=1)
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Jan","lastName":"Nový","dateOfBirth":"2005-03-15"}'

# Smazat studenta (id=1)
curl -X DELETE http://localhost:8080/api/students/1

# Přidat známku
curl -X POST http://localhost:8080/api/grades \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"subjectId":1,"topic":"Test","mark":1,"date":"2026-04-17T10:00:00"}'
```

### Swagger UI

Interaktivní dokumentace s možností volat endpointy přímo z prohlížeče:

```
http://localhost:8080/swagger-ui/index.html
```
