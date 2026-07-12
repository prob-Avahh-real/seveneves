import { useRef, useEffect, useCallback, useState } from "react";

const GRID = 32; // pixels per tile
const COLS = 25;
const ROWS = 18;

interface WorldCanvasProps {
  selectedTile: number;
}

export function WorldCanvas({ selectedTile }: WorldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<number[]>(() => new Array(COLS * ROWS).fill(0));

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const tile = grid[y * COLS + x];
        switch (tile) {
          case 0: break;
          case 1: ctx.fillStyle = "#4a4a6a"; ctx.fillRect(x * GRID, y * GRID, GRID, GRID); break;
          case 2: ctx.fillStyle = "#2a2a4a"; ctx.fillRect(x * GRID, y * GRID, GRID, GRID); break;
          case 3: ctx.fillStyle = "#a78bfa"; ctx.fillRect(x * GRID + 4, y * GRID + 4, GRID - 8, GRID - 8); break;
          case 4: ctx.fillStyle = "#f0a"; ctx.fillRect(x * GRID + 4, y * GRID + 4, GRID - 8, GRID - 8); break;
        }
      }
    }

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * GRID, 0); ctx.lineTo(x * GRID, ROWS * GRID); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * GRID); ctx.lineTo(COLS * GRID, y * GRID); ctx.stroke(); }
  }, [grid]);

  useEffect(() => { draw(); }, [draw]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / GRID);
      const y = Math.floor((e.clientY - rect.top) / GRID);
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return;
      setGrid((g) => {
        const next = [...g];
        next[y * COLS + x] = selectedTile;
        return next;
      });
    },
    [selectedTile]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.buttons !== 1) return; // left button held
      handleClick(e);
    },
    [handleClick]
  );

  return (
    <canvas
      ref={canvasRef}
      width={COLS * GRID}
      height={ROWS * GRID}
      style={{ cursor: "crosshair", display: "block", margin: "0 auto" }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    />
  );
}
