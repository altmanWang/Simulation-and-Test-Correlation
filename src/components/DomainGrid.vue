<template>
  <div class="domain-grid">
    <DomainCard
      v-for="domain in domains"
      :key="domain.id"
      :domain="domain"
      @click="$emit('select', $event)"
    />
  </div>
</template>

<script setup>
import DomainCard from './DomainCard.vue'

defineProps({
  domains: Array
})

defineEmits(['select'])
</script>

<style scoped>
.domain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) {
  .domain-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
