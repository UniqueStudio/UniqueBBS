<template>
  <div
    class="tag-container"
    :class="{'tag-active': active , 'tag-noactive':!active}"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
    props: ["active"],
    methods: {
        onClick() {
            this.$emit("click");
        }
    }
};
</script>
<style scoped>
.tag-container {
    height: 22px;
    width: 48px;
    font-size: 13px;
    display: inline-block;
    margin: 6px;
    cursor: pointer;
    border-radius: 11px;
    transition: all 0.9s cubic-bezier(0.33, 0.63, 0.65, 0.99);
}
.tag-active {
    background: #396bea;
    color: white;
}
.tag-noactive {
    background: #b4c0db;
    color: #363e51;
}
.tag-container:hover {
    opacity: 0.7;
}
</style>
