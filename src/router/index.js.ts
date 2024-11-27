import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import Events from '@/views/Events.vue'
import Profile from '@/views/Profile.vue'
import Login from '@/components/home/Login.vue'
import Register from '@/components/home/Register.vue'
import Matchmaking from '@/views/Matchmaking.vue'
import { UserStore } from '@/store/userStore'
import Forum from '@/views/Forum.vue'
import ViewForum from '@/views/forum/ViewForum.vue'
import ViewTopic from '@/views/forum/ViewTopic.vue'
import ForumsList from '@/views/forum/ForumsList.vue'
import SearchForums from '@/views/forum/SearchForums.vue'
import EditProfileView from '@/views/EditProfileView.vue'

type Route = RouteRecordRaw & {
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
    path: '/forums',
    name: 'Forums',
    component: Forum,
    inNav: true,
    beforeEnter: requireAuth,
    children: [
      {
        path: '',
        name: 'ForumsList',
        component: ForumsList,
        beforeEnter: requireAuth
      },
      {
        path: ':forumId',
        name: 'ViewForum',
        component: ViewForum,
        beforeEnter: requireAuth
      },
      {
        path: ':forumId/:topicId',
        name: 'ViewTopic',
        component: ViewTopic,
        beforeEnter: requireAuth
      },
      {
        path: 'search/:search',
        name: 'SearchInForums',
        component: SearchForums,
        beforeEnter: requireAuth
      }
    ]
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
  {
    path: '/modifier-profil',
    name: 'ModificationProfil',
    component: EditProfileView,
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
