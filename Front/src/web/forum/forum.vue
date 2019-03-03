<template>
  <div class="forum-container">
    <a-spin :spinning="showLoading" size="large">
      <div class="forum-item" v-for="forum in this.forumList" :key="forum.id">
        <div class="forum-item-icon-container">
          <router-link :to="'/thread/list/'+forum.id+'/1'">
            <div class="forum-item-icon-bg" :style="{backgroundColor:forum.backgroundColor}">
              <a-icon :type="forum.icon" class="forum-item-icon"></a-icon>
            </div>
          </router-link>
        </div>
        <div class="forum-item-info">
          <router-link :to="'/thread/list/'+forum.id+'/1'">
            <p class="forum-item-title">{{forum.name}}</p>
          </router-link>
          <p v-if="forum.description !== null" class="forum-item-description">
            <a-tag color="purple">
              <a-icon type="message"/>
              {{forum.threads}}
            </a-tag>
            {{forum.description}}
          </p>
        </div>
        <div class="forum-item-last">
          <div v-if="forum.lastPost!==null">
            <p class="forum-last-post">
              <router-link :to="'/user/visit/'+forum.lastPostInfo.user.id">
                <a-avatar
                  shape="circle"
                  :src="forum.lastPostInfo.user.avatar"
                  class="avatar-img"
                  size="small"
                ></a-avatar>
              </router-link>
              <router-link
                :to="'/thread/info/'+forum.lastPostInfo.thread.id+'/1'"
              >{{forum.lastPost.message.length>10 ? (forum.lastPost.message.substr(0,10)+"..."):forum.lastPost.message}}</router-link>
            </p>
            <a-tag color="green">
              <a-icon type="clock-circle"/>
              {{getHumanDate(forum.lastPost.createDate)}}
            </a-tag>
          </div>
          <div v-else>暂无回帖</div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
export default {
    data() {
        return {
            forumList: [],
            showLoading: true
        };
    },
    methods: {
        getHumanDate(createDate) {
            return this.$humanDate(new Date(createDate));
        },
        async getForumList() {
            this.showLoading = true;
            const responseRaw = await this.$ajax.get(this.$urls.forumList);
            const response = responseRaw.data;
            if (response.code === 1) {
                const tmpList = response.msg.map(item => {
                    const iconCollection = item.icon.split("|");
                    item.icon = iconCollection[0];
                    item.backgroundColor = iconCollection[1];
                    return item;
                });

                this.forumList = tmpList;
            } else {
                this.$store.dispatch("checkLoginStatus");
            }
            this.showLoading = false;
        }
    },
    activated() {
        this.$store.commit("setActiveNav", 1);
        this.getForumList();
    }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
    .forum-container {
        width: 90%;
        margin: 36px auto;
    }
    .forum-item {
        grid-template-columns: 20% 50% 30%;
    }
}
@media screen and (max-width: 800px) {
    .forum-container {
        width: 90%;
        margin: 36px auto;
    }
    .forum-item {
        grid-template-columns: 20% 80%;
    }
    .forum-item-last {
        display: none;
    }
}
.forum-item {
    display: grid;
    margin: 64px auto;
    height: 72px;
}
.forum-item-icon-container {
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
.forum-item-title {
    font-size: 20px;
}
.forum-item-info p,
.forum-item-last p {
    margin: 0;
}
.forum-item-info {
    padding: 0 32px;
}
.forum-item-description {
    color: #777;
}
.forum-last-post {
    font-size: 14px;
}
</style>
