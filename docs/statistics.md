# Statistics Page Doku

## Zweck
Die Seite zeigt den aktuellen Stand der Aufgaben als eigene Route unter `/statistics`.
Sie ist absichtlich getrennt von der Home-Seite und spaeter auch getrennt vom Dashboard.

## Routing
- Route-Datei: `app/statistics/page.tsx`
- UI-Komponente: `src/StatisticsPage.jsx`
- Home-Seite bleibt separat unter `app/page.tsx`

## Datenquelle
`StatisticsPage` erwartet optional ein Prop `stats`. Wenn nichts uebergeben wird, nutzt die Komponente interne Beispielwerte (`defaultStats`).

```jsx
<StatisticsPage stats={myStats} />
```

## Erwartete Datenstruktur

```js
{
  user: {
    name: string,
    email: string,
    weekday: string,
    date: string
  },
  summary: {
    totalTasks: number,
    finished: number,
    inProgress: number,
    important: number,
    streakDays: number
  },
  openTasks: Array<{
    title: string,
    priority: "High" | "Medium" | "Low",
    due: string
  }>,
  importantTasks: string[],
  weeklyCompletion: Array<{
    day: string,
    done: number,
    total: number
  }>
}
```

## Was wird angezeigt
- Header mit Titel, Wochentag, Datum und Benutzername
- Summary-Karten (Total, Finished, In Progress, Important, Streak)
- Tabelle `Open Tasks`
- `Status Breakdown` mit Prozent-Balken
- Liste `Important Tasks`
- `Weekly Completion` als Balken pro Tag

## Berechnungslogik
Prozente werden ueber `asPercent(done, total)` berechnet:
- `Math.round((done / total) * 100)`
- Schutz gegen Division durch 0: bei `total = 0` wird `0` zurueckgegeben

## Styling
- Die Komponente nutzt aktuell einen inline CSS-String (`pageStyles`) in `src/StatisticsPage.jsx`.
- Wichtige Breakpoints:
  - `max-width: 980px`: Grid wird einspaltig
  - `max-width: 700px`: Header und Summary werden kompakter

## Hinweise fuer Erweiterungen
- Prioritaeten sind derzeit auf `High`, `Medium`, `Low` ausgelegt (ueber CSS-Klassen `badge.high`, `badge.medium`, `badge.low`).
- Fuer Live-Daten kann `stats` in `app/statistics/page.tsx` aus API/DB geladen und an `StatisticsPage` uebergeben werden.
- Wenn spaeter ein Dashboard dazu kommt, kann diese Komponente als wiederverwendbares Analytics-Modul eingebunden werden, ohne die Route `/statistics` zu verlieren.
