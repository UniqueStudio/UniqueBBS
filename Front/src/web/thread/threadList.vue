<template>
  <div class="thread-list">
    <div class="forum-info">
      <div class="forum-icon">
        <div class="forum-item-icon-bg" :style="{backgroundColor:forum.backgroundColor}">
          <a-icon :type="forum.icon" class="forum-item-icon"></a-icon>
        </div>
      </div>
      <div class="forum-description">
        <p class="forum-info-name">
          {{forum.name}}
          <span class="forum-info-number">
            <a-icon type="message"/>
            {{forum.threads}}
          </span>
        </p>
        <p class="forum-info-description">{{forum.description}}</p>
      </div>
    </div>
    <div class="thread-list-items">
      <div class="thread-item" v-for="thread in threadList" :key="thread.id">
        <div class="thread-item-author">
          <a-avatar shape="circle" :src="thread.user.avatar" class="avatar-img"></a-avatar>
        </div>
        <div class="thread-item-info">
          <p class="thread-item-info-subject">
            <router-link :to="'/thread/info/'+thread.thread.id+'/1'">{{thread.thread.subject}}</router-link>
          </p>
          <p class="thread-item-info-author">
            <a-icon type="message"/>
            {{thread.thread.postCount}}&nbsp;
            <a-icon type="clock-circle"/>
            {{humanDate(new Date(thread.thread.createDate))}} &nbsp;
            <a-icon type="user"/>
            {{thread.user.username}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      threadList: [],
      forum: {
        backgroundColor: "gray",
        name: "板块",
        description: "板块描述",
        threads: 0,
        icon: "check"
      },
      fid: "0",
      page: "0"
    };
  },
  methods: {
    humanDate(date) {
      return this.$humanDate(date);
    },
    async getData() {
      this.fid = this.$route.params.fid;
      this.page = this.$route.params.page;
      const threadListResponseRaw = await this.$ajax.get(
        this.$urls.threadList(this.fid, this.page)
      );
      const threadListResponse = threadListResponseRaw.data;
      if (threadListResponse.code === 1) {
        this.threadList = [
          ...threadListResponse.msg.top,
          ...threadListResponse.msg.list
        ];

        ["name", "description", "threads"].forEach(item => {
          this.forum[item] = threadListResponse.msg.forum[item];
        });

        const iconCollection = threadListResponse.msg.forum.icon.split("|");
        this.forum.icon = iconCollection[0];
        this.forum.backgroundColor = iconCollection[1];
      } else {
        this.$store.dispatch("checkLoginStatus");
      }
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
  .thread-list {
    width: 80%;
  }
  .thread-item-info-subject {
    font-size: 20px;
  }
  .thread-item-info-author {
    font-size: 14px;
  }
}
@media screen and (max-width: 800px) {
  .thread-list {
    width: 95%;
  }
  .thread-item-info-subject {
    font-size: 18px;
  }
  .thread-item-info-author {
    font-size: 12px;
  }
}
.forum-info-name {
  font-size: 20px;
}
.thread-list {
  margin: 12px auto;
}
.forum-info {
  display: grid;
  grid-template-columns: 30% 70%;
  margin: 64px auto;
}
.forum-icon {
  text-align: right;
}
.forum-item-icon-bg {
  display: inline-block;
  height: 72px;
  width: 72px;
  border-radius: 36px;
}
.forum-item-icon {
  color: white;
  font-size: 36px;
  height: 72px;
  width: 72px;
  margin-top: 18px;
}
.forum-description {
  padding: 0 36px;
}
.forum-info-description {
  color: #777;
}
.forum-description p,
.thread-item-info p {
  margin-bottom: 0;
  margin-top: 0;
}
.forum-info-number {
  color: dodgerblue;
  margin: 12px;
}
.thread-item {
  display: grid;
  grid-template-columns: 30% 70%;
  margin: 12px auto;
  height: 72px;
}
.thread-item-info {
  padding: 0 16px;
}
.avatar-img {
  height: 48px;
  width: 48px;
}
.thread-item-author {
  text-align: right;
}
</style>