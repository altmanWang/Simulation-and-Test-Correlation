<template>
  <div class="breadcrumb" :class="{ dark }">
    <router-link to="/" class="link">首页</router-link>
    <span class="sep">›</span>
    <span class="current">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  dark: Boolean
})
</script>

<style scoped>
.breadcrumb {
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}
.link {
  color: var(--text-secondary);
  text-decoration: none;
}
.link:hover {
  color: var(--brand);
}
.sep {
  color: var(--text-muted);
}
.current {
  font-weight: 500;
  color: var(--text-primary);
}

.breadcrumb.dark .link {
  color: rgba(255,255,255,0.7);
}
.breadcrumb.dark .link:hover {
  color: white;
}
.breadcrumb.dark .sep {
  color: rgba(255,255,255,0.4);
}
.breadcrumb.dark .current {
  color: white;
}
</style>
