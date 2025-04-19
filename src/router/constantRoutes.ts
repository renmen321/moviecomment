import { type RouteRecordRaw } from "vue-router";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/App.vue"),
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
    path: '/Home',
    name: 'Home',
    component: () => import("@/pages/Home.vue"),
  },
  {
  path: '/FeedBack',
  name: 'FeedBack',
  component: () => import("@/pages/FeedBack.vue"),
  },{
    path: '/TodayComment',//今日评论
    name: 'TodayComment',
    component: () => import("@/pages/TodayComment.vue"),
  },{
    path: '/UserManage',//用户管理
    name: 'UserManage',
    component: () => import("@/pages/UserManage.vue"),
  },{
  path:'/CommentManage',//评论管理
  name:'CommentManage',
  component: () => import("@/pages/CommentManage.vue"),
  },{
    path:'/MovieManage',//电影管理
    name:'MovieManage',
    component: () => import("@/pages/MovieManage.vue"),
  },{
    path:'/FeedBackAdmin',//反馈管理
    name:'FeedBackAdmin',
    component: () => import("@/pages/FeedBackAdmin.vue"),
  }, {
    path: '/User',
    name: 'User',
    component: () => import("@/pages/User.vue"),
  },{
  path:'/Model',
  name:'Model',
  component: () => import("@/pages/Model.vue"),
  },{
  path:'/Main',
  name:'Main',
  component: () => import("@/pages/Main.vue"),
  }
];

