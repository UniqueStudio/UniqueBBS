<template>
  <div class="userMyWx">
    <a-alert message="以下资料同步自企业微信。" type="info" showIcon="true"></a-alert>
    <a-input-group>
      <a-input addonBefore="姓名" readonly :value="wxInfo.username" size="large"/>
      <a-input addonBefore="邮箱" readonly :value="wxInfo.email" size="large"/>
      <a-input addonBefore="手机" readonly :value="wxInfo.mobile" size="large"/>
    </a-input-group>
    <div class="submit-container">
      <a-button icon="wechat" type="primary">同步</a-button>
    </div>
    <a-alert message="以下资料可自行更改。" type="success" showIcon="true"></a-alert>
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
      <a-button icon="check" type="primary" @click="updateInfo">提交</a-button>
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
      }
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
    async renderInfo() {
      const responseRaw = await this.$ajax.get(this.$urls.myInfo);
      const response = responseRaw.data.msg;

      this.keys1.forEach(item => {
        this.wxInfo[item] = response[item];
      });

      this.keys2.forEach(item => {
        this.detailInfo[item] = response[item];
      });
    },
    async updateInfo() {
      const response = await this.$ajax.post(
        this.$urls.updateMyInfo,
        this.detailInfo
      );
      const result = response.data;
      if (result.code === 1) {
        this.$message.success("设置成功！", 3);
      } else {
        const modal = this.$error();
        modal.update({
          title: "设置错误",
          content: result.msg
        });
      }
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
