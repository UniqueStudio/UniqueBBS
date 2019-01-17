<template>
  <div class="thread-list">
    <div class="forum-info" :style="{backgroundColor:forum.backgroundColor}">
      <div class="forum-icon">
        <a-icon :type="forum.icon" class="forum-item-icon"></a-icon>
      </div>
      <div class="forum-info-name">{{forum.name}}</div>
      <div class="forum-number-name">
        <a-icon type="message"/>
        {{forum.threads}}
      </div>
    </div>
    <div class="thread-list-items">
      <div class="thread-item" v-for="thread in threadList" :key="thread.id">
        <div class="thread-item-author">
          <router-link :to="'/user/visit/'+thread.user.id">
            <a-avatar shape="circle" :src="thread.user.avatar" class="avatar-img"></a-avatar>
          </router-link>
        </div>
        <div class="thread-item-info">
          <p class="thread-item-info-subject">
            <router-link :to="'/thread/info/'+thread.thread.id+'/1'">{{thread.thread.subject}}</router-link>
          </p>
          <p>
            <a-tag :color="thread.user.isAdmin? 'orange': 'blue'">
              <a-icon :type="thread.user.isAdmin? 'crown' : 'user'"/>
              {{thread.user.username}}
            </a-tag>
            <a-tag color="green">
              <a-icon type="clock-circle"/>
              {{humanDate(new Date(thread.thread.createDate))}}
            </a-tag>
            <a-tag color="purple">
              <a-icon type="message"/>
              {{thread.thread.postCount}}
            </a-tag>
          </p>
        </div>
        <div class="thread-item-last-reply">
          <p class="thread-item-info-reply-message">
            <router-link :to="'/thread/info/'+thread.thread.id+'/1'">{{thread.lastReply[0].message}}</router-link>
          </p>
          <p class="thread-item-info-author">
            <a-tag color="green">
              <a-icon type="clock-circle"/>
              {{humanDate(new Date(thread.thread.lastDate))}}
            </a-tag>
          </p>
        </div>
      </div>
      <div class="pagination" v-if="forum.threads > defaultPageSize">
        <a-pagination
          :current="page"
          :defaultPageSize="defaultPageSize"
          :total="forum.threads"
          @change="pageOnchange"
        ></a-pagination>
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
      page: 0,
      defaultPageSize: 20
    };
  },
  computed: {},
  methods: {
    pageOnchange(page) {
      this.$router.push({
        path: `/thread/list/${this.fid}/${page}`
      });
      this.getData();
    },
    humanDate(date) {
      return this.$humanDate(date);
    },
    async getData() {
      this.fid = this.$route.params.fid;
      this.page = Number.parseInt(this.$route.params.page);
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
  .thread-item-info-subject {
    font-size: 20px;
  }
  .thread-item {
    grid-template-columns: 20% 50% 30%;
  }
}
@media screen and (max-width: 800px) {
  .thread-item-info-subject {
    font-size: 18px;
  }
  .thread-item {
    grid-template-columns: 20% 80%;
  }
  .thread-item-last-reply {
    display: none;
  }
}
.thread-item-info-reply-message {
  font-size: 14px;
}
.forum-info-name {
  font-size: 20px;
}
.forum-info {
  margin: -12px -12px 36px -12px;
  border-radius: 6px 6px 0 0;
  height: 172px;
  user-select: none;
}
.forum-icon {
  text-align: center;
  padding-top: 16px;
}
.forum-number-name,
.forum-info-name {
  text-align: center;
  color: white;
}
.forum-info-name {
  margin-top: -8px;
}
.forum-item-icon {
  color: white;
  font-size: 36px;
  height: 72px;
  width: 72px;
  margin-top: 18px;
}
.forum-info-description {
  color: #777;
}
.thread-item-info p,
.thread-item-last-reply p {
  margin-bottom: 0;
  margin-top: 0;
}
.thread-item {
  display: grid;
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
.pagination {
  text-align: center;
  margin: 36px auto;
}
</style>