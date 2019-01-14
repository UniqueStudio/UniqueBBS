<template>
  <div id="root">
    <div class="nav">
      <div class="nav-logo">
        <img src="./logo.png" alt="Unique Studio Logo">
      </div>
      <div class="nav-user">
        
      </div>
    </div>
    <div class="body">
      <router-view>

      </router-view>
    </div>
    <footer>
      <p class="footer-left">
        Powered By <b>Unique BBS</b> v1.00<br>Code By <a href="https://github.com/ttzztztz" target="_blank">Rabbit</a> @ 811
      </p>
      <p class="footer-right">
        <b>Unique Studio</b> @ HUST<br>January 14 2019
      </p>
    </footer>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
footer {
  margin: 48px 10%;
  display: grid;
  grid-template-columns: 50% 50%;
}
.footer-right{
  text-align: right;
}
.body {
  min-height: 1800px;
  border-radius: 32px;
  background:white;
  position: relative;
  width:90%;
  margin-left:5%;
  margin-top:96px;
  box-shadow:rgba(0, 0, 0, 0.02) 0px 0px 12px 1px;
}
.nav {
  height: 48px;
  width: 100%;
  position: fixed;
  background: rgba(45,45,45,0.9);
  color:white;
  top:0;
  z-index:999;
}
.nav {
  transition: all .9s cubic-bezier(.33, .63, .65, .99);
}
.nav:hover{
  background: rgb(45,45,45);
}
.nav-logo,
.nav-user {
  display: inline-block;
  position: relative;
}
.nav-logo > img {
  width: 36px;
  height: 36px;
  margin: 6px 24px;
}
.nav-user {
  position: absolute;
  right: 24px;
  top: 6px;
  width: 24px;
  height: 24px;
}
</style>
