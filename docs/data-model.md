# Datenmodell

## Ressourcen

### Task (Aufgabe)

Zentrale Ressource der Anwendung. Repräsentiert eine einzelne Aufgabe.

| Eigenschaft | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | `string` (UUID) | ja | Eindeutige ID, generiert via `crypto.randomUUID()` |
| `title` | `string` | ja | Titel der Aufgabe |
| `description` | `string` | ja | Beschreibung der Aufgabe (kann leer sein) |
| `priority` | `"Hoch" \| "Mittel" \| "Niedrig"` | ja | Prioritätsstufe |
| `dueDate` | `string` (ISO 8601) | nein | Fälligkeitsdatum, z. B. `"2026-06-10"` |
| `isDone` | `boolean` | ja | `true` wenn erledigt, sonst `false` |
| `doneAt` | `string` (ISO 8601) | nein | Zeitstempel der Erledigung, z. B. `"2026-06-09T14:32:00.000Z"` |
| `pinned` | `boolean` | nein | Ob die Aufgabe angepinnt ist (reserviert, noch nicht genutzt) |

**TypeScript-Definition:**

```typescript
type Priority = "Hoch" | "Mittel" | "Niedrig";

type Task = {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    dueDate?: string;
    isDone: boolean;
    doneAt?: string;
    pinned?: boolean;
};
```

---

### User (Benutzer)

Repräsentiert den eingeloggten Benutzer. Wird im Auth-Kontext verwaltet.

| Eigenschaft | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `email` | `string` | ja | E-Mail-Adresse des Benutzers |
| `isAuthenticated` | `boolean` | ja | Ob der Benutzer eingeloggt ist |

**Persistenz:** `auth_token` und `user_email` in localStorage + Cookie

---

## Beziehungen zwischen Ressourcen

```
User ──── besitzt ────► Task[]
           (1 : n)
```

- Ein **User** hat beliebig viele **Tasks**
- Jeder **Task** gehört genau einem **User** (identifiziert über die E-Mail in localStorage)
- Tasks werden pro Benutzer-Session im localStorage gespeichert (Schlüssel: `"task-manager-tasks"`)

---

## Mögliche Aktionen auf Ressourcen

### Task

| Aktion | Auslöser | Beschreibung |
|---|---|---|
| `create` | TaskInput-Formular | Neue Aufgabe anlegen |
| `read` | Seitenaufruf | Alle Tasks laden und anzeigen |
| `update` | Inline-Editor in OpenTask | Titel, Beschreibung, Priorität oder Datum ändern |
| `delete` | CloseTask-Tabelle | Erledigte Aufgabe dauerhaft löschen |
| `complete` | OpenTask-Tabelle | Aufgabe als erledigt markieren, `doneAt` wird gesetzt |
| `restore` | CloseTask-Tabelle | Erledigte Aufgabe zurücksetzen (`isDone = false`) |
| `filter` | Suchfeld in OpenTask | Nach Titel/Beschreibung filtern |
| `sort` | Sortier-Dropdown | Nach Fälligkeitsdatum oder Priorität sortieren |

### User

| Aktion | Auslöser | Beschreibung |
|---|---|---|
| `login` | Login-Seite | Benutzer authentifizieren |
| `logout` | Dashboard | Session beenden, localStorage leeren |

---

## Persistenzschicht (aktuell)

Da kein Backend existiert, werden alle Daten clientseitig im **localStorage** des Browsers gespeichert:

| Schlüssel | Inhalt |
|---|---|
| `task-manager-tasks` | JSON-Array aller Tasks (`Task[]`) |
| `auth_token` | Authentifizierungs-Token (Mock) |
| `user_email` | E-Mail des eingeloggten Benutzers |
