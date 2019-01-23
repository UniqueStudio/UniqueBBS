<template>
  <div class="report-create">
    <div class="title-info" style="background:#009688;">
      <div class="title-icon">
        <a-icon type="calendar" class="title-item-icon"></a-icon>
        &nbsp;{{mode==0?"发表Report": "编辑Report"}}
      </div>
    </div>
    <div class="report-form">
      <div class="form-left">
        <label>报告类型</label>
      </div>
      <div class="form-right">
        <a-select style="width: 100%;" v-model="isWeekReport">
          <a-select-option value="0" v-if="can.daily">Daily Report</a-select-option>
          <a-select-option value="1" v-if="can.weekly">Weekly Report</a-select-option>
        </a-select>
      </div>
      <div class="form-left">
        <label>学习时间</label>
      </div>
      <div class="form-right">
        <a-input placeholder="学习时间" v-model="time"/>
      </div>
      <div class="form-left">
        <label>学习内容</label>
      </div>
      <div class="form-right">
        <a-textarea placeholder="学习内容" v-model="content"/>
      </div>
      <div class="form-left">
        <label>学习计划</label>
      </div>
      <div class="form-right">
        <a-textarea placeholder="学习计划" v-model="plan"/>
      </div>
      <div class="form-left">
        <label>解决问题</label>
      </div>
      <div class="form-right">
        <a-textarea placeholder="解决问题" v-model="solution"/>
      </div>
      <div class="form-left">
        <label>学习总结</label>
      </div>
      <div class="form-right">
        <a-textarea placeholder="学习总结" v-model="conclusion"/>
      </div>
      <div class="form-left">
        <label>附加内容</label>
      </div>
      <div class="form-right">
        <a-textarea placeholder="附加信息" v-model="extra"/>
      </div>
      <div class="form-left"></div>
      <div class="form-right">
        <a-button
          type="primary"
          icon="calendar"
          @click="handleButtonClick"
        >{{mode==0?"发表Report": "编辑Report"}}</a-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rid: "",
      time: "",
      content: "",
      plan: "",
      solution: "",
      conclusion: "",
      isWeekReport: "0",
      extra: "",
      mode: 0,
      can: {
        daily: true,
        weekly: true
      }
    };
  },
  methods: {
    handleButtonClick() {
      const MODE_CREATE = 0,
        MODE_UPDATE = 1;
      switch (this.mode) {
        case MODE_CREATE:
          this.createReport();
          break;
        case MODE_UPDATE:
          this.updateReport();
          break;
      }
    },
    async createReport() {
      const createReportRaw = await this.$ajax.post(this.$urls.reportCreate, {
        time: this.time,
        content: this.content,
        plan: this.plan,
        solution: this.solution,
        conclusion: this.conclusion,
        isWeekReport: this.isWeekReport,
        extra: this.extra
      });

      if (createReportRaw.data.code === 1) {
        this.$notification.open({
          message: "Report",
          description: "Report发布成功！",
          icon: <a-icon type="calendar" style="color: #108ee9" />
        });
        this.$router.push({
          path: "/report/my/1"
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "Report发布错误",
          content: createReportRaw.data.msg
        });
      }
    },
    async getCanStatus() {
      const canReportRaw = await this.$ajax.get(this.$urls.reportCan);

      this.can.weekly = canReportRaw.data.msg.weekly;
      this.can.daily = canReportRaw.data.msg.daily;

      this.isWeekReport = this.can.daily ? "0" : "1";
    },
    async updateReport() {
      const updateReportRaw = await this.$ajax.post(
        this.$urls.reportUpdate(this.rid),
        {
          time: this.time,
          content: this.content,
          plan: this.plan,
          solution: this.solution,
          conclusion: this.conclusion,
          extra: this.extra
        }
      );
      if (updateReportRaw.data.code === 1) {
        this.$notification.open({
          message: "Report",
          description: "Report更新成功！",
          icon: <a-icon type="calendar" style="color: #108ee9" />
        });
        this.$router.push({
          path: "/report/my/1"
        });
      } else {
        const modal = this.$error();
        modal.update({
          title: "Report更新错误",
          content: updateReportRaw.data.msg
        });
      }
    },
    async getReportInfo() {
      const reportInfoRaw = await this.$ajax.get(
        this.$urls.reportInfo(this.rid)
      );
      if (reportInfoRaw.data.code === 1) {
        ["time", "content", "plan", "solution", "conclusion", "extra"].forEach(
          item => {
            this[item] = reportInfoRaw.data.msg[item];
          }
        );
      } else {
        const modal = this.$error();
        modal.update({
          title: "Report错误",
          content: reportInfoRaw.data.msg
        });
      }
    }
  },
  mounted() {
    this.mode = this.$route.meta.mode;
    if (this.mode === 1) {
      this.rid = this.$route.params.rid;
      this.getReportInfo();
    } else {
      this.getCanStatus();
    }
  }
};
</script>
<style scoped>
@media screen and (max-width: 800px) {
  .report-form {
    width: 100%;
  }
}
@media screen and (min-width: 800px) {
  .report-form {
    width: 50%;
    margin: 0 auto;
  }
}
.report-form {
  display: grid;
  grid-template-columns: 30% 70%;
}
.form-left {
  text-align: right;
  padding: 5px 12px;
}
.form-left,
.form-right {
  margin: 8px 0;
}
</style>
