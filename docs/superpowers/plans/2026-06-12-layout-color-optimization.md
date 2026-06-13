# 首页布局自适应与配色优化 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 首页 5 个领域卡片改为每行一张（横向布局），大屏自适应减少左右留白，整体配色变浅变柔和。

**Architecture:** 纯 CSS 修改，不改动 Vue 组件逻辑。涉及 HomeView（Hero + 卡片）、DomainDetailView（max-width）、AppNav（导航栏文字色）三个文件的样式调整。

**Tech Stack:** Vue 3 + Vite + CSS（scoped styles）

---

### Task 1: 修改 AppNav 导航栏文字颜色

**Files:**
- Modify: `src/components/AppNav.vue:45-53`

**背景:** Hero 区域从深色渐变改为浅色后，导航栏初始态白色文字不可见，需要改为深色。

- [ ] **Step 1: 修改导航栏默认文字颜色为深色**

将 `.nav-brand` 默认 `color` 从 `white` 改为 `var(--text-primary)`，将 `.icon` 默认背景和文字色从白色半透改为深色主题风格。

修改 `src/components/AppNav.vue` 的 `<style scoped>` 部分：

```css
/* 修改前 (行 45-53) */
.nav-brand {
  color: white;
}
.icon {
  background: rgba(255,255,255,0.2);
  color: white;
}

/* 修改后 */
.nav-brand {
  color: var(--text-primary);
}
.icon {
  background: var(--brand-light);
  color: var(--brand);
}
```

同时 `.nav.scrolled .nav-brand` 的 `color: var(--text-primary)` 保持不变（已经正确）。`.nav.scrolled .icon` 的 `background: var(--brand); color: white;` 也保持不变。

- [ ] **Step 2: 验证并提交**

```bash
git add src/components/AppNav.vue
git commit -m "style: 导航栏默认文字色适配浅色 Hero 背景"
```

---

### Task 2: 修改 Hero 区域配色与宽度

**Files:**
- Modify: `src/views/HomeView.vue:179-269`

**背景:** Hero 从深蓝紫渐变改为浅色渐变，KPI 卡片从半透白毛玻璃改为纯白卡片，max-width 加宽。

- [ ] **Step 1: 修改 Hero 背景色**

将 `.hero-bg` 的 `background` 从深色渐变改为浅色渐变：

```css
/* 修改前 (行 185-188) */
.hero-bg {
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 40%, #7C3AED 100%);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
}

/* 修改后 */
.hero-bg {
  background: linear-gradient(135deg, #EFF4FB 0%, #F0F4FF 50%, #F8FAFC 100%);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
}
```

- [ ] **Step 2: 修改 Hero 文字颜色**

```css
/* 修改前 (行 203-204) */
.hero-content {
  color: white;
}

/* 修改后 */
.hero-content {
  color: var(--text-primary);
}
```

同时修改 `.hero-desc` 的 `opacity` 从 `0.7` 到 `0.6`（深色文字下调低透明度效果更好）。

- [ ] **Step 3: 修改 Hero KPI 卡片样式**

将 `.hero-kpi` 从半透白毛玻璃改为纯白卡片：

```css
/* 修改前 (行 253-266) */
.hero-kpi {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
}
.hero-kpi:hover {
  transform: scale(1.03);
  background: rgba(255,255,255,0.16);
}
.hero-kpi.primary {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.25);
}

/* 修改后 */
.hero-kpi {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  box-shadow: var(--shadow-sm);
}
.hero-kpi:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-md);
  border-color: #CBD5E1;
}
.hero-kpi.primary {
  background: linear-gradient(135deg, #2563EB, #1d4ed8);
  border: none;
  color: white;
}
```

同时修改 danger 色值适配浅色背景：

```css
/* 修改前 (行 304-305) */
.hero-kpi-num.danger { color: #FCA5A5; }
.hero-kpi-num.success { color: #6EE7B7; }

/* 修改后 */
.hero-kpi-num.danger { color: var(--danger); }
.hero-kpi-num.success { color: var(--success); }
```

- [ ] **Step 4: 加宽 Hero KPIs max-width**

```css
/* 修改前 (行 249) */
.hero-kpis {
  max-width: 1100px;
}

/* 修改后 */
.hero-kpis {
  max-width: 1400px;
}
```

- [ ] **Step 5: 验证并提交**

```bash
git add src/views/HomeView.vue
git commit -m "style: Hero 区域配色变浅、KPI 卡片改为白色、max-width 加宽"
```

---

### Task 3: 修改卡片布局 — 单列横向卡片

**Files:**
- Modify: `src/views/HomeView.vue:331-569`

**背景:** 卡片从 3 列网格改为单列，卡片内部从纵向改为横向 flex 布局，左侧色条从顶部改为左边框。

- [ ] **Step 1: 修改网格为单列并加宽内容区**

```css
/* 修改前 (行 309-314, 331-335) */
.content {
  max-width: 1280px;
}
.domain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

/* 修改后 */
.content {
  max-width: 1600px;
}
.domain-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
```

- [ ] **Step 2: 修改卡片为横向 flex 布局**

替换 `.domain-card` 样式：

```css
/* 修改后 — 完整替换 */
.domain-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 4px solid transparent;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: card-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

删除 `.blt`, `.highspeed`, `.thermal`, `.power`, `.pi` 中各自的背景渐变（改为白色默认即可）。改为通过 `border-left-color` 区分：

```css
.blt { border-left-color: #2563EB; }
.highspeed { border-left-color: #7C3AED; }
.thermal { border-left-color: #059669; }
.power { border-left-color: #F59E0B; }
.pi { border-left-color: #EC4899; }
```

warning 卡片也改为左边框：

```css
.domain-card.warning {
  border-left-color: #F59E0B;
  border-color: #FDE68A;
  border-left-color: #F59E0B;
  background: #FFFDF5;
}
```

hover 保持上浮效果：

```css
.domain-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 8px 24px rgba(0,0,0,0.06),
    0 2px 6px rgba(0,0,0,0.04);
  border-color: #CBD5E1;
}
.domain-card:active { transform: translateY(0) scale(0.998); }
```

- [ ] **Step 3: 替换 dc-accent / dc-highlight — 删除顶部色条相关样式**

删除以下 CSS 选择器：
- `.dc-accent`（行 373-379）
- `.dc-highlight`（行 380-386）
- `.blt .dc-accent`, `.highspeed .dc-accent` 等（行 387-391）
- `.domain-card:hover .dc-accent`（行 370-372）

- [ ] **Step 4: 修改 dc-top 为 flex 行内元素**

```css
/* 修改后 */
.dc-top {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  width: 200px;
  padding-top: 0;
  margin-bottom: 0;
}
```

- [ ] **Step 5: 修改一致性数值区域为独立列**

```css
.dc-consistency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  flex-shrink: 0;
  width: 80px;
  text-align: right;
  margin-bottom: 0;
  letter-spacing: -1px;
}
.dc-consistency small {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.5;
  margin-left: 1px;
}
```

- [ ] **Step 6: 修改指标区域为水平排列**

```css
.dc-metrics {
  display: flex;
  gap: 16px;
  margin-bottom: 0;
  flex-shrink: 0;
}
.dc-metric {
  background: none;
  border-radius: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.dc-metric-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 0;
}
.dc-metric-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
}
```

- [ ] **Step 7: 修改四级一致性为水平排列**

```css
.dc-levels {
  display: flex;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
  padding-top: 0;
  border-top: none;
}
.dc-lv {
  flex: 0 0 auto;
  text-align: center;
  padding: 2px 6px;
}
```

- [ ] **Step 8: 更新响应式断点**

```css
@media (max-width: 1024px) {
  .hero { padding: 40px 20px 32px; }
  .hero-title { font-size: 30px; }
  .hero-kpis { grid-template-columns: 1fr 1fr; }
  .hero-kpi.primary { grid-column: 1/-1; }
  .domain-card {
    flex-wrap: wrap;
    gap: 12px;
  }
  .dc-top { width: 100%; }
  .dc-levels {
    width: 100%;
    justify-content: flex-start;
  }
  .content { padding: 24px 20px 32px; }
}

@media (max-width: 640px) {
  .domain-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .dc-consistency { text-align: left; width: auto; }
  .dc-levels { flex-wrap: wrap; }
}
```

- [ ] **Step 9: 验证并提交**

```bash
git add src/views/HomeView.vue
git commit -m "style: 卡片改为单列横向布局，去除彩色渐变背景"
```

---

### Task 4: 修改详情页与 KPI 行宽度

**Files:**
- Modify: `src/views/DomainDetailView.vue:99`
- Modify: `src/components/KpiRow.vue:8-12`

- [ ] **Step 1: 加宽详情页 max-width**

修改 `src/views/DomainDetailView.vue`：

```css
/* 修改前 (行 99) */
.main {
  max-width: 1280px;
}

/* 修改后 */
.main {
  max-width: 1600px;
}
```

- [ ] **Step 2: 加宽 KpiRow 响应式处理（可选）**

KpiRow 本身没有 max-width 限制（由父容器控制），无需修改。确认 `KpiRow.vue` 不需要改动。

- [ ] **Step 3: 验证并提交**

```bash
git add src/views/DomainDetailView.vue
git commit -m "style: 详情页内容区 max-width 加宽到 1600px"
```

---

### Task 5: 最终验证

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 视觉检查清单**

1. 打开首页，确认 Hero 区域为浅蓝灰渐变背景
2. 确认导航栏文字可见（深色）
3. 确认 5 张卡片每行一张，横向排列
4. 确认卡片左侧有对应颜色的 4px 竖条
5. 确认卡片 hover 时上浮效果正常
6. 点击卡片进入详情页，确认内容区更宽
7. 缩放浏览器到 1024px 以下，确认卡片响应式换行

- [ ] **Step 3: 提交最终确认**

```bash
git add -A
git commit -m "style: 布局自适应与配色优化完成"
```
