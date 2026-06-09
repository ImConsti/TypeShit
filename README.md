# TypeShit – Task Manager

Eine webbasierte Aufgabenverwaltung, entwickelt im Rahmen des Kurses **Programmieren** an der DHBW.

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| Sprache | TypeScript 5 |
| UI | React 19 |
| Styling | CSS Modules |
| Persistenz | localStorage (clientseitig) |
| Auth | Mock-Authentifizierung via Cookie + localStorage |

## Features

### Aufgabenverwaltung (CRUD)

| Operation | Beschreibung |
|---|---|
| **Erstellen** | Neue Aufgabe mit Titel, Beschreibung, Priorität und Fälligkeitsdatum anlegen |
| **Lesen** | Alle offenen und erledigten Aufgaben anzeigen |
| **Bearbeiten** | Titel, Beschreibung, Priorität und Fälligkeitsdatum direkt in der Tabelle bearbeiten |
| **Löschen** | Erledigte Aufgaben dauerhaft entfernen |
| **Abschließen** | Aufgabe als erledigt markieren (mit Zeitstempel) |
| **Wiederherstellen** | Erledigte Aufgabe zurück in offene Aufgaben verschieben |

### Filter & Sortierung

**Offene Aufgaben:**
- Echtzeit-Suche nach Titel oder Beschreibung
- Sortierung nach Fälligkeitsdatum (Standard)
- Sortierung nach Priorität (Hoch → Mittel → Niedrig)

**Erledigte Aufgaben:**
- Sortierung nach Erledigungsdatum (neueste zuerst)

### Statistiken

- Gesamtanzahl, erledigte, offene und wichtige Aufgaben
- Aufgaben der aktuellen Woche mit Tagesübersicht
- Streak-Counter (aufeinanderfolgende Tage mit Abschlüssen)
- Balken- oder Kreisdiagramm-Ansicht für Statusverteilung

## Projektstruktur

```
src/
├── app/
│   ├── api/                    # API-Routen (geplant)
│   ├── login/                  # Login-Seite
│   ├── statistics/             # Statistik-Seite
│   ├── components/             # Gemeinsame Komponenten
│   ├── TaskPanel/              # Aufgabenverwaltung (State-Container)
│   ├── OpenTask/               # Offene Aufgaben (Tabelle + Edit)
│   ├── CloseTask/              # Erledigte Aufgaben (Tabelle + Delete)
│   ├── layout.tsx              # Root-Layout mit AuthProvider
│   ├── middleware.tsx           # Auth-Middleware (Route Guard)
│   └── page.tsx                # Dashboard (Startseite)
└── contexts/
    └── AuthContext.tsx         # Auth-State und Login/Logout
```

## Setup & Ausführen

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter [http://localhost:3000](http://localhost:3000) erreichbar.

**Login:** Beliebige E-Mail-Adresse + Passwort (mind. 6 Zeichen)

## Dokumentation

- [Datenmodell](docs/data-model.md) – Ressourcen, Eigenschaften und Beziehungen
- [API-Struktur](docs/api.md) – Geplante REST-Endpunkte mit Aktion, Methode, Input/Output
