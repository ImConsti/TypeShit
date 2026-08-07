# 1. Überblick & Nutzung

## Was ist TypeShit?

TypeShit ist eine webbasierte **To-Do-Applikation**. Nutzer registrieren sich mit
E-Mail-Adresse und Passwort, verwalten darüber ihre eigenen Aufgaben (Titel, Beschreibung, Priorität,
Fälligkeitsdatum) und sehen ihren Fortschritt auf einer separaten Statistik-Seite.

Jede Aufgabe gehört genau einer Person. Zusätzlich existiert eine
Admin-Rolle, die andere Nutzer auflisten und zu Admins befördern / degradieren, als auch Nutzer löschen kann.

## Features im Überblick

| Bereich | Beschreibung                                                                                                                                                           |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Registrierung / Login | E-Mail + Passwort (min. 6 Zeichen), Passwörter werden serverseitig gehasht (bcrypt), Sessions über JWT                                                                 |
| Aufgaben erstellen | Titel (Pflicht, max. 300 Zeichen), Beschreibung (optional, max. 5000 Zeichen), Priorität (Hoch/Mittel/Niedrig), optionales Fälligkeitsdatum (nicht in der Vergangenheit) |
| Aufgaben bearbeiten | Bearbeitung direkt in der Tabelle der offenen Aufgaben                                                                                                                 |
| Aufgaben abschließen / wiederherstellen | Erledigte Aufgaben werden mit Zeitstempel in eine separate Liste verschoben, von dort auch wiederherstellbar                                                           |
| Aufgaben löschen | Mit Bestätigungsdialog, sowohl für offene als auch erledigte Aufgaben                                                                                                  |
| Suche & Sortierung | Suche über Titel/Beschreibung; Sortierung nach Fälligkeitsdatum oder Priorität (offene Liste), nach Erledigungsdatum (erledigte Liste)                                 |
| Überfällig-Hervorhebung | Überfällige bzw. heute fällige Aufgaben werden farblich hervorgehoben                                                                                                  |
| Statistik-Seite | Kennzahlen (gesamt/erledigt/offen/wichtig), Tage-in-Folge-Streak, Balken- oder Kreis-Ansicht der Statusverteilung, anstehende Fälligkeiten (nächste 7 Tage)            |
| Admin-Bereich | Nutzerliste einsehen, Nutzer zu Admin befördern (nur für Rolle admin sichtbar), User löschen als auch Admins degradieren                                                                                         |
| Passwort vergessen | Passwort kann über die in der DB vorhandene Email-Adresse mit einem einmaligen Schlüssel zurückgesetzt werden.                                                                                            |

## Bedienung

### Registrierung & Login
- **Registrieren:** Um sich zum ersten Mal einloggen zu können muss man sich erst registrieren. Dazu auf den Button "Registrieren" drücken und eine Email, als auch ein mindestens 6-stelliges Passwort eingeben.
- **Login:** Nach der Registrierung kann man sich nach belieben wieder An-oder-Abmelden. Dazu dient der Login, bei dem man die User-Email und das Passwort eingeben muss. 

### Aufgaben verwalten (Dashboard `/`)

- **Erstellen:** Formular oben auf dem Dashboard ausfüllen und mit „Hinzufügen“ bestätigen.
- **Bearbeiten:** Stift-Symbol in der Zeile der offenen Aufgabe klickt in den Inline-Edit-Modus,
  „Speichern“ übernimmt die Änderungen.
- **Erledigen:** Häkchen-Symbol markiert die Aufgabe als erledigt (verschiebt sie in die untere Tabelle).
- **Wiederherstellen:** Zurück-Pfeil in der Tabelle „Erledigte Aufgaben“.
- **Löschen:** Papierkorb-Symbol, Bestätigung über einen Dialog erforderlich.
- **Suchen/Sortieren:** Suchfeld und Dropdown oberhalb der Tabelle „Offene Aufgaben“.

### Statistiken (`/statistics`)

- Erreichbar über den Button „Statistiken ansehen →“ oben rechts im Dashboard.
- **Kennzahlen:** Gesamtanzahl, erledigte, offene und als „wichtig“ markierte Aufgaben
  sowie die aktuelle Tage-in-Folge-Streak.
- **Status-Übersicht:** Verhältnis erledigt/offen als gestapelter Balken oder Kreisdiagramm; die
  Ansicht lässt sich über das „⋮“-Menü rechts oben im Panel umschalten.
- **Offene Aufgaben:** Tabelle mit Titel, Priorität und Fälligkeitsdatum aller offenen Aufgaben.
- **Wichtige Aufgaben:** Liste der als hoch priorisiert markierten Aufgaben.
- **Anstehende Fälligkeiten:** Aufgaben, die überfällig sind oder in den nächsten 7 Tagen fällig
  werden, inkl. relativer Zeitangabe (z. B. „Heute“, „In 3 Tagen“, „2 Tage überfällig“).
- Über „← Zurück zum Dashboard“ geht es zurück zur Aufgabenverwaltung.

### Admin-Bereich (`/admin`)
- **Erstellen:** Einen Admin erstellen geht nur durch eine Beförderung von einem anderen Admin. Der erste Admin entsteht durch den ersten jemals erstellten Account.
- **Anmelden:** Admins melden sich genauso an, wie jeder normale User auch. Im Hauptfeld befindet sich der Button für die Admin-Ansicht, das **Admin-Dashboard**. Für die Dozenten gibt es einen vorgefertigten Admin-Account:<br>
**Admin-Email:** dozent@admin.de <br>
**Admin-Passwort:** 123456 


## Screenshots


| Screenshot                               | Zeigt                                         |
|------------------------------------------|-----------------------------------------------|
| `docs/screenshots/login.png`             | Login-Seite                                   |
| `docs/screenshots/dashboard.png`         | Dashboard mit offenen und erledigten Aufgaben |
| `docs/screenshots/task-edit.png`         | Inline-Bearbeitung einer Aufgabe              |
| `docs/screenshots/statistics-balken.png` | Statistik-Seite, Balkenansicht                |
| `docs/screenshots/statistics-kreis.png`  | Statistik-Seite, Kreis-Ansicht                |
| `docs/screenshots/admin_dashboard.png`             | Admin-Bereich mit Nutzerliste                 |
|`docs/screenshots/registrieren.png`|Registrierungs-Seite |
`docs/screenshots/passwort_vergessen.png`|Passwort-Vergessen-Seite|


