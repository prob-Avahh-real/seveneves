import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { RegisterSchema, LoginSchema } from "../schemas.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "seveneves-dev-secret";

export async function authRoutes(app: FastifyInstance) {
  app.post("/api/auth/register", async (req, reply) => {
    const body = RegisterSchema.parse(req.body);
    const hash = await bcrypt.hash(body.password, 10);
    const {
      rows: [user],
    } = await pool.query(
      `INSERT INTO users (email, username, password) VALUES ($1,$2,$3)
       RETURNING id, email, username`,
      [body.email, body.username, hash]
    );
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    return { user, token };
  });

  app.post("/api/auth/login", async (req, reply) => {
    const body = LoginSchema.parse(req.body);
    const {
      rows: [user],
    } = await pool.query(`SELECT * FROM users WHERE email = $1`, [body.email]);
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    return { user: { id: user.id, email: user.email, username: user.username }, token };
  });

  app.get("/api/auth/me", async (req, reply) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return reply.status(401).send({ error: "No token" });
    try {
      const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { sub: string };
      const {
        rows: [user],
      } = await pool.query(`SELECT id, email, username FROM users WHERE id = $1`, [payload.sub]);
      return user ?? reply.status(404).send({ error: "User not found" });
    } catch {
      return reply.status(401).send({ error: "Invalid token" });
    }
  });
}
