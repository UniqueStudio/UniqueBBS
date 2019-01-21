<template>
  <div class="report-mentor">
    <div class="title-info" style="background:rgb(99, 76, 184);">
      <div class="title-icon">
        <a-icon type="trophy" class="title-item-icon"></a-icon>&nbsp;Mentor
      </div>
    </div>
    <div class="avatar-container">
      <img :src="myAvatar" alt="myAvatar" class="user-avatar">
      <img :src="mentor.avatar" alt="myMentorAvatar" class="user-avatar" v-if="mentor.have">
    </div>
    <div class="mentor-set"></div>
    <div class="mentor-my-students"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      mentor: {
        have: false,
        id: "",
        avatar: "",
        username: ""
      },
      students: [],
      mentorName: ""
    };
  },
  computed: {
    myAvatar() {
      return this.$store.state.avatarSrc;
    }
  },
  methods: {
    async getInfo() {
      const mentorResponseRaw = await this.$ajax.get(
        this.$urls.mentorMyStudents
      );
      if (mentorResponseRaw.data.code === 1) {
        const mentorResponse = mentorResponseRaw.data.msg;
        if (mentorResponse.mentor === null) {
          this.mentor.have = false;
        } else {
          this.mentor.have = true;
          ["id", "avatar", "username"].forEach(item => {
            this.mentor[item] = mentorResponse.mentor[item];
          });
        }
        this.students = mentorResponse.students;
      } else {
        const modal = this.$error();
        modal.update({
          title: "Mentor资料获取错误",
          content: mentorResponseRaw.data.msg
        });
      }
    },
    async setMentor() {}
  },
  mounted() {
    this.getInfo();
  }
};
</script>
<style scoped>
.user-avatar {
  height: 96px;
  width: 96px;
  border-radius: 48px;
  margin: 0 16px;
}
.avatar-container {
  margin: 36px auto;
  text-align: center;
}
</style>
