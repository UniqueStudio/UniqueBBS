<template>
  <div class="report-mentor">
    <div class="title-info" style="background:rgb(99, 76, 184);">
      <div class="title-icon">
        <a-icon type="trophy" class="title-item-icon"></a-icon>&nbsp;Mentor
      </div>
    </div>
    <a-spin :spinning="showLoading" size="large">
      <div class="avatar-container">
        <div class="user-info-container">
          <div class="user-avatar-container">
            <img :src="myAvatar" alt="myAvatar" class="user-avatar">
          </div>
          <div class="user-name-container">
            <a-tag color="cyan">
              <a-icon type="user"/>
              &nbsp;{{myUserName}}
            </a-tag>
          </div>
        </div>
        <div class="user-info-container" v-if="mentor.have">
          <div class="user-avatar-container">
            <router-link :to="'/user/visit/'+mentor.id">
              <img :src="mentor.avatar" alt="myMentorAvatar" class="user-avatar">
            </router-link>
          </div>
          <div class="user-name-container">
            <router-link :to="'/user/visit/'+mentor.id">
              <a-tag color="purple">
                <a-icon type="fork"/>
                &nbsp;{{mentor.username}}
              </a-tag>
            </router-link>
          </div>
        </div>
      </div>
      <div class="mentor-set">
        <h3>设置Mentor</h3>
        <div class="mentor-set-container">
          <a-input-group>
            <a-input addonBefore="Mentor姓名" v-model="setMentorName" size="large"/>
          </a-input-group>
        </div>
        <div class="mentor-set-btn-container">
          <a-button icon="tool" type="primary" @click="setMentor">设定</a-button>
        </div>
      </div>
      <h3>我的Mentee</h3>
      <div class="mentor-my-students">
        <div class="mentor-my-students-item" v-for="student in students" :key="student.id">
          <div class="student-item-avatar">
            <div class="student-item-avatar-container">
              <router-link :to="'/user/visit/'+student.id">
                <img :src="student.avatar" alt="userAvatar" class="user-avatar-small">
              </router-link>
            </div>
            <div class="student-item-name-container">
              <router-link :to="'/user/visit/'+student.id">
                <a-tag color="cyan">
                  <a-icon type="user"/>
                  &nbsp;{{student.username}}
                </a-tag>
              </router-link>
            </div>
          </div>
          <div class="student-item-graph">
            <report-graph :uid="student.id" align="left"></report-graph>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
const reportGraph = () => import("./reportGraph.vue");
export default {
    components: {
        "report-graph": reportGraph
    },
    data() {
        return {
            mentor: {
                have: false,
                id: "",
                avatar: "",
                username: ""
            },
            students: [],
            myUserName: "",
            setMentorName: "",
            showLoading: true
        };
    },
    computed: {
        myAvatar() {
            return this.$store.state.avatarSrc;
        }
    },
    methods: {
        async getInfo() {
            this.showLoading = true;
            const mentorResponseRaw = await this.$ajax.get(
                this.$urls.mentorMyStudents
            );
            if (mentorResponseRaw.data.code === 1) {
                const mentorResponse = mentorResponseRaw.data.msg;
                if (mentorResponse.mentor === null) {
                    this.mentor.have = false;
                    this.setMentorName = "";
                } else {
                    this.mentor.have = true;
                    ["id", "avatar", "username"].forEach(item => {
                        this.mentor[item] = mentorResponse.mentor[item];
                    });
                    this.setMentorName = this.mentor.username;
                }
                this.students = mentorResponse.students;
                this.myUserName = mentorResponse.my.username;
            } else {
                const modal = this.$error();
                modal.update({
                    title: "Mentor资料获取错误",
                    content: mentorResponseRaw.data.msg
                });
            }
            this.showLoading = false;
        },
        async setMentor() {
            this.showLoading = true;
            const setResult = await this.$ajax.post(this.$urls.mentorSet, {
                mentorName: this.setMentorName
            });
            if (setResult.data.code === 1) {
                this.$notification.open({
                    message: "Mentor设置",
                    description: "Mentor设置成功！",
                    icon: <a-icon type="fork" style="color: #108ee9" />
                });
                this.getInfo();
            } else {
                const modal = this.$error();
                modal.update({
                    title: "Mentor设置错误",
                    content: setResult.data.msg
                });
            }
            this.showLoading = false;
        }
    },
    mounted() {
        this.getInfo();
    }
};
</script>
<style scoped>
@media screen and (max-width: 1150px) {
    .mentor-my-students-item {
        grid-template-rows: 160px 196px;
    }
    .student-item-avatar {
        text-align: center;
    }
    .student-item-graph {
        margin: auto;
    }
}
@media screen and (min-width: 1150px) {
    .mentor-my-students-item {
        grid-template-columns: 30% 70%;
    }
    .student-item-avatar {
        text-align: right;
    }
}
@media screen and (max-width: 800px) {
    .mentor-set,
    .mentor-my-students {
        width: 95%;
        margin: 0 auto;
    }
}
@media screen and (min-width: 800px) {
    .mentor-set {
        width: 60%;
        margin: 0 auto;
    }
    .mentor-my-students {
        width: 80%;
        margin: 0 auto;
    }
    .mentor-set-container {
        width: 60%;
        margin: 0 auto;
    }
}
.student-item-graph {
    padding: 12px;
    width: auto;
    max-width: 650px;
}
.user-info-container {
    display: inline-block;
}
.mentor-my-students-item {
    display: grid;
}
.user-avatar {
    height: 128px;
    width: 128px;
    border-radius: 64px;
    margin: 0 16px;
}
.user-avatar-small {
    height: 96px;
    width: 96px;
    border-radius: 48px;
}
.avatar-container {
    margin: 36px auto;
    text-align: center;
}
.user-name-container {
    margin-top: 12px;
}
h3 {
    text-align: center;
    user-select: none;
    margin: 36px auto;
}
.mentor-set-btn-container {
    text-align: center;
    margin: 12px auto;
}
.student-item-name-container {
    margin: 8px 8px 0 0;
}
</style>
