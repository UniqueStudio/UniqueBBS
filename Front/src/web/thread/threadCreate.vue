<template>
  <div class="thread-create">
    <div class="create-first-line">
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
    <div class="create-thread-btn">
      <a-button type="primary" icon="check" @click="createThread">发表帖子</a-button>
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
      }
    };
  },
  computed: {
    previewText() {
      return marked(this.message, { sanitize: true });
    }
  },
  methods: {
    async getForumList() {
      const threadListReponseRaw = await this.$ajax.get(
        this.$urls.forumListSimple
      );
      if (threadListReponseRaw.data.code !== 1) {
        return this.$store.dispatch("checkLoginStatus");
      }
      this.forumList = threadListReponseRaw.data.msg;
      this.fid = this.forumList[0].id;
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
    async createThread() {
      const responseRaw = await this.$ajax.post(this.$urls.threadCreate, {
        fid: this.fid,
        subject: this.subject,
        message: this.message
      });
      if (responseRaw.data.code === 1) {
        const tid = responseRaw.data.msg;
        this.$router.push({
          path: `/thread/info/${tid}/1`
        });
        this.$message.success("发帖成功！", 3);
      } else {
        const modal = this.$error();
        modal.update({
          title: "发帖错误",
          content: responseRaw.data.msg
        });
      }
    }
  },
  mounted() {
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
}
.create-thread-btn {
  margin-top: 24px;
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