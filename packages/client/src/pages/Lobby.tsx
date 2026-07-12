import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface GameCard {
  id: string;
  title: string;
  description: string;
  plays: number;
}

export function Lobby() {
  const [games, setGames] = useState<GameCard[]>([]);

  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then(setGames)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Explore Games</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {games.map((g) => (
          <Link to={`/play/${g.id}`} key={g.id} style={cardStyle}>
            <div style={{ aspectRatio: "16/9", background: "rgba(167,139,250,0.15)", borderRadius: 8, marginBottom: 8 }} />
            <div style={{ fontWeight: 600 }}>{g.title}</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{g.plays} plays</div>
          </Link>
        ))}
        {games.length === 0 && (
          <p style={{ color: "#666" }}>No games yet. Be the first creator!</p>
        )}
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: "block", padding: 12, borderRadius: 12,
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
  textDecoration: "none", color: "inherit",
};
