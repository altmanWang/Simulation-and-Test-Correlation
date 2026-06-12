<template>
  <div class="kpi-card" :class="{ primary }">
    <div class="kpi-label">{{ label }}</div>
    <div class="kpi-value" :style="{ color: valueColor }">{{ displayValue }}</div>
    <div v-if="trend" class="kpi-trend" :class="trendClass">{{ trend }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  value: [Number, String],
  primary: Boolean,
  trend: String,
  trendUp: Boolean,
  valueColor: String
})

const displayValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value
  }
  return props.value
})

const trendClass = computed(() => {
  if (props.trendUp === undefined) return ''
  return props.trendUp ? 'up' : 'down'
})
</script>

<style scoped>
.kpi-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
}
.kpi-card.primary {
  background: linear-gradient(135deg, var(--brand), #1d4ed8);
  border: none;
  color: white;
}
.kpi-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-weight: 500;
}
.primary .kpi-label {
  color: rgba(255, 255, 255, 0.8);
}
.kpi-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px;
  font-weight: 600;
}
.primary .kpi-value {
  font-size: 48px;
}
.kpi-trend {
  font-size: 13px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}
.primary .kpi-trend {
  color: rgba(255, 255, 255, 0.9);
}
.kpi-trend.up { color: #10B981; }
.kpi-trend.down { color: var(--danger); }
</style>
