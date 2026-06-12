<template>
  <div class="alert-bar">
    <TriangleAlert :size="22" :stroke-width="2" class="alert-icon" />
    <div class="alert-text">
      <div class="alert-title">{{ title }}</div>
      <div class="alert-desc">{{ description }}</div>
    </div>
    <button class="alert-action" @click="$emit('action')">{{ actionLabel }}</button>
  </div>
</template>

<script setup>
import { TriangleAlert } from 'lucide-vue-next'

defineProps({
  title: String,
  description: String,
  actionLabel: String
})

defineEmits(['action'])
</script>

<style scoped>
.alert-bar {
  background: var(--warning-light);
  border: 1px solid #FDE68A;
  border-radius: var(--radius-lg);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.alert-icon {
  color: #D97706;
  flex-shrink: 0;
}
.alert-text {
  flex: 1;
}
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
.alert-action {
  padding: 8px 16px;
  background: var(--warning);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}
.alert-action:hover {
  background: #D97706;
}
</style>
