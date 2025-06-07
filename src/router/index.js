import { createRouter, createWebHistory } from 'vue-router'
import DiscoverView from '../views/DiscoverView.vue'

const routes = [
  {
    path: '/',
    name: 'Discover',
    component: DiscoverView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router