<template>
  <div class="main">
    <BreadcrumbNav :name="detail?.name || ''" />

    <KpiRow v-if="detail">
      <KpiCard
        :label="detail.name + '一致性'"
        :value="detail.consistency.toFixed(1) + '%'"
        :primary="true"
      />
      <KpiCard label="测试项" :value="detail.totalItems" />
      <KpiCard label="偏差项" :value="detail.deviationItems" value-color="var(--danger)" />
    </KpiRow>

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
import { useDashboardStore } from '../stores/dashboard'
import KpiRow from '../components/KpiRow.vue'
import KpiCard from '../components/KpiCard.vue'
import BreadcrumbNav from '../components/BreadcrumbNav.vue'
import HierarchyTree from '../components/HierarchyTree.vue'
import TestResultTable from '../components/TestResultTable.vue'

const props = defineProps({
  id: String
})

const store = useDashboardStore()
const detail = computed(() => store.getDomainDetail(props.id))

// Default to first component-level node
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
  .tree-table-wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
