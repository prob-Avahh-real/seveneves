import { useEffect, useRef, useState } from "react";
import { Sandbox, createDefaultAPI } from "@seveneves/runtime";

interface PreviewModalProps {
  scripts: Record<string, string>;
  onClose: () => void;
}

export function PreviewModal({ scripts, onClose }: PreviewModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [log, setLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const api = createDefaultAPI();
      api.log = (...args) => setLog((l) => [...l.slice(-50), args.join(" ")]);
      const sb = await Sandbox.create({
        instructionLimit: 1e6,
        memoryLimit: 16 * 1024 * 1024,
        timeoutMs: 5000,
        api: { game: api as unknown as Record<string, (...args: unknown[]) => unknown> },
      });

      const initCode = scripts["init"] ?? "";
      const result = await sb.run(initCode);
      if (!result.ok) {
        if (!cancelled) setError(result.error ?? "Unknown error");
      }

      await sb.dispose();
    }

    run();
    return () => { cancelled = true; };
  }, [scripts]);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <h3>Preview</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <canvas ref={canvasRef} width={400} height={300} style={{ background: "#1a1a2e", borderRadius: 8, width: "100%" }} />
        {error && <div style={{ color: "#f66", marginTop: 8, fontSize: 13 }}>Error: {error}</div>}
        <div style={{ marginTop: 8, maxHeight: 120, overflowY: "auto", fontSize: 12, fontFamily: "monospace", color: "#aaa" }}>
          {log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
};
const modalStyle: React.CSSProperties = {
  background: "#12122a", borderRadius: 12, padding: 24, width: 480, maxHeight: "80vh", overflowY: "auto",
  border: "1px solid rgba(255,255,255,0.1)",
};
