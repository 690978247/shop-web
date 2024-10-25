<template>
  <div class="container"></div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  // height: 20px;
  display: flex;
  flex-direction: column;
  // align-items: center;
  background: #03226f;
}
.text {
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
}
</style>
