<template>
  <div
    class="tag-container"
    :style="{backgroundColor: background , color: color? color: 'white' , cursor:cursor? cursor : 'default' }"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
    props: ["background", "color", "cursor"]
};
</script>
<style scoped>
.tag-container {
    width: auto;
    height: 24px;
    border-radius: 8px;
    font-size: 14px;
    user-select: none;
    text-align: center;
    display: inline-block;
    transition: all 0.9s cubic-bezier(0.33, 0.63, 0.65, 0.99);
    padding: 1px 8px 0 8px;
    margin: 0 4px;
}
.tag-container:hover {
    opacity: 0.7;
}
</style>
