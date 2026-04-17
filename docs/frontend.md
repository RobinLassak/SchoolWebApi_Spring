# Frontend – dokumentace

## Struktura projektu

```
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── package.json
└── src/
    ├── main.tsx              <- vstupní bod
    ├── App.tsx               <- root komponenta, routing, providery
    ├── index.css             <- Tailwind direktivy, globální styly
    ├── api/
    │   ├── client.ts         <- Axios instance
    │   ├── students.ts       <- CRUD funkce pro studenty
    │   ├── subjects.ts       <- CRUD funkce pro předměty
    │   └── grades.ts         <- CRUD funkce pro známky
    ├── types/
    │   └── index.ts          <- TypeScript interface typy
    ├── utils/
    │   ├── cn.ts             <- utility pro clsx + tailwind-merge
    │   └── grade.ts          <- helper funkce pro práci se známkami
    ├── components/
    │   ├── layout/
    │   │   ├── Layout.tsx    <- wrapper layoutu
    │   │   └── Sidebar.tsx   <- boční navigace
    │   ├── ui/
    │   │   ├── Modal.tsx
    │   │   ├── ConfirmDialog.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   ├── FormField.tsx
    │   │   └── PageHeader.tsx
    │   ├── students/
    │   │   └── StudentForm.tsx
    │   ├── subjects/
    │   │   └── SubjectForm.tsx
    │   └── grades/
    │       └── GradeForm.tsx
    └── pages/
        ├── StudentsPage.tsx
        ├── SubjectsPage.tsx
        └── GradesPage.tsx
```

---

## Vstupní bod a root

### `main.tsx`

Renderuje `<App />` do DOM elementu `#root` v `index.html`.

### `App.tsx`

Obsahuje všechny globální providery a klientské směrování:

```tsx
<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/students" />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/grades" element={<GradesPage />} />
      </Routes>
    </Layout>
  </BrowserRouter>
  <Toaster position="bottom-right" richColors closeButton />
</QueryClientProvider>
```

**QueryClient konfigurace:**
- `staleTime: 30_000` – data jsou "čerstvá" 30 sekund (omezuje zbytečné refetch)
- `retry: 1` – při chybě se pokusí znovu jednou

---

## TypeScript typy (`src/types/index.ts`)

### `Student`
```ts
{ id: number, firstName: string, lastName: string, dateOfBirth: string }
```

### `Subject`
```ts
{ id: number, name: string }
```

### `Grade`
```ts
{
  id: number
  student: Student       // vnořený objekt pro zobrazení
  subject: Subject       // vnořený objekt pro zobrazení
  studentId: number      // FK pro zápis
  subjectId: number      // FK pro zápis
  topic: string
  mark: number
  date: string
}
```

### `GradeMark`
```ts
type GradeMark = 1 | 2 | 3 | 4 | 5
```

Každá doménová entita má i odpovídající `FormData` typ bez `id` (jen fields pro formulář).

---

## API vrstva

### `src/api/client.ts`

Centrální Axios instance:

```ts
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})
```

Obsahuje interceptory připravené pro budoucí JWT autentizaci:

```ts
// Request interceptor – vložení tokenu
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor – globální handling chyb
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response?.status === 401) { /* redirect to login */ }
    return Promise.reject(error)
  }
)
```

### `src/api/students.ts`

| Funkce | HTTP | Endpoint | Popis |
|--------|------|----------|-------|
| `getStudents()` | GET | `/students` | Vrátí seznam studentů |
| `createStudent(data)` | POST | `/students` | Vytvoří studenta |
| `updateStudent(id, data)` | PUT | `/students/{id}` | Aktualizuje studenta |
| `deleteStudent(id)` | DELETE | `/students/{id}` | Smaže studenta |

### `src/api/subjects.ts`

Analogická struktura jako `students.ts`.

### `src/api/grades.ts`

| Funkce | HTTP | Endpoint | Popis |
|--------|------|----------|-------|
| `getGrades()` | GET | `/grades` | Vrátí seznam všech známek |
| `createGrade(data)` | POST | `/grades` | Vytvoří známku |
| `updateGrade(id, data)` | PUT | `/grades/{id}` | Aktualizuje známku |
| `deleteGrade(id)` | DELETE | `/grades/{id}` | Smaže známku |

---

## Stavový management (TanStack Query)

Každá stránka používá:
- `useQuery` – pro načítání dat (automatická cache, refetch, loading/error stavy)
- `useMutation` – pro create/update/delete operace s invalidací cache

Příklad z `StudentsPage`:
```ts
const { data: students, isLoading } = useQuery({
  queryKey: ['students'],
  queryFn: getStudents,
})

const createMutation = useMutation({
  mutationFn: (data: StudentFormData) => createStudent(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['students'] })
    toast.success('Student přidán')
  },
})
```

Po úspěšné mutaci se invaliduje příslušný query key, což způsobí automatické obnovení dat.

---

## Layout komponenty

### `Layout.tsx`

Wrapper celé aplikace – flex layout s postranním panelem vlevo a hlavním obsahem vpravo.

### `Sidebar.tsx`

Boční navigace s odkazy na:
- `/students` – Studenti
- `/subjects` – Předměty
- `/grades` – Známky

Aktivní link je vizuálně odlišen pomocí `NavLink` z React Routeru.

---

## UI komponenty

### `Modal.tsx`

Obecný modální dialog. Přijímá `isOpen`, `onClose`, `title` a `children`. Blokuje scroll stránky při otevření. Zavírá se kliknutím na overlay nebo tlačítko X.

### `ConfirmDialog.tsx`

Potvrzovací dialog pro mazání. Zobrazuje varování a dvě tlačítka (Zrušit / Smazat). Prop `isLoading` zakáže tlačítka při probíhající operaci.

### `EmptyState.tsx`

Zobrazuje se při prázdném seznamu dat. Přijímá `icon`, `title`, `description` a volitelně `action` (tlačítko).

### `LoadingSpinner.tsx`

Animovaný spinner pro stavy načítání. Lze zobrazit ve středu stránky nebo inline.

### `FormField.tsx`

Wrapper pro formulářové pole s labelem, vstupem a zobrazením chybové zprávy z React Hook Form.

### `PageHeader.tsx`

Záhlaví stránky s `title`, `description` a volitelným `action` tlačítkem (pro "Přidat nový záznam").

---

## Formulářové komponenty

### `StudentForm.tsx`

Pole: `firstName`, `lastName`, `dateOfBirth`.  
Validace Zod: jméno a příjmení povinné (min. 2 znaky), datum povinné.

### `SubjectForm.tsx`

Pole: `name`.  
Validace Zod: název povinný (min. 2 znaky).

### `GradeForm.tsx`

Pole: `studentId` (select), `subjectId` (select), `topic`, `mark` (select 1–5), `date`.  
Validace Zod: všechna pole povinná.

Číselná pole (`studentId`, `subjectId`, `mark`) jsou registrována s `{ valueAsNumber: true }`, aby se hodnoty z `<select>` správně parsovaly jako čísla.

---

## Pages

### `StudentsPage.tsx`

- Zobrazuje seznam studentů v tabulce
- Tlačítka Editovat a Smazat u každého záznamu
- Modal s `StudentForm` pro přidání/editaci
- `ConfirmDialog` pro potvrzení smazání
- Toast notifikace po každé akci

### `SubjectsPage.tsx`

Analogická struktura jako `StudentsPage`.

### `GradesPage.tsx`

- Zobrazuje seznam známek včetně jména studenta, předmětu, tématu a hodnoty
- Barevné odlišení hodnoty známky (1 = zelená, 5 = červená) přes `grade.ts` utilitu
- Modal s `GradeForm` – selecty pro studenty a předměty jsou naplněny daty z API

---

## Utility

### `src/utils/cn.ts`

```ts
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Umožňuje podmíněné skládání Tailwind tříd bez konfliktů.

### `src/utils/grade.ts`

Pomocné funkce pro:
- Mapování číselné hodnoty na textový popis (1 = "Výborně", ..., 5 = "Nedostatečně")
- Mapování hodnoty na Tailwind barvu (1 = zelená, 5 = červená)

---

## Konfigurace

### `vite.config.ts`

```ts
{
  plugins: [react()],
  resolve: { alias: { '@': './src' } },
  server: {
    port: 3000,
    proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } }
  }
}
```

Path alias `@/` zkracuje importy – místo `../../components/ui/Modal` lze psát `@/components/ui/Modal`.

### `tailwind.config.js`

Rozšiřuje výchozí Tailwind konfiguraci o vlastní barvy a font (Inter z Google Fonts).

### `tsconfig.app.json`

Klíčové nastavení: `"moduleResolution": "bundler"` – moderní režim pro Vite projekty. Path alias `@/*` je definován v `tsconfig.app.json` i `vite.config.ts` (musí být na obou místech).

---

## Závislosti

### Produkční

| Balíček | Verze | Účel |
|---------|-------|------|
| `react` | 19 | UI framework |
| `react-dom` | 19 | DOM renderer |
| `react-router-dom` | 7 | Klientské směrování |
| `@tanstack/react-query` | 5 | Server state management |
| `axios` | 1.x | HTTP klient |
| `react-hook-form` | 7 | Správa formulářů |
| `@hookform/resolvers` | 5 | Adaptér pro Zod v RHF |
| `zod` | 4 | Schema validace |
| `tailwind-merge` | 3 | Merge Tailwind tříd bez konfliktů |
| `clsx` | 2 | Podmíněné třídy |
| `lucide-react` | 1.x | Ikony |
| `sonner` | 2 | Toast notifikace |

### Vývojové

| Balíček | Verze | Účel |
|---------|-------|------|
| `vite` | 8 | Build nástroj |
| `@vitejs/plugin-react` | 6 | Vite plugin pro React (Babel/SWC) |
| `typescript` | 6.0 | Typový systém |
| `tailwindcss` | 3 | CSS framework |
| `autoprefixer` | 10 | PostCSS plugin |
| `postcss` | 8 | CSS transformace |
| `eslint` | 9 | Linter |
