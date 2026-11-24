# SevenEves

受 Roblox 启发的 Web 优先 2D 沙盒创作与游玩平台（pnpm Monorepo）。创作者可在可视化编辑器中搭建方块世界、编写受限沙箱内的 Lua 游戏脚本并发布；玩家可在浏览器中加载世界存档并运行实时交互逻辑。

## 架构与工作区包结构

| 包名 | 路径 | 职责 |
|------|------|------|
| `@seveneves/runtime` | `packages/runtime` | 基于 Wasmoon（Lua 5.4 WASM）的超时受限脚本沙箱与默认实体/输入 `GameAPI` |
| `@seveneves/server` | `packages/server` | Fastify + TypeScript + Zod 校验服务端，提供认证、游戏存档 API、PostgreSQL 与 Redis 接入 |
| `@seveneves/client` | `packages/client` | React 18 + Vite 大厅壳与 Phaser 3 游戏运行画布 |
| `@seveneves/editor` | `packages/editor` | 世界地图画布 (`WorldCanvas`)、工具栏与内置 Lua 脚本编辑器 (`LuaEditor`) |

详细架构决策与扩展路线见 [`ARCHITECTURE.md`](./ARCHITECTURE.md)。

## 快速开始

### 环境要求
- Node.js >= 20
- pnpm >= 9
- Docker Compose（本地启动 PostgreSQL 16 与 Redis 7 时使用）

### 常用命令

```bash
# 运行运行时 API、工作区拓扑与服务端契约测试
npm test

# 启动本地数据库与缓存（可选）
pnpm db:up

# 安装依赖并启动全栈开发环境
pnpm install
pnpm dev

# 全量类型检查与构建
pnpm typecheck
pnpm build
```
