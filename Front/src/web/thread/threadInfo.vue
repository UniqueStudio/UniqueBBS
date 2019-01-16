<template>
  <div class="thread-info">
    <div class="thread-main-content">
      <div class="user-avatar-container">
        <router-link :to="'/user/visit/'+user.id">
          <a-avatar :src="user.avatar" class="user-avatar"></a-avatar>
        </router-link>
      </div>
      <div class="thread-main-info">
        <p class="thread-subject">{{thread.subject}}</p>
        <p class="thread-sub-info">
          <a-icon type="user"/>
          {{user.username}}&nbsp;
          <a-tag v-for="group in groupList" :key="group.id" :color="group.color">{{group.name}}</a-tag>
          <span :title="fullCreateDate">
            <a-icon type="clock-circle"/>
            {{createDate}}&nbsp;
          </span>
          <a-icon type="message"/>
          {{postCount}}
        </p>
      </div>
    </div>
    <div class="thread-content">{{content}}</div>
    <div></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      thread: {
        id: 0,
        subject: "",
        createDate: ""
      },
      user: {
        id: 0,
        username: "",
        avatar: ""
      },
      postList: [],
      tid: "0",
      page: "0",
      postCount: 0,
      attachList: [],
      content: "",
      groupList: [],
      defaultPageSize: 20
    };
  },
  computed: {
    createDate() {
      return this.$humanDate(new Date(this.thread.createDate));
    },
    fullCreateDate() {
      const date = new Date(this.thread.createDate);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
  },
  methods: {
    getHumanDate(str) {
      return this.$humanDate(new Date(str));
    },
    async getThreadInfo() {
      this.tid = this.$route.params.tid;
      this.page = this.$route.params.page;
      const threadInfoResponseRaw = await this.$ajax.get(
        this.$urls.threadInfo(this.tid, this.page)
      );
      const threadInfoResponse = threadInfoResponseRaw.data;
      if (threadInfoResponse.code === 1) {
        const data = threadInfoResponse.msg;
        Object.keys(this.thread).forEach(item => {
          this.thread[item] = data.threadInfo[item];
        });
        Object.keys(this.user).forEach(item => {
          this.user[item] = data.threadAuthor[item];
        });

        this.postList = data.postArr;
        this.attachList = data.attachArr;
        this.content = data.firstPost.message;
      } else {
        return this.$store.dispute("updateLoginStatus");
      }
      const userGroupListResponseRaw = await this.$ajax.get(
        this.$urls.userGroup(this.user.id)
      );

      const userGroupListResponse = userGroupListResponseRaw.data;
      if (userGroupListResponse.code !== 1) {
        return this.$store.dispute("updateLoginStatus");
      }
      this.groupList = userGroupListResponse.msg.map(item => ({
        name: item.name,
        color: item.color
      }));
    }
  },
  mounted() {
    this.getThreadInfo();
  }
};
</script>
<style scoped>
.thread-main-content {
  display: grid;
  grid-template-columns: 30% 70%;
  height: 72px;
  margin-top: 18px;
}
.user-avatar {
  height: 72px;
  width: 72px;
}
.user-avatar-container {
  text-align: right;
}
.thread-main-info {
  padding: 0 18px;
}
.thread-subject {
  font-size: 20px;
}
.thread-main-info p {
  padding: 0;
  margin: 0;
}
.thread-sub-info {
  color: #777;
  font-size: 14px;
  margin-top: 6px !important;
}
.thread-content {
  margin: 12px 30%;
}
</style>
