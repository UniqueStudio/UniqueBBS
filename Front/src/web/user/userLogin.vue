<template>
  <div class="userLogin">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus;
    }
  },
  watch: {
    loginStatus(newVal, oldVal) {
      if (newVal) {
        this.$router.push({
          path: "/user/my/info"
        });
      }
    }
  }
};
</script>
<style scoped>
</style>
