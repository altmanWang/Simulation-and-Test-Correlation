<template>
  <div class="level-row">
    <div class="level-item">
      <span class="level-name">系统</span>
      <span class="level-val" :style="{ color }">{{ formatPct(data.system) }}</span>
    </div>
    <div class="level-item">
      <span class="level-name">模组</span>
      <span class="level-val" :style="{ color }">{{ formatPct(data.module) }}</span>
    </div>
    <div class="level-item">
      <span class="level-name">部件</span>
      <span class="level-val" :style="{ color }">{{ formatPct(data.component) }}</span>
    </div>
    <div class="level-item">
      <span class="level-name">材料</span>
      <span class="level-val" :style="{ color }">{{ formatPct(data.material) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: Object,
  color: String
})

function formatPct(v) {
  return v.toFixed(1) + '%'
}
</script>

<style scoped>
.level-row {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.level-item {
  flex: 1;
  text-align: center;
  background: #F8FAFC;
  border-radius: var(--radius-sm);
  padding: 8px 4px;
}
.level-name {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 2px;
  display: block;
}
.level-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 700;
}
</style>
