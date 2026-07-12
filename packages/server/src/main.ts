import Fastify from "fastify";
import cors from "@fastify/cors";
import { migrate } from "./db.js";
import { authRoutes } from "./routes/auth.js";
import { gameRoutes } from "./routes/games.js";

const app = Fastify({ logger: true });

async function start() {
  await app.register(cors, { origin: true });
  await migrate();

  await app.register(authRoutes);
  await app.register(gameRoutes);

  app.get("/api/health", () => ({ ok: true, ts: Date.now() }));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`SevenEves server → http://localhost:${port}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
