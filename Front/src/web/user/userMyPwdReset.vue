<template>
  <div class="userMyPwdReset">
    <a-alert message="如果之前没有设定过旧密码，则旧密码为空，无需填写。" type="info" showIcon="true"></a-alert>
    <a-input-group>
      <a-input addonBefore="请输入旧密码" v-model="oldPwd" type="password" size="large"/>
      <a-input addonBefore="请输入新密码" v-model="newPwd" type="password" size="large"/>
      <a-input addonBefore="重新输入密码" v-model="repeatPwd" type="password" size="large"/>
    </a-input-group>
    <div class="submit-container">
      <a-button icon="key" type="primary" @click="updatePwd" :disabled="resetBtnDisabled">重设密码</a-button>
    </div>
  </div>
</template>
<script>
import * as crypto from "crypto";
export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      repeatPwd: "",
      resetBtnDisabled: false
    };
  },
  computed: {
    newPwdMd5() {
      const md5 = crypto.createHash("md5");
      return md5.update(this.newPwd).digest("hex");
    },
    oldPwdMd5() {
      const md5 = crypto.createHash("md5");
      return md5.update(this.oldPwd).digest("hex");
    }
  },
  methods: {
    async updatePwd() {
      this.resetBtnDisabled = true;
      if (this.newPwd !== this.repeatPwd) {
        const modal = this.$error();
        modal.update({
          title: "密码错误",
          content: "两次输入的密码不一致，请检查后重新输入！"
        });
      } else {
        const responseRaw = await this.$ajax.post(this.$urls.updateMyPwd, {
          previousPwd: this.oldPwdMd5,
          newPwd: this.newPwdMd5
        });

        const response = responseRaw.data;

        if (response.code !== 1) {
          const modal = this.$error();
          modal.update({
            title: "密码错误",
            content: response.msg
          });
        } else {
          this.$message.success("新密码设置成功！", 3);
        }
      }
      this.resetBtnDisabled = true;
    }
  },
  mounted() {}
};
</script>
<style scoped>
.userMyPwdReset span {
  margin: 6px auto;
}
.submit-container {
  text-align: center;
}
</style>
