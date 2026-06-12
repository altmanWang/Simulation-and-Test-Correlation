<template>
  <div class="main">
    <!-- Domain Header -->
    <div v-if="detail" class="domain-header" :class="'dh-' + detail.id">
      <div class="dh-accent"></div>
      <BreadcrumbNav :name="detail.name" dark />
      <div class="dh-body">
        <div class="dh-info">
          <div class="dh-icon-box">
            <component :is="domainIcon" :size="22" :stroke-width="2" />
          </div>
          <div>
            <h1 class="dh-title">{{ detail.name }}</h1>
            <div class="dh-meta">
              {{ detail.totalItems }} 个测试项 · {{ detail.deviationItems }} 个偏差项
              <span class="dh-badge" :class="detail.consistency >= 93 ? 'pass' : 'alert'">
                {{ detail.consistency >= 93 ? '达标' : '⚠ 关注' }}
              </span>
            </div>
          </div>
        </div>
        <div class="dh-kpis">
          <div class="dh-kpi primary">
            <div class="dh-kpi-val">
              {{ detail.consistency.toFixed(1) }}<small>%</small>
            </div>
            <div class="dh-kpi-label">仿测一致性</div>
          </div>
          <div class="dh-kpi">
            <div class="dh-kpi-val">{{ detail.totalItems }}</div>
            <div class="dh-kpi-label">测试项</div>
          </div>
          <div class="dh-kpi">
            <div class="dh-kpi-val danger">{{ detail.deviationItems }}</div>
            <div class="dh-kpi-label">偏差项</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="detail" class="tree-table-wrapper">
      <HierarchyTree
        :root-label="detail.name"
        :tree="detail.tree"
        :selected-id="selectedNodeId"
        @select="selectNode"
      />
      <TestResultTable
        :title="tableTitle"
        :records="currentRecords"
      />
    </div>

    <div v-else class="empty">
      未找到该领域数据
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Layers, Zap, Thermometer, BatteryFull, Activity } from 'lucide-vue-next'
import { useDashboardStore } from '../stores/dashboard'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import HierarchyTree from '../components/HierarchyTree.vue'
import TestResultTable from '../components/TestResultTable.vue'

const props = defineProps({
  id: String
})

const store = useDashboardStore()
const detail = computed(() => store.getDomainDetail(props.id))

const iconMap = { blt: Layers, highspeed: Zap, thermal: Thermometer, power: BatteryFull, pi: Activity }
const colorMap = { blt: '#2563EB', highspeed: '#7C3AED', thermal: '#059669', power: '#B45309', pi: '#EC4899' }

const domainIcon = computed(() => iconMap[props.id] || Layers)
const domainColor = computed(() => colorMap[props.id] || '#2563EB')

const defaultNodeId = computed(() => {
  if (!detail.value) return ''
  for (const node of detail.value.tree) {
    if (node.children && node.children.length > 0) {
      return node.children[0].id
    }
  }
  return detail.value.tree[0]?.id || ''
})

const selectedNodeId = ref(defaultNodeId.value)

function selectNode(id) {
  selectedNodeId.value = id
}

function findNodeLabel(id) {
  if (!detail.value) return ''
  for (const node of detail.value.tree) {
    if (node.id === id) return node.label
    if (node.children) {
      for (const child of node.children) {
        if (child.id === id) return child.label
        if (child.children) {
          for (const grandchild of child.children) {
            if (grandchild.id === id) return grandchild.label
          }
        }
      }
    }
  }
  return ''
}

const currentRecords = computed(() => {
  if (!detail.value) return []
  return detail.value.records[selectedNodeId.value] || []
})

const tableTitle = computed(() => {
  if (!detail.value) return ''
  const nodeLabel = findNodeLabel(selectedNodeId.value)
  return `${detail.value.name} / ${nodeLabel}`
})
</script>

<style scoped>
.main {
  max-width: 1600px;
  margin: 0 auto;
  padding: 76px 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ======= DOMAIN HEADER ======= */
.domain-header {
  position: relative;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 45%, #7C3AED 100%);
  border: none;
  border-radius: 16px;
  overflow: hidden;
  padding: 28px 32px 32px;
  color: white;
}
.domain-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}
.dh-accent {
  display: none;
}

.dh-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}
.dh-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dh-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255,255,255,0.18);
  color: white;
}

.dh-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}
.dh-meta {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  gap: 10px;
}
.dh-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 100px;
  font-weight: 500;
}
.dh-badge.pass { background: rgba(52,211,153,0.25); color: #6EE7B7; }
.dh-badge.alert { background: rgba(252,165,165,0.25); color: #FCA5A5; }

.dh-kpis {
  display: flex;
  gap: 0;
  flex-shrink: 0;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
}
.dh-kpi {
  text-align: center;
  padding: 14px 28px;
  border-left: 1px solid rgba(255,255,255,0.12);
}
.dh-kpi:first-child {
  border-left: none;
}
.dh-kpi.primary {
  min-width: 150px;
}
.dh-kpi-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  color: white;
}
.dh-kpi-val small {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.5;
  margin-left: 2px;
}
.dh-kpi-val.danger { color: #FCA5A5; }
.dh-kpi-label {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  margin-top: 4px;
  font-weight: 500;
}

.tree-table-wrapper {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
}
.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
  font-size: 16px;
}

@media (max-width: 1024px) {
  .dh-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .dh-kpis {
    width: 100%;
    justify-content: stretch;
  }
  .dh-kpi {
    flex: 1;
    padding: 12px 16px;
  }
  .tree-table-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
