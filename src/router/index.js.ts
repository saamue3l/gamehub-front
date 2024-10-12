import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'

const routes = [
  {path: '/', name: "Accueil", component: Home},
  {path: '/events', name: "Évènements", component: Events},
  {path: '/joachim', name: "Love", component: () => import('@/views/Joachim.vue')},
]

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
export { routes, router };