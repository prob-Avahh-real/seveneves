import { LuaEngine, LuaFactory } from "wasmoon";
import type { SandboxConfig, SandboxResult } from "./types.js";

/**
 * Wasmoon-backed Lua sandbox.
 *
 * Usage:
 *   const sb = await Sandbox.create({ instructionLimit: 1e6, memoryLimit: 16*1024*1024, timeoutMs: 5000 });
 *   const result = await sb.run("return 1 + 1");
 */
export class Sandbox {
  private engine!: LuaEngine;
  private factory: LuaFactory;
  private config: SandboxConfig;
  private killed = false;

  private constructor(factory: LuaFactory, config: SandboxConfig) {
    this.factory = factory;
    this.config = config;
  }

  static async create(config: SandboxConfig): Promise<Sandbox> {
    const factory = new LuaFactory();
    const sb = new Sandbox(factory, config);
    await sb.reset();
    return sb;
  }

  /** Reset the Lua state (fresh global scope). */
  async reset(): Promise<void> {
    this.engine = await this.factory.createEngine({
      functionTimeout: this.config.timeoutMs,
    });
    this.killed = false;

    // Inject API namespaces into Lua global scope
    if (this.config.api) {
      for (const [namespace, fns] of Object.entries(this.config.api)) {
        this.engine.global.set(namespace, fns);
      }
    }
  }

  async run(code: string): Promise<SandboxResult> {
    if (this.killed) {
      return { ok: false, error: "sandbox killed", killed: true };
    }

    try {
      const value = await this.engine.doString(code);
      return { ok: true, value, killed: false };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const killed = msg.toLowerCase().includes("timeout");
      if (killed) this.killed = true;
      return { ok: false, error: msg, killed };
    }
  }

  /** Clean up WASM memory. */
  async dispose(): Promise<void> {
    // wasmoon engine GC handled by JS GC
  }
}
