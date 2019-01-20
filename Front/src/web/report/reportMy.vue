<template>
  <div class="report-my">
    <div class="report-my-info-container">
      <div class="user-info">
        <img :src="user.avatar" class="user-avatar">
        <div class="user-info-details-container">
          <div class="user-info-container">
            <div class="user-name">
              <router-link :to="userLink(user.uid)">{{user.name}}</router-link>
            </div>
            <div class="user-mentor">
              <div class="user-have-mentor" v-if="haveMentor">
                <a-tag color="cyan">
                  <a-icon type="fork"/>
                  &nbsp;
                  {{mentor.name}}
                </a-tag>
              </div>
              <div class="user-dont-have-mentoor" v-else>
                <a-tag color="orange">
                  <a-icon type="fork"/>&nbsp;设定Mentor
                </a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-block"></div>
    </div>
    <div class="user-report-create" v-if="canPostReport">
      <router-link to="/report/create">
        <a-button icon="form" type="primary">发表Report</a-button>
      </router-link>
    </div>
    <div class="user-report-list">
      <a-timeline>
        <a-timeline-item
          v-for="report in reportList"
          :key="report.id"
          :color="report.isWeek? 'orange' : 'blue'"
        >
          <h4>{{renderDate(report.createDate)}}</h4>
          <div class="report-content" v-html="renderMessage(report.message)"></div>
        </a-timeline-item>
      </a-timeline>
    </div>
    <div class="pagination" v-if="reportCount > defaultPageSize">
      <a-pagination
        :current="page"
        :defaultPageSize="defaultPageSize"
        :total="reportCount"
        @change="pageOnchange"
      ></a-pagination>
    </div>
  </div>
</template>
<script>
export default {
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
      canPostReport: false
    };
  },
  methods: {
    renderDate(dateStr) {
      const date = new Date(dateStr);
      const nowDate = new Date();

      if (nowDate.getFullYear() === date.getFullYear()) {
        return `${nowDate.getMonth() + 1}月 ${nowDate.getDate()}日`;
      } else {
        return `${nowDate.getFullYear()}年 ${nowDate.getMonth() +
          1}月 ${nowDate.getDate()}日`;
      }
    },
    renderMessage(message) {
      return this.$marked(message, { sanitize: true });
    },
    userLink(uid) {
      return `/user/visit/${uid}`;
    },
    pageOnchange() {
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
      this.reportList = reportListRaw.data.msg;

      const reportCanRaw = await this.$ajax.get(this.$urls.reportCan);

      this.canPostReport =
        reportCanRaw.data.msg.weekly || reportCanRaw.data.msg.daily;

      const reportGraphRaw = await this.$ajax.get(
        this.$urls.reportGraph(this.user.uid)
      );
    }
  },
  computed: {
    userAvatarSrc() {
      return this.$store.state.avatarSrc;
    }
  },
  mounted() {
    this.mode = this.$route.meta.mode;
    if (this.mode === "visit") {
      this.canPostReport = false;
    }
    this.page = Number.parseInt(this.$route.params.page);
    this.getData();
  }
};
</script>
<style scoped>
@media screen and (max-width: 1000px) {
  .report-my-info-container {
    grid-template-rows: 100% 100%;
  }
  .report-my {
    width: 95%;
  }
}
@media screen and (min-width: 1000px) {
  .report-my-info-container {
    grid-template-columns: 30% 70%;
  }
  .report-my {
    width: 80%;
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
</style>
