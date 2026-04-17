# SchoolWebApi – Frontend

Moderní React aplikace pro správu studentů, předmětů a jejich známek. Komunikuje s REST API backendem postaveným na Spring Bootu.

## Technologie

| Technologie | Verze | Účel |
|-------------|-------|------|
| React | 19 | UI framework |
| TypeScript | 6.0 | Typovaný JavaScript |
| Vite | 8 | Build nástroj a dev server |
| React Router | 7 | Klientské směrování |
| TanStack Query | 5 | Správa server state, cache a synchronizace |
| Axios | 1.x | HTTP klient pro volání REST API |
| React Hook Form | 7 | Správa formulářů |
| Zod | 4 | Schéma validace formulářů |
| Tailwind CSS | 3 | Utility-first CSS framework |
| Sonner | 2 | Toast notifikace |
| Lucide React | 1.x | Ikonová knihovna |

## Struktura projektu

```
frontend/src/
├── App.tsx               <- root komponenta, routing, globální providery
├── main.tsx              <- vstupní bod aplikace
├── index.css             <- globální styly a Tailwind direktivy
├── api/
│   ├── client.ts         <- Axios instance (připravena pro JWT)
│   ├── students.ts       <- CRUD funkce pro studenty
│   ├── subjects.ts       <- CRUD funkce pro předměty
│   └── grades.ts         <- CRUD funkce pro známky
├── types/
│   └── index.ts          <- sdílené TypeScript typy
├── utils/
│   ├── cn.ts             <- helper pro Tailwind třídy
│   └── grade.ts          <- helper pro formátování známek
├── components/
│   ├── layout/           <- Layout, Sidebar
│   ├── ui/               <- sdílené UI komponenty (Modal, FormField, ...)
│   ├── students/         <- StudentForm
│   ├── subjects/         <- SubjectForm
│   └── grades/           <- GradeForm
└── pages/
    ├── StudentsPage.tsx
    ├── SubjectsPage.tsx
    └── GradesPage.tsx
```

## Spuštění

### Požadavky

- Node.js 18+
- npm
- Spuštěný backend na portu `8080`

### Instalace závislostí (jednou)

```bash
npm install
```

### Vývojový server

```bash
npm run dev
```

Aplikace je dostupná na **http://localhost:3000**

Vite proxy automaticky přesměruje všechna volání `/api/*` na backend (`http://localhost:8080`).

### Build pro produkci

```bash
npm run build
```

Výstup se uloží do složky `dist/`.

### Náhled produkčního buildu

```bash
npm run preview
```

## Stránky aplikace

| Cesta | Stránka | Popis |
|-------|---------|-------|
| `/students` | Studenti | Přehled a správa studentů |
| `/subjects` | Předměty | Přehled a správa předmětů |
| `/grades` | Známky | Přehled a správa známek |

Výchozí cesta `/` přesměruje na `/students`.

## Připravenost na rozšíření

Axios klient v `src/api/client.ts` obsahuje připravené interceptory pro budoucí JWT autentizaci:

```ts
// Request interceptor – vložení Bearer tokenu
// const token = localStorage.getItem('token')
// if (token) config.headers.Authorization = `Bearer ${token}`

// Response interceptor – přesměrování při 401
// if (error.response?.status === 401) { /* redirect to login */ }
```

Po přidání přihlašování stačí odkomentovat příslušné řádky.
