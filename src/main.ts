import '@/index.css';
import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router/index.js';
import { createPinia } from 'pinia';

// Importation de Laravel Echo et Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configuration de Laravel Echo
const echo = new Echo({
  broadcaster: 'pusher',
  key: '7fac9eff97bb8b304ef8', // Remplace par ta clé Pusher
  cluster: 'eu', // Remplace par ton cluster Pusher
  forceTLS: true,
});

// Ajouter Echo à `window` pour un accès global si nécessaire
(window as any).Echo = echo;

// Créer l'application Vue
createApp(App).use(router).use(createPinia()).mount('#app');
