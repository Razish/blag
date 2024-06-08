import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'index', component: App },
    { path: '/tags/:tag', name: 'postsByTag', component: App },
    { path: '/posts/:title', name: 'post', component: App },
  ],
});

createApp(App).use(router).mount('#app');
