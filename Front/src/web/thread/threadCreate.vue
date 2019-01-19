<template>
  <div class="thread-create">
    <div class="create-first-line" v-if="mode !== 2">
      <div class="create-forum-list-container">
        <a-select v-model="fid" class="forum-list-selector">
          <a-select-option
            v-for="forum in forumList"
            :value="forum.id"
            :key="forum.id"
          >{{forum.name}}</a-select-option>
        </a-select>
      </div>
      <div class="creaete-forum-subject">
        <a-input placeholder="帖子标题" v-model="subject"/>
      </div>
    </div>
    <div class="create-input">
      <codemirror v-model="message" :options="cmOptions"></codemirror>
      <div class="create-preview-container">
        <a-divider type="vertical" class="divider"></a-divider>
        <div class="create-preview" v-html="previewText"></div>
      </div>
    </div>
    <div class="bottom-controls">
      <div>
        <div class="thread-attach" v-if="mode !== 2">
          <a-upload
            name="attaches"
            :action="fileUploadUrl"
            @change="handleFileListChange"
            :headers="uploadHeaderSet"
            :multiple="true"
            :defaultFileList="attachList"
            v-if="showAttachList"
          >
            <a-button>
              <a-icon type="upload"/>附件上传
            </a-button>
          </a-upload>
        </div>
      </div>
      <div class="create-thread-btn">
        <a-button type="primary" icon="check" @click="handleBtnClick">{{execBtnText}}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/theme/idea.css";
import "./editor.css";
import marked from "marked";
export default {
  components: { marked, codemirror },
  data() {
    return {
      mode: 0,
      tid: "",
      pid: "",
      fid: "",
      subject: "",
      message: "",
      forumList: [],
      cmOptions: {
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        line: true,
        mode: "text/x-markdown",
        theme: "idea"
      },
      attachList: [],
      showAttachList: false
    };
  },
  computed: {
    uploadHeaderSet() {
      return {
        Authorization: localStorage.getItem("token")
      };
    },
    fileUploadUrl() {
      return this.$urls.fileUpload;
    },
    previewText() {
      return marked(this.message, { sanitize: true });
    },
    execBtnText() {
      let result = "发表帖子";
      switch (this.mode) {
        case 0:
          result = "发表帖子";
          break;
        case 1:
          result = "更新帖子";
          break;
        case 2:
          result = "更新回帖";
          break;
      }
      return result;
    }
  },
  methods: {
    async getAttachList() {
      const unlinkListRaw = await this.$ajax.get(this.$urls.attachUnlink);
      if (unlinkListRaw.data.code === 1) {
        const unLinkList = unlinkListRaw.data.msg;
        this.attachList = [
          ...this.attachList,
          ...unLinkList.map(item => ({
            uid: item.id,
            response: {
              code: 1,
              msg: item.id
            },
            name: item.originalName,
            status: "done"
          }))
        ];
      }
      this.showAttachList = true;
    },
    async deleteAttach(aid) {
      const response = await this.$ajax.post(this.$urls.attachRemove(aid));
    },
    handleFileListChange({ file, fileList }) {
      if (file.status === "removed") {
        this.deleteAttach(file.response.msg);
      }
      this.attachList = fileList;
    },
    async getForumList() {
      const threadListReponseRaw = await this.$ajax.get(
        this.$urls.forumListSimple
      );
      if (threadListReponseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.forumList = threadListReponseRaw.data.msg;

      if (this.$route.params.fid) {
        this.fid = this.$route.params.fid;
      } else {
        this.fid = this.forumList[0].id;
      }
    },
    markedConfig() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });
    },
    handleBtnClick() {
      const mode = this.$route.meta.mode;
      const THREAD_CREATE = 0,
        THREAD_UPDATE = 1,
        POST_UPDATE = 2;
      switch (mode) {
        case THREAD_CREATE:
          this.createThread();
          break;
        case THREAD_UPDATE:
          this.updateThread();
          break;
        case POST_UPDATE:
          this.updatePost();
          break;
      }
    },
    async updateThread() {
      const responseRaw = await this.$ajax.post(
        this.$urls.threadUpdate(this.tid),
        {
          fid: this.fid,
          subject: this.subject,
          message: this.message,
          fileListArr: this.attachList.map(item => item.response.msg)
        }
      );
      if (responseRaw.data.code === 1) {
        this.$router.push({
          path: `/thread/info/${this.tid}/1`
        });
        this.$notification.open({
          message: "更新主题",
          description: "主题更新成功！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "更新错误",
          content: responseRaw.data.msg
        });
      }
    },
    async createThread() {
      const responseRaw = await this.$ajax.post(this.$urls.threadCreate, {
        fid: this.fid,
        subject: this.subject,
        message: this.message,
        fileListArr: this.attachList.map(item => item.response.msg)
      });
      if (responseRaw.data.code === 1) {
        const tid = responseRaw.data.msg;
        this.$router.push({
          path: `/thread/info/${tid}/1`
        });
        this.$notification.open({
          message: "发表主题",
          description: "发帖成功！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "发帖错误",
          content: responseRaw.data.msg
        });
      }
    },
    async getThreadInfo(tid) {
      const threadInfoRaw = await this.$ajax.get(this.$urls.threadInfo(tid, 1));
      if (threadInfoRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "错误",
          content: threadInfoRaw.data.msg
        });
        return;
      }
      this.fid = threadInfoRaw.data.msg.forumInfo.id;
      this.subject = threadInfoRaw.data.msg.threadInfo.subject;
      this.message = threadInfoRaw.data.msg.firstPost.message;

      this.attachList = threadInfoRaw.data.msg.attachArr.map(item => ({
        uid: item.id,
        response: {
          code: 1,
          msg: item.id
        },
        name: item.originalName,
        status: "done"
      }));

      this.getAttachList();
    },
    async updatePost() {
      const updatePostInfoRaw = await this.$ajax.post(
        this.$urls.postUpdate(this.pid),
        {
          message: this.message
        }
      );
      if (updatePostInfoRaw.data.code === 1) {
        const tid = updatePostInfoRaw.data.msg;
        this.$router.push({
          path: `/thread/info/${tid}/1`
        });
        this.$notification.open({
          message: "更新回帖",
          description: "回帖更新成功！",
          icon: <a-icon type="smile" style="color: #108ee9" />
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "错误",
          content: updatePostInfoRaw.data.msg
        });
      }
    },
    async getReplyInfo(pid) {
      const replyInfoRaw = await this.$ajax.get(this.$urls.postInfo(pid));
      if (replyInfoRaw.data.code !== 1) {
        const modal = this.$error();
        modal.update({
          title: "错误",
          content: replyInfoRaw.data.msg
        });
        return;
      }
      this.message = replyInfoRaw.data.msg.message;
      this.pid = replyInfoRaw.data.msg.id;
    }
  },
  mounted() {
    this.mode = this.$route.meta.mode;
    if (this.mode === 1) {
      this.tid = this.$route.params.tid;
      this.getThreadInfo(this.tid);
    } else if (this.mode === 2) {
      this.pid = this.$route.params.pid;
      this.getReplyInfo(this.pid);
    }
    if (this.mode === 0) {
      this.getAttachList();
    }
    this.getForumList();
    this.markedConfig();
  }
};
</script>
<style scoped>
@media screen and (max-width: 800px) {
  .thread-create {
    width: 100%;
  }
  .divider,
  .create-preview {
    display: none;
  }
  .create-input {
    grid-template-columns: 100% 0;
  }
  .create-input {
    height: 40vh;
  }
  .create-first-line {
    grid-template-columns: 40% 60%;
  }
  .bottom-controls {
    grid-template-columns: 50% 50%;
  }
}
@media screen and (min-width: 800px) {
  .thread-create {
    width: 80%;
    margin: 24px auto;
  }
  .divider {
    position: absolute;
    left: 0;
    height: 100%;
  }
  .create-input {
    grid-template-columns: 50% 50%;
  }
  .create-input {
    height: 55vh;
  }
  .create-first-line {
    grid-template-columns: 20% 80%;
  }
  .bottom-controls {
    grid-template-columns: 70% 30%;
  }
}
.bottom-controls {
  display: grid;
  margin-top: 24px;
}
.create-thread-btn {
  text-align: right;
}
.create-first-line {
  display: grid;
}
.forum-list-selector {
  display: block;
}
.creaete-forum-subject {
  margin-left: 12px;
}
.create-second-line {
  margin: 24px auto;
}
.create-input {
  display: grid;
  margin-top: 36px;
}
.create-preview {
  margin-left: 18px;
}
.create-preview-container,
.create-preview {
  position: relative;
}
</style>