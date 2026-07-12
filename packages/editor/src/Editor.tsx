import { useState, useCallback } from "react";
import { WorldCanvas } from "./WorldCanvas.js";
import { LuaEditor } from "./LuaEditor.js";
import { Toolbar } from "./Toolbar.js";
import { PreviewModal } from "./PreviewModal.js";

export function Editor() {
  const [selectedTile, setSelectedTile] = useState(0);
  const [scripts, setScripts] = useState<Record<string, string>>({
    init: "-- init.lua\n",
    update: "-- update.lua (runs every frame)\n",
  });
  const [activeScript, setActiveScript] = useState("init");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      // TODO: POST world data + scripts to /api/games/:id
      await new Promise((r) => setTimeout(r, 500));
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar
        selectedTile={selectedTile}
        onTileSelect={setSelectedTile}
        activeScript={activeScript}
        onScriptSelect={setActiveScript}
        scriptNames={Object.keys(scripts)}
        onSave={handleSave}
        saving={saving}
        onPreview={() => setPreviewOpen(true)}
      />
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ flex: 1, background: "#0d0d2b" }}>
          <WorldCanvas selectedTile={selectedTile} />
        </div>
        <div style={{ width: 420, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          <LuaEditor
            script={scripts[activeScript] ?? ""}
            onChange={(v) => setScripts((s) => ({ ...s, [activeScript]: v }))}
          />
        </div>
      </div>
      {previewOpen && (
        <PreviewModal scripts={scripts} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}
