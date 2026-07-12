import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PG_HOST ?? "localhost",
  port: Number(process.env.PG_PORT ?? 5432),
  user: process.env.PG_USER ?? "seveneves",
  password: process.env.PG_PASSWORD ?? "seveneves_dev",
  database: process.env.PG_DB ?? "seveneves",
});

/** Run migrations on startup. */
export async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT UNIQUE NOT NULL,
      username    TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS games (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id  UUID REFERENCES users(id),
      title       TEXT NOT NULL,
      description TEXT DEFAULT '',
      thumbnail   TEXT DEFAULT '',
      world_data  JSONB NOT NULL DEFAULT '{}',
      scripts     JSONB NOT NULL DEFAULT '{}',
      published   BOOLEAN DEFAULT false,
      plays       INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT now(),
      updated_at  TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS assets (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id    UUID REFERENCES users(id),
      game_id     UUID REFERENCES games(id) ON DELETE CASCADE,
      filename    TEXT NOT NULL,
      mime_type   TEXT NOT NULL,
      size_bytes  INT NOT NULL,
      path        TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT now()
    );
  `);
}
