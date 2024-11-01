import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Profile from '@/views/Profile.vue'
import type { Component } from 'vue'
import Login from '@/components/home/Login.vue'
import Register from '@/components/home/Register.vue'
import Matchmaking from '@/views/Matchmaking.vue'

type Route = {
  path: string
  name: string
  component: Component
  inNav?: boolean
}

const routes: Route[] = [
  { path: '/', name: 'Accueil', component: Home, inNav: true },
  { path: '/events', name: 'Évènements', component: Events, inNav: true },
  { path: '/joachim', name: 'Love', component: () => import('@/views/Joachim.vue') },
  { path: '/profil/:username', name: 'Profil', component: Profile },
  { path: '/matchmaking', name: 'Matchmaking', component: Matchmaking, inNav: true},
  { path: '/login', name: 'Connexion', component: Login },
  { path: '/register', name: 'Register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
export { routes, router }
