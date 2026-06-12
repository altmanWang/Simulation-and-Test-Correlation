<template>
  <div class="kpi-row">
    <slot />
  </div>
</template>

<style scoped>
.kpi-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}
@media (max-width: 1024px) {
  .kpi-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
