<template>
  <div>
    <div class="title-info" style="background:rgb(99, 76, 184);">
      <div class="title-icon">
        <a-icon type="api" class="title-item-icon"></a-icon>&nbsp;管理面板
      </div>
    </div>
    <div class="admin-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
@media screen and (min-width: 800px) {
    .admin-container {
        width: 40%;
    }
}
@media screen and (max-width: 800px) {
    .admin-container {
        width: 90%;
    }
}
.admin-container {
    margin: 24px auto;
}
</style>
