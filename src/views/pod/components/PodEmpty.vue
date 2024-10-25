<template>
  <div class="empty" :style="{ width: width, height: height }">
    <el-skeleton-item
      variant="image"
      :style="{ width: width, height: height }"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  width: {
    type: String,
    default: '500px'
  },
  height: {
    type: String,
    default: '500px'
  }
})
</script>

<style lang="scss" scoped>
.empty {
  background-color: #eff1f3;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
