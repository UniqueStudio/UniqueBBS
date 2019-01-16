<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      const loginStatus = this.$store.state.loginStatus;
      if (to.matched.some(item => item.meta.requireLogin) && !loginStatus) {
        next({
          path: "/user/login/pwd"
        });
      } else if (
        to.matched.some(item => item.meta.requireUnLogin) &&
        loginStatus
      ) {
        next({
          path: "/user/my/info"
        });
      } else {
        next();
      }
    });
  }
};
</script>

<style>
#app {
  font-family: "Microsoft Yahei", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
