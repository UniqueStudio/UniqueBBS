// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import Vuex from "vuex";
import axios from "axios";

const domain = "http://localhost:7010/";
const urls = {
  login: `${domain}user/login/pwd`,
  myInfo: `${domain}user/my/info`,
  updateMyInfo: `${domain}user/update/normal`,
  updateMyPwd: `${domain}user/update/pwd`
};
const ajax = {
  async get(url, obj) {
    const token = localStorage.getItem("token");
    axios.defaults.headers.get["Authorization"] = token;
    return await axios.get(url, obj);
  },
  async post(url, obj) {
    const token = localStorage.getItem("token");
    axios.defaults.headers.post["Authorization"] = token;
    return await axios.post(url, obj);
  }
};

Vue.prototype.$urls = urls;
Vue.prototype.$axios = axios;
Vue.prototype.$antd = Antd;
Vue.prototype.$ajax = ajax;

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    avatarSrc: "http://p.qlogo.cn/bizmail/DaKOA6aHxn24gyNbZg1ZeEuiaDwI83BxRkg16o7nMOJ6WFZAEtzBIpA/",
    loginStatus: false
  },
  mutations: {
    updateAvatarSrc(state, url) {
      state.avatarSrc = url;
    },
    updateLoginStatus(state, status) {
      state.loginStatus = status;
    }
  },
  actions: {
    async updateAvatarSrcAsync(context) {
      const responseRaw = await ajax.get(urls.myInfo);
      const response = responseRaw.data;
      if (response.code === 1) {
        context.commit("updateAvatarSrc", response.msg.avatar);
        context.commit("updateLoginStatus", true);
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
