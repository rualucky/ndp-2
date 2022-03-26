import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
     {
       path: "/",
       component: () => import("../pages/Home.vue"),
     },
    {
      path: "/detail",
      component: () => import("../pages/Detail.vue"),
    },
  ],
});

export default router;