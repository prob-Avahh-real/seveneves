/** Lua execution limits per script run. */
export interface SandboxConfig {
  /** Max Lua instructions before hard kill. */
  instructionLimit: number;
  /** Max memory (bytes). */
  memoryLimit: number;
  /** Max execution time (ms). */
  timeoutMs: number;
  /** API functions injected into Lua global scope. */
  api?: Record<string, Record<string, (...args: unknown[]) => unknown>>;
}

export interface SandboxResult {
  ok: boolean;
  value?: unknown;
  error?: string;
  killed: boolean; // true if terminated by limit
}

/** Shape of the default game API injected into Lua. */
export interface GameAPI {
  log: (...args: unknown[]) => void;
  getTime: () => number;
  spawn: (type: string, x: number, y: number) => number;
  destroy: (id: number) => void;
  setPosition: (id: number, x: number, y: number) => void;
  getPosition: (id: number) => { x: number; y: number } | null;
  input: {
    isKeyDown: (key: string) => boolean;
    getMouse: () => { x: number; y: number; down: boolean };
  };
}
