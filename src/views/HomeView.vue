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

      <div class="domain-grid">
        <div
          v-for="(d, i) in store.domains"
          :key="d.id"
          class="domain-card"
          :class="[d.id, { warning: d.consistency < d.threshold }]"
          :style="{ animationDelay: (0.08 * i) + 's' }"
          @click="goToDomain(d.id)"
        >
          <div class="dc-accent"></div>
          <div class="dc-highlight"></div>
          <div class="dc-top">
            <div class="dc-icon-box" :class="'dc-icon-' + d.id">
              <component :is="iconMap[d.id]" :size="20" :stroke-width="2" />
            </div>
            <div class="dc-info">
              <div class="dc-name">{{ d.name }}</div>
              <div class="dc-badge" :class="d.consistency >= d.threshold ? 'pass' : 'alert'">
                {{ d.consistency >= d.threshold ? '达标' : '⚠ 关注' }}
              </div>
            </div>
          </div>
          <div class="dc-consistency" :style="{ color: d.consistency >= d.threshold ? colorMap[d.id] : '#B45309' }">
            {{ d.consistency.toFixed(1) }}<small>%</small>
          </div>
          <div class="dc-metrics">
            <div class="dc-metric">
              <span class="dc-metric-label">测试项</span>
              <span class="dc-metric-val">{{ d.totalItems }}</span>
            </div>
            <div class="dc-metric">
              <span class="dc-metric-label">偏差项</span>
              <span class="dc-metric-val dc-dev">{{ d.deviationItems }}</span>
            </div>
          </div>
          <div class="dc-levels">
            <div class="dc-lv">
              <span class="dc-lv-dot" :style="{ background: colorMap[d.id] }"></span>
              <span class="dc-lv-label">系统</span>
              <span class="dc-lv-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency.system.toFixed(1) }}%</span>
            </div>
            <div class="dc-lv">
              <span class="dc-lv-dot" :style="{ background: colorMap[d.id] }"></span>
              <span class="dc-lv-label">模组</span>
              <span class="dc-lv-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency.module.toFixed(1) }}%</span>
            </div>
            <div class="dc-lv">
              <span class="dc-lv-dot" :style="{ background: colorMap[d.id] }"></span>
              <span class="dc-lv-label">部件</span>
              <span class="dc-lv-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency.component.toFixed(1) }}%</span>
            </div>
            <div class="dc-lv">
              <span class="dc-lv-dot" :style="{ background: colorMap[d.id] }"></span>
              <span class="dc-lv-label">材料</span>
              <span class="dc-lv-val" :style="{ color: colorMap[d.id] }">{{ d.levelConsistency.material.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <Transition name="alert">
        <div v-if="store.alertDomains.length > 0" class="alert-bar">
          <div class="alert-left">
            <div class="alert-icon-box">
              <TriangleAlert :size="20" :stroke-width="2" />
            </div>
            <div class="alert-body">
              <div class="alert-title">{{ alertTitle }}</div>
              <div class="alert-desc">{{ alertDescription }}</div>
            </div>
          </div>
          <button class="alert-btn" @click="goToDomain(store.alertDomains[0].id)">
            查看详情
            <ArrowRight :size="14" :stroke-width="2" />
          </button>
        </div>
      </Transition>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Layers, Zap, Thermometer, BatteryFull, Activity, TriangleAlert, ArrowRight } from 'lucide-vue-next'
import { useDashboardStore } from '../stores/dashboard'

const store = useDashboardStore()
const router = useRouter()

const iconMap = { blt: Layers, highspeed: Zap, thermal: Thermometer, power: BatteryFull, pi: Activity }
const colorMap = { blt: '#2563EB', highspeed: '#7C3AED', thermal: '#059669', power: '#B45309', pi: '#EC4899' }

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

const alertTitle = computed(() => {
  const names = store.alertDomains.map(d => d.name).join('、')
  return `${names}一致性低于阈值（93%）`
})

const alertDescription = computed(() => {
  const d = store.alertDomains[0]
  if (!d) return ''
  return `当前 ${d.consistency.toFixed(1)}%，共 ${d.deviationItems} 个偏差项待处理`
})
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
  background: linear-gradient(135deg, #EFF4FB 0%, #F0F4FF 50%, #F8FAFC 100%);
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
}
.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  clip-path: polygon(0 0, 100% 0, 100% 78%, 0 100%);
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: var(--text-primary);
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
  opacity: 0.6;
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
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 24px;
  text-align: center;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s, box-shadow 0.2s;
}
.hero-kpi:hover {
  transform: scale(1.03);
  box-shadow: var(--shadow-md);
  border-color: #CBD5E1;
}
.hero-kpi.primary {
  background: linear-gradient(135deg, #2563EB, #1d4ed8);
  border: none;
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
.hero-kpi-num.danger { color: var(--danger); }
.hero-kpi-num.success { color: var(--success); }

/* ======= CONTENT ======= */
.content {
  max-width: 1280px;
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
.domain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.domain-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 22px 24px 18px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px);
  animation: card-enter 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes card-enter {
  to { opacity: 1; transform: translateY(0); }
}
.blt { background: linear-gradient(180deg, #F8FAFE 0%, #FFFFFF 55%); }
.highspeed { background: linear-gradient(180deg, #F9F7FF 0%, #FFFFFF 55%); }
.thermal { background: linear-gradient(180deg, #F6FDF9 0%, #FFFFFF 55%); }
.power { background: linear-gradient(180deg, #FFFCF5 0%, #FFFFFF 55%); }
.pi { background: linear-gradient(180deg, #FDF7FA 0%, #FFFFFF 55%); }
.domain-card.warning {
  border-color: #FDE68A;
  background: linear-gradient(180deg, #FFFDF5 0%, #FFFDF5 55%);
}
.domain-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 16px 32px rgba(0,0,0,0.07),
    0 4px 8px rgba(0,0,0,0.04);
  border-color: #CBD5E1;
}
.domain-card:active { transform: translateY(-1px) scale(0.995); }
.domain-card:hover .dc-accent {
  box-shadow: 0 0 16px currentColor;
}
.dc-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
  transition: box-shadow 0.3s;
}
.dc-highlight {
  position: absolute;
  top: 4px; left: 1px; right: 1px;
  height: 1px;
  background: rgba(255,255,255,0.6);
  border-radius: 0;
}
.blt .dc-accent { background: linear-gradient(90deg, #2563EB, #60A5FA); color: #2563EB; }
.highspeed .dc-accent { background: linear-gradient(90deg, #7C3AED, #A78BFA); color: #7C3AED; }
.thermal .dc-accent { background: linear-gradient(90deg, #059669, #34D399); color: #059669; }
.power .dc-accent { background: linear-gradient(90deg, #F59E0B, #FBBF24); color: #F59E0B; }
.pi .dc-accent { background: linear-gradient(90deg, #EC4899, #F472B6); color: #EC4899; }

.dc-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  padding-top: 6px;
}
.dc-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
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

.dc-info { flex: 1; min-width: 0; }
.dc-name {
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 4px;
}
.dc-badge {
  display: inline-block;
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 100px;
  font-weight: 500;
}
.dc-badge.pass { background: #ECFDF5; color: #059669; }
.dc-badge.alert { background: #FFFBEB; color: #B45309; }

.dc-consistency {
  font-family: 'JetBrains Mono', monospace;
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -2px;
}
.dc-consistency small {
  font-size: 20px;
  font-weight: 500;
  opacity: 0.5;
  margin-left: 2px;
}

.dc-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}
.dc-metric {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 8px 10px;
}
.dc-metric-label {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
}
.dc-metric-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 600;
}
.dc-dev { color: var(--danger); }

.dc-levels {
  display: flex;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.dc-lv {
  flex: 1;
  text-align: center;
  padding: 4px 2px;
}
.dc-lv-dot {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin: 0 auto 4px;
  opacity: 0.6;
}
.dc-lv-label {
  font-size: 10px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
}
.dc-lv-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
}

/* ======= ALERT ======= */
.alert-bar {
  background: var(--warning-light);
  border: 1px solid #FDE68A;
  border-radius: 14px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.alert-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.alert-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #FEF3C7;
  color: #D97706;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.alert-body { flex: 1; }
.alert-title {
  font-weight: 600;
  font-size: 14px;
  color: #92400E;
}
.alert-desc {
  font-size: 13px;
  color: #B45309;
  margin-top: 2px;
}
.alert-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: var(--warning);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: background 0.15s;
}
.alert-btn:hover { background: #D97706; }

.alert-enter-active { transition: all 0.4s ease; }
.alert-leave-active { transition: all 0.3s ease; }
.alert-enter-from,
.alert-leave-to { opacity: 0; transform: translateY(-8px); }

@media (max-width: 1024px) {
  .hero { padding: 40px 20px 32px; }
  .hero-title { font-size: 30px; }
  .hero-kpis { grid-template-columns: 1fr 1fr; }
  .hero-kpi.primary { grid-column: 1/-1; }
  .domain-grid { grid-template-columns: 1fr 1fr; }
  .content { padding: 24px 20px 32px; }
}
</style>
