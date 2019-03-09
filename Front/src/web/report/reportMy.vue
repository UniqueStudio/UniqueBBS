<template>
  <div class="report-my">
    <a-spin :spinning="showLoading" size="large">
      <div class="report-my-info-container">
        <div class="user-info">
          <img :src="user.avatar" class="user-avatar">
          <div class="user-info-details-container">
            <div class="user-info-container">
              <div class="user-name">
                <router-link
                  :to="userLink(user.uid)"
                  style="color:#363E51;font-weight:600;"
                >{{user.name}}</router-link>
              </div>
              <div class="user-mentor">
                <div class="user-have-mentor" v-if="haveMentor">
                  <a-tag color="cyan" @click="handleMentorClick">
                    <a-icon type="fork"/>
                    {{mentor.name}}
                  </a-tag>
                </div>
                <div class="user-dont-have-mentoor" v-else>
                  <a-tag color="orange" @click="handleMentorClick">
                    <a-icon type="fork"/>无Mentor
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <report-graph :uid="user.uid" class="user-report-graph"></report-graph>
      </div>
      <div class="user-report-create" v-if="canPostReport && mode === 'my'">
        <router-link to="/report/create">
          <a-button icon="form" type="primary" style="font-weight:600;">发表Report</a-button>
        </router-link>
      </div>
      <div class="user-report-list">
        <a-timeline>
          <a-timeline-item
            v-for="report in reportList"
            :key="report.id"
            :color="report.isWeek? 'orange' : 'blue'"
          >
            <div class="report-header">
              <h3>{{getDate(report.createDate)}}</h3>
              <div class="report-header-btns">
                <router-link
                  :to="'/report/update/'+report.id"
                  v-if="showEditBtn(report.createDate)"
                >
                  <a-tag color="blue">
                    <a-icon type="edit"/>&nbsp;编辑
                  </a-tag>
                </router-link>
                <rabbit-tag
                  :background="report.isWeek? '#FFCD52' : '#88AAFF'"
                >{{report.isWeek? 'Weekly' : 'Daily'}}</rabbit-tag>
              </div>
            </div>
            <div class="report-content" v-html="getMessage(report.message)"></div>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="pagination" v-if="reportCount > defaultPageSize">
        <a-pagination
          :current="page"
          :defaultPageSize="defaultPageSize"
          :total="reportCount"
          @change="handlePageOnchange"
        ></a-pagination>
      </div>
    </a-spin>
  </div>
</template>
<script>
const reportGraph = () => import("./reportGraph.vue");
const rabbitTag = () => import("../components/rabbitTag.vue");
export default {
    components: { "report-graph": reportGraph, "rabbit-tag": rabbitTag },
    data() {
        return {
            user: {
                name: "",
                uid: "",
                avatar: ""
            },
            mentor: {
                name: "",
                uid: ""
            },
            haveMentor: true,
            mode: "my",
            reportCount: 0,
            defaultPageSize: 20,
            page: 1,
            reportList: [],
            graphList: [],
            canPostReport: false,
            showLoading: true
        };
    },
    methods: {
        handleMentorClick() {
            if (this.mode === "my") {
                this.$router.push({ path: "/report/mentor" });
            }
        },
        initReport() {
            this.mode = this.$route.meta.mode;
            if (this.mode === "visit") {
                this.canPostReport = false;
            }
            this.page = +this.$route.params.page;
            this.getData();
        },
        getDate(dateStr) {
            const date = new Date(dateStr);
            const nowDate = new Date();

            if (nowDate.getFullYear() === date.getFullYear()) {
                return `${date.getMonth() +
                    1}月 ${date.getDate()}日 ${date.getHours()}:${
                    date.getMinutes() < 10
                        ? "0" + date.getMinutes()
                        : date.getMinutes()
                }`;
            } else {
                return `${date.getFullYear()}年 ${date.getMonth() +
                    1}月 ${date.getDate()}日 ${date.getHours()}:${
                    date.getMinutes() < 10
                        ? "0" + date.getMinutes()
                        : date.getMinutes()
                }`;
            }
        },
        showEditBtn(dataStr) {
            let date = new Date();
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            const maxDate = date.getTime();
            const postDate = new Date(dataStr).getTime();
            return postDate > maxDate && this.mode === "my";
        },
        getMessage(message) {
            return this.$marked(message, { sanitize: true });
        },
        userLink(uid) {
            return `/user/visit/${uid}`;
        },
        handlePageOnchange(page) {
            if (this.mode === "my") {
                this.$router.push({
                    path: `/report/my/${page}`
                });
            } else {
                this.$router.push({
                    path: `/report/visit/${this.user.uid}/${page}`
                });
            }
            this.getData();
        },
        async getData() {
            this.showLoading = true;
            let requestInfoUrl = "";
            if (this.mode === "my") {
                requestInfoUrl = this.$urls.mentorMyInfo;
            } else {
                this.user.uid = this.$route.params.uid;
                requestInfoUrl = this.$urls.mentorInfo(this.user.uid);
            }

            const infoRaw = await this.$ajax.get(requestInfoUrl);
            const info = infoRaw.data.msg;

            this.user.name = info.user.username;
            this.user.uid = info.user.id;
            this.user.avatar = info.user.avatar;

            if (info.mentor === null) {
                this.haveMentor = false;
            } else {
                this.haveMentor = true;
                this.mentor.name = info.mentor.username;
                this.mentor.uid = info.mentor.id;
            }

            const reportListRaw = await this.$ajax.get(
                this.$urls.reportList(this.user.uid, this.page)
            );
            this.reportList = reportListRaw.data.msg.list;
            this.reportCount = +reportListRaw.data.msg.count;
            const reportCanRaw = await this.$ajax.get(this.$urls.reportCan);
            this.canPostReport =
                reportCanRaw.data.msg.weekly || reportCanRaw.data.msg.daily;
            this.showLoading = false;
        }
    },
    computed: {
        userAvatarSrc() {
            return this.$store.state.avatarSrc;
        }
    },
    mounted() {
        this.initReport();
    },
    watch: {
        $route(to, from) {
            this.initReport();
        }
    }
};
</script>
<style scoped>
@media screen and (max-width: 1050px) {
    .report-my-info-container {
        grid-template-rows: 196px 156px;
    }
    .user-report-graph {
        margin: 20px auto;
    }
}
@media screen and (max-width: 1200px) {
    .report-my {
        width: 95%;
    }
}
@media screen and (min-width: 1200px) {
    .report-my {
        width: 60%;
    }
    .user-report-graph {
        margin: 24px auto;
    }
}
@media screen and (min-width: 1050px) {
    .report-my-info-container {
        grid-template-columns: 30% 70%;
    }
    .user-report-list {
        padding: 0 10%;
    }
}
.report-my {
    margin: 36px auto 0 auto;
}
.report-my-info-container {
    display: grid;
}
.user-info {
    text-align: center;
}
.user-avatar {
    height: 144px;
    width: 144px;
    border-radius: 72px;
}
.user-info-details-container {
    margin-top: 16px;
}
.user-name-container {
    font-size: 18px;
}
.user-report-create {
    text-align: center;
}
.user-report-create {
    margin: 36px auto;
}
.user-report-list {
    margin: 36px 0;
}
.report-header {
    display: grid;
    grid-template-columns: 50% 50%;
}
.report-header-btns {
    text-align: right;
}
</style>
