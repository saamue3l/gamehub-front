import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Profile from '@/views/Profile.vue'

const routes = [
  {path: '/', name: "Accueil", component: Home},
  {path: '/events', name: "Évènements", component: Events},
  {path: '/joachim', name: "Love", component: () => import('@/views/Joachim.vue')},
  {path: '/thehorse', name: "?", component: () => import('@/views/TheHorse.vue')},
  {path: '/profil', name: "Profil", component: Profile},
]

const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router;
export { routes, router };