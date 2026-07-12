import type { GameAPI } from "./types.js";

/**
 * Build the default game API injected into every Lua sandbox.
 * The actual state (entities, input) lives in the game engine;
 * these stubs are replaced at runtime with bound closures.
 */
export function createDefaultAPI(): GameAPI {
  const entities = new Map<number, { type: string; x: number; y: number }>();
  let nextId = 1;

  return {
    log: (...args) => console.log("[Lua]", ...args),

    getTime: () => performance.now() / 1000,

    spawn: (type, x, y) => {
      const id = nextId++;
      entities.set(id, { type, x, y });
      return id;
    },

    destroy: (id) => {
      entities.delete(id);
    },

    setPosition: (id, x, y) => {
      const e = entities.get(id);
      if (e) {
        e.x = x;
        e.y = y;
      }
    },

    getPosition: (id) => {
      const e = entities.get(id);
      return e ? { x: e.x, y: e.y } : null;
    },

    input: {
      isKeyDown: () => false,
      getMouse: () => ({ x: 0, y: 0, down: false }),
    },
  };
}
