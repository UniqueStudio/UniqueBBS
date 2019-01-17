<template>
  <div class="userLoginPwd">
    <div class="team-logo-container">
      <img src="./unique.jpg" class="team-logo" alt="team-logo">
    </div>
    <h1>登录</h1>
    <div class="login-container">
      <a-input-group>
        <a-input addonBefore="昵称" v-model="nickname"/>
        <a-input addonBefore="密码" v-model="pwd" type="password" @keyup.enter="login"/>
      </a-input-group>
    </div>
    <div class="login-btn-container">
      <a-button
        icon="login"
        type="primary"
        @click="login"
        id="login"
        :disabled="loginBtnDisabled"
      >登录</a-button>
    </div>
    <div>
      <a-button icon="wechat" type="primary">使用企业微信登录</a-button>
    </div>
  </div>
</template>
<script>
import * as crypto from "crypto";
export default {
  data() {
    return {
      nickname: "",
      pwd: "",
      loginBtnDisabled: false
    };
  },
  computed: {
    pwd_md5() {
      const md5 = crypto.createHash("md5");
      return md5.update(this.pwd).digest("hex");
    }
  },
  methods: {
    async login() {
      this.loginBtnDisabled = true;
      document.getElementById("login").focus();
      const nickname = this.nickname;
      const pwd = this.pwd_md5;
      const result = await this.$ajax.post(this.$urls.login, {
        nickname: nickname,
        pwd: pwd
      });
      const response = result.data;
      if (response.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "登录错误",
          content: response.msg
        });
        localStorage.removeItem("token");
        localStorage.removeItem("uid");
      } else {
        const token = response.msg.token;
        const uid = response.msg.uid;
        localStorage.setItem("token", token);
        localStorage.setItem("uid", uid);
        this.$store.commit("updateLoginStatus", true);
        this.$store.dispatch("checkLoginStatus");
        this.$message.success("登录成功！", 3);
        this.$router.push({ path: "/user/my/info" });
      }
      this.loginBtnDisabled = false;
    }
  }
};
</script>
<style scoped>
.login-btn-container {
  margin: 12px 0 36px 0;
}
.team-logo-container {
  margin: 48px auto;
  text-align: center;
}
.team-logo {
  width: 140px;
  height: 140px;
  border-radius: 70px;
}
.userLoginPwd {
  text-align: center;
}
h1 {
  user-select: none;
}
@media screen and (min-width: 800px) {
  .login-container {
    width: 35%;
  }
}
@media screen and (max-width: 800px) {
  .login-container {
    width: 80%;
  }
}
.login-container span {
  margin: 6px auto;
}
.login-container {
  margin: 6px auto;
}
</style>
