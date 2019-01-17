<template>
  <div class="user-my-notice">
    <div class="user-my-notice-control">
      <a-button type="primary" @click="readAllMessagesHandle">全部已读</a-button>
      <a-button type="primary" @click="deleteAllMessagesHandle">全部删除</a-button>
    </div>
    <a-comment
      v-for="message in messageList"
      :key="message.messageItem.id"
      @click="clickMessage(message.messageItem.id,message.messageItem.url)"
      :data-url="message.url"
      class="message-item"
    >
      <div slot="author" class="message-sender">
        <a-tag :color="message.fromUser.isAdmin?'orange':'blue'">
          <a-icon :type="message.fromUser.isAdmin?'crown': 'user'"/>
          {{message.fromUser.username}}
        </a-tag>
        <a-tag color="green">
          <a-icon type="clock-circle"/>
          {{getMessageHumandate(message.messageItem.createDate)}}
        </a-tag>
      </div>
      <a-avatar :src="message.fromUser.avatar" slot="avatar"/>
      <div slot="content">
        <a-tag color="orange" v-if="!message.messageItem.isRead">
          <a-icon type="eye"/>&nbsp;未读
        </a-tag>
        {{message.messageItem.message}}
      </div>
    </a-comment>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messageList: []
    };
  },
  computed: {
    page() {
      const { page } = this.$route.params;
      return page;
    }
  },
  methods: {
    readAllMessagesHandle() {
      if (confirm("是否要将全部消息设置为已读？")) {
        readAllMessages();
      }
    },
    deleteAllMessagesHandle() {
      if (confirm("是否要将全部消息删除？")) {
        deleteAllMessages();
      }
    },
    getMessageHumandate(str) {
      const date = new Date(str);
      return this.$humanDate(date);
    },
    clickMessage(id, url) {
      this.readMessage(id);
      if (url !== null) {
        this.$router.push({ path: url });
      }
    },
    async getMessageList() {
      const messageListResponseRaw = await this.$ajax.get(
        this.$urls.messageList(this.page)
      );
      if (messageListResponseRaw.data.code !== 1) {
        return this.$dispute("checkLoginStatus");
      }
      this.messageList = messageListResponseRaw.data.msg;
    },
    async deleteMessage(e) {
      const mid = e.key;
      const responseRaw = await this.$ajax.post(this.$urls.messageIsRead(mid));
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$message.success("消息已删除！", 3);
        this.getMessageList();
      }
    },
    async readMessage(mid) {
      await this.$ajax.post(this.$urls.messageRead(mid));
      this.getMessageList();
    },
    async readAllMessages(e) {
      const responseRaw = await this.$ajax.post(this.$urls.messageReadAll);
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$message.success("消息已全部设置为已读！", 3);
        this.getMessageList();
      }
    },
    async deleteAllMessages(e) {
      const responseRaw = await this.$ajax.post(this.$urls.messageDeleteAll);
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$message.success("消息已清空！", 3);
        this.getMessageList();
      }
    }
  },
  mounted() {
    this.getMessageList();
  }
};
</script>
<style scoped>
.message-item {
  cursor: pointer;
}
.message-sender {
  font-size: 14px;
}
.user-my-notice-control {
  margin-top: 18px;
  text-align: right;
}
</style>
