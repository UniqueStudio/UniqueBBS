<template>
  <div class="user">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$store.commit("setActiveNav", 2);
  }
};
</script>
<style scoped>
</style>