import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
     {
       path: "/",
       component: () => import("../pages/Home.vue"),
     },
     {
      path: '/contacts/:id',
      name: 'contacts',
      component: () => import("../pages/DetailContact.vue")
    },
    {
      path: "/sign-in",
      component: () => import("../pages/SignIn.vue"),
    },
    {
      path: "/users",
      component: () => import("../pages/Users.vue"),
    },
    {
      path: "/users/:id",
      name: 'users',
      component: () => import("../pages/UserDetail.vue"),
    },
  ],
});

export default router;