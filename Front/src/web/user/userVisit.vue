<template>
  <div class="user-visit">
    <div class="title-info" style="background:#3F47C5;">
      <div class="title-icon">
        <a-icon type="user" class="title-item-icon"></a-icon>&nbsp;
        用户资料
      </div>
    </div>
    <div class="avatar-container">
      <a-avatar shape="circle" :src="userDatas.avatar" class="avatar-img" size="large"></a-avatar>
    </div>
    <h2 :style="{color: userDatas.isAdmin? '#ff9800':'dodgerblue'}">{{userDatas.username}}</h2>
    <div class="group-container">
      <rabbit-tag v-if="userDatas.isAdmin" background="#EDABAB">管理员</rabbit-tag>
      <div v-for="group in groupList" :key="group.id" class="group-item">
        <router-link :to="'/user/group/'+ group.id">
          <rabbit-tag :background="group.color" cursor="pointer">{{group.name}}</rabbit-tag>
        </router-link>
      </div>
      <router-link :to="'/report/visit/'+uid+'/1'">
        <rabbit-tag background="#396BEA" cursor="pointer">Report</rabbit-tag>
      </router-link>
      <rabbit-tag background="#FFCD52" v-if="lastLoginHumanDate">{{lastLoginHumanDate}}</rabbit-tag>
    </div>
    <h5>{{userDatas.signature}}</h5>
    <report-graph :uid="uid" class="report-graph"></report-graph>
    <div class="user-detail-info">
      <a-input-group>
        <a-input
          addonBefore="加入"
          readonly
          :value="getJoinTime"
          size="large"
          v-if="getJoinTime !== ''"
        />
        <a-input
          addonBefore="邮箱"
          readonly
          :value="userDatas.email"
          size="large"
          v-if="userDatas.email !== ''"
        />
        <a-input
          addonBefore="手机"
          readonly
          :value="userDatas.mobile"
          size="large"
          v-if="userDatas.mobile !== ''"
        />
        <a-input
          addonBefore="学号"
          readonly
          v-model="userDatas.studentID"
          size="large"
          v-if="userDatas.studentID !== ''"
        />
        <a-input
          addonBefore="宿舍"
          readonly
          v-model="userDatas.dormitory"
          size="large"
          v-if="userDatas.dormitory !== ''"
        />
        <a-input
          addonBefore=" Q Q "
          readonly
          v-model="userDatas.qq"
          size="large"
          v-if="userDatas.qq !== ''"
        />
        <a-input
          addonBefore="微信"
          readonly
          v-model="userDatas.wechat"
          size="large"
          v-if="userDatas.wechat !== ''"
        />
        <a-input
          addonBefore="专业"
          readonly
          v-model="userDatas.major"
          size="large"
          v-if="userDatas.major !== ''"
        />
        <a-input
          addonBefore="班级"
          readonly
          v-model="userDatas.className"
          size="large"
          v-if="userDatas.className !== ''"
        />
      </a-input-group>
    </div>
  </div>
</template>
<script>
const reportGraph = () => import("../report/reportGraph.vue");
const rabbitTag = () => import("../components/rabbitTag.vue");
export default {
    components: { "report-graph": reportGraph, "rabbit-tag": rabbitTag },
    data() {
        return {
            uid: "",
            userDatas: {
                avatar: "",
                username: "",
                email: "",
                mobile: "",
                studentID: "",
                dormitory: "",
                qq: "",
                wechat: "",
                major: "",
                className: "",
                signature: "",
                lastLogin: "",
                threads: 0,
                isAdmin: false,
                joinTime: ""
            },
            groupList: []
        };
    },
    computed: {
        lastLoginHumanDate() {
            return this.$humanDate(new Date(this.userDatas.lastLogin));
        },
        getJoinTime() {
            return this.$joinTime(this.userDatas.joinTime);
        }
    },
    methods: {
        async getUserInfo() {
            this.uid = this.$route.params.uid;
            const userInfo = await this.$ajax.get(
                this.$urls.userInfo(this.uid)
            );

            if (userInfo.data.code !== 1) {
                return this.$store.dispatch("checkLoginStatus");
            }
            Object.keys(this.userDatas).forEach(item => {
                this.userDatas[item] = userInfo.data.msg.user[item];
            });
            this.groupList = userInfo.data.msg.group.map(item => ({
                name: item.name,
                color: item.color,
                id: item.id
            }));
        }
    },
    mounted() {
        this.getUserInfo();
    }
};
</script>
<style scoped>
@media screen and (min-width: 800px) {
    .user-detail-info {
        width: 40%;
    }
}
@media screen and (max-width: 800px) {
    .user-detail-info {
        width: 80%;
    }
}
.user-detail-info {
    margin: 0 auto;
}
.avatar-container {
    text-align: center;
    margin: 72px;
}
.avatar-img {
    transform: scale(3, 3);
}
h2,
h5 {
    text-align: center;
    user-select: none;
    margin: 0;
}
.group-item {
    display: inline-block;
}
.user-detail-info {
    margin-top: 36px;
}
.user-detail-info span {
    margin: 6px auto;
}
.last-login {
    color: gray;
}
.group-container {
    text-align: center;
    margin: 12px auto;
    user-select: none;
}
.report-graph {
    margin: 30px auto;
}
</style>
