<template>
  <div class="user-group">
    <a-spin :spinning="showLoading" size="large">
      <div class="user-group-collections" v-for="group in groupList" :key="group.id">
        <h3>
          <router-link to="/user/grouplist">{{group.info.name}}</router-link>
        </h3>
        <div v-for="user in group.list" :key="user.id" class="group-user-container">
          <div class="group-user-avatar">
            <router-link :to="'/user/visit/'+user.id">
              <a-avatar shape="circle" :src="user.avatar" class="avatar-img"></a-avatar>
            </router-link>
          </div>
          <div class="group-user-info">
            <router-link :to="'/user/visit/'+user.id">
              <span :style="{color: user.isAdmin? 'orange' : 'black'}">{{user.username}}</span>
            </router-link>
            <rabbit-tag
              class="group-user-mobile"
              background="#CACAE5"
              color="#42427A"
            >{{user.mobile}}</rabbit-tag>
            <p>{{user.signature}}</p>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
const rabbitTag = () => import("../components/rabbitTag.vue");
export default {
    components: { "rabbit-tag": rabbitTag },
    data() {
        return {
            groupList: [],
            showLoading: true
        };
    },
    methods: {
        async getGroupList() {
            this.showLoading = true;
            const responseMyInfoRaw = await this.$ajax.get(this.$urls.myInfo);
            const responseMyInfo = responseMyInfoRaw.data;
            if (responseMyInfo.code !== 1) {
                this.showLoading = false;
                return this.$store.dispatch("checkLoginStatus");
            }
            const userGroupList = responseMyInfo.msg.group;
            this.groupList = await Promise.all(
                userGroupList.map(async item => {
                    const groupInfo = { id: item.id, name: item.name };
                    const memberList = await this.$ajax.get(
                        this.$urls.groupMemberList(item.id)
                    );
                    return { info: groupInfo, list: memberList.data.msg.list };
                })
            );
            this.showLoading = false;
        }
    },
    mounted() {
        this.getGroupList();
    }
};
</script>
<style scoped>
.user-group,
.user-group-collections {
    position: relative;
}
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
.group-user-mobile {
    position: absolute;
    right: 0;
    user-select: text !important;
}
</style>
