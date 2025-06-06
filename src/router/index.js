import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Home.vue"),
  },
  {
    path: "/unity",
    name: "Unity",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Unity.vue"),
  },
  {
    path: "/stuck",
    name: "Stuck",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Stuck.vue"),
  },
  {
    path: "/ThirtyF",
    name: "ThirtyF",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ThirtyF" */ "../views/ThirtyF.vue"),
  },
    {
    path: "/ThirtyF2",
    name: "ThirtyF2",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ThirtyF" */ "../views/ThirtyF2.vue"),
  },
  /* Default/404 */
  {
    path: "/404",
    alias: "/:pathMatch(.*)*",
    name: "404",
    component: () =>
      import(
        /*webpackChunkName: "NotFound" */
        "../views/404.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;