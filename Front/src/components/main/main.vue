<template>
  <div id="root">
    <div class="nav">
      <div class="nav-logo">
        <img src="./logo.png" alt="Unique Studio Logo">
      </div>
      <div class="nav-item">
        <div class="nav-item-content">
          <div></div>
          <div class="nav-item-icon-container">
            <a-icon type="appstore" style="font-size:24px;" theme="filled"/>
          </div>
          <div class="nav-item-icon-container">
            <a-icon type="pushpin" style="font-size:24px;" title="论坛"/>
          </div>
          <div class="nav-item-icon-container">
            <a-icon type="star" style="font-size:24px;" title="个人"/>
          </div>
        </div>
      </div>
      <div class="nav-avatar">
        <a-avatar shape="circle" :src="userAvatarSrc" class="avatar-img"></a-avatar>
      </div>
    </div>
    <div class="body">
      <router-view @changeAvatar="userAvatarSrc = $event;"></router-view>
    </div>
    <footer>
      <p class="footer-left">
        <b>Unique BBS</b> v1.00
        <br>Code By
        <a href="https://github.com/ttzztztz" target="_blank">Rabbit</a> @ 811
      </p>
      <p class="footer-right">Unique Studio
        <br>January 14 2019
      </p>
    </footer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userAvatarSrc:
        "http://p.qlogo.cn/bizmail/DaKOA6aHxn24gyNbZg1ZeEuiaDwI83BxRkg16o7nMOJ6WFZAEtzBIpA/"
    };
  },
  methods:{

  }
};
</script>
<style scoped>
.nav-item-ul a {
  color: white !important;
}
footer {
  margin: 32px 7%;
  display: grid;
  color: white;
  grid-template-columns: 50% 50%;
  user-select: none;
  cursor:default;
}
.footer-right {
  text-align: right;
}

@media screen and (max-width: 800px) {
  .body {
    width: 95%;
    margin-left: 2.5%;
  }
  .nav {
    grid-template-columns: 20% 60% 20%;
  }
}
@media screen and (min-width: 800px) {
  .body {
    width: 90%;
    margin-left: 5%;
  }
  .nav {
    grid-template-columns: 5% 90% 5%;
  }
}
.avatar-img {
  margin: 6px 24px;
}
.body {
  min-height: 1800px;
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
.nav-avatar:hover,
.nav-logo:hover {
  opacity: 0.5;
}
.nav-item-icon-container,
.nav-avatar,
.nav-logo {
  transition: all 0.9s cubic-bezier(0.33, 0.63, 0.65, 0.99);
  cursor: pointer;
}
</style>