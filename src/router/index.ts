// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/Home.vue';
import ConvertPage from '@/pages/Convert.vue';

const routes = [
    { path: '/', component: HomePage, name: 'home' },
    { path: '/convert', component: ConvertPage, name: 'convert' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
