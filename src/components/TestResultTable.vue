<template>
  <div class="table-panel">
    <div class="table-header-bar">
      <div>
        <div class="table-title">{{ title }}</div>
        <div class="table-subtitle">共 {{ records.length }} 条测试记录</div>
      </div>
      <select v-model="scenarioFilter" class="filter-select">
        <option value="">全部场景</option>
        <option v-for="s in scenarios" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>批次编号</th>
            <th>场景</th>
            <th>仿真值</th>
            <th>测试值</th>
            <th>一致性</th>
            <th>偏差</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in filteredRecords" :key="record.id">
            <td>{{ record.batchNumber }}</td>
            <td>{{ record.scenario }}</td>
            <td>{{ record.simulationValue }}</td>
            <td>{{ record.testValue }}</td>
            <td class="consistency-cell" :class="consistencyClass(record.consistency)">
              {{ record.consistency.toFixed(1) }}%
            </td>
            <td>{{ record.deviation > 0 ? '+' : '' }}{{ record.deviation.toFixed(3) }}</td>
            <td>
              <span class="status-dot" :class="record.status"></span>
              {{ statusText(record.status) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String,
  records: Array
})

const scenarioFilter = ref('')

const scenarios = computed(() => {
  const set = new Set(props.records.map(r => r.scenario))
  return Array.from(set).sort()
})

const filteredRecords = computed(() => {
  if (!scenarioFilter.value) return props.records
  return props.records.filter(r => r.scenario === scenarioFilter.value)
})

function consistencyClass(v) {
  if (v >= 97) return 'consistency-high'
  if (v >= 93) return 'consistency-mid'
  return 'consistency-low'
}

function statusText(s) {
  const map = { pass: '通过', warn: '关注', fail: '需排查' }
  return map[s] || s
}
</script>

<style scoped>
.table-panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.table-header-bar {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-title {
  font-weight: 600;
  font-size: 15px;
}
.table-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}
.filter-select {
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card);
  font-size: 12px;
  color: var(--text-primary);
  cursor: pointer;
  font-family: inherit;
}
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th {
  background: #F8FAFC;
  padding: 10px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
td {
  padding: 10px 16px;
  border-bottom: 1px solid #F1F5F9;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
}
.consistency-cell {
  font-weight: 600;
}
.consistency-high { color: var(--success); }
.consistency-mid { color: var(--warning); }
.consistency-low { color: var(--danger); }
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}
.status-dot.pass { background: var(--success); }
.status-dot.warn { background: var(--warning); }
.status-dot.fail { background: var(--danger); }
</style>
