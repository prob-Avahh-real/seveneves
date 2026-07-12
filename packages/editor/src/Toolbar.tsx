const TILES = [
  { id: 0, label: "Empty", color: "transparent" },
  { id: 1, label: "Wall", color: "#4a4a6a" },
  { id: 2, label: "Floor", color: "#2a2a4a" },
  { id: 3, label: "Player", color: "#a78bfa" },
  { id: 4, label: "Goal", color: "#f0a" },
];

interface ToolbarProps {
  selectedTile: number;
  onTileSelect: (id: number) => void;
  activeScript: string;
  onScriptSelect: (name: string) => void;
  scriptNames: string[];
  onSave: () => void;
  saving: boolean;
  onPreview: () => void;
}

export function Toolbar({
  selectedTile,
  onTileSelect,
  activeScript,
  onScriptSelect,
  scriptNames,
  onSave,
  saving,
  onPreview,
}: ToolbarProps) {
  return (
    <div style={barStyle}>
      {/* Tile palette */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {TILES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTileSelect(t.id)}
            style={{
              ...tileBtn,
              borderColor: selectedTile === t.id ? "#a78bfa" : "rgba(255,255,255,0.1)",
              background: t.color,
            }}
            title={t.label}
          >
            {t.id === 0 ? "✕" : ""}
          </button>
        ))}
      </div>

      {/* Script tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {scriptNames.map((name) => (
          <button
            key={name}
            onClick={() => onScriptSelect(name)}
            style={{
              ...tabBtn,
              background: activeScript === name ? "rgba(167,139,250,0.2)" : "transparent",
              color: activeScript === name ? "#a78bfa" : "#888",
            }}
          >
            {name}.lua
          </button>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onPreview} style={actionBtn}>▶ Preview</button>
        <button onClick={onSave} style={{ ...actionBtn, background: "#a78bfa", color: "#0a0a1a" }} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

const barStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "8px 16px", background: "rgba(255,255,255,0.04)",
  borderBottom: "1px solid rgba(255,255,255,0.08)", gap: 16, flexWrap: "wrap",
};
const tileBtn: React.CSSProperties = {
  width: 32, height: 32, borderRadius: 6, border: "2px solid", cursor: "pointer", fontSize: 14,
};
const tabBtn: React.CSSProperties = {
  padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "monospace",
};
const actionBtn: React.CSSProperties = {
  padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
  background: "transparent", color: "#e0e0e0", cursor: "pointer", fontSize: 13, fontWeight: 600,
};
