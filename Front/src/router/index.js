import Vue from "vue";
import Router from "vue-router";
// import Main from "@/components/main/main.vue";
// import forumList from "@/pages/forumList/forumList.vue";
// import user from "@/pages/user/user.vue";
// import userLoginPwd from "@/components/userLoginPwd/loginPwd.vue";

Vue.use(Router);

export default new Router({
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
          children: [
            {
              path: "login",
              name: "login",
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
                  path: "wxInfo",
                  name: "userMyWxInfo",
                  component: userWxInfo
                },
                {
                  path: "detailInfo",
                  name: "userMyDetailInfo",
                  component: userDetailInfo
                },
                {
                  path: "mentorInfo",
                  name: "userMyMentorInfo",
                  component: userMentorInfo
                },
                {
                  path: "pwdReset",
                  name: "userMyPwdReset",
                  component: userPwdReset
                }
              ]
            },
            {
              path: "visit",
              name: "userVisit",
              component: userVisit,
              meta: {
                requireLogin: true
              }
            },
            {
              path: "report",
              name: "report",
              component: userReport,
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
              path: "list",
              name: "threadList",
              component: threadList
            },
            {
              path: "info",
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
