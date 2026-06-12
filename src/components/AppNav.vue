<template>
  <nav class="nav" :class="{ scrolled }">
    <div class="nav-brand">
      <div class="icon"><Layers :size="15" :stroke-width="2.5" /></div>
      仿测一致性平台
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Layers } from 'lucide-vue-next'

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  padding: 0 32px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition: background 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.nav.scrolled {
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 17px;
  color: var(--text-primary);
  transition: color 0.25s;
}
.icon {
  width: 28px;
  height: 28px;
  background: var(--brand);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
