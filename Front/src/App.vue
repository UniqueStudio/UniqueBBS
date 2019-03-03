<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
    name: "App",
    mounted() {
        this.$router.beforeEach((to, from, next) => {
            const loginStatus = this.$store.state.loginStatus;
            if (
                to.matched.some(item => item.meta.requireLogin) &&
                !loginStatus
            ) {
                next({
                    path: "/user/login/pwd"
                });
            } else if (
                to.matched.some(item => item.meta.requireUnLogin) &&
                loginStatus
            ) {
                next({
                    path: "/user/my/info"
                });
            } else {
                next();
            }
        });
        this.$notification.config({
            top: "86px",
            placement: "topRight",
            duration: 5
        });
    },
    computed: {
        noticeContent() {
            return this.$store.state.noticeContent;
        }
    },
    watch: {
        noticeContent(newContent, oldContent) {
            if (newContent !== "") {
                this.$notification.open({
                    message: "消息通知",
                    description: newContent,
                    icon: <a-icon type="mail" style="color: #108ee9" />
                });
            }
        }
    }
};
</script>

<style>
#app {
    font-family: "Microsoft Yahei", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
