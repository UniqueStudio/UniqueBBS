<template>
  <div class="userMyWx">
    <a-alert message="以下资料同步自企业微信。" type="info" :showIcon="true"></a-alert>
    <a-input-group>
      <a-input addonBefore="姓名" readonly :value="wxInfo.username" size="large"/>
      <a-input addonBefore="邮箱" readonly :value="wxInfo.email" size="large"/>
      <a-input addonBefore="手机" readonly :value="wxInfo.mobile" size="large"/>
    </a-input-group>
    <div class="submit-container">
      <a-button icon="wechat" type="primary" @click="syncWxInfo" :disabled="syncBtnDisabled">同步</a-button>
    </div>
    <a-alert message="以下资料可自行更改，仅团队成员可见。" type="success" :showIcon="true"></a-alert>
    <a-input-group>
      <a-input addonBefore="昵称" v-model="detailInfo.nickname" size="large"/>
      <a-input addonBefore="学号" v-model="detailInfo.studentID" size="large"/>
      <a-input addonBefore="宿舍" v-model="detailInfo.dormitory" size="large"/>
      <a-input addonBefore=" Q Q " v-model="detailInfo.qq" size="large"/>
      <a-input addonBefore="微信" v-model="detailInfo.wechat" size="large"/>
      <a-input addonBefore="专业" v-model="detailInfo.major" size="large"/>
      <a-input addonBefore="班级" v-model="detailInfo.className" size="large"/>
      <a-input addonBefore="签名" v-model="detailInfo.signature" size="large"/>
    </a-input-group>
    <div class="submit-container">
      <a-button icon="check" type="primary" @click="updateInfo" :disabled="updateBtnDisabled">提交</a-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      wxInfo: {
        username: "",
        email: "",
        mobile: ""
      },
      detailInfo: {
        nickname: "",
        studentID: "",
        dormitory: "",
        qq: "",
        wechat: "",
        major: "",
        className: "",
        signature: ""
      },
      updateBtnDisabled: false,
      syncBtnDisabled: false
    };
  },
  computed: {
    keys1() {
      return Object.keys(this.wxInfo);
    },
    keys2() {
      return Object.keys(this.detailInfo);
    }
  },
  methods: {
    async syncWxInfo() {
      this.syncBtnDisabled = true;
      const responseRaw = await this.$ajax.post(this.$urls.syncWxInfo);
      const response = responseRaw.data;
      if (response.code === 1) {
        this.renderInfo();
        this.$notification.open({
          message: "资料同步",
          description: "资料同步成功！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "同步错误",
          content: response.msg
        });
      }
      this.syncBtnDisabled = false;
    },
    async renderInfo() {
      const responseRaw = await this.$ajax.get(this.$urls.myInfo);
      if (responseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }

      const response = responseRaw.data.msg.user;

      this.keys1.forEach(item => {
        this.wxInfo[item] = response[item];
      });

      this.keys2.forEach(item => {
        this.detailInfo[item] = response[item];
      });
    },
    async updateInfo() {
      this.updateBtnDisabled = true;
      const responseRaw = await this.$ajax.post(
        this.$urls.updateMyInfo,
        this.detailInfo
      );
      const response = responseRaw.data;
      if (response.code === 1) {
        this.$notification.open({
          message: "资料设定",
          description: "资料设定成功！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "设置错误",
          content: response.msg
        });
      }
      this.updateBtnDisabled = false;
    }
  },
  mounted() {
    this.renderInfo();
  }
};
</script>
<style scoped>
.userMyWx span {
  margin: 6px auto;
}
.submit-container {
  text-align: center;
  margin: 18px;
}
</style>
