<template>
  <div class="thread">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$store.commit("setActiveNav", 1);
  }
};
</script>
<style scoped>
</style>
