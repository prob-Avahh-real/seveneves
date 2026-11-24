# SevenEves

Roblox 式沙盒游戏平台（client / server / editor，pnpm workspace）。

## 用途与 Target 判定

| 平台 | 需要? | 方式 |
|------|-------|------|
| 移动端 | 可选 | 当前为 Web/桌面平台；手机壳非本阶段强制 |
| 智能硬件 | 不适用 | 平台编辑器/服务器，非体感产品 |

## 命令

```bash
npm test
pnpm typecheck
pnpm build
```

## Harness / Loop（助手）

- Guide = 本文件；Sensor = `npm test` + `pnpm typecheck`
- 同类失误第二次 → 规则或测试（棘轮）

## 验证环 / Done

```bash
npm test
pnpm typecheck
```

**Done**：类型检查通过。手机 APK 不纳入当前里程碑。
