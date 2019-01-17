<template>
  <div id="root">
    <div class="nav">
      <div class="nav-logo">
        <img src="./logo.png" alt="Unique Studio Logo">
      </div>
      <div class="nav-item">
        <div class="nav-item-content">
          <div></div>
          <router-link to="/">
            <div class="nav-item-icon-container">
              <a-icon
                type="appstore"
                style="font-size:24px;"
                title="板块"
                :theme="navActive===0?'filled':'outlined'"
              />
            </div>
          </router-link>
          <router-link to="/forum">
            <div class="nav-item-icon-container">
              <a-icon
                type="pushpin"
                style="font-size:24px;"
                title="论坛"
                :theme="navActive===1?'filled':'outlined'"
              />
            </div>
          </router-link>
          <router-link to="/user">
            <div class="nav-item-icon-container">
              <a-icon
                type="star"
                style="font-size:24px;"
                title="个人"
                :theme="navActive===2?'filled':'outlined'"
              />
            </div>
          </router-link>
        </div>
      </div>
      <div class="nav-avatar">
        <a-dropdown placement="bottomRight" v-if="this.$store.state.loginStatus">
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="contacts"/>资料
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="key"/>密码
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="sound"/>消息
            </a-menu-item>
            <a-menu-item key="4">
              <a-icon type="team"/>组别
            </a-menu-item>
            <a-menu-item key="5">
              <a-icon type="copy"/>帖子
            </a-menu-item>
            <a-menu-divider key="6"></a-menu-divider>
            <a-menu-item key="7">
              <a-icon type="logout"/>注销
            </a-menu-item>
          </a-menu>
          <a-avatar shape="circle" :src="this.$store.state.avatarSrc" class="avatar-img"></a-avatar>
        </a-dropdown>
        <router-link to="/user/login/pwd" v-else>
          <a-avatar shape="circle" icon="cloud" class="avatar-img avatar-nologin"></a-avatar>
        </router-link>
      </div>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
    <footer>
      <p class="footer-left">
        <b>Unique BBS</b> v1.00
        <br>Code By
        <a href="https://github.com/ttzztztz" target="_blank">Rabbit</a> @ 811
      </p>
      <p class="footer-right">Unique Studio
        <br>January 30 2019
      </p>
    </footer>
  </div>
</template>
<script>
export default {
  methods: {
    handleMenuClick(e) {
      switch (e.key) {
        case "1":
          this.$router.push({ path: "/user/my/info" });
          break;
        case "2":
          this.$router.push({ path: "/user/my/pwdReset" });
          break;
        case "3":
          this.$router.push({ path: "/user/my/notice/1" });
          break;
        case "4":
          this.$router.push({ path: "/user/my/group" });
          break;
        case "5":
          this.$router.push({ path: "/user/my/threads/1" });
          break;
        case "7":
          if (confirm("您确定要注销吗？")) {
            localStorage.removeItem("token");
            localStorage.removeItem("uid");
            this.$store.commit("updateLoginStatus", false);
            this.$store.dispatch("checkLoginStatus");
            this.$router.push({ path: "/user/login/pwd" });
          }
          break;
      }
    }
  },
  mounted() {
    this.$store.dispatch("checkLoginStatus");
  },
  computed: {
    navActive() {
      return this.$store.state.navActive;
    }
  }
};
</script>
<style scoped>
.nav-item-ul a {
  color: white !important;
}
footer {
  margin: 32px 6%;
  display: grid;
  color: white;
  grid-template-columns: 50% 50%;
  user-select: none;
  cursor: default;
}
.footer-right {
  text-align: right;
}

@media screen and (max-width: 1000px) {
  .body {
    width: 95%;
    margin-left: 2.5%;
  }
  .nav {
    grid-template-columns: 20% 60% 20%;
  }
}
@media screen and (min-width: 1000px) {
  .body {
    width: 90%;
    margin-left: 5%;
  }
  .nav {
    grid-template-columns: 10% 80% 10%;
  }
}
.avatar-img {
  margin: 6px 24px;
}
.body {
  min-height: 900px;
  border-radius: 6px;
  background: white;
  position: relative;
  margin-top: 96px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 12px 1px;
  padding: 12px;
}
.nav {
  height: 60px;
  width: 100%;
  position: fixed;
  display: grid;
  background: rgba(45, 45, 45, 0.85);
  color: white;
  top: 0;
  z-index: 999;
  padding: 6px;
  transition: all 0.9s cubic-bezier(0.33, 0.63, 0.65, 0.99);
  user-select: none;
}
.nav:hover {
  background: rgb(45, 45, 45);
}
.nav-logo,
.nav-item,
.nav-avatar {
  display: inline-block;
  position: relative;
}
.nav-logo > img {
  width: 36px;
  height: 36px;
  margin: 6px 24px;
  position: absolute;
  right: 0;
}
.nav-avatar {
  width: 84px;
  height: 100%;
  cursor: pointer;
}
.nav-item {
  width: 100%;
  text-align: center;
  height: 100%;
}
.nav-item-content {
  display: grid;
  grid-template-columns: auto 64px 64px 64px auto;
  height: 100%;
}
.nav-item-icon-container {
  padding: 10px;
}
.nav-item-icon-container:hover,
.nav-logo:hover,
.avatar-img:hover {
  opacity: 0.5;
}
.nav-item-icon-container,
.avatar-img,
.nav-logo {
  transition: all 0.9s cubic-bezier(0.33, 0.63, 0.65, 0.99);
  cursor: pointer;
}
.footer-left > a,
.nav-item a {
  color: white;
}
.avatar-nologin {
  background-color: transparent;
  transform: scale(1.5, 1.5);
}
</style>