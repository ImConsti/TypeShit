export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Home</h1>
        <p>
          Statistics page: <a href="/statistics">/statistics</a>
        </p>
      </div>
    </main>
  );
}
