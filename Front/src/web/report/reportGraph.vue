<template>
  <div class="user-block">
    <div class="block-year-select">
      <a-tag :color="yearColor.year3" data-year="3" @click="changeYear(3)">{{yearText.year3}}</a-tag>
      <a-tag :color="yearColor.year2" data-year="2" @click="changeYear(2)">{{yearText.year2}}</a-tag>
      <a-tag :color="yearColor.year1" data-year="1" @click="changeYear(1)">{{yearText.year1}}</a-tag>
      <a-tag :color="yearColor.year0" data-year="0" @click="changeYear(0)">{{yearText.year0}}</a-tag>
    </div>
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
            userBlock: [],
            year: 0,
            doing: false,
            yearColor: {
                year3: "cyan",
                year2: "cyan",
                year1: "cyan",
                year0: "dodgerblue"
            },
            yearText: {
                year3: "2016",
                year2: "2017",
                year1: "2018",
                year0: "2019"
            }
        };
    },
    props: ["uid", "align"],
    methods: {
        changeYear(year) {
            if (this.doing) return;
            const lastActiveYear = this.year;
            if (this.year === year) return;
            this.year = year;
            [3, 2, 1, 0].forEach(item => {
                if (item === lastActiveYear) {
                    this.yearColor["year" + item.toString()] = "cyan";
                } else if (item === year) {
                    this.yearColor["year" + item.toString()] = "dodgerblue";
                }
            });

            this.renderGraph();
        },
        async renderGraph() {
            if (this.doing) return;
            this.doing = true;
            let year = this.year;

            let reportGraphRaw;
            if (!year) {
                year = undefined;
                reportGraphRaw = await this.$ajax.post(
                    this.$urls.reportGraph(this.uid)
                );
            } else {
                reportGraphRaw = await this.$ajax.post(
                    this.$urls.reportGraph(this.uid),
                    {
                        year: year
                    }
                );
            }

            this.graphList = reportGraphRaw.data.msg.map(item => ({
                date: new Date(item.createDate).getTime(),
                isWeek: item.isWeek
            }));

            const colorArr = [
                "#ebedf0",
                "#c6e48b",
                "#7bc96f",
                "#239a3b",
                "#196127"
            ];
            let offset = 0;
            this.userBlock = [];

            const beginDateRaw = new Date();

            if (year) {
                beginDateRaw.setFullYear(
                    year * -1 + beginDateRaw.getFullYear(),
                    11,
                    31
                );
            }
            beginDateRaw.setHours(0);
            beginDateRaw.setMinutes(0);
            beginDateRaw.setSeconds(0);
            const extraBlockCount = beginDateRaw.getDay() + 1;
            const beginDate = new Date(
                beginDateRaw.getTime() -
                    (extraBlockCount + 363) * 24 * 60 * 60 * 1000
            );

            while (
                this.graphList.length !== 0 &&
                this.graphList[offset].date < beginDate.getTime()
            ) {
                offset++;
            }
            for (let i = 0; i < 364 + extraBlockCount; i++) {
                const beginTimeStamp =
                    beginDate.getTime() + 24 * 60 * 60 * 1000 * i;
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
            this.doing = false;
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
        const NowYear = new Date().getFullYear();
        this.yearText.year0 = NowYear.toString();
        this.yearText.year1 = (NowYear - 1).toString();
        this.yearText.year2 = (NowYear - 2).toString();
        this.yearText.year3 = (NowYear - 3).toString();
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
        height: 130px;
    }
    .block-year-select,
    .user-block-flex {
        width: 300px;
    }
}
@media screen and (min-width: 1050px) {
    .user-block-item {
        width: 10px;
        height: 10px;
        margin: 1px;
    }
    .user-block-flex {
        height: 86px;
    }
    .block-year-select,
    .user-block-flex {
        width: 636px;
    }
    .block-year-select {
        margin: 8px auto 8px 0 !important;
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
.block-year-select {
    text-align: center;
    margin: 8px auto;
}
</style>
