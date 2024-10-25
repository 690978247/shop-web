<template>
  <div class="container">
    <el-aside class="left-side" width="900" height="750">
      <slot name="canvas"></slot>
    </el-aside>
    <el-aside class="right-side">
      <SKUStageSwitchWidget />
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import SKUStageSwitchWidget from '@/components/DIYSKU/components/widgets/SKUStageSwitchWidget.vue'
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  background: #edebeb;
}

.left-side {
  flex: 1;
  height: 100%;
}

.right-side {
  width: 200px;
  z-index: 10;
  background: rgb(255, 255, 255);
  box-shadow: 0 1px 5px 1px #dcdedf;
}
</style>
