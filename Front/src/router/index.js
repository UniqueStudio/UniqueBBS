import Vue from "vue";
import Router from "vue-router";
import Main from "@/web/main.vue";

const forum = () => import("@/web/forum/forum.vue");
const user = () => import("@/web/user/user.vue");
const userLogin = () => import("@/web/user/userLogin.vue");
const userLoginPwd = () => import("@/web/user/userLoginPwd.vue");
const userLoginWx = () => import("@/web/user/userLoginWx.vue");
const userMy = () => import("@/web/user/userMy.vue");
const userMyInfo = () => import("@/web/user/userMyInfo.vue");
const userMyPwdReset = () => import("@/web/user/userMyPwdReset.vue");
const userVisit = () => import("@/web/user/userVisit.vue");
const userMyNotice = () => import("@/web/user/userMyNotice.vue");
const userMyGroup = () => import("@/web/user/userMyGroup.vue");
const userMyThreads = () => import("@/web/user/userMyThreads.vue");
const userGroupList = () => import("@/web/user/userGroupList.vue");
const userGroupVisit = () => import("@/web/user/userGroupVisit.vue");
const thread = () => import("@/web/thread/thread.vue");
const threadList = () => import("@/web/thread/threadList.vue");
const threadInfo = () => import("@/web/thread/threadInfo.vue");
const threadCreate = () => import("@/web/thread/threadCreate.vue");
const report = () => import("@/web/report/report.vue");
const reportMy = () => import("@/web/report/reportMy.vue");
const reportCreate = () => import("@/web/report/reportCreate.vue");
const reportMentor = () => import("@/web/report/reportMentor.vue");

Vue.use(Router);

const router = new Router({
    mode: "history",
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
                        },
                        {
                            path: "mentor",
                            name: "reportMentor",
                            component: reportMentor
                        }
                    ]
                },
                {
                    path: "forum",
                    name: "forum",
                    component: forum,
                    meta: {
                        requireLogin: true,
                        keepAlive: true
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
                                        showAvatar: false,
                                        keepAlive: true
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
                            component: threadList,
                            meta: {
                                keepAlive: true
                            }
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
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});

export default router;
