<template>
  <div class="breadcrumb">
    <router-link to="/" class="link">首页</router-link>
    <span class="sep">›</span>
    <span class="current" :style="{ color: color }">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  color: String
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
}
</style>
