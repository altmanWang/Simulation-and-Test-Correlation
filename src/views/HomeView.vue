<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-grid"></div>
      <div class="hero-content">
        <div class="hero-eyebrow">
          <div class="hero-dot"></div>
          仿真 · 实测 · 一致性
        </div>
        <h1 class="hero-title">仿测一致性平台</h1>
        <p class="hero-desc">实时监控五大领域仿真与实测数据的匹配精度，快速定位偏差项</p>
      </div>
      <div class="hero-kpis">
        <div class="hero-kpi primary">
          <div class="hero-kpi-val">{{ animatedConsistency }}<small>%</small></div>
          <div class="hero-kpi-label">总体仿测一致性</div>
        </div>
        <div class="hero-kpi">
          <div class="hero-kpi-num">{{ animatedTotal }}</div>
          <div class="hero-kpi-label">测试项总数</div>
        </div>
        <div class="hero-kpi">
          <div class="hero-kpi-num danger">{{ animatedDeviation }}</div>
          <div class="hero-kpi-label">偏差项</div>
        </div>
        <div class="hero-kpi">
          <div class="hero-kpi-num success">{{ store.overview.qualifiedDomains }}<small>/{{ store.overview.totalDomains }}</small></div>
          <div class="hero-kpi-label">达标领域</div>
        </div>
      </div>
    </section>

    <!-- Kanban Cards -->
    <section class="content">
      <div class="section-header">
        <h2 class="section-title">
          <Layers :size="20" :stroke-width="2" class="section-icon" />
          各领域一致性
        </h2>
        <div class="section-summary">
          <span class="ss-dot pass"></span>{{ store.overview.qualifiedDomains }} 达标
          <span class="ss-dot alert"></span>{{ store.overview.totalDomains - store.overview.qualifiedDomains }} 关注
        </div>
      </div>

      <div class="kanban-row">
        <div
          v-for="(d, i) in store.domains"
          :key="d.id"
          class="kanban-card"
          :class="[d.id, { warning: d.consistency < d.threshold }]"
          :style="{ animationDelay: (0.06 * i) + 's' }"
          @click="goToDomain(d.id)"
        >
          <!-- Header: icon + name + badge -->
          <div class="kc-header">
            <div class="kc-icon-box" :class="'kc-icon-' + d.id">
              <component :is="iconMap[d.id]" :size="20" :stroke-width="2" />
            </div>
            <div class="kc-info">
              <div class="kc-name">{{ d.name }}</div>
            </div>
            <div class="kc-badge" :class="d.consistency >= d.threshold ? 'pass' : 'alert'">
              {{ d.consistency >= d.threshold ? '达标' : '关注' }}
            </div>
          </div>

          <!-- Hero number: consistency + trend -->
          <div class="kc-hero">
            <span class="kc-consistency" :style="{ color: colorMap[d.id] }">
              {{ d.consistency.toFixed(1) }}<small>%</small>
            </span>
            <span class="kc-trend" :class="d.trend >= 0 ? 'up' : 'down'">
              {{ d.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(d.trend).toFixed(1) }}%
            </span>
          </div>

          <!-- Meta -->
          <div class="kc-meta">
            <span class="kc-meta-item">{{ d.totalItems }} 测试项</span>
            <span class="kc-meta-sep">·</span>
            <span class="kc-meta-item" :class="{ dev: d.deviationItems > 0 }">{{ d.deviationItems }} 偏差</span>
          </div>

          <!-- Mini progress bar -->
          <div class="kc-bar-track">
            <div
              class="kc-bar-fill"
              :style="{ width: d.consistency + '%', background: colorMap[d.id] }"
            ></div>
          </div>

          <!-- Per-level list -->
          <div class="kc-levels">
            <div
              v-for="lv in levels"
              :key="lv.key"
              class="kc-lv"
            >
              <span class="kc-lv-label">{{ lv.label }}</span>
              <span class="kc-lv-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency[lv.key].toFixed(1) }}%</span>
              <span class="kc-lv-meta">{{ d.levelItems[lv.key] }}项</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Layers, Zap, Thermometer, BatteryFull, Activity } from 'lucide-vue-next'
import { useDashboardStore } from '../stores/dashboard'

const store = useDashboardStore()
const router = useRouter()

const iconMap = { blt: Layers, highspeed: Zap, thermal: Thermometer, power: BatteryFull, pi: Activity }
const colorMap = { blt: '#2563EB', highspeed: '#7C3AED', thermal: '#059669', power: '#B45309', pi: '#EC4899' }
const levels = [
  { key: 'system', label: '系统级' },
  { key: 'module', label: '模组级' },
  { key: 'component', label: '部件级' },
  { key: 'material', label: '材料级' },
]

const animatedConsistency = ref(0)
const animatedTotal = ref(0)
const animatedDeviation = ref(0)

function animateValue(ref, target, duration = 1200) {
  const start = performance.now()
  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    ref.value = Math.round(target * eased * 10) / 10
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  animateValue(animatedConsistency, store.overview.totalConsistency)
  animateValue(animatedTotal, store.overview.totalItems)
  animateValue(animatedDeviation, store.overview.deviationItems)
})

function goToDomain(id) {
  router.push({ name: 'domain', params: { id } })
}

</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 52px);
  overflow: hidden;
}

/* ======= HERO ======= */
.hero {
  position: relative;
  padding: 56px 32px 32px;
  overflow: hidden;
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #2563EB 0%, #1d4ed8 40%, #7C3AED 100%);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
  margin-bottom: 36px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.8;
  margin-bottom: 12px;
}
.hero-dot {
  width: 6px;
  height: 6px;
  background: #34D399;
  border-radius: 50%;
  box-shadow: 0 0 8px #34D399;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 8px #34D399; }
  50% { box-shadow: 0 0 16px #34D399, 0 0 24px rgba(52,211,153,0.4); }
}
.hero-title {
  font-size: 42px;
  font-weight: 700;
  letter-spacing: -1.5px;
  margin-bottom: 8px;
}
.hero-desc {
  font-size: 15px;
  opacity: 0.7;
  max-width: 480px;
  margin: 0 auto;
}

.hero-kpis {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}
.hero-kpi {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 20px 24px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: transform 0.2s, background 0.2s;
}
.hero-kpi:hover {
  transform: scale(1.03);
  background: rgba(255,255,255,0.16);
}
.hero-kpi.primary {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.25);
  color: white;
  flex-direction: column;
  gap: 4px;
  padding: 20px 28px;
}
.hero-kpi.primary .hero-kpi-val { font-size: 40px; }
.hero-kpi.primary .hero-kpi-label { font-size: 14px; }
.hero-kpi-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.hero-kpi-val small {
  font-size: 14px;
  opacity: 0.7;
  margin-left: 1px;
}
.hero-kpi-label {
  font-size: 13px;
  opacity: 0.8;
  font-weight: 500;
}
.hero-kpi-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 30px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.hero-kpi-num small { font-size: 16px; opacity: 0.6; }
.hero-kpi-num.danger { color: #FCA5A5; }
.hero-kpi-num.success { color: #6EE7B7; }

/* ======= CONTENT ======= */
.content {
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 32px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 0 0 50%;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  font-size: 17px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1F2937;
}
.section-icon { color: var(--brand); }

.section-summary {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 13px;
  color: var(--text-muted);
}
.ss-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: -10px;
}
.ss-dot.pass { background: #10B981; }
.ss-dot.alert { background: #F59E0B; }

/* ======= KANBAN ROW ======= */
.kanban-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  align-items: stretch;
  flex: 1;
}

/* ======= KANBAN CARD ======= */
.kanban-card {
  background: #FFFFFF;
  border: 1px solid #E5E6EB;
  border-radius: 12px;
  padding: 18px 16px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(16px);
  animation: card-enter 0.4s ease forwards;
  position: relative;
  overflow: hidden;
  height: 100%;
}
.kanban-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
}
.blt::before { background: #2563EB; }
.highspeed::before { background: #7C3AED; }
.thermal::before { background: #059669; }
.power::before { background: #B45309; }
.pi::before { background: #EC4899; }
.kanban-card.warning::before { background: #F59E0B; }
.kanban-card.warning {
  border-color: #FDE68A;
  background: #FFFDF5;
}

@keyframes card-enter {
  to { opacity: 1; transform: translateY(0); }
}

.kanban-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  border-color: #CBD5E1;
  transform: translateY(-2px);
}

/* Card header */
.kc-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.kc-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kc-icon-blt { background: #EFF6FF; color: #2563EB; }
.kc-icon-highspeed { background: #F5F3FF; color: #7C3AED; }
.kc-icon-thermal { background: #ECFDF5; color: #059669; }
.kc-icon-power { background: #FFFBEB; color: #D97706; }
.kc-icon-pi { background: #FDF2F8; color: #EC4899; }

.kc-info { flex: 1; min-width: 0; }
.kc-name {
  font-weight: 600;
  font-size: 15px;
  color: #1F2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kc-badge {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 100px;
  font-weight: 500;
  flex-shrink: 0;
}
.kc-badge.pass { background: #ECFDF5; color: #059669; }
.kc-badge.alert { background: #FEF3C7; color: #B45309; }

/* Hero number */
.kc-hero {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.kc-consistency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.5px;
}
.kc-consistency small {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.35;
  margin-left: 1px;
}
.kc-trend {
  font-size: 13px;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
}
.kc-trend.up { color: #059669; }
.kc-trend.down { color: #DC2626; }

/* Meta */
.kc-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9CA3AF;
}
.kc-meta-item.dev { color: #B45309; font-weight: 500; }
.kc-meta-sep { opacity: 0.4; }

/* Progress bar */
.kc-bar-track {
  height: 4px;
  background: #F3F4F6;
  border-radius: 2px;
  overflow: hidden;
}
.kc-bar-fill {
  height: 100%;
  border-radius: 2px;
  min-width: 0;
  transition: width 0.8s ease;
}

/* Per-level list */
.kc-levels {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid #F3F4F6;
  padding-top: 10px;
  flex: 1;
  justify-content: space-evenly;
}
.kc-lv {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  font-size: 13px;
}
.kc-lv-label {
  color: #9CA3AF;
  font-weight: 500;
}
.kc-lv-val {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  text-align: right;
  min-width: 52px;
}
.kc-lv-meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #D1D5DB;
  text-align: right;
  min-width: 28px;
}

@media (max-width: 1400px) {
  .kanban-row {
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
  .kanban-card { padding: 14px 12px 12px; }
  .kc-consistency { font-size: 30px; }
  .kc-consistency small { font-size: 15px; }
}

@media (max-width: 1100px) {
  .kanban-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px 32px; }
  .hero-title { font-size: 30px; }
  .hero-kpis { grid-template-columns: 1fr 1fr; }
  .hero-kpi.primary { grid-column: 1/-1; }
  .kanban-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .kanban-card { padding: 14px 12px 12px; gap: 10px; }
  .kc-consistency { font-size: 28px; }
  .content { padding: 24px 20px 32px; }
}

@media (max-width: 480px) {
  .kanban-row {
    grid-template-columns: 1fr;
  }
}
</style>
