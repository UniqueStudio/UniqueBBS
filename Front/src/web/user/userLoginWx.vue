<template>
  <div class="user-login-wx">
    <div class="title-info" style="background:#00752f;">
      <div class="title-icon">
        <a-icon type="wechat" class="title-item-icon"></a-icon>
        &nbsp;{{titleMsg}}
      </div>
    </div>
    <a-spin :spinning="showLoading" size="large">
      <div class="qr-code-container">
        <img :src="keySrc" alt="QR CODE">
      </div>
    </a-spin>
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
            onPage: false,
            titleMsg: "使用企业微信扫码登录",
            showLoading: true
        };
    },
    methods: {
        async getKey() {
            const pageIntoTime = this.$store.state.wxGoPageTime;

            const responseRaw = await this.$ajax.get(this.$urls.wxLoginGetKey);
            this.titleMsg = "使用企业微信扫码登录";

            if (responseRaw.data.code !== 1) {
                const modal = this.$error();
                modal.update({
                    title: "认证错误",
                    content: "企业微信二维码获取错误，请刷新页面后重试！"
                });
                this.showLoading = false;
            } else {
                const key = responseRaw.data.msg;
                this.key = key;
                this.keySrc = `https://open.work.weixin.qq.com/wwopen/sso/qrImg?key=${key}`;
                this.showLoading = false;
                let statusRaw = await this.getStatusRaw();
                if (this.$store.state.wxGoPageTime !== pageIntoTime) {
                    return;
                }
                while (statusRaw.data.code === -1) {
                    // like Sleep(500ms)
                    await new Promise(resolve => setTimeout(resolve, 500));
                    statusRaw = await this.getStatusRaw();
                }
                if (statusRaw.data.code === 1) {
                    const response = statusRaw.data;
                    const token = response.msg.token;
                    const uid = response.msg.uid;
                    localStorage.setItem("token", token);
                    localStorage.setItem("uid", uid);
                    this.$store.commit("setLoginStatus", true);
                    this.$store.dispatch("checkLoginStatus");
                    this.$notification.open({
                        message: "登录",
                        description: "登录成功，欢迎回来！",
                        icon: <a-icon type="smile" style="color: #108ee9" />
                    });
                    this.$router.push({ path: "/user/my/info" });
                } else if (
                    statusRaw.data.code === -2 &&
                    !this.$store.state.loginStatus &&
                    this.onPage
                ) {
                    this.keySrc = "";
                    this.key = "";
                    this.titleMsg = "正在重新获取二维码";
                    this.getKey();
                }
            }
        }
    },
    mounted() {
        this.onPage = true;
        this.$store.commit("setLoginTime", new Date().getTime());
        this.getKey();
    },
    beforeDestroy() {
        this.onPage = false;
    },
    methods: {
        async getStatusRaw() {
            return await this.$ajax.get(
                this.$urls.wxLoginGetStatus(this.key)
            );
        }
    }
};
</script>
<style scoped>
.qr-code-container {
    text-align: center;
    margin-top: 12px;
}
.btn-container {
    margin-top: 36px;
    text-align: center;
}
</style>
