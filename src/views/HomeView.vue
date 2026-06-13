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

    <!-- Domain Cards -->
    <section class="content">
      <div class="section-header">
        <h2 class="section-title">
          <Layers :size="20" :stroke-width="2" class="section-icon" />
          各领域一致性
        </h2>
      </div>

      <div class="domain-list">
        <div
          v-for="(d, i) in store.domains"
          :key="d.id"
          class="domain-card"
          :class="[d.id, { warning: d.consistency < d.threshold }]"
          :style="{ animationDelay: (0.08 * i) + 's' }"
          @click="goToDomain(d.id)"
        >
          <!-- Card header: icon + name + badge + overall stats -->
          <div class="dc-header">
            <div class="dc-icon-box" :class="'dc-icon-' + d.id">
              <component :is="iconMap[d.id]" :size="28" :stroke-width="2" />
            </div>
            <div class="dc-info">
              <div class="dc-name">{{ d.name }}</div>
              <div class="dc-badge" :class="d.consistency >= d.threshold ? 'pass' : 'alert'">
                {{ d.consistency >= d.threshold ? '达标' : '⚠ 关注' }}
              </div>
            </div>
            <div class="dc-overall">
              <div class="dc-overall-consistency" :style="{ color: colorMap[d.id] }">
                {{ d.consistency.toFixed(1) }}<small>%</small>
              </div>
              <div class="dc-overall-meta">
                <span>{{ d.totalItems }} 项</span>
                <span class="sep">·</span>
                <span class="dc-overall-dev">{{ d.deviationItems }} 偏差</span>
              </div>
            </div>
          </div>

          <!-- Card body: per-level consistency table -->
          <div class="dc-body">
            <div class="dc-table">
              <div class="dc-table-row dc-table-head">
                <span class="dc-tcol-label"></span>
                <span class="dc-tcol-val">一致性</span>
                <span class="dc-tcol-items">测试项</span>
                <span class="dc-tcol-dev">偏差</span>
              </div>
              <div
                v-for="lv in levels"
                :key="lv.key"
                class="dc-table-row"
              >
                <span class="dc-tcol-label">{{ lv.label }}</span>
                <span class="dc-tcol-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency[lv.key].toFixed(1) }}%</span>
                <span class="dc-tcol-items">{{ d.levelItems[lv.key] }}</span>
                <span class="dc-tcol-dev">{{ d.levelDeviations[lv.key] }}</span>
              </div>
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
.home { overflow: hidden; }

/* ======= HERO ======= */
.hero {
  position: relative;
  padding: 80px 32px 40px;
  overflow: hidden;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.section-icon { color: var(--brand); }

/* ======= DOMAIN CARDS ======= */
.domain-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.domain-card {
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(226,232,240,0.6);
  border-left: 5px solid transparent;
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 18px;
  opacity: 0;
  transform: translateY(20px);
  animation: card-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes card-enter {
  to { opacity: 1; transform: translateY(0); }
}
.blt { border-left-color: #2563EB; }
.highspeed { border-left-color: #7C3AED; }
.thermal { border-left-color: #059669; }
.power { border-left-color: #B45309; }
.pi { border-left-color: #EC4899; }
.domain-card.warning {
  border-left-color: #F59E0B;
  border-color: rgba(253,230,138,0.5);
  background: rgba(255,253,245,0.65);
}
.domain-card:hover {
  transform: translateY(-3px);
  background: rgba(255,255,255,0.78);
  box-shadow:
    0 10px 30px rgba(0,0,0,0.07),
    0 3px 8px rgba(0,0,0,0.05);
  border-color: rgba(203,213,225,0.8);
}
.domain-card:active { transform: translateY(0) scale(0.998); }

/* Card header */
.dc-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}
.dc-header .dc-info {
  flex: 1;
  min-width: 0;
}
.dc-header .dc-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dc-icon-blt { background: #EFF6FF; color: #2563EB; }
.dc-icon-highspeed { background: #F5F3FF; color: #7C3AED; }
.dc-icon-thermal { background: #ECFDF5; color: #059669; }
.dc-icon-power { background: #FFFBEB; color: #D97706; }
.dc-icon-pi { background: #FDF2F8; color: #EC4899; }

.dc-header .dc-name {
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 4px;
}
.dc-header .dc-badge {
  display: inline-block;
  font-size: 12px;
  padding: 3px 12px;
  border-radius: 100px;
  font-weight: 500;
}
.dc-badge.pass { background: #ECFDF5; color: #059669; }
.dc-badge.alert { background: #FFFBEB; color: #B45309; }

/* Overall stats in header */
.dc-header .dc-overall {
  text-align: right;
  flex-shrink: 0;
}
.dc-header .dc-overall-consistency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 40px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.5px;
}
.dc-header .dc-overall-consistency small {
  font-size: 20px;
  font-weight: 500;
  opacity: 0.4;
  margin-left: 2px;
}
.dc-header .dc-overall-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}
.dc-header .dc-overall-meta .sep { opacity: 0.4; }
.dc-header .dc-overall-dev { color: var(--danger); }

/* Card body: per-level table */
.dc-body {
  display: flex;
  flex-direction: column;
}
.dc-table {
  display: flex;
  flex-direction: column;
}
.dc-table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(203,213,225,0.3);
}
.dc-table-row:last-child { border-bottom: none; }
.dc-table-head {
  padding: 6px 0 8px;
  border-bottom: 1px solid rgba(203,213,225,0.5);
}
.dc-table-head .dc-tcol-label,
.dc-table-head .dc-tcol-val,
.dc-table-head .dc-tcol-items,
.dc-table-head .dc-tcol-dev {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: none;
}
.dc-tcol-label {
  font-size: 15px;
  font-weight: 500;
}
.dc-tcol-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}
.dc-tcol-items {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  text-align: center;
  color: var(--text-muted);
}
.dc-tcol-dev {
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  text-align: center;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .hero { padding: 40px 20px 32px; }
  .hero-title { font-size: 30px; }
  .hero-kpis { grid-template-columns: 1fr 1fr; }
  .hero-kpi.primary { grid-column: 1/-1; }
  .dc-header {
    flex-wrap: wrap;
    gap: 10px;
  }
  .dc-header .dc-overall {
    width: 100%;
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  .dc-header .dc-overall-meta { margin-top: 0; }
  .domain-card {
    padding: 18px 20px;
    gap: 14px;
    min-height: 0;
  }
  .dc-header .dc-icon-box { width: 40px; height: 40px; border-radius: 10px; }
  .dc-header .dc-overall-consistency { font-size: 28px; }
  .dc-header .dc-overall-consistency small { font-size: 16px; }
  .dc-table-row {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .dc-tcol-val { font-size: 16px; }
  .dc-tcol-label { font-size: 14px; }
  .dc-tcol-items,
  .dc-tcol-dev {
    font-size: 14px;
  }
  .content { padding: 24px 20px 32px; }
}
</style>
