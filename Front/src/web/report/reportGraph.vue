<template>
  <div class="user-block">
    <div :class="{'user-block-flex':true,'user-block-flex-left':align === 'left'}">
      <a-tooltip
        class="user-block-item"
        v-for="block in userBlock"
        :key="block.id"
        :style="{backgroundColor: block.color}"
        :mouseLeaveDelay="0"
      >
        <template slot="title">{{block.date}}</template>
      </a-tooltip>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userBlock: []
    };
  },
  props: ["uid", "align"],
  methods: {
    async renderGraph() {
      const reportGraphRaw = await this.$ajax.get(
        this.$urls.reportGraph(this.uid)
      );
      this.graphList = reportGraphRaw.data.msg.map(item => ({
        date: new Date(item.createDate).getTime(),
        isWeek: item.isWeek
      }));

      const colorArr = ["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"];
      let offset = 0;
      this.userBlock = [];
      const nowDate = new Date();
      const extraBlockCount = nowDate.getDay() + 1;

      const beginDateRaw = new Date();
      beginDateRaw.setHours(0);
      beginDateRaw.setMinutes(0);
      beginDateRaw.setSeconds(0);
      const beginDate = new Date(
        beginDateRaw.getTime() - (extraBlockCount + 363) * 24 * 60 * 60 * 1000
      );

      while (
        this.graphList.length !== 0 &&
        this.graphList[offset].date < beginDate.getTime()
      ) {
        offset++;
      }
      for (let i = 0; i < 364 + extraBlockCount; i++) {
        const beginTimeStamp = beginDate.getTime() + 24 * 60 * 60 * 1000 * i;
        const endTimeStamp =
          beginDate.getTime() + 24 * 60 * 60 * 1000 * (i + 1);

        let numbers = 0;
        while (
          offset < this.graphList.length &&
          this.graphList[offset].date < endTimeStamp
        ) {
          numbers += this.graphList[offset].isWeek ? 2 : 1;
          offset++;
        }
        const endTime = new Date(beginTimeStamp);
        this.userBlock.push({
          id: endTimeStamp,
          numbers: numbers,
          color:
            numbers > colorArr.length - 1
              ? colorArr[colorArr.length - 1]
              : colorArr[numbers],
          date:
            endTime.getFullYear() +
            "年" +
            (endTime.getMonth() + 1) +
            "月" +
            endTime.getDate() +
            "日"
        });
      }
    }
  },
  watch: {
    uid(newUid, previousUid) {
      if (newUid !== "") {
        this.renderGraph();
      }
    }
  },
  mounted() {
    if (this.uid !== "") {
      this.renderGraph();
    }
  }
};
</script>
<style scoped>
@media screen and (max-width: 1050px) {
  .user-block-item {
    width: 7.5px;
    height: 7.5px;
    margin: 1px;
  }
  .user-block-flex {
    width: 300px;
    height: 130px;
  }
}
@media screen and (min-width: 1050px) {
  .user-block-item {
    width: 10px;
    height: 10px;
    margin: 1px;
  }
  .user-block-flex {
    width: 636px;
    height: 86px;
  }
}
@media screen and (min-width: 1200px) {
  .user-block-flex-left {
    margin: auto auto auto 0 !important;
  }
}
.user-block-flex {
  display: flex;
  flex-flow: column wrap;
  align-content: space-between;
  margin: auto;
}
</style>
