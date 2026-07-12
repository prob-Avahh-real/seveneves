# SevenEves — Architecture

> Roblox-like sandbox game platform. Web-first MVP. Lua scripting, 2D → 3D path.

## Principles
- **MVP-first**: ship 2D block world + Lua scripting before anything else
- **Elastic scaling**: monorepo → service split when needed; local FS → S3 when needed
- **No over-engineering**: one database, one cache, one queue. Add services only under measured load
- **Play anywhere**: Web (desktop for creation), PWA (mobile for consumption)

## Tech Stack (MVP)

| Layer | Choice | Why |
|-------|--------|-----|
| Client render | Phaser 3 (2D) | Fastest 2D game framework, tilemap native |
| Client UI | React 18 + Vite | Dev UX, HMR, ecosystem |
| Lua runtime | Wasmoon (Lua 5.4 → WASM) | Browser sandbox, no server trust issue |
| API server | Fastify + TypeScript | Fast, typed, plugin system |
| Real-time | Socket.IO | Rooms, fallback, battle-tested |
| Database | PostgreSQL 16 | JSONB for game state, relational for users |
| Cache / PubSub | Redis 7 | Session, presence, real-time broadcast |
| Monorepo | pnpm workspaces | Fast, strict, disk-efficient |
| Container | Docker Compose | Local dev, CI parity |

## Package Layout

```
seveneves/
├── packages/
│   ├── runtime/     # @seveneves/runtime   — Lua sandbox engine
│   ├── server/      # @seveneves/server    — API + WebSocket + DB
│   ├── client/      # @seveneves/client    — React shell + Phaser game loop
│   └── editor/      # @seveneves/editor    — World editor + code editor
├── docker-compose.yml
├── package.json
├── tsconfig.base.json
└── pnpm-workspace.yaml
```

## Data Flow

```
[Browser]
  ├── React Shell (lobby, game list, auth)
  ├── Phaser Canvas (game render)
  ├── Monaco Editor (Lua IDE)
  └── Wasmoon (Lua sandbox)
        │
        ▼
[Fastify Server]◄────[PostgreSQL]
  ├── REST: /api/auth, /api/games, /api/assets
  └── Socket.IO: game state sync, chat, presence
        │
        ▼
[Redis] (session, pubsub, rate-limit)
```

## Game Lifecycle

```
1. Creator builds world in Editor → saves as JSON + Lua scripts
2. World published → stored in PostgreSQL (JSONB) + Asset FS
3. Player clicks "Play" → client downloads world JSON + scripts
4. Wasmoon executes Lua game logic locally (single-player MVP)
5. Multiplayer later: authoritative server runs Lua, clients sync via Socket.IO
```

## MVP Scope

- [ ] Auth (email + OAuth)
- [ ] Game listing + launch
- [ ] 2D tilemap world (Phaser)
- [ ] Lua scripting for game logic (Wasmoon)
- [ ] Simple editor: place blocks, write Lua, test-run
- [ ] Asset upload (sprites, sounds)
- [ ] Save/load game state

## Scaling Path (Post-MVP)

| When | What changes |
|------|-------------|
| >100 CCU | Split Socket.IO to dedicated service |
| >1k games | Asset storage → S3-compatible (MinIO → AWS) |
| >10k users | Read replicas for game listing |
| 3D demand | Add Three.js renderer behind feature flag |
| Mobile native | React Native shell reusing Phaser canvas |
| Multiplayer | Move Lua execution to server, client becomes thin renderer |
