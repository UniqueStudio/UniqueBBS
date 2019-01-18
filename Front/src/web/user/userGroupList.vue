<template>
  <div class="user-group-list">
    <div class="user-group-item" v-for="group in groupList" :key="group.id">
      <div class="group-icon-container">
        <div class="group-icon-bg" :style="{backgroundColor:group.group.color}">
          <a-icon type="team" class="group-icon"></a-icon>
        </div>
      </div>
      <div class="group-name">
        <div>
          <router-link :to="'/user/group/'+group.group.id">
            <span class="group-name-title">{{group.group.name}}</span>
          </router-link>
        </div>
        <div class="group-info">
          <router-link :to="'/user/visit/'+group.master.id">
            <a-tag color="orange">
              <a-icon type="crown"/>
              {{group.master.username}}
            </a-tag>
          </router-link>
          <a-tag color="cyan" class="group-number">
            <a-icon type="team"/>
            {{group.count}}人
          </a-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      groupList: []
    };
  },
  methods: {
    async getGroupList() {
      const responseRaw = await this.$ajax.get(this.$urls.groupList);
      if (responseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.groupList = responseRaw.data.msg;
    }
  },
  mounted() {
    this.getGroupList();
  }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
  .user-group-list {
    width: 40%;
  }
  .user-group-item {
    grid-template-columns: 30% 70%;
  }
}
@media screen and (max-width: 800px) {
  .user-group-list {
    width: 80%;
  }
  .user-group-item {
    grid-template-columns: 25% 75%;
  }
}
.user-group-list {
  margin: 48px auto;
}
.user-group-item {
  display: grid;
  margin: 48px auto;
}
.group-name {
  padding: 0 16px;
}
.group-icon-container {
  text-align: right;
}
.group-icon-bg {
  height: 72px;
  width: 72px;
  border-radius: 36px;
  display: inline-block;
}
.group-icon {
  color: white;
  font-size: 36px;
  height: 72px;
  width: 72px;
  margin-top: 16px;
}
.group-name-title {
  font-size: 20px;
}
.group-info {
  margin-top: 12px;
}
.group-number {
  position: absolute;
  right: 0;
}
.group-info,
.group-name {
  position: relative;
}
</style>
