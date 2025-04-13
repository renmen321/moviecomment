import { type RouteRecordRaw } from "vue-router";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/App.vue"),
  },
  {
    path: "/Movie",
    name: "Movie",
    component: () => import("@/pages/Movie.vue"),
  },
  {
    path: "/Comment",
    name: "Comment",
    component: () => import("@/pages/Comment.vue")
  },
  {
    path: "/moviedata",
    name: "MovieData",
    component: () => import("@/pages/Moviedata.vue")
  },
  {
    path: '/login',
    name: 'login',
    component: () => import("@/pages/login.vue"),
  },
  {
    path: '/reset',
    name: 'reset',
    component: () => import("@/pages/reset.vue"),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import("@/pages/register.vue"),
  },
  {
    path: '/shouye',
    name: 'shouye',
    component: () => import("@/pages/shouye.vue"),
  },
  {
  path: '/feedback',
  name: 'feedback',
  component: () => import("@/pages/feedback.vue"),
  },{
    path: '/ss',//今日评论
    name: 'ss',
    component: () => import("@/pages/ss.vue"),
  },{
    path: '/user',//用户管理
    name: 'user',
    component: () => import("@/pages/user.vue"),
  },{
  path:'/pinglun',//评论管理
  name:'pinglun',
  component: () => import("@/pages/pinglun.vue"),
  },{
    path:'/MovieManage',//电影管理
    name:'MovieManage',
    component: () => import("@/pages/MovieManage.vue"),
  },{
    path:'/feedbackAdmin',//反馈管理
    name:'feedbackAdmin',
    component: () => import("@/pages/feedbackAdmin.vue"),
  }, {
    path: '/zhanghao',
    name: 'zhanghao',
    component: () => import("@/pages/zhanghao.vue"),
  },{
  path:'/Model',
  name:'Model',
  component: () => import("@/pages/Model.vue"),
  }
];
