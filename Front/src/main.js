import Vue from "vue";
import App from "./App";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vuex from "vuex";
import ajax from "./functions/ajax";
import urls from "./functions/urls";
import getHumanDate from "./functions/humanDate";

Vue.prototype.$urls = urls;
Vue.prototype.$antd = Antd;
Vue.prototype.$ajax = ajax;
Vue.prototype.$humanDate = getHumanDate;

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
    uid: ""
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
      state.unreadCount = val;
    },
    setisAdmin(state, val) {
      state.isAdmin = val;
    },
    setUid(state, val) {
      state.uid = val;
    }
  },
  actions: {
    async checkLoginStatus(context) {
      const responseRaw = await ajax.get(urls.myInfo);
      const response = responseRaw.data;
      if (response.code !== 1) {
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
        context.commit("setLoginStatus", false);
        context.commit("unreadCount", 0);
        return;
      }
      context.commit("setAvatarSrc", response.msg.user.avatar);
      context.commit("setLoginStatus", true);
      context.commit("setisAdmin", response.msg.user.isAdmin);
      context.commit("setUid", response.msg.user.id);
      const messageCountResponseRaw = await ajax.get(urls.messageCount);
      const messageCountResponse = messageCountResponseRaw.data;
      if (messageCountResponse.code === 1) {
        context.commit("setUnreadCount", Number.parseInt(messageCountResponse.msg.unread));
      }
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
