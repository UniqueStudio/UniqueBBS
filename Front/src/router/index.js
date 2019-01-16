import Vue from "vue";
import Router from "vue-router";
import Main from "@/web/main.vue";
import forum from "@/web/forum/forum.vue";
import user from "@/web/user/user.vue";
import userLogin from "@/web/user/userLogin.vue";
import userLoginPwd from "@/web/user/userLoginPwd.vue";
import userLoginWx from "@/web/user/userLoginWx.vue";
import userMy from "@/web/user/userMy.vue";
import userMyInfo from "@/web/user/userMyInfo.vue";
import userMyPwdReset from "@/web/user/userMyPwdReset.vue";
import userVisit from "@/web/user/userVisit.vue";
import userReport from "@/web/user/userReport.vue";
import userGroup from "@/web/user/userGroup.vue";
import userThreads from "@/web/user/userThreads.vue";
import thread from "@/web/thread/thread.vue";
import threadList from "@/web/thread/threadList.vue";
import threadInfo from "@/web/thread/threadInfo.vue";
import threadCreate from "@/web/thread/threadCreate.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
      children: [
        {
          path: "forum",
          name: "forum",
          component: forum,
          meta: {
            requireLogin: true
          }
        },
        {
          path: "user",
          name: "user",
          component: user,
          redirect: "/user/my/info",
          children: [
            {
              path: "login",
              name: "login",
              redirect: "/user/login/pwd",
              component: userLogin,
              meta: {
                requireUnLogin: true
              },
              children: [
                {
                  path: "pwd",
                  name: "loginPwd",
                  component: userLoginPwd
                },
                {
                  path: "wx",
                  name: "loginWx",
                  component: userLoginWx
                }
              ]
            },
            {
              path: "my",
              name: "userMy",
              component: userMy,
              meta: {
                requireLogin: true
              },
              children: [
                {
                  path: "info",
                  name: "userMyInfo",
                  component: userMyInfo
                },
                {
                  path: "pwdReset",
                  name: "userMyPwdReset",
                  component: userMyPwdReset
                },
                {
                  path: "report",
                  name: "report",
                  component: userReport,
                  meta: {
                    requireLogin: true
                  }
                },
                {
                  path: "group",
                  name: "group",
                  component: userGroup,
                  meta: {
                    requireLogin: true
                  }
                },
                {
                  path: "threads",
                  name: "threads",
                  component: userThreads,
                  meta: {
                    requireLogin: true
                  }
                }
              ]
            },
            {
              path: "visit/:uid",
              name: "userVisit",
              component: userVisit,
              meta: {
                requireLogin: true
              }
            }
          ]
        },
        {
          path: "thread",
          name: "thread",
          component: thread,
          meta: {
            requireLogin: true
          },
          children: [
            {
              path: "list/:fid/:page",
              name: "threadList",
              component: threadList
            },
            {
              path: "info/:tid/:page",
              name: "threadInfo",
              component: threadInfo
            },
            {
              path: "create",
              name: "threadCreate",
              component: threadCreate
            }
          ]
        }
      ]
    }
  ]
});

export default router;
