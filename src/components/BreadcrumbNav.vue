<template>
  <div class="breadcrumb">
    <router-link to="/" class="link">首页</router-link>
    <span class="sep">›</span>
    <span class="current">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: String
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
  color: var(--text-primary);
  font-weight: 500;
}
</style>
