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
import userMyNotice from "@/web/user/userMyNotice.vue";
import userMyGroup from "@/web/user/userMyGroup.vue";
import userMyThreads from "@/web/user/userMyThreads.vue";
import userGroupList from "@/web/user/userGroupList.vue";
import userGroupVisit from "@/web/user/userGroupVisit.vue";
import thread from "@/web/thread/thread.vue";
import threadList from "@/web/thread/threadList.vue";
import threadInfo from "@/web/thread/threadInfo.vue";
import threadCreate from "@/web/thread/threadCreate.vue";
import report from "@/web/report/report.vue";
import reportMy from "@/web/report/reportMy.vue";
import reportCreate from "@/web/report/reportCreate.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "main",
      component: Main,
      redirect: "/forum",
      children: [
        {
          path: "report",
          name: "report",
          component: report,
          redirect: "/report/my/1",
          meta: {
            requireLogin: true
          },
          children: [
            {
              path: "my",
              name: "reportMyHome",
              redirect: "/report/my/1"
            },
            {
              path: "my/:page",
              name: "reportMy",
              component: reportMy,
              meta: {
                mode: "my"
              }
            },
            {
              path: "create",
              name: "reportCreate",
              component: reportCreate,
              meta: {
                mode: 0
              }
            },
            {
              path: "update/:rid",
              name: "reportUpdate",
              component: reportCreate,
              meta: {
                mode: 1
              }
            },
            {
              path: "visit/:uid/:page",
              name: "reportVisit",
              component: reportMy,
              meta: {
                mode: "visit"
              }
            }
          ]
        },
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
                  component: userMyInfo,
                  meta: {
                    key: "0",
                    showAvatar: true
                  }
                },
                {
                  path: "pwdReset",
                  name: "userMyPwdReset",
                  component: userMyPwdReset,
                  meta: {
                    key: "1",
                    showAvatar: true
                  }
                },
                {
                  path: "notice/:page",
                  name: "userMyNotice",
                  component: userMyNotice,
                  meta: {
                    key: "2",
                    showAvatar: false
                  }
                },
                {
                  path: "group",
                  name: "userMyGroups",
                  component: userMyGroup,
                  meta: {
                    key: "3",
                    showAvatar: true
                  }
                },
                {
                  path: "threads/:page",
                  name: "userMyThreads",
                  component: userMyThreads,
                  meta: {
                    key: "4",
                    showAvatar: false
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
            },
            {
              path: "grouplist",
              name: "userGroupList",
              component: userGroupList,
              meta: {
                requireLogin: true
              }
            },
            {
              path: "group/:gid",
              name: "userGroupVisit",
              component: userGroupVisit,
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
              component: threadCreate,
              meta: {
                mode: 0
              }
            },
            {
              path: "create/:fid",
              name: "threadCreateFid",
              component: threadCreate,
              meta: {
                mode: 0
              }
            },
            {
              path: "update/:tid",
              name: "threadUpdate",
              component: threadCreate,
              meta: {
                mode: 1
              }
            }
          ]
        },
        {
          path: "post",
          name: "post",
          component: thread,
          meta: {
            requireLogin: true
          },
          children: [
            {
              path: "update/:pid",
              name: "threadUpdate",
              component: threadCreate,
              meta: {
                mode: 2
              }
            }
          ]
        }
      ]
    }
  ]
});

export default router;
