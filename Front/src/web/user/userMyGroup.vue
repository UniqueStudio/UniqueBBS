<template>
  <div class="user-group">
    <div class="user-group-collections" v-for="group in groupList" :key="group.id">
      <h3>{{group.info.name}}</h3>
      <div v-for="user in group.list" :key="user.id" class="group-user-container">
        <div class="group-user-avatar">
          <router-link :to="'/user/visit/'+user.id">
            <a-avatar shape="circle" :src="user.avatar" class="avatar-img"></a-avatar>
          </router-link>
        </div>
        <div class="group-user-info">
          <span :style="{color: user.isAdmin? 'red' : 'black'}">{{user.username}}</span>
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
      const responseMyInfoRaw = await this.$ajax.get(this.$urls.myInfo);
      const responseMyInfo = responseMyInfoRaw.data;
      if (responseMyInfo.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      const userGroupList = responseMyInfo.msg.group;
      this.groupList = await Promise.all(
        userGroupList.map(async item => {
          const groupInfo = { id: item.id, name: item.name };
          const memberList = await this.$ajax.get(
            this.$urls.groupMemberList(item.id)
          );
          return { info: groupInfo, list: memberList.data.msg };
        })
      );
    }
  },
  mounted() {
    this.$emit("changeNav", "3");
    this.getGroupList();
  }
};
</script>
<style scoped>
.user-group-collections {
  margin-top: 64px;
}
.group-user-container {
  display: grid;
  grid-template-columns: 20% 80%;
  margin: 24px 0;
}
.group-user-avatar {
  text-align: right;
}
.avatar-img {
  height: 48px;
  width: 48px;
}
.group-user-info {
  padding: 0 18px;
}
h3 {
  text-align: center;
}
</style>
