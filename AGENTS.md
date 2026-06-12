# 仿测一致性平台

Vue 3 + Vite 前端项目，纯 JavaScript。

## 命令

```bash
# 安装依赖
npm install

# 开发服务器
npm run dev

# 构建
npm run build

# 预览构建产物
npm run preview
```

## 项目结构

```
src/
├── main.js                    # 入口
├── App.vue                    # 根组件
├── router/index.js            # Vue Router
├── stores/dashboard.js        # Pinia store
├── data/mock.js               # Mock 数据
├── assets/main.css            # CSS Variables + 全局样式
├── views/
│   ├── HomeView.vue           # 首页看板
│   └── DomainDetailView.vue   # 领域详情页
└── components/
    ├── AppNav.vue             # 导航栏
    ├── KpiCard.vue / KpiRow.vue  # KPI 卡片
    ├── DomainCard.vue / DomainGrid.vue  # 领域卡片
    ├── LevelConsistency.vue   # 层级一致性
    ├── AlertBar.vue           # 预警条
    ├── BreadcrumbNav.vue      # 面包屑
    ├── HierarchyTree.vue      # 层级树
    └── TestResultTable.vue    # 测试结果表
```

## 依赖

- vue 3, vue-router 4, pinia
- lucide-vue-next (图标)
- vite, @vitejs/plugin-vue (构建)
