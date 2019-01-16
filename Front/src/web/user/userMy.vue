<template>
  <div class="userMy">
    <a-menu mode="horizontal" class="user-nav" v-model="activeMyNavItem">
      <a-menu-item key="0">
        <router-link to="/user/my/info">
          <a-icon type="contacts"/>
          <span class="user-nav-text">资料</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="1">
        <router-link to="/user/my/pwdReset">
          <a-icon type="key"/>
          <span class="user-nav-text">密码</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="2">
        <router-link to="/user/my/report">
          <a-icon type="ordered-list"/>
          <span class="user-nav-text">Report</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="3">
        <router-link to="/user/my/group">
          <a-icon type="team"/>
          <span class="user-nav-text">组别</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="4">
        <router-link to="/user/my/threads/1">
          <a-icon type="copy"/>
          <span class="user-nav-text">帖子</span>
        </router-link>
      </a-menu-item>
    </a-menu>
    <div class="avatar-container">
      <a-avatar shape="circle" :src="userAvatarSrc" class="avatar-img" size="large"></a-avatar>
    </div>
    <div class="user-view-container">
      <router-view @changeNav="activeMyNavItem[0] =$event;"></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeMyNavItem: ["0"]
    };
  },
  computed: {
    userAvatarSrc() {
      return this.$store.state.avatarSrc;
    }
  }
};
</script>
<style scoped>
.user-nav {
  text-align: center;
}
@media screen and (min-width: 800px) {
  .user-view-container {
    width: 40%;
  }
}
@media screen and (max-width: 800px) {
  .user-view-container {
    width: 80%;
  }
  .user-nav-text {
    display: none;
  }
}
.user-view-container {
  margin: 72px auto;
}
.avatar-container {
  text-align: center;
  margin: 72px;
}
.avatar-img {
  transform: scale(3, 3);
}
</style>
