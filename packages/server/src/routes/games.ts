import type { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { CreateGameSchema, SaveGameSchema } from "../schemas.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "seveneves-dev-secret";

function getUserId(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const auth = req.headers["authorization"];
  if (typeof auth !== "string" || !auth.startsWith("Bearer ")) return null;
  try {
    const p = jwt.verify(auth.slice(7), JWT_SECRET) as { sub: string };
    return p.sub;
  } catch {
    return null;
  }
}

export async function gameRoutes(app: FastifyInstance) {
  /** List published games. */
  app.get("/api/games", async () => {
    const { rows } = await pool.query(
      `SELECT id, creator_id, title, description, thumbnail, plays, created_at
       FROM games WHERE published = true ORDER BY plays DESC LIMIT 50`
    );
    return rows;
  });

  /** Get single game with world data. */
  app.get("/api/games/:id", async (req, reply) => {
    const {
      rows: [game],
    } = await pool.query(`SELECT * FROM games WHERE id = $1`, [req.params["id"]]);
    return game ?? reply.status(404).send({ error: "Game not found" });
  });

  /** Create game (auth required). */
  app.post("/api/games", async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });
    const body = CreateGameSchema.parse(req.body);
    const {
      rows: [game],
    } = await pool.query(
      `INSERT INTO games (creator_id, title, description) VALUES ($1,$2,$3) RETURNING *`,
      [userId, body.title, body.description]
    );
    return game;
  });

  /** Save world + scripts (auth, owner only). */
  app.put("/api/games/:id", async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });
    const {
      rows: [game],
    } = await pool.query(`SELECT creator_id FROM games WHERE id = $1`, [req.params["id"]]);
    if (!game) return reply.status(404).send({ error: "Not found" });
    if (game.creator_id !== userId) return reply.status(403).send({ error: "Forbidden" });

    const body = SaveGameSchema.parse(req.body);
    await pool.query(
      `UPDATE games SET world_data = $1, scripts = $2, updated_at = now() WHERE id = $3`,
      [JSON.stringify(body.worldData), JSON.stringify(body.scripts), req.params["id"]]
    );
    return { ok: true };
  });

  /** Publish game. */
  app.post("/api/games/:id/publish", async (req, reply) => {
    const userId = getUserId(req);
    if (!userId) return reply.status(401).send({ error: "Unauthorized" });
    const { rowCount } = await pool.query(
      `UPDATE games SET published = true WHERE id = $1 AND creator_id = $2`,
      [req.params["id"], userId]
    );
    if (rowCount === 0) return reply.status(404).send({ error: "Not found or not owner" });
    return { ok: true };
  });
}
