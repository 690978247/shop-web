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
import SKUStageSwitchWidget from '@/components/DIYSKU/components/widgets/SKUStageSwitchWidgetPreview.vue'
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
  width: 120px;
  z-index: 10;
  background: #f1f1f1;
}
</style>
