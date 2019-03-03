<template>
  <div class="userMy">
    <a-menu
      mode="horizontal"
      class="user-nav"
      :defaultSelectedKeys="getSelectedKeys()"
      :selectedKeys="getSelectedKeys()"
    >
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
        <router-link to="/user/my/notice/1">
          <a-icon type="sound"/>
          <span class="user-nav-text">消息</span>
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
    <div class="avatar-container" v-if="$route.meta.showAvatar">
      <a-avatar shape="circle" :src="userAvatarSrc" class="avatar-img" size="large"></a-avatar>
    </div>
    <div :class="{'user-view-container':true,'user-view-container-margin':$route.meta.showAvatar}">
      <router-view @changeNav="activeMyNavItem[0] =$event;"></router-view>
    </div>
  </div>
</template>
<script>
export default {
    computed: {
        userAvatarSrc() {
            return this.$store.state.avatarSrc;
        }
    },
    methods: {
        getSelectedKeys() {
            return [this.$route.meta.key];
        }
    }
};
</script>
<style scoped>
.user-nav {
    text-align: center;
    user-select: none;
}
@media screen and (min-width: 800px) {
    .user-view-container {
        width: 40%;
    }
}
@media screen and (max-width: 800px) {
    .user-view-container {
        width: 90%;
    }
    .user-nav-text {
        display: none;
    }
}
.user-view-container {
    margin: auto;
}
.user-view-container-margin {
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
