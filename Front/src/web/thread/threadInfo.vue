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
        <div class="thread-sub">
          <p class="thread-sub-info">
            <a-tag :color="user.isAdmin?'red':'blue'">
              <a-icon type="user"/>
              {{user.username}}
            </a-tag>&nbsp;
            <a-tag
              v-for="group in groupList"
              :key="group.id"
              :color="group.color"
              class="user-group"
            >{{group.name}}</a-tag>
            <a-tag color="green" :title="fullCreateDate">
              <a-icon type="clock-circle"/>
              {{createDate}}
            </a-tag>
            <a-tag color="purple">
              <a-icon type="message"/>
              {{postCount}}
            </a-tag>
          </p>
          <div class="thread-content">{{content}}</div>
        </div>
      </div>
    </div>
    <div class="thread-admin"></div>
    <div class="thread-post-list">
      <div class="thread-post-list-item" v-for="post in postList" :key="post.id">
        <div class="thread-post-list-item-avatar-container">
          <router-link :to="'/user/visit/'+post.user.id">
            <a-avatar :src="post.user.avatar" class="user-avatar-small"></a-avatar>
          </router-link>
        </div>
        <div class="thread-post-list-item-content">
          <p class="thread-post-list-item-author-info">
            <router-link :to="'/user/visit/'+post.user.id">
              <a-tag :color="user.isAdmin?'red':'blue'">
                <a-icon type="user"/>
                {{user.username}}
              </a-tag>
            </router-link>&nbsp;
            <a-tag
              v-for="group in post.group"
              :key="group.id"
              :color="group.color"
              class="user-group"
            >{{group.name}}</a-tag>
            <a-tag color="green" :title="getFullCreateDate(post.post.createDate)">
              <a-icon type="clock-circle"/>
              {{getHumanDate(post.post.createDate)}}&nbsp;
            </a-tag>
          </p>
          <div>{{post.post.message}}</div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="postCount > defaultPageSize">
      <a-pagination
        :current="page"
        :defaultPageSize="defaultPageSize"
        :total="postCount"
        @change="pageOnchange"
      ></a-pagination>
    </div>
    <div class="thread-send-post">
      <div class="thread-post-list-item">
        <div class="thread-post-list-item-avatar-container">
          <a-avatar :src="readerAvatar" class="user-avatar-small"></a-avatar>
        </div>
        <div class="thread-post-list-item-content">
          <a-input type="textarea" v-model="replyInput"></a-input>
          <div class="thread-post-reply-btn">
            <a-button icon="message" type="primary" @click="reply" :disabled="btnDisabled">回帖</a-button>
          </div>
        </div>
      </div>
    </div>
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
        avatar: "",
        isAdmin: false
      },
      postList: [],
      tid: "0",
      page: 0,
      postCount: 0,
      attachList: [],
      content: "",
      groupList: [],
      defaultPageSize: 20,
      replyInput: "",
      quote: -1,
      btnDisabled: false
    };
  },
  computed: {
    createDate() {
      return this.$humanDate(new Date(this.thread.createDate));
    },
    fullCreateDate() {
      const date = new Date(this.thread.createDate);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    readerAvatar() {
      return this.$store.state.avatarSrc;
    }
  },
  methods: {
    pageOnchange(page) {
      this.$router.push({
        path: `/thread/info/${this.tid}/${page}`
      });
      this.getThreadInfo();
    },
    async reply() {
      this.btnDisabled = true;
      const replyRepsonseRaw = await this.$ajax.post(this.$urls.threadReply, {
        tid: this.thread.id,
        quote: this.quote,
        message: this.replyInput
      });
      if (replyRepsonseRaw.data.code === 1) {
        this.$message.success("回帖成功！", 3);
        this.replyInput = "";
        this.getThreadInfo();
      } else {
        const modal = this.$error();
        modal.update({
          title: "回帖错误",
          content: replyRepsonseRaw.data.msg
        });
      }
      this.btnDisabled = false;
    },
    getHumanDate(str) {
      return this.$humanDate(new Date(str));
    },
    getFullCreateDate(str) {
      const date = new Date(str);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    },
    async getThreadInfo() {
      this.tid = this.$route.params.tid;
      this.page = Number.parseInt(this.$route.params.page);
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
        this.postCount = data.threadInfo.postCount;
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
@media screen and (min-width: 800px) {
  .thread-main-content,
  .thread-post-list-item {
    grid-template-columns: 25% 50% 25%;
  }
  .user-avatar {
    height: 72px;
    width: 72px;
  }
  .user-avatar-small {
    height: 48px;
    width: 48px;
  }
  .thread-main-info,
  .thread-post-list-item-content {
    padding: 0 0 0 18px;
  }
}
@media screen and (max-width: 800px) {
  .thread-main-content,
  .thread-post-list-item {
    grid-template-columns: 15% 85%;
  }
  .user-avatar {
    height: 48px;
    width: 48px;
  }
  .user-avatar-small {
    height: 36px;
    width: 36px;
  }
  .user-group {
    display: none;
  }
  .thread-main-info,
  .thread-post-list-item-content {
    padding: 0 0 0 12px;
  }
}
.thread-main-content {
  display: grid;
  height: 72px;
  margin-top: 18px;
}
.user-avatar-container,
.thread-post-list-item-avatar-container {
  text-align: right;
}
.thread-subject {
  font-size: 20px;
}
.thread-main-info p,
.thread-post-list-item-content p {
  padding: 0;
  margin: 0;
}
.thread-sub-info {
  margin-top: 6px !important;
}
.thread-content {
  margin-top: 12px;
}
.thread-post-list-item {
  display: grid;
  margin-bottom: 32px;
}
.thread-post-list {
  margin-top: 48px;
}
.thread-post-list-item-author-info,
.thread-sub-info {
  color: #777;
  font-size: 14px;
}
.thread-post-reply-btn {
  text-align: right;
  margin-top: 12px;
}
.pagination {
  text-align: center;
  margin: 36px auto;
}
</style>
