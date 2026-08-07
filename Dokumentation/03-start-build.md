# 3. Start & Build


## Das gesamte Projekt mit einem Befehl bauen

```bash
npm run build
```

Dieser Befehl im Repository-Root baut Backend und Frontend nacheinander
## Die Anwendung starten

### Variante A: Docker Compose

```bash
npm run dev
# entspricht: docker compose up --build
```

Startet automatisch eine lokale Postgres-Datenbank, wendet die Migrationen darauf an und
startet danach Backend (`http://localhost:3001`) sowie Frontend (`http://localhost:3000`) 


### Variante B: Manuell, ohne Docker

```bash
# Terminal 1 – im Backend Root
npm run dev

# Terminal 2 – im Frontend Root
npm run dev
```

### Variante C: Produktions-Build lokal ausführen

```bash
npm run build                     # siehe oben

npm start      # im Backend Root
npm start   # im Frontend Root
```

## Deployment (aktueller Stand)

- **Backend:** deployt auf Render
- **Frontend:** GitHub-Actions-Workflow

URL des Deployments: https://type-shit-plum.vercel.app/

> **Hinweis:** Das Backend auf Render läuft im Sleep-Modus, wenn es länger nicht genutzt wurde. Beim ersten Request muss der Server erst wieder aufgeweckt werden, was einige Minuten dauern kann. Ein zweiter Request kurz danach sollte dann wie erwartet schnell funktionieren.

