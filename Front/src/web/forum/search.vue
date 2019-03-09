<template>
  <div class="search-container">
    <div class="search-box">
      <a-input-search placeholder="请输入要搜索的内容" @search="handleSearch" v-model="seachBoxInput"/>
    </div>
    <a-spin :spinning="showLoading" size="large">
      <div class="result-container">
        <div class="result-item" v-for="item in searchResult" :key="item.key">
          <div class="thread-item-subject">
            <router-link :to="'/user/visit/'+item.user.id">
              <img :src="item.user.avatar" class="author-avatar">
            </router-link>
            <router-link :to="'/thread/info/'+item.id+'/1'">{{item.subject}}</router-link>
          </div>
          <div class="show-markdown user-post-message" v-html="item.message"></div>
          <div class="thread-item-content">
            <span>
              <a-icon type="message"/>
              {{item.postCount}}
            </span>
            <span class="time-span">
              <a-icon type="clock-circle"/>
              {{getHumanDate(item.createDate)}}
            </span>
          </div>
          <a-divider class="thread-divider"></a-divider>
        </div>
      </div>
      <div class="pagination" v-if="all > defaultPageSize">
        <a-pagination
          :current="page"
          :defaultPageSize="defaultPageSize"
          :total="all"
          @change="handlePageOnchange"
        ></a-pagination>
      </div>
    </a-spin>
  </div>
</template>
<script>
export default {
    data() {
        return {
            seachBoxInput: "",
            showLoading: false,
            searchResult: [],
            all: 0,
            defaultPageSize: 20,
            page: 1
        };
    },
    methods: {
        handleSearch() {
            this.$router.push({
                path: `/search/${this.seachBoxInput}/1`
            });

            this.page = +this.$route.params.page;
            this.doSearch();
        },
        async doSearch() {
            this.showLoading = true;

            this.page = +this.$route.params.page;
            this.seachBoxInput = this.$route.params.keyword;

            const searchResultRaw = await this.$ajax.post(
                this.$urls.search(this.page.toString()),
                {
                    keyword: this.seachBoxInput
                }
            );

            if (searchResultRaw.data.code === 1) {
                const searchResult = searchResultRaw.data.msg;
                this.all = searchResult.count;

                searchResult.result.forEach(item => {
                    item.message = this.getMessage(item.message);
                });

                this.searchResult = searchResult.result;
            }

            this.showLoading = false;
        },
        handlePageOnchange(page) {
            this.$router.push({
                path: `/search/${this.seachBoxInput}/${page}`
            });
        },
        getHumanDate(str) {
            const date = new Date(str);
            return this.$humanDate(date);
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
        }
    },
    mounted() {
        this.$store.commit("setActiveNav", 1);
        this.doSearch();
    }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
    .search-box {
        width: 60%;
    }
    .search-container {
        width: 60%;
        margin: 36px auto;
    }
}
@media screen and (max-width: 800px) {
    .search-box {
        width: 90%;
    }
    .search-container {
        width: 90%;
        margin: 36px auto;
    }
}
.search-box {
    margin: 12px auto;
}
.thread-divider {
    margin: 2px 0 6px 0;
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
    top: 140px;
    height: 70px;
    pointer-events: none;
}
.result-item,
.search-container,
.user-post-message {
    position: relative;
}
.thread-item-content {
    font-size: 12px;
    color: #999;
    user-select: none;
    cursor: default;
}
.result-item {
    margin: 12px 0;
}
.thread-item-subject {
    font-size: 18px;
}
.author-avatar {
    height: 18px;
    width: 18px;
    border-radius: 9px;
}
</style>
