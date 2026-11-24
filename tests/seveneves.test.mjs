import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import module from "node:module";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadRuntimeApi() {
  const apiPath = path.join(ROOT, "packages/runtime/src/api.ts");
  const stripped = module.stripTypeScriptTypes(fs.readFileSync(apiPath, "utf8"), { mode: "strip" });
  const cjs = stripped.replace(/export\s+function\s+createDefaultAPI/, "function createDefaultAPI");
  const mod = { exports: {} };
  new vm.Script(
    `(function(exports) {\n${cjs}\nexports.createDefaultAPI = createDefaultAPI;\n})`,
    { filename: apiPath }
  ).runInThisContext()(mod.exports);
  return mod.exports;
}

test("@seveneves/runtime createDefaultAPI manages entity lifecycle, coordinates, and input stubs", () => {
  const { createDefaultAPI } = loadRuntimeApi();
  const api = createDefaultAPI();

  const player = api.spawn("player", 10, 25);
  const crate = api.spawn("crate", -4, 8);
  assert.equal(player, 1);
  assert.equal(crate, 2);
  assert.deepEqual(api.getPosition(player), { x: 10, y: 25 });

  api.setPosition(player, 42, 99);
  assert.deepEqual(api.getPosition(player), { x: 42, y: 99 });

  api.destroy(player);
  assert.equal(api.getPosition(player), null);
  assert.deepEqual(api.getPosition(crate), { x: -4, y: 8 });

  assert.equal(typeof api.getTime(), "number");
  assert.equal(api.input.isKeyDown("Space"), false);
  assert.deepEqual(api.input.getMouse(), { x: 0, y: 0, down: false });
});

test("pnpm workspace topology covers runtime, server, client, and editor packages", () => {
  const wsYaml = fs.readFileSync(path.join(ROOT, "pnpm-workspace.yaml"), "utf8");
  assert.match(wsYaml, /packages\/\*/);

  const expected = ["@seveneves/runtime", "@seveneves/server", "@seveneves/client", "@seveneves/editor"];
  const found = ["runtime", "server", "client", "editor"].map((dir) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "packages", dir, "package.json"), "utf8"));
    return pkg.name;
  });
  assert.deepEqual(found, expected);
});

test("server Zod schemas, routes, and Wasmoon sandbox enforce protocol contracts", () => {
  const schemasTs = fs.readFileSync(path.join(ROOT, "packages/server/src/schemas.ts"), "utf8");
  for (const schemaName of ["RegisterSchema", "LoginSchema", "CreateGameSchema", "SaveGameSchema"]) {
    assert.ok(schemasTs.includes(`export const ${schemaName}`), `missing ${schemaName}`);
  }
  assert.match(schemasTs, /password:\s*z\.string\(\)\.min\(8\)/);
  assert.match(schemasTs, /worldData:\s*z\.record/);
  assert.match(schemasTs, /scripts:\s*z\.record\(z\.string\(\)\)/);

  const mainTs = fs.readFileSync(path.join(ROOT, "packages/server/src/main.ts"), "utf8");
  assert.match(mainTs, /\/api\/health/);
  assert.match(mainTs, /authRoutes/);
  assert.match(mainTs, /gameRoutes/);

  const sandboxTs = fs.readFileSync(path.join(ROOT, "packages/runtime/src/sandbox.ts"), "utf8");
  assert.match(sandboxTs, /functionTimeout:\s*this\.config\.timeoutMs/);
  assert.match(sandboxTs, /sandbox killed/);
});
