<template>
  <div class="user-my-threads-list">
    <div class="user-my-thread-item" v-for="thread in threadList" :key="thread.id">
      <p class="thread-item-subject">
        <router-link :to="'/thread/info/'+thread.id+'/1'">{{thread.subject}}</router-link>
      </p>
      <p class="thread-item-content">
        <a-tag color="purple">
          <a-icon type="message"/>
          {{thread.postCount}}
        </a-tag>
        <a-tag color="green">
          <a-icon type="clock-circle"/>
          {{getHumanDate(thread.createDate)}}
        </a-tag>
      </p>
    </div>
    <div class="pagination" v-if="all > defaultPageSize">
      <a-pagination
        :current="page"
        :defaultPageSize="defaultPageSize"
        :total="all"
        @change="pageOnchange"
      ></a-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      threadList: [],
      all: 0,
      page: 0,
      defaultPageSize: 20
    };
  },
  methods: {
    pageOnchange(page) {
      this.$router.push({
        path: `/user/my/threads/${page}`
      });
      this.getMyThreadList();
    },
    async getMyThreadList() {
      const uid = localStorage.getItem("uid");
      this.page = Number.parseInt(this.$route.params.page);
      const myThreadListRaw = await this.$ajax.get(
        this.$urls.userThreadList(uid, this.page.toString())
      );
      if (myThreadListRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      const { list, count } = myThreadListRaw.data.msg;
      this.threadList = list;
      this.all = count;
    },
    getHumanDate(str) {
      const date = new Date(str);
      return this.$humanDate(date);
    }
  },
  mounted() {
    this.getMyThreadList();
  }
};
</script>
<style scoped>
.user-my-threads-list p {
  margin: 0;
  padding: 0;
}
.user-my-thread-item {
  margin: 24px 0;
}
.thread-item-subject {
  font-size: 18px;
}
</style>