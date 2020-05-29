import Vue from "vue";
import App from "./App";
import router from "./router";
import "ant-design-vue/dist/antd.css";
import Vuex from "vuex";
import urls from "./functions/urls";
import getHumanDate from "./functions/humanDate";
import getHumanDateLite from "./functions/humanDateLite";
import joinTime from "./functions/joinTime";
import marked from "marked";
import { getLanguage, highlight } from "highlight.js";
import Antd from "ant-design-vue";
import io from "socket.io-client";
import ajax from "./functions/ajax";

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: (code, lang) =>
        highlight(getLanguage(lang) ? lang : "plaintext", code).value,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
});

Vue.prototype.$urls = urls;
Vue.prototype.$antd = Antd;
Vue.prototype.$ajax = ajax;
Vue.prototype.$humanDate = getHumanDate;
Vue.prototype.$marked = marked;
Vue.prototype.$joinTime = joinTime;
Vue.prototype.$humanDateLite = getHumanDateLite;

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        avatarSrc: "",
        loginStatus: false,
        navActive: 0,
        unreadCount: 0,
        isAdmin: false,
        uid: "",
        socket: undefined,
        noticeContent: "",
        wxGoPageTime: new Date().getTime(),
    },
    mutations: {
        setAvatarSrc(state, url) {
            state.avatarSrc = url;
        },
        setLoginStatus(state, status) {
            state.loginStatus = status;
        },
        setActiveNav(state, val) {
            state.navActive = val;
        },
        setUnreadCount(state, val) {
            state.unreadCount = Number.parseInt(val);
        },
        setisAdmin(state, val) {
            state.isAdmin = val;
        },
        setUid(state, val) {
            state.uid = val;
        },
        setSocket(state, socket) {
            state.socket = socket;
        },
        setNotifyContent(state, content) {
            state.noticeContent = content;
        },
        setLoginTime(state, val) {
            state.wxGoPageTime = val;
        },
    },
    actions: {
        async checkLoginStatus(context) {
            const responseRaw = await ajax.get(urls.myInfo);
            const response = responseRaw.data;
            if (response.code !== 1) {
                localStorage.removeItem("token");
                localStorage.removeItem("uid");
                context.commit("setLoginStatus", false);
                context.commit("setUnreadCount", 0);
                return;
            }
            context.commit("setAvatarSrc", response.msg.user.avatar);
            context.commit("setLoginStatus", true);
            context.commit("setisAdmin", response.msg.user.isAdmin);
            context.commit("setUid", response.msg.user.id);
            context.dispatch("updateUnreadMessage");
            if (context.state.socket === undefined) {
                const socket = io(urls.socket);
                socket.emit("login", response.msg.user.id);
                socket.on("pushMessage", (count, content) => {
                    context.commit("setUnreadCount", count);
                    context.commit("setNotifyContent", content);
                });
                context.commit("setSocket", socket);
            }
        },
        async updateUnreadMessage(context) {
            const messageCountResponseRaw = await ajax.get(urls.messageCount);
            const messageCountResponse = messageCountResponseRaw.data;
            if (messageCountResponse.code === 1) {
                context.commit(
                    "setUnreadCount",
                    Number.parseInt(messageCountResponse.msg.unread)
                );
            }
        },
    },
});

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App/>",
});
