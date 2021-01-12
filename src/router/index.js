import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Reply from "../views/Reply.vue";
import Announcement from "../views/Announcement.vue";
import Login from "../views/Login.vue";
import Report from "../views/Report.vue";
import Admin from "../views/Admin.vue";
import Vacation from "../views/Vacation.vue";
import store from '../store';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/reply-secret",
    name: "Reply",
    component: Reply,
  },
  {
    path: "/announcement",
    name: "Announcement",
    component: Announcement,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/:squadId/report",
    name: "Report",
    component: Report
  },
  {
    path: "/:squadId/reply-secret",
    name: "ReplySecret",
    component: Reply
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin
  },
  {
    path: "/vacation",
    name: "Vacation",
    component: Vacation
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  switch (to.name) {
    case "Admin":
      if (store.state.loginState) next();
      else next({ name: "Login" });
      break;
    case "Login":
      if (store.state.loginState) next({ name: "Admin" });
      else next();
      break;
    default:
      next();
      break;
  }
})

export default router;
