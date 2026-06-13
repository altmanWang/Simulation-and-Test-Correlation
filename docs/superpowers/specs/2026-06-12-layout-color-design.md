# 首页布局自适应与配色优化设计

**日期**: 2026-06-12
**状态**: 已确认

## 目标

1. 首页 5 个领域卡片改为每行一张（横向布局），大屏自适应减少左右留白
2. 整体配色变浅变柔和

## 布局修改

### 内容区宽度

| 位置 | 当前 | 改为 |
|------|------|------|
| Hero KPIs | `max-width: 1100px` | `max-width: 1400px` |
| 内容区 `.content` | `max-width: 1280px` | `max-width: 1600px` |
| 详情页 `.main` | `max-width: 1280px` | `max-width: 1600px` |

### 卡片布局

- `.domain-grid`: `grid-template-columns: repeat(3, 1fr)` → `grid-template-columns: 1fr`（单列）
- 卡片内部从纵向改为横向 flex 排列：图标+名称 | 一致性数值 | 测试项/偏差项 | 四级一致性
- 左侧色条从顶部 4px 改为左边框 4px 竖线

### 响应式

- `≤1024px`: 卡片内部换行为两行
- `≤640px`: 卡片完全纵向堆叠

## 配色修改

| 元素 | 当前 | 改为 |
|------|------|------|
| Hero 背景 | 深蓝紫渐变 | 浅蓝灰渐变 `#EFF4FB → #F0F4FF → #F8FAFC` |
| Hero 文字 | 白色 | 深色 `#0F172A` |
| Hero KPI 卡片 | 半透白毛玻璃 | 纯白卡片 + 浅阴影 |
| 导航栏初始态 | 白色文字 | 深色文字 |
| 卡片背景 | 彩色淡渐变 | 统一白色，去掉彩色渐变 |
| 卡片色条 | 顶部 4px | 左侧 4px 竖条（保持领域色） |

## 涉及文件

- `src/views/HomeView.vue` — 首页卡片布局 + Hero 配色
- `src/views/DomainDetailView.vue` — 详情页 max-width
- `src/components/AppNav.vue` — 导航栏文字颜色适配
- `src/components/KpiRow.vue` — KPI 行宽度（可选）
