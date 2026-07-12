import { useEffect, useRef } from "react";
import Phaser from "phaser";

/** Minimal Phaser boot scene — MVP renders a colored canvas with text. */
class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "Boot" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#1a1a2e");
    this.add
      .text(400, 300, "SevenEves\nGame Running", {
        fontSize: "32px",
        color: "#a78bfa",
        align: "center",
        fontFamily: "sans-serif",
      })
      .setOrigin(0.5);
  }
}

export function GamePlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      backgroundColor: "#1a1a2e",
      scene: [BootScene],
    });
    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Playing...</h2>
      <div ref={containerRef} style={{ borderRadius: 12, overflow: "hidden", display: "inline-block" }} />
    </div>
  );
}
