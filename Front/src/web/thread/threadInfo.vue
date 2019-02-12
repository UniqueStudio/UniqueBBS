<template>
  <div class="thread-info" id="thread-info">
    <router-link :to="'/thread/list/'+forum.id+'/1'">
      <div class="title-info" :style="{backgroundColor:forum.color}">
        <div class="title-icon">
          <a-icon :type="forum.icon" class="title-item-icon"></a-icon>
          &nbsp;
          {{forum.name}}
        </div>
      </div>
    </router-link>
    <div :class="{'thread-main-content':true,'no-active-filter':!thread.active}">
      <div class="user-avatar-container">
        <router-link :to="'/user/visit/'+author.id">
          <a-avatar :src="author.avatar" class="user-avatar"></a-avatar>
        </router-link>
      </div>
      <div class="thread-main-info">
        <p class="thread-subject">
          <span v-if="thread.top" :title="thread.top===1 ? '本版置顶':'全局置顶'">
            <a-icon type="arrow-up" :style="{color: thread.top===1 ? 'orange' : 'red'}"/>
          </span>
          {{thread.subject}}
        </p>
        <div class="thread-sub">
          <a-drawer
            title="帖子删除"
            placement="top"
            :visible="deleteDiag.visible"
            @close="deleteDiag.visible=false;"
          >
            <div class="drawer-content">
              <div>帖子删除不可逆，请谨慎操作！</div>
              <div class="drawer-btn-container">
                <a-button
                  type="primary"
                  @click="handleDelete(0)"
                  title="软删除后，帖子仍在数据库中，仅管理员可见。"
                  v-if="!(isAdmin && !deleteDiag.active)"
                >{{isAdmin? '软删除' : '删除'}}</a-button>
                <a-button
                  type="primary"
                  @click="handleDelete(1)"
                  title="硬删除不可逆，删除后将无法恢复，请谨慎操作！"
                  v-if="isAdmin"
                >硬删除</a-button>
                <a-button
                  type="primary"
                  @click="handleDelete(2)"
                  title="用于恢复被软删除的帖子，仅管理员可操作！"
                  v-if="isAdmin"
                >恢复</a-button>
              </div>
            </div>
          </a-drawer>
          <div class="thread-sub-info">
            <a-tag color="cyan" v-if="thread.diamond">
              <a-icon type="star"/>
              <span class="mobile-hidden-text">&nbsp;精华</span>
            </a-tag>
            <a-tag color="red" v-if="thread.closed">
              <a-icon type="lock"/>
              <span class="mobile-hidden-text">&nbsp;锁定</span>
            </a-tag>
            <router-link :to="'/user/visit/'+author.id">
              <a-tag :color="author.isAdmin?'orange':'cyan'">
                <a-icon :type="author.isAdmin?'crown': 'user'"/>
                {{author.username}}
              </a-tag>
            </router-link>&nbsp;
            <div class="user-group" v-for="group in groupList" :key="group.id">
              <router-link :to="'/user/group/'+group.id">
                <a-tag :color="group.color" class="user-group">
                  <a-icon type="team"/>
                  {{group.name}}
                </a-tag>
              </router-link>
            </div>
            <a-tag color="purple" class="thread-item-info-messages">
              <a-icon type="message"/>
              {{postCount}}
            </a-tag>
          </div>
          <div class="thread-content show-markdown" v-html="content" @click="handleAtClick"></div>
          <div class="thread-attach-list post-quote" v-if="attachList.length !== 0">
            <h5>附件列表</h5>
            <div v-for="attach in attachList" :key="attach.id" class="attach-item">
              <a :href="attachDownload(attach.id)" target="_blank">
                <a-tag color="cyan" :title="getTitle(attach)">
                  <a-icon type="paper-clip"/>
                  {{attach.originalName.length > 12? attach.originalName.substr(0,12)+'...' :attach.originalName}}
                </a-tag>
              </a>
            </div>
          </div>
          <div class="thread-signature">
            <div :title="fullCreateDate">
              <a-icon type="clock-circle"/>
              {{createDate}}
            </div>
            <div v-if="author.signature !== ''">
              <a-icon type="pushpin"/>
              {{author.signature}}
            </div>
          </div>
          <a-divider class="thread-divider"></a-divider>
        </div>
      </div>
    </div>
    <div class="thread-admin">
      <router-link :to="'/thread/update/'+thread.id">
        <a-tag color="blue" v-if="isAdmin || myUid===author.id">
          <a-icon type="edit"/>&nbsp;编辑
        </a-tag>
      </router-link>
      <a-tag color="red" v-if="isAdmin || myUid===author.id" @click="handleThreadDelete">
        <a-icon type="delete"/>
        &nbsp;{{thread.active? '删除' : '恢复'}}
      </a-tag>
      <a-tag color="orange" v-if="isAdmin" @click="visibleTop = true;">
        <a-drawer title="帖子置顶" placement="top" :visible="visibleTop" @close="visibleTop=false;">
          <div class="drawer-content">
            <div>置顶帖子后，帖子将展示到板块的最前面。</div>
            <div class="drawer-btn-container">
              <a-button type="primary" @click="handleTopThread('2')">全局置顶</a-button>
              <a-button type="primary" @click="handleTopThread('1')">本版置顶</a-button>
              <a-button type="primary" @click="handleTopThread('0')">解除置顶</a-button>
            </div>
          </div>
        </a-drawer>
        <a-icon type="arrow-up"/>&nbsp;置顶
      </a-tag>
      <a-tag color="cyan" v-if="isAdmin" @click="visibleDiamond = true;">
        <a-drawer
          title="精华设置"
          placement="top"
          :visible="visibleDiamond"
          @close="visibleDiamond=false;"
        >
          <div class="drawer-content">
            <div>设置精华后，帖子将以特殊的形式展示。</div>
            <div class="drawer-btn-container">
              <a-button type="primary" @click="handleDiamondThread('1')">设置精华</a-button>
              <a-button type="primary" @click="handleDiamondThread('0')">取消精华</a-button>
            </div>
          </div>
        </a-drawer>
        <a-icon type="star"/>&nbsp;精华
      </a-tag>
      <a-tag color="purple" v-if="isAdmin" @click="visibleClose = true;">
        <a-drawer title="帖子锁定" placement="top" :visible="visibleClose" @close="visibleClose=false;">
          <div class="drawer-content">
            <div>帖子锁定后，只有管理员才可以发表评论。</div>
            <div class="drawer-btn-container">
              <a-button type="primary" @click="handleCloseThread('1')">锁定帖子</a-button>
              <a-button type="primary" @click="handleCloseThread('0')">解除锁定</a-button>
            </div>
          </div>
        </a-drawer>
        <a-icon type="lock"/>&nbsp;锁帖
      </a-tag>
    </div>
    <div class="thread-post-list">
      <div
        class="thread-post-list-item"
        v-for="(post,index) in postList"
        :key="post.id"
        :class="{'no-active-filter':!post.post.active}"
      >
        <div class="thread-post-list-item-avatar-container" v-if="isAdmin || post.post.active">
          <router-link :to="'/user/visit/'+post.user.id">
            <a-avatar :src="post.user.avatar" class="user-avatar-small"></a-avatar>
          </router-link>
        </div>
        <div class="thread-post-list-item-content" v-if="isAdmin || post.post.active">
          <div class="thread-post-list-item-author-info">
            <router-link :to="'/user/visit/'+post.user.id">
              <a-tag :color="post.user.isAdmin?'orange':'cyan'">
                <a-icon :type="post.user.isAdmin?'crown': 'user'"/>
                {{post.user.username}}
              </a-tag>
            </router-link>&nbsp;
            <div class="user-group" v-for="group in post.group" :key="group.id">
              <router-link :to="'/user/group/'+group.id">
                <a-tag :color="group.color" class="user-group">
                  <a-icon type="team"/>
                  {{group.name}}
                </a-tag>
              </router-link>
            </div>
            <a-tag color="pink" class="thread-item-info-messages">
              <a-icon type="trophy"/>
              {{(page -1) * defaultPageSize + index +1}}楼
            </a-tag>
          </div>
          <div class="post-message post-quote" v-if="post.quote !== null">
            <h5>引用</h5>
            <div class="show-markdown" v-html="post.quote.message"></div>
          </div>
          <div class="post-message show-markdown" @click="handleAtClick" v-html="post.post.message"></div>
          <div class="thread-signature">
            <div :title="getFullCreateDate(post.post.createDate)">
              <a-icon type="clock-circle"/>
              {{getHumanDate(post.post.createDate)}}&nbsp;
            </div>
            <div v-if="post.user.signature !== ''">
              <a-icon type="pushpin"/>
              {{post.user.signature}}
            </div>
          </div>
          <a-divider class="thread-divider"></a-divider>
          <div class="post-admin">
            <router-link :to="'/post/update/'+post.post.id">
              <a-tag color="blue" v-if="isAdmin || myUid===post.user.id">
                <a-icon type="edit"/>&nbsp;编辑
              </a-tag>
            </router-link>
            <a-tag
              color="red"
              v-if="isAdmin || myUid===post.user.id"
              @click="handlePostDelete(post.post.id,post.post.active)"
            >
              <a-icon type="delete"/>
              &nbsp;{{post.post.active? '删除' : '恢复'}}
            </a-tag>
            <a-tag
              color="orange"
              v-if="(isAdmin || !thread.closed) && post.post.active"
              :class="{'active-quote':quote === post.post.id}"
              @click="handleQuote(post.post.id , post.user.username)"
            >
              <a-icon type="environment"/>&nbsp;引用
            </a-tag>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="postCount > defaultPageSize">
      <a-pagination
        :current="page"
        :defaultPageSize="defaultPageSize"
        :total="postCount"
        @change="handlePageOnchange"
      ></a-pagination>
    </div>
    <div class="thread-send-post">
      <div class="thread-post-list-item" v-if="isAdmin || !thread.closed">
        <div class="thread-post-list-item-avatar-container">
          <a-avatar :src="readerAvatar" class="user-avatar-small"></a-avatar>
        </div>
        <div class="thread-post-list-item-content">
          <div class="quote-message">
            <a-alert
              type="info"
              :message="'您正在引用'+quoteUsername+'的回复'"
              :showIcon="true"
              :closable="true"
              v-if="quote !== '-1'"
              @close="handleCloseQuote"
            ></a-alert>
          </div>
          <a-input type="textarea" v-model="replyInput" id="replyContent"></a-input>
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
                id: "0",
                subject: "",
                createDate: "",
                diamond: false,
                top: 0,
                closed: false,
                active: true
            },
            author: {
                id: "0",
                username: "",
                avatar: "",
                signature: "",
                isAdmin: false
            },
            forum: {
                name: "",
                icon: "",
                color: "",
                id: ""
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
            quote: "-1",
            quoteUsername: "",
            btnDisabled: false,
            visibleDiamond: false,
            visibleClose: false,
            visibleTop: false,
            deleteDiag: {
                visible: false,
                isThread: false,
                pid: "",
                active: true
            }
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
        },
        isAdmin() {
            return this.$store.state.isAdmin;
        },
        myUid() {
            return this.$store.state.uid;
        }
    },
    methods: {
        attachDownload(aid) {
            return this.$urls.attachDownload(
                aid,
                localStorage.getItem("token")
            );
        },
        async reply() {
          this.btnDisabled = true;
          const replyRepsonseRaw = await this.$ajax.post(
                  this.$urls.threadReply,
                  {
                    tid: this.thread.id,
                    quote: this.quote,
                    message: this.replyInput
                  }
          );
          if (replyRepsonseRaw.data.code === 1) {
            this.$notification.open({
              message: "回帖",
              description: "回帖成功！",
              icon: <a-icon type="smile" style="color: #108ee9" />
          });
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
        getTitle(attach) {
            let size = attach.filesize;
            let unit = "B";
            if (size > 1024) {
                size /= 1024;
                unit = "KB";
            }
            if (size > 1024) {
                size /= 1024;
                unit = "MB";
            }
            size = Math.floor(size);
            return `文件:${attach.originalName}\n下载:${
                attach.downloads
            }次\n大小:${size} ${unit}`;
        },
        getMessage(message) {
            const regImgStr = /\!\[uniqueImg\]\(unique\:\/\/(.*?)\)/g;
            const token = localStorage.getItem("token");
            return this.$marked(
                message.replace(
                    regImgStr,
                    `![uniqueImg](${
                        this.$urls.domain
                    }attach/download/$1/${token})`
                ),
                { sanitize: true }
            );
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
            let rawPostContent = [];
            if (threadInfoResponse.code === 1) {
                const data = threadInfoResponse.msg;
                Object.keys(this.thread).forEach(item => {
                    this.thread[item] = data.threadInfo[item];
                });
                Object.keys(this.author).forEach(item => {
                    this.author[item] = data.threadAuthor[item];
                });

                ["name", "id"].forEach(item => {
                    this.forum[item] = data.forumInfo[item];
                });
                const iconCollection = data.forumInfo.icon.split("|");
                this.forum.icon = iconCollection[0];
                this.forum.color = iconCollection[1];

                this.postCount = data.threadInfo.postCount;

                rawPostContent = data.postArr.map(item => item.post.message);

                data.postArr = data.postArr.map(item => {
                    item.post.message = this.getMessage(item.post.message);
                    if (item.quote) {
                        item.quote.message = this.getMessage(
                            item.quote.message
                        );
                    }

                    return item;
                });
                this.postList = data.postArr;
                this.attachList = data.attachArr;

                this.content = this.getMessage(data.firstPost.message);
            } else {
                return this.$store.dispatch("checkLoginStatus");
            }
            const userGroupListResponseRaw = await this.$ajax.get(
                this.$urls.userGroup(this.author.id)
            );

            const userGroupListResponse = userGroupListResponseRaw.data;
            if (userGroupListResponse.code !== 1) {
                return this.$store.dispatch("checkLoginStatus");
            }
            this.groupList = userGroupListResponse.msg.map(item => ({
                name: item.name,
                color: item.color,
                id: item.id
            }));

            const atList = new Set();
            const atReg = /@(.+?)(?=\s)/gi;
            const contentMatchArr = threadInfoResponse.msg.firstPost.message.match(
                atReg
            );
            contentMatchArr &&
                contentMatchArr.forEach(item =>
                    atList.add(item.substr(1, item.length - 1))
                );
            for (const post of rawPostContent) {
                const postMatchArr = post.match(atReg);
                postMatchArr &&
                    postMatchArr.forEach(item =>
                        atList.add(item.substr(1, item.length - 1))
                    );
            }
            const atResponseRaw = await this.$ajax.post(this.$urls.atResult, {
                keywords: [...atList]
            });

            if (atResponseRaw.data.code === 1) {
                const atResponse = atResponseRaw.data.msg;
                atResponse.forEach(item => {
                    const itemPrefix =
                        item.type === "user" ? "/user/visit/" : "/user/group/";
                    const replaceStr = `<a href="${itemPrefix}${
                        item.id
                    }" data-router="1" data-href="${itemPrefix}${item.id}">${
                        item.at
                    }</a>`;
                    this.content = this.content.replace(item.at, replaceStr);
                    this.postList.forEach(post => {
                        post.post.message = post.post.message.replace(
                            item.at,
                            replaceStr
                        );
                    });
                });
            }
        },
        handleTopThread(val) {
            this.visibleTop = false;
            this.postServer(this.$urls.topThread, {
                tid: this.thread.id,
                setTop: val
            });
        },
        handleDiamondThread(val) {
            this.visibleDiamond = false;
            this.postServer(this.$urls.diamondThread, {
                tid: this.thread.id,
                setDiamond: val
            });
        },
        handleCloseThread(val) {
            this.visibleClose = false;
            this.postServer(this.$urls.closeThread, {
                tid: this.thread.id,
                setClose: val
            });
        },
        handleAtClick(e) {
            if (e.target.dataset.router === "1") {
                e.preventDefault();
                this.$router.push({
                    path: e.target.dataset.href
                });
            }
        },
        handlePostDelete(pid, active) {
            this.deleteDiag.isThread = false;
            this.deleteDiag.pid = pid;
            this.deleteDiag.active = active;
            this.deleteDiag.visible = true;
        },
        handleThreadDelete() {
            this.deleteDiag.isThread = true;
            this.deleteDiag.active = this.thread.active;
            this.deleteDiag.visible = true;
        },
        handleDelete(mode) {
            this.deleteDiag.visible = false;
            let url = "";

            const SOFT_DELETE = 0,
                HARD_DELETE = 1,
                RECOVERY = 2;

            switch (mode) {
                case SOFT_DELETE:
                    url = this.deleteDiag.isThread
                        ? this.$urls.deleteThread(this.thread.id)
                        : (url = this.$urls.deletePost(this.deleteDiag.pid));
                    break;
                case HARD_DELETE:
                    url = this.deleteDiag.isThread
                        ? this.$urls.deleteThreadHard(this.thread.id)
                        : (url = this.$urls.deletePostHard(
                              this.deleteDiag.pid
                          ));
                    if (this.deleteDiag.isThread) {
                        this.$router.push({
                            path: `/thread/list/${this.forum.id}/1`
                        });
                    }
                    break;
                case RECOVERY:
                    url = this.deleteDiag.isThread
                        ? this.$urls.recoveryThread(this.thread.id)
                        : (url = this.$urls.recoveryPost(this.deleteDiag.pid));
                    break;
            }

            this.postServer(url);
        },
        handleCloseQuote() {
            this.quote = "-1";
        },
        handleQuote(pid, username) {
            if (this.quote === pid) {
                this.quote = "-1";
            } else {
                this.quote = pid;
                this.quoteUsername = username;
                window.scrollTo(0, document.documentElement.scrollHeight);
                document.querySelector("#replyContent").focus();
            }
        },
        handlePageOnchange(page) {
          this.$router.push({
            path: `/thread/info/${this.tid}/${page}`
          });
          this.getThreadInfo();
        },
        async postServer(url, obj) {
            const result = await this.$ajax.post(url, obj);
            if (result.data.code === 1) {
                this.$notification.open({
                    message: "主题操作",
                    description: "操作成功！",
                    icon: <a-icon type="smile" style="color: #108ee9" />
                });
                this.getThreadInfo();
            } else {
                const modal = this.$error();
                modal.update({
                    title: "操作错误",
                    content: result.data.msg
                });
            }
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
        grid-template-columns: 20% 60% 20%;
    }
    .thread-admin {
        width: 60%;
        margin: 0 auto;
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
    .user-group,
    .mobile-hidden-text {
        display: none;
    }
    .thread-main-info,
    .thread-post-list-item-content {
        padding: 0 0 0 12px;
    }
}
.thread-main-content {
    display: grid;
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
.thread-item-info-messages {
    position: absolute;
    right: 0;
}
.thread-sub-info,
.thread-sub,
.thread-main-info,
.thread-post-list,
.thread-post-list-item,
.thread-post-list-item-content {
    position: relative;
}
.thread-divider {
    margin: 12px 0 6px 0;
}
.thread-signature {
    font-size: 12px;
    color: #777;
    margin-top: 16px;
    user-select: none;
    cursor: default;
}
.post-message {
    margin-top: 12px;
}
.thread-admin,
.post-admin {
    text-align: right;
}
.drawer-content {
    text-align: center;
}
.drawer-btn-container {
    margin-top: 36px;
}
.no-active-filter {
    opacity: 0.4;
}
.active-quote {
    transform: scale(1.2, 1.2);
}
.user-group {
    display: inline-block;
}
.quote-message {
    margin-bottom: 12px;
}
.post-quote {
    color: #565656;
    border-left: #e4e4e4 3px solid;
    background: #f4f4f4;
    border-radius: 0 6px 6px 0;
    padding: 9px 8px 9px 8px;
}
.thread-attach-list h5 {
    margin: 6px 2px;
}
.attach-item {
    display: inline-block;
}
</style>
