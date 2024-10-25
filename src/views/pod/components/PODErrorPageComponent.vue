<template>
  <el-result title="404" sub-title="Sorry, request error">
    <PodEmpty :width="'600px'" :height="'600px'" />
    <template #extra>
      <el-button type="primary" @click="reload">reload</el-button>
    </template>
  </el-result>
</template>

<script lang="ts" setup>
import PodEmpty from './PodEmpty.vue'

const reload = () => {
  window.location.reload() // 修复 reload 调用
}
</script>
<style lang="scss" scoped></style>
