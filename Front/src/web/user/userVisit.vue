<template>
  <div class="user-visit">
    <div class="avatar-container">
      <a-avatar shape="circle" :src="userDatas.avatar" class="avatar-img" size="large"></a-avatar>
    </div>
    <h2>{{userDatas.username}}</h2>
    <h4>{{group.join(" ")}}</h4>
    <h5>上次登录：{{lastLoginHumanDate}}</h5>
    <div class="user-detail-info">
      <a-input-group>
        <a-input addonBefore="姓名" readonly :value="userDatas.username" size="large"/>
        <a-input addonBefore="邮箱" readonly :value="userDatas.email" size="large"/>
        <a-input addonBefore="手机" readonly :value="userDatas.mobile" size="large"/>
        <a-input addonBefore="昵称" readonly v-model="userDatas.nickname" size="large"/>
        <a-input addonBefore="学号" readonly v-model="userDatas.studentID" size="large"/>
        <a-input addonBefore="宿舍" readonly v-model="userDatas.dormitory" size="large"/>
        <a-input addonBefore=" Q Q " readonly v-model="userDatas.qq" size="large"/>
        <a-input addonBefore="微信" readonly v-model="userDatas.wechat" size="large"/>
        <a-input addonBefore="专业" readonly v-model="userDatas.major" size="large"/>
        <a-input addonBefore="班级" readonly v-model="userDatas.className" size="large"/>
        <a-input addonBefore="签名" readonly v-model="userDatas.signature" size="large"/>
      </a-input-group>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uid: "",
      userDatas: {
        avatar: "",
        username: "",
        email: "",
        mobile: "",
        studentID: "",
        dormitory: "",
        qq: "",
        wechat: "",
        major: "",
        className: "",
        signature: "",
        lastLogin: "",
        threads: 0
      },
      group: []
    };
  },
  computed: {
    lastLoginHumanDate() {
      return this.$humanDate(new Date(this.userDatas.lastLogin));
    }
  },
  methods: {
    async getUserInfo() {
      this.uid = this.$route.params.uid;
      const userInfo = await this.$ajax.get(this.$urls.userInfo(this.uid));

      if (userInfo.data.code !== 1) {
        return this.$store.dispute("checkLoginStatus");
      }
      Object.keys(this.userDatas).forEach(item => {
        this.userDatas[item] = userInfo.data.msg.user[item];
      });
      this.group = userInfo.data.msg.group.map(item => item.name);
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
  .user-detail-info {
    width: 40%;
  }
}
@media screen and (max-width: 800px) {
  .user-detail-info {
    width: 80%;
  }
}
.user-detail-info {
  margin: 0 auto;
}
.avatar-container {
  text-align: center;
  margin: 72px;
}
.avatar-img {
  transform: scale(3, 3);
}
h2,
h4,
h5 {
  text-align: center;
}
.user-detail-info {
  margin-top: 36px;
}
.user-detail-info span {
  margin: 6px auto;
}
</style>
