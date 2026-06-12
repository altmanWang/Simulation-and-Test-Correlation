import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/domain/:id',
      name: 'domain',
      component: () => import('../views/DomainDetailView.vue'),
      props: true
    }
  ]
})

export default router
