<template>
  <div class="user-login-wx">
    <div class="title-info" style="background:#00752f;">
      <div class="title-icon">
        <a-icon type="wechat" class="title-item-icon"></a-icon>&nbsp;使用企业微信扫码登录
      </div>
    </div>
    <div class="qr-code-container">
      <img :src="keySrc" alt="QR CODE">
    </div>
    <div class="btn-container">
      <router-link to="/user/login/pwd">
        <a-button icon="key" type="primary">使用账号密码登录</a-button>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      keySrc: "",
      key: "",
      isFinished: false
    };
  },
  methods: {
    async getKey() {
      const responseRaw = await this.$ajax.get(this.$urls.wxLoginGetKey);
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "认证错误",
          content: "企业微信二维码获取错误，请刷新页面后重试！"
        });
      } else {
        const key = responseRaw.data.msg;
        this.key = key;
        this.keySrc = `https://open.work.weixin.qq.com/wwopen/sso/qrImg?key=${key}`;
        const statusRaw = await this.$ajax.get(
          this.$urls.wxLoginGetStatus(this.key)
        );
        if (this.isFinished) return;
        if (statusRaw.data.code === 1) {
          this.isFinished = true;
          const response = statusRaw.data;
          const token = response.msg.token;
          const uid = response.msg.uid;
          localStorage.setItem("token", token);
          localStorage.setItem("uid", uid);
          this.$store.commit("setLoginStatus", true);
          this.$store.dispatch("checkLoginStatus");
          this.$notification.open({
            message: "登录",
            description: "登陆成功，欢迎回来！",
            icon: <a-icon type="smile" style="color: #108ee9" />
          });
          this.$router.push({ path: "/user/my/info" });
        } else if (statusRaw.data.code === -2) {
          this.isFinished = true;
          const modal = this.$error();
          modal.update({
            title: "认证错误",
            content: statusRaw.data.msg
          });
          this.keySrc = "";
          this.key = "";
        }
      }
    }
  },
  mounted() {
    this.getKey();
    this.isFinished = false;
  }
};
</script>
<style scoped>
.qr-code-container {
  text-align: center;
  margin-top: 12px;
}
.title-info {
  margin: -12px -12px 24px -12px;
  border-radius: 5px 5px 0 0;
  height: 52px;
  user-select: none;
}
.title-icon {
  text-align: center;
  color: white;
}
.title-info-name {
  text-align: center;
  color: white;
}
.title-item-icon {
  font-size: 16px;
  margin-top: 18px;
}
.btn-container {
  margin-top: 36px;
  text-align: center;
}
</style>
