<template>
  <div class="user-my-threads-list">
    <div class="user-my-thread-item" v-for="post in postList" :key="post.id">
      <div class="thread-item-subject">
        <router-link :to="'/thread/info/'+post.thread.id+'/1'">{{post.thread.subject}}</router-link>
      </div>
      <div
        class="show-markdown user-post-message"
        @click="handleAtClick"
        v-html="post.post.message"
      ></div>
      <div class="thread-item-content">
        <a-tag color="purple">
          <a-icon type="message"/>
          {{post.thread.postCount}}
        </a-tag>
        <span class="time-span">
          <a-tag color="green">
            <a-icon type="clock-circle"/>
            {{getHumanDate(post.thread.createDate)}}
          </a-tag>
        </span>
      </div>
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
            postList: [],
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
        renderMessage(message) {
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
        async getMyThreadList() {
            const uid = localStorage.getItem("uid");
            this.page = Number.parseInt(this.$route.params.page);
            const myThreadListRaw = await this.$ajax.get(
                this.$urls.userPosts(uid, this.page.toString())
            );
            if (myThreadListRaw.data.code !== 1) {
                return this.$store.dispatch("checkLoginStatus");
            }
            const { list, count } = myThreadListRaw.data.msg;

            const rawPostList = list.map(item => item.post.message);

            this.postList = list.map(item => {
                item.post.message = this.renderMessage(item.post.message);
                return item;
            });

            const atList = new Set();
            const atReg = /@(.+?)(?=\s)/gi;
            for (const post of rawPostList) {
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
                    this.postList.forEach(post => {
                        post.post.message = post.post.message.replace(
                            item.at,
                            replaceStr
                        );
                    });
                });
            }

            this.all = count;
        },
        getHumanDate(str) {
            const date = new Date(str);
            return this.$humanDate(date);
        },
        handleAtClick(e) {
            if (e.target.dataset.router === "1") {
                e.preventDefault();
                this.$router.push({
                    path: e.target.dataset.href
                });
            }
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
.thread-item-content,
.user-my-thread-item {
    position: relative;
}
.time-span {
    position: absolute;
    right: 0;
}
.user-post-message {
    max-height: 200px;
    overflow: hidden;
}
.user-post-message:before {
    position: absolute;
    width: 100%;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 1) 100%
    );
    content: " ";
    top: 160px;
    height: 70px;
    pointer-events: none;
}
</style>