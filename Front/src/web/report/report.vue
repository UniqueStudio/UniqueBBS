<template>
  <div class="report">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
    mounted() {
        this.$store.commit("setActiveNav", 0);
    }
};
</script>
<style scoped>
</style>