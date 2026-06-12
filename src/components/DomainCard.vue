<template>
  <div
    class="domain-card"
    :class="[domain.id, { warning: isWarning }]"
    @click="$emit('click', domain.id)"
  >
    <div class="accent-bar"></div>
    <div class="domain-card-header">
      <span class="domain-card-name">
        <component :is="domainIcon" :size="18" :stroke-width="2" class="domain-icon" />
        {{ domain.name }}
      </span>
      <span class="domain-card-badge" :class="badgeClass">{{ badgeText }}</span>
    </div>
    <div class="domain-card-consistency" :style="{ color: consistencyColor }">
      {{ domain.consistency.toFixed(1) }}%
    </div>
    <div class="domain-card-metrics">
      <div class="metric-item">
        <span class="metric-label">测试项</span>
        <span class="metric-value">{{ domain.totalItems }}</span>
      </div>
      <div class="metric-item">
        <span class="metric-label">偏差项</span>
        <span class="metric-value deviation">{{ domain.deviationItems }}</span>
      </div>
    </div>
    <LevelConsistency :data="domain.levelConsistency" :color="domainColor" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Layers, Zap, Thermometer, BatteryFull, Activity } from 'lucide-vue-next'
import LevelConsistency from './LevelConsistency.vue'

const props = defineProps({
  domain: Object
})

defineEmits(['click'])

const iconComponents = {
  blt: Layers,
  highspeed: Zap,
  thermal: Thermometer,
  power: BatteryFull,
  pi: Activity
}

const colors = {
  blt: 'var(--brand)',
  highspeed: 'var(--purple)',
  thermal: 'var(--success)',
  power: '#B45309',
  pi: 'var(--pink)'
}

const domainIcon = computed(() => iconComponents[props.domain.id] || Layers)
const domainColor = computed(() => colors[props.domain.id] || 'var(--brand)')

const isWarning = computed(() => props.domain.consistency < props.domain.threshold)

const badgeClass = computed(() => {
  if (isWarning.value) return 'badge-warning'
  const map = {
    blt: 'badge-blue',
    highspeed: 'badge-purple',
    thermal: 'badge-green',
    power: 'badge-warning',
    pi: 'badge-pink'
  }
  return map[props.domain.id] || 'badge-blue'
})

const badgeText = computed(() => isWarning.value ? '⚠ 关注' : '达标')

const consistencyColor = computed(() =>
  isWarning.value ? '#B45309' : domainColor.value
)
</script>

<style scoped>
.domain-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}
.domain-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: #CBD5E1;
}
.domain-card:active {
  transform: translateY(0);
}
.domain-card.warning {
  border-color: #FDE68A;
}
.accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}
.blt .accent-bar { background: var(--brand); }
.highspeed .accent-bar { background: var(--purple); }
.thermal .accent-bar { background: var(--success); }
.power .accent-bar { background: var(--warning); }
.pi .accent-bar { background: var(--pink); }

.domain-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-top: 4px;
}
.domain-card-name {
  font-weight: 600;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.domain-icon {
  flex-shrink: 0;
}
.domain-card-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 500;
}
.badge-blue { background: var(--brand-light); color: var(--brand); }
.badge-purple { background: var(--purple-light); color: var(--purple); }
.badge-green { background: var(--success-light); color: var(--success); }
.badge-warning { background: var(--warning-light); color: #B45309; }
.badge-pink { background: var(--pink-light); color: var(--pink); }

.domain-card-consistency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.domain-card-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 14px;
}
.metric-item {
  display: flex;
  flex-direction: column;
}
.metric-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.metric-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 600;
}
.metric-value.deviation {
  color: var(--danger);
}
.metric-value.trend-up {
  color: #10B981;
}
.metric-value.trend-down {
  color: var(--danger);
}
</style>
