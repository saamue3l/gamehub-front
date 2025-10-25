import '@/index.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import router, { initializeAuthGuard } from '@/router/index.js'
import { createPinia } from 'pinia'

// Importation de Laravel Echo et Pusher
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Configuration de Laravel Echo
const echo = new Echo({
  broadcaster: 'pusher',
  key: '7fac9eff97bb8b304ef8',
  cluster: 'eu',
  forceTLS: true
})

// Ajouter Echo à `window` pour un accès global
;(window as any).Echo = echo

// Créer l'application Vue
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

router.isReady().then(() => {
  initializeAuthGuard()
    .then(() => {
      app.mount('#app')
    })
    .catch((error) => {
      console.error('Failed to initialize store:', error)
      app.mount('#app')
    })
})
