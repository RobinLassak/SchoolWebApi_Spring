# Backend – dokumentace

## Struktura projektu

```
backend/
├── pom.xml
└── src/main/
    ├── java/cz/schoolweb/
    │   ├── Main.java
    │   ├── configuration/
    │   │   └── WebConfiguration.java
    │   ├── controller/
    │   │   ├── StudentController.java
    │   │   ├── SubjectController.java
    │   │   └── GradeController.java
    │   ├── dto/
    │   │   ├── StudentDto.java
    │   │   ├── SubjectDto.java
    │   │   └── GradeDto.java
    │   ├── entity/
    │   │   ├── StudentEntity.java
    │   │   ├── SubjectEntity.java
    │   │   └── GradeEntity.java
    │   ├── mapper/
    │   │   ├── StudentMapper.java
    │   │   ├── SubjectMapper.java
    │   │   └── GradeMapper.java
    │   ├── repository/
    │   │   ├── StudentRepository.java
    │   │   ├── SubjectRepository.java
    │   │   └── GradeRepository.java
    │   └── service/
    │       ├── StudentService.java
    │       ├── SubjectService.java
    │       └── GradeService.java
    └── resources/
        └── application.properties
```

---

## Vstupní bod aplikace

### `Main.java`

Startovní třída Spring Boot aplikace. Rozšiřuje `SpringBootServletInitializer` pro případný deploy jako WAR soubor do externího Tomcatu. Packaging v `pom.xml` je nastaven na `war`.

```java
@SpringBootApplication
public class Main extends SpringBootServletInitializer { ... }
```

---

## Konfigurace

### `application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/schoolapi
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.open-in-view=true
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
springdoc.swagger-ui.operationsSorter=method
```

| Klíč | Hodnota | Popis |
|------|---------|-------|
| `datasource.url` | `jdbc:postgresql://localhost:5432/schoolapi` | JDBC URL na lokální PostgreSQL |
| `datasource.username` | `postgres` | Uživatel DB |
| `datasource.password` | `postgres` | Heslo DB |
| `ddl-auto` | `update` | Hibernate automaticky aktualizuje schéma (nevhodné pro produkci) |
| `show-sql` | `true` | Vypisuje generované SQL do konzole (vhodné pro debug) |
| `operationsSorter` | `method` | Swagger UI řadí endpointy podle HTTP metody |

### `WebConfiguration.java`

Nastavuje CORS pro celou aplikaci – v lokálním vývoji povoluje všechny originy a metody.

```java
registry.addMapping("/**")
        .allowedMethods("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedOriginPatterns("**")
        .allowCredentials(true);
```

> Pro produkci nahradit `allowedOriginPatterns("**")` konkrétní doménou.

---

## Entity (datový model)

Entity jsou JPA třídy mapované na databázové tabulky. Používají Lombok `@Getter` a `@Setter`.

### `StudentEntity`

| Pole | Typ | Popis |
|------|-----|-------|
| `id` | `int` | PK, automaticky generováno (`IDENTITY`) |
| `firstName` | `String` | Jméno |
| `lastName` | `String` | Příjmení |
| `dateOfBirth` | `LocalDate` | Datum narození |

### `SubjectEntity`

| Pole | Typ | Popis |
|------|-----|-------|
| `id` | `int` | PK, automaticky generováno |
| `name` | `String` | Název předmětu |

### `GradeEntity`

| Pole | Typ | Popis |
|------|-----|-------|
| `id` | `int` | PK, automaticky generováno |
| `student` | `StudentEntity` | `@ManyToOne` – vazba na studenta |
| `subject` | `SubjectEntity` | `@ManyToOne` – vazba na předmět |
| `topic` | `String` | Téma zkoušení |
| `mark` | `int` | Hodnota známky (1–5) |
| `date` | `LocalDateTime` | Datum a čas udělení |

---

## DTO (Data Transfer Objects)

DTO jsou datové objekty přenášené přes REST API. Jsou odděleně od entit, aby se zamezilo přímému vystavení databázového modelu.

### `StudentDto`

```java
int Id          // pozor: velké I (historicky)
String firstName
String lastName
LocalDate dateOfBirth
```

### `SubjectDto`

```java
int id
String name
```

### `GradeDto`

```java
int id
StudentDto student    // pro čtení – vnořený objekt studenta
SubjectDto subject    // pro čtení – vnořený objekt předmětu
int studentId         // pro zápis – cizí klíč studenta
int subjectId         // pro zápis – cizí klíč předmětu
String topic
int mark
LocalDateTime date
```

`GradeDto` obsahuje jak vnořené objekty (`student`, `subject`) pro zobrazení, tak cizí klíče (`studentId`, `subjectId`) pro vytváření a editaci záznamu.

---

## Mappery (MapStruct)

Mappery zajišťují konverzi mezi entitami a DTO bez ruční kopírování polí. Jsou generovány automaticky při kompilaci díky `mapstruct-processor`.

### `StudentMapper`

```java
StudentEntity toEntity(StudentDto dto)
StudentDto toDto(StudentEntity entity)
```

### `SubjectMapper`

```java
SubjectEntity toEntity(SubjectDto dto)
SubjectDto toDto(SubjectEntity entity)
```

### `GradeMapper`

```java
GradeEntity toEntity(GradeDto dto)

@Mapping(target = "studentId", source = "student.id")
@Mapping(target = "subjectId", source = "subject.id")
GradeDto toDto(GradeEntity entity)

GradeEntity updateGrade(GradeDto dto, @MappingTarget GradeEntity entity)
```

`updateGrade` se používá při editaci – aktualizuje existující entitu bez vytvoření nové instance.  
Anotace `@Mapping` explicitně mapuje `student.id` a `subject.id` na ploché pole `studentId`/`subjectId` v DTO.

---

## Repository

Repozitáře rozšiřují `JpaRepository<Entity, ID>` a poskytují CRUD operace bez nutnosti psát SQL.

```java
StudentRepository extends JpaRepository<StudentEntity, Integer>
SubjectRepository extends JpaRepository<SubjectEntity, Integer>
GradeRepository   extends JpaRepository<GradeEntity, Integer>
```

Dostupné metody (automaticky): `findAll()`, `findById()`, `save()`, `delete()`, `existsById()`, `getReferenceById()`, a další.

---

## Services

Vrstva byznys logiky. Každá service drží referenci na příslušný mapper a repository.

### `StudentService`

| Metoda | Popis |
|--------|-------|
| `getStudents()` | Vrátí seznam všech studentů jako `List<StudentDto>` |
| `addStudent(dto)` | Uloží nového studenta, vrátí uložené DTO |
| `editStudent(dto, id)` | Aktualizuje studenta – ověří existenci, nastaví ID, uloží |
| `deleteStudent(id)` | Smaže studenta, vrátí smazané DTO |

Při neexistenci záznamu vyhodí `EntityNotFoundException`.

### `SubjectService`

Analogická struktura jako `StudentService`.

### `GradeService`

| Metoda | Popis |
|--------|-------|
| `getAll()` | Vrátí všechny známky |
| `getGradeById(id)` | Vrátí jednu známku |
| `addGrade(dto)` | Uloží novou známku – nastaví `student` a `subject` přes `getReferenceById()` |
| `editGrade(id, dto)` | Aktualizuje existující známku – používá `GradeMapper.updateGrade()` |
| `deleteGrade(id)` | Smaže známku |

> `getReferenceById()` vrací lazy proxy bez okamžitého DB dotazu – vhodné pro nastavení FK vztahu.

---

## Controllers

Controllers mapují HTTP metody na metody service. Všechny jsou pod `@RequestMapping("/api")`.

### Společná konvence

- `GET` `/api/{resource}` – seznam všech záznamů
- `POST` `/api/{resource}` – vytvoření nového záznamu
- `PUT` `/api/{resource}/{id}` – editace záznamu
- `DELETE` `/api/{resource}/{id}` – smazání záznamu

Podrobný popis všech endpointů viz [api-reference.md](api-reference.md).

---

## Swagger UI

Po spuštění backendu je dostupné na:

```
http://localhost:8080/swagger-ui/index.html
```

Poskytuje interaktivní dokumentaci a umožňuje volat endpointy přímo z prohlížeče.

---

## Build a závislosti (pom.xml)

Klíčové konfigurace:

- **Parent**: `spring-boot-starter-parent:3.5.0` – spravuje verze závislostí
- **Java**: 23
- **Packaging**: `war`
- **Annotation procesory**: Lombok + MapStruct jsou explicitně v `annotationProcessorPaths` pluginu `maven-compiler-plugin`, aby zpracování proběhlo ve správném pořadí

```xml
<annotationProcessorPaths>
    <path>lombok:1.18.38</path>
    <path>lombok-mapstruct-binding:0.2.0</path>
    <path>mapstruct-processor:1.6.3</path>
</annotationProcessorPaths>
```

Pořadí je důležité: Lombok musí zpracovat `@Getter`/`@Setter` dříve, než MapStruct generuje mapper implementace.
