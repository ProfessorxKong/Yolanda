# WisLand

Vite + React + TypeScript 项目模板。

## 已集成

- Redux Toolkit + Thunks 管理状态与请求
- 别名 `@ -> src/`
- SVGR + SVGO：以 React 组件方式使用 `svg`
- ESLint + Prettier + Husky + lint-staged

## 常用命令

```bash
npm run dev           # 本地开发
npm run build         # 构建
npm run lint          # ESLint 检查
npm run format        # Prettier 格式化
```

## 目录结构

```
src/
  constants/           # 常量
  hooks/               # 自定义 hooks（含 typed redux hooks）
  services/            # API 请求
    api/
  store/               # Redux store / slices / thunks
    slices/
    thunks/
  types/               # 类型声明（如 svg.d.ts）
```
