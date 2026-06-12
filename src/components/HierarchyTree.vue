<template>
  <div class="tree-panel">
    <div class="tree-title">层级结构</div>
    <div class="tree-node system">
      <Box :size="14" :stroke-width="2" />
      {{ rootLabel }}
    </div>
    <template v-for="node in tree" :key="node.id">
      <div
        class="tree-node child"
        :class="{ active: expandedIds.has(node.id) }"
        @click="toggleNode(node.id)"
      >
        <span class="expand-icon">
          <ChevronDown v-if="expandedIds.has(node.id)" :size="14" :stroke-width="2" />
          <ChevronRight v-else :size="14" :stroke-width="2" />
        </span>
        {{ node.label }}
      </div>
      <template v-if="expandedIds.has(node.id) && node.children">
        <div
          v-for="child in node.children"
          :key="child.id"
          class="tree-node grandchild"
          :class="{ active: selectedId === child.id }"
          @click="selectNode(child.id)"
        >
          <FolderOpen v-if="expandedIds.has(child.id)" :size="14" :stroke-width="2" />
          <FileText v-else :size="14" :stroke-width="2" />
          {{ child.label }}
        </div>
        <div
          v-for="child in node.children"
          :key="child.id + '-sub'"
        >
          <template v-if="expandedIds.has(child.id) && child.children">
            <div
              v-for="grandchild in child.children"
              :key="grandchild.id"
              class="tree-node grandchild deep"
              :class="{ active: selectedId === grandchild.id }"
              @click="selectNode(grandchild.id)"
            >
              <ChevronRight :size="12" :stroke-width="2" class="leaf-icon" />
              {{ grandchild.label }}
            </div>
          </template>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Box, ChevronRight, ChevronDown, FolderOpen, FileText } from 'lucide-vue-next'

const props = defineProps({
  rootLabel: String,
  tree: Array,
  selectedId: String
})

const emit = defineEmits(['select'])

const expandedIds = ref(new Set())

function toggleNode(id) {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  } else {
    expandedIds.value.add(id)
  }
  expandedIds.value = new Set(expandedIds.value)
}

function selectNode(id) {
  emit('select', id)
}

// Auto-expand parent of selected node
function expandParents() {
  for (const node of props.tree) {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === props.selectedId || child.children?.some(c => c.id === props.selectedId)) {
          expandedIds.value.add(node.id)
          expandedIds.value.add(child.id)
        }
      }
    }
  }
}
expandParents()
</script>

<style scoped>
.tree-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 16px;
  min-height: 200px;
}
.tree-title {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  margin-bottom: 12px;
}
.tree-node {
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}
.tree-node:hover {
  background: #F1F5F9;
}
.tree-node.active {
  background: var(--brand-light);
  color: var(--brand);
  font-weight: 500;
}
.tree-node.system {
  font-weight: 500;
  color: var(--text-primary);
}
.tree-node.child {
  padding-left: 28px;
}
.tree-node.grandchild {
  padding-left: 46px;
}
.tree-node.grandchild.deep {
  padding-left: 64px;
}
.expand-icon {
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.leaf-icon {
  flex-shrink: 0;
}
</style>
