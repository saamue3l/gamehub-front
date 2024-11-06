import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Profile from '@/views/Profile.vue'
import type { Component } from 'vue'
import Login from '@/components/home/Login.vue'
import Register from '@/components/home/Register.vue'
import Matchmaking from '@/views/Matchmaking.vue'
import { UserStore } from '@/store/userStore'
import Forum from '@/views/Forums.vue'
import ViewForum from '@/views/ViewForum.vue'

type Route = {
  path: string
  name: string
  component: Component
  inNav?: boolean
  beforeEnter?: (to: any, from: any, next: any) => void
}

const routes: Route[] = [
  /* === HEADER NAV === */
  { path: '/', name: 'Accueil', component: Home, inNav: true },
  {
    path: '/events',
    name: 'Évènements',
    component: Events,
    inNav: true,
    beforeEnter: requireAuth
  },
  {
    path: '/forum',
    name: 'Forums',
    component: Forum,
    inNav: true,
    beforeEnter: requireAuth
  },
  {
    path: '/matchmaking',
    name: 'Matchmaking',
    component: Matchmaking,
    inNav: true,
    beforeEnter: requireAuth
  },
  /* === AUTH ===*/
  { path: '/login', name: 'Connexion', component: Login },
  { path: '/register', name: 'Register', component: Register },
  /* === PROFILE === */
  {
    path: '/profil/:username',
    name: 'Profil',
    component: Profile,
    beforeEnter: requireAuth
  },
  /* === FORUM === */
  {
    path: '/forum/:id',
    name: 'viewForum',
    component: ViewForum,
    beforeEnter: requireAuth
  },
  /* === OTHERS === */
  { path: '/joachim', name: 'Love', component: () => import('@/views/Joachim.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function requireAuth(to, from, next) {
  const userStore = UserStore()
  const username = userStore.username
  if (!username) {
    next({ path: '/' })
  } else {
    next()
  }
}

export default router
export { routes, router }
