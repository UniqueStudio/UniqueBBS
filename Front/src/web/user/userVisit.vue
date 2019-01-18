<template>
  <div class="user-visit">
    <div class="avatar-container">
      <a-avatar shape="circle" :src="userDatas.avatar" class="avatar-img" size="large"></a-avatar>
    </div>
    <h2 :style="{color: userDatas.isAdmin? 'orange': 'black'}">{{userDatas.username}}</h2>
    <div class="group-container">
      <a-tag color="orange" v-if="userDatas.isAdmin">
        <a-icon type="crown"/>&nbsp;管理员
      </a-tag>
      <div v-for="group in groupList" :key="group.id" class="group-item">
        <router-link :to="'/user/group/'+ group.id">
          <a-tag :color="group.color">
            <a-icon type="team"/>
            {{group.name}}
          </a-tag>
        </router-link>
      </div>

      <a-tag color="green">
        <a-icon type="clock-circle"/>
        {{lastLoginHumanDate}}
      </a-tag>
    </div>
    <h5>{{userDatas.signature}}</h5>
    <div class="user-detail-info">
      <a-input-group>
        <a-input
          addonBefore="邮箱"
          readonly
          :value="userDatas.email"
          size="large"
          v-if="userDatas.email !== ''"
        />
        <a-input
          addonBefore="手机"
          readonly
          :value="userDatas.mobile"
          size="large"
          v-if="userDatas.mobile !== ''"
        />
        <a-input
          addonBefore="学号"
          readonly
          v-model="userDatas.studentID"
          size="large"
          v-if="userDatas.studentID !== ''"
        />
        <a-input
          addonBefore="宿舍"
          readonly
          v-model="userDatas.dormitory"
          size="large"
          v-if="userDatas.dormitory !== ''"
        />
        <a-input
          addonBefore=" Q Q "
          readonly
          v-model="userDatas.qq"
          size="large"
          v-if="userDatas.qq !== ''"
        />
        <a-input
          addonBefore="微信"
          readonly
          v-model="userDatas.wechat"
          size="large"
          v-if="userDatas.wechat !== ''"
        />
        <a-input
          addonBefore="专业"
          readonly
          v-model="userDatas.major"
          size="large"
          v-if="userDatas.major !== ''"
        />
        <a-input
          addonBefore="班级"
          readonly
          v-model="userDatas.className"
          size="large"
          v-if="userDatas.className !== ''"
        />
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
        threads: 0,
        isAdmin: false
      },
      groupList: []
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
        return this.$store.dispatch("checkLoginStatus");
      }
      Object.keys(this.userDatas).forEach(item => {
        this.userDatas[item] = userInfo.data.msg.user[item];
      });
      this.groupList = userInfo.data.msg.group.map(item => ({
        name: item.name,
        color: item.color,
        id: item.id
      }));
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
h5 {
  text-align: center;
  user-select: none;
  margin: 0;
}
.group-item {
  display: inline-block;
}
.user-detail-info {
  margin-top: 36px;
}
.user-detail-info span {
  margin: 6px auto;
}
.last-login {
  color: gray;
}
.group-container {
  text-align: center;
}
</style>
