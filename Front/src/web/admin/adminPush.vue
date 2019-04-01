<template>
  <a-spin :spinning="showLoading" size="large">
    <a-form @submit="handleSubmit">
      <a-form-item label="组别" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-checkbox-group :options="checkBoxOptions" v-model="checkBoxValue"/>
      </a-form-item>
      <a-form-item label="内容" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-input type="textarea" v-model="content" placeholder="请输入通知的内容"/>
      </a-form-item>
      <a-form-item label="URL" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <a-input v-model="url" placeholder="请输入完整URL"/>
      </a-form-item>
      <a-form-item class="notice-btn">
        <a-button
          type="primary"
          html-type="submit"
          icon="sound"
          @click="handleSubmit"
          :disabled="showLoading"
        >发送通知</a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>
<script>
export default {
    data() {
        return {
            checkBoxOptions: [],
            checkBoxValue: [],
            content: "",
            url: "",
            showLoading: true
        };
    },
    methods: {
        async handleSubmit() {
            if (this.showLoading) {
                return;
            }
            this.showLoading = true;
            const responseRaw = await this.$ajax.post(this.$urls.messagePush, {
                groupLists: this.checkBoxValue,
                content: this.content,
                url: this.url
            });
            if (responseRaw.data.code === 1) {
                this.$notification.open({
                    message: "消息推送已发送",
                    description: "服务器正在异步推送消息，请稍等片刻！",
                    icon: <a-icon type="smile" style="color: #108ee9" />
                });
            } else {
                const modal = this.$error();
                modal.update({
                    title: "推送错误",
                    content: responseRaw.data.msg
                });
            }

            this.showLoading = false;
        }
    },
    async mounted() {
        this.showLoading = true;
        const responseRaw = await this.$ajax.get(this.$urls.groupList);
        if (responseRaw.data.code !== 1) {
            return this.$store.dispatch("checkLoginStatus");
        }
        const groupList = responseRaw.data.msg;
        this.checkBoxOptions = groupList.map(item => ({
            label: item.group.name,
            value: item.group.id
        }));
        this.showLoading = false;
    }
};
</script>
<style scoped>
.notice-btn {
    text-align: center;
}
</style>
