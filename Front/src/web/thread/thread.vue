<template>
  <div class="thread">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
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
