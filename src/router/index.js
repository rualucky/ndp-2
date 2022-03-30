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
    {
      path: "/sign-in",
      component: () => import("../pages/SignIn.vue"),
    }
  ],
});

export default router;