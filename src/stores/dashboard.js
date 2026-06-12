import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { overviewKpi, domainSummaries, domainDetails } from '../data/mock'

export const useDashboardStore = defineStore('dashboard', () => {
  const overview = ref(overviewKpi)
  const domains = ref(domainSummaries)

  const alertDomains = computed(() =>
    domains.value.filter(d => d.consistency < d.threshold)
  )

  function getDomainDetail(id) {
    return domainDetails[id]
  }

  return {
    overview,
    domains,
    alertDomains,
    getDomainDetail
  }
})
