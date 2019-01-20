<template>
  <div class="user-my-notice">
    <div class="user-my-notice-control">
      <h3>消息列表</h3>
      <div class="user-my-notice-btn-container" v-if="messageList.length > 0">
        <a-button type="primary" @click="readAllMessagesHandle" :disabled="isReadDisabled">全部已读</a-button>
        <a-button type="primary" @click="deleteAllMessagesHandle" :disabled="deleteAllDisabled">全部删除</a-button>
      </div>
    </div>
    <a-comment
      v-for="message in messageList"
      :key="message.messageItem.id"
      :data-url="message.url"
      class="message-item"
    >
      <div slot="author" class="message-sender">
        <a-tag
          :color="message.fromUser.isAdmin?'orange':'blue'"
          @click="jumpToUser(message.fromUser.id)"
        >
          <a-icon :type="message.fromUser.isAdmin?'crown': 'user'"/>
          {{message.fromUser.username}}
        </a-tag>
        <a-tag color="green">
          <a-icon type="clock-circle"/>
          {{getMessageHumandate(message.messageItem.createDate)}}
        </a-tag>
        <div class="right-message">
          <a-tag color="orange" class="message-read-status" v-if="message.messageItem.isRead">
            <a-icon type="smile"/>&nbsp;已读
          </a-tag>
          <a-tag color="orange" class="message-read-status" v-else>
            <a-icon type="eye"/>&nbsp;未读
          </a-tag>
          <a-tag color="red" @click="deleteMessage(message.messageItem.id)">
            <a-icon type="scissor"/>&nbsp;删除
          </a-tag>
        </div>
      </div>
      <a-avatar
        :src="message.fromUser.avatar"
        slot="avatar"
        @click="jumpToUser(message.fromUser.id)"
      />
      <div
        slot="content"
        @click="clickMessage(message.messageItem.id,message.messageItem.url)"
        :class="{'bold-message': !message.messageItem.isRead}"
      >{{message.messageItem.message}}</div>
    </a-comment>
    <div class="pagination" v-if="totalMessages > defaultPageSize">
      <a-pagination
        :current="page"
        :defaultPageSize="defaultPageSize"
        :total="totalMessages"
        @change="pageOnchange"
      ></a-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      messageList: [],
      isReadDisabled: false,
      deleteAllDisabled: false,
      defaultPageSize: 20,
      totalMessages: 0,
      page: 1
    };
  },
  methods: {
    jumpToUser(uid) {
      this.$router.push({
        path: `/user/visit/${uid}`
      });
    },
    pageOnchange(page) {
      this.page = Number.parseInt(page);
      this.$router.push({
        path: `/user/my/notice/${page}`
      });
      this.getMessageList();
    },
    readAllMessagesHandle() {
      if (confirm("是否要将全部消息设置为已读？")) {
        this.readAllMessages();
      }
    },
    deleteAllMessagesHandle() {
      if (confirm("是否要将全部消息删除？")) {
        this.deleteAllMessages();
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
      this.$store.dispatch("updateUnreadMessage");
      const messageCountResponseRaw = await this.$ajax.get(
        this.$urls.messageCount
      );

      if (messageCountResponseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.totalMessages = Number.parseInt(
        messageCountResponseRaw.data.msg.total
      );

      const messageListResponseRaw = await this.$ajax.get(
        this.$urls.messageList(this.page)
      );

      if (messageListResponseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.messageList = messageListResponseRaw.data.msg;
    },
    async deleteMessage(mid) {
      const responseRaw = await this.$ajax.post(this.$urls.messageDelete(mid));
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$notification.open({
          message: "消息",
          description: "消息已经全部删除！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.getMessageList();
      }
      this.$store.dispatch("updateUnreadMessage");
    },
    async readMessage(mid) {
      await this.$ajax.post(this.$urls.messageRead(mid));
      this.getMessageList();
      this.$store.dispatch("updateUnreadMessage");
    },
    async readAllMessages(e) {
      this.isReadDisabled = true;
      const responseRaw = await this.$ajax.post(this.$urls.messageReadAll);
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$notification.open({
          message: "消息",
          description: "消息已经全部设为已读！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.getMessageList();
      }
      this.$store.dispatch("updateUnreadMessage");
      this.isReadDisabled = false;
    },
    async deleteAllMessages(e) {
      this.deleteAllDisabled = true;
      const responseRaw = await this.$ajax.post(this.$urls.messageDeleteAll);
      if (responseRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "消息错误",
          content: responseRaw.data.msg
        });
      } else {
        this.$notification.open({
          message: "消息",
          description: "消息已经清空！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
        this.getMessageList();
      }
      this.$store.dispatch("updateUnreadMessage");
      this.deleteAllDisabled = false;
    }
  },
  mounted() {
    this.page = Number.parseInt(this.$route.params.page);
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
  position: relative;
}
.user-my-notice-btn-container {
  text-align: right;
  position: absolute;
  display: inline-block;
  right: 0;
}
.user-my-notice-control h3 {
  display: inline-block;
}
.user-my-notice {
  position: relative;
}
.user-my-notice-control {
  user-select: none;
}
.right-message {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
}
@media screen and (max-width: 800px) {
  .message-read-status {
    display: none;
  }
}
.bold-message {
  font-weight: 700;
}
</style>
