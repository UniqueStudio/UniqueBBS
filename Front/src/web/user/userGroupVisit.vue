<template>
  <div class="user-group-visit">
    <router-link to="/user/grouplist">
      <div class="title-info" style="background:rgb(99, 76, 184);">
        <div class="title-icon">
          <a-icon type="team" class="title-item-icon"></a-icon>
          &nbsp;{{groupName}}
        </div>
      </div>
    </router-link>
    <div class="user-group-collections">
      <div v-for="user in groupUserList" :key="user.id" class="group-user-container">
        <div class="group-user-avatar">
          <router-link :to="'/user/visit/'+user.id">
            <a-avatar shape="circle" :src="user.avatar" class="avatar-img"></a-avatar>
          </router-link>
        </div>
        <div class="group-user-info">
          <router-link :to="'/user/visit/'+user.id">
            <span :style="{color: user.isAdmin? 'orange' : 'black'}">{{user.username}}</span>
          </router-link>
          <a-tag color="cyan" class="group-user-mobile">
            <a-icon type="mobile"/>
            {{user.mobile}}
          </a-tag>
          <p>{{user.signature}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      groupUserList: [],
      groupName: "",
      gid: "",
      groupColor: ""
    };
  },
  methods: {
    async getGroupUserList() {
      const { gid } = this.$route.params;
      this.gid = gid;
      const responseGroupInfoRaw = await this.$ajax.get(
        this.$urls.groupUsers(gid)
      );
      const responseGroupInfo = responseGroupInfoRaw.data;
      if (responseGroupInfo.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.groupUserList = responseGroupInfo.msg.list;
      this.groupName = responseGroupInfo.msg.info.name;
      this.groupColor = responseGroupInfo.msg.info.color;
    }
  },
  mounted() {
    this.getGroupUserList();
  }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
  .user-group-collections {
    width: 40%;
  }
}
@media screen and (max-width: 800px) {
  .user-group-collections {
    width: 80%;
  }
}
.user-group-collections {
  margin: 0 auto;
}
.user-group-collections {
  position: relative;
}
.user-group-collections {
  margin-top: 12px;
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
.group-user-mobile {
  position: absolute;
  right: 0;
}
</style>