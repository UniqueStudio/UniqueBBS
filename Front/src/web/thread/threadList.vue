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
    <div class="thread-controls">
      <router-link :to="'/thread/create/'+forum.id">
        <a-button type="primary" icon="form">发帖</a-button>
      </router-link>
    </div>
    <div class="thread-list-items">
      <div class="thread-item" v-for="thread in threadList" :key="thread.id">
        <div :class="{'thread-item-author':true,'no-active-filter':!thread.thread.active}">
          <router-link :to="'/user/visit/'+thread.user.id">
            <a-avatar shape="circle" :src="thread.user.avatar" class="avatar-img"></a-avatar>
          </router-link>
        </div>
        <div :class="{'thread-item-info':true,'no-active-filter':!thread.thread.active}">
          <p class="thread-item-info-subject">
            <span v-if="thread.thread.top" :title="thread.thread.top===1 ? '本版置顶':'全局置顶'">
              <a-icon type="arrow-up" :style="{color: thread.thread.top===1 ? 'orange' : 'red'}"/>
            </span>
            <router-link :to="'/thread/info/'+thread.thread.id+'/1'">{{thread.thread.subject}}</router-link>
          </p>
          <p>
            <a-tag color="cyan" v-if="thread.thread.diamond">
              <a-icon type="star"/>
              <span class="diamond-text">&nbsp;精华</span>
            </a-tag>
            <a-tag color="red" v-if="thread.thread.closed">
              <a-icon type="lock"/>
              <span class="diamond-text">&nbsp;锁定</span>
            </a-tag>
            <router-link :to="'/user/visit/'+thread.user.id">
              <a-tag :color="thread.user.isAdmin? 'orange': 'blue'">
                <a-icon :type="thread.user.isAdmin? 'crown' : 'user'"/>
                {{thread.user.username}}
              </a-tag>
            </router-link>
            <a-tag color="green">
              <a-icon type="clock-circle"/>
              {{humanDate(new Date(thread.thread.createDate))}}
            </a-tag>
            <a-tag color="purple" class="thread-item-post-count">
              <a-icon type="message"/>
              {{thread.thread.postCount}}
            </a-tag>
          </p>
        </div>
        <div class="thread-item-last-reply" v-if="thread.lastReply[0]">
          <div class="thread-item-info-reply-message">
            <router-link
              :to="'/thread/info/'+thread.thread.id+'/1'"
            >{{thread.lastReply[0].message.length > 10? (thread.lastReply[0].message.substr(0,10)+'...') : thread.lastReply[0].message}}</router-link>
          </div>
          <div class="thread-item-info-author">
            <a-tag color="green">
              <a-icon type="clock-circle"/>
              {{humanDate(new Date(thread.thread.lastDate))}}
            </a-tag>
          </div>
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
                icon: "check",
                id: ""
            },
            fid: "0",
            page: 0,
            defaultPageSize: 20
        };
    },
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
                this.threadList = threadListResponse.msg.list;

                ["name", "description", "threads", "id"].forEach(item => {
                    this.forum[item] = threadListResponse.msg.forum[item];
                });

                const iconCollection = threadListResponse.msg.forum.icon.split(
                    "|"
                );
                this.forum.icon = iconCollection[0];
                this.forum.backgroundColor = iconCollection[1];
            } else {
                this.$store.dispatch("checkLoginStatus");
            }
        }
    },
    activated() {
        this.getData();
    }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
    .thread-item-info-subject {
        font-size: 18px;
    }
    .thread-item {
        grid-template-columns: 20% 45% 35%;
    }
}
@media screen and (max-width: 800px) {
    .thread-item-info-subject {
        font-size: 14px;
    }
    .thread-item {
        grid-template-columns: 20% 80%;
    }
    .thread-item-last-reply,
    .thread-item-post-count,
    .diamond-text {
        display: none;
    }
}
.thread-controls {
    text-align: center;
    margin-bottom: 24px;
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
.no-active-filter {
    opacity: 0.4;
}
</style>