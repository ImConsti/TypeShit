<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Beispielseite</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/main.js"></script>
</body>
</html>
import "./style.css";

const app = document.querySelector("#app");

app.innerHTML = `
  <header>
    <h1>Demo-Webseite</h1>
    <p>Beispieltext für Layout und Struktur</p>
  </header>

  <main>
    <h2>Einführung</h2>
    <p>
      Diese Webseite dient als neutrales Beispiel für eine einfache HTML-Struktur.
      Die Inhalte sind Platzhalter und können frei ersetzt werden.
    </p>

    <h2>Abschnitt</h2>
    <p>
      HTML beschreibt den Aufbau einer Seite, während CSS für das Design
      zuständig ist.
    </p>

    <ul>
      <li>Klare Struktur</li>
      <li>Neutrale Texte</li>
      <li>Einfache Gestaltung</li>
    </ul>
  </main>

  <footer>
    <p>Demo-Inhalt · Platzhaltertext</p>
  </footer>
`;
body {
  font-family: Arial, sans-serif;
  background-color: #f2f2f2;
  margin: 0;
}

header {
  background-color: #444;
  color: white;
  padding: 20px;
  text-align: center;
}

main {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
}

footer {
  text-align: center;
  padding: 10px;
  background-color: #ddd;
}
