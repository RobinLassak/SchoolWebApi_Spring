# SchoolWebApi – Dokumentace

Kompletní dokumentace školního systému pro správu studentů, předmětů a známek.

## Obsah dokumentace

| Soubor | Popis |
|--------|-------|
| [architektura.md](architektura.md) | Přehled architektury, technologický stack, struktura projektu |
| [backend.md](backend.md) | Popis backendu – vrstvy, entity, mapování, konfigurace |
| [frontend.md](frontend.md) | Popis frontendu – komponenty, stránky, stavový management |
| [api-reference.md](api-reference.md) | Kompletní REST API reference (endpointy, request/response) |
| [spusteni.md](spusteni.md) | Návod na instalaci a spuštění (backend i frontend) |

## O aplikaci

**SchoolWebApi** je webová aplikace pro správu školní agendy. Umožňuje evidovat:

- **Studenty** – jméno, příjmení, datum narození
- **Předměty** – název předmětu
- **Známky** – vazba student + předmět, téma, hodnota (1–5), datum

Aplikace je navržena jako základ, který je připraven pro budoucí rozšíření – autentizaci, autorizaci, role uživatelů a další bezpečnostní prvky.

## Rychlý start

```bash
# 1. Spustit PostgreSQL
brew services start postgresql@17

# 2. Spustit backend (port 8080)
cd backend && mvn spring-boot:run

# 3. Spustit frontend (port 3000)
cd frontend && npm run dev
```

Aplikace poté běží na [http://localhost:3000](http://localhost:3000).  
Swagger UI je dostupné na [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).
