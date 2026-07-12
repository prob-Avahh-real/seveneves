import { Routes, Route, Link } from "react-router-dom";
import { Lobby } from "./pages/Lobby.js";
import { GamePlay } from "./pages/GamePlay.js";
import { AuthPage } from "./pages/AuthPage.js";

export function App() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <nav style={navStyle}>
        <Link to="/" style={logoStyle}>SevenEves</Link>
        <div style={{ display: "flex", gap: 16 }}>
          <Link to="/" style={linkStyle}>Explore</Link>
          <Link to="/auth" style={linkStyle}>Sign In</Link>
        </div>
      </nav>
      <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/play/:gameId" element={<GamePlay />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </main>
    </div>
  );
}

const navStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "12px 24px", background: "rgba(255,255,255,0.04)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};
const logoStyle: React.CSSProperties = { fontSize: 20, fontWeight: 700, color: "#a78bfa", textDecoration: "none" };
const linkStyle: React.CSSProperties = { color: "#c0c0d0", textDecoration: "none", fontSize: 14 };
