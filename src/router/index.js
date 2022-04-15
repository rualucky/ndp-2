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
      path: "/employees",
      component: () => import("../pages/Employees.vue"),
    },
    {
      path: "/employees/:id",
      name: 'employees',
      component: () => import("../pages/EmployeeDetail.vue"),
    },
  ],
});

export default router;