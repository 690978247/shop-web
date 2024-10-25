<template>
  <div class="go-back-widget">
    <el-button class="action" @click="goBack">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.2em"
        height="1.2em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"
        />
      </svg>
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router/router'
const goBack = () => {
  router.push({
    path: '/podlist'
  })
}
</script>

<style scoped lang="scss">
.action {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 36px;
  width: 36px;
  color: #333333;
  margin-left: 20px;
}
.action-btn {
  padding: 7px 10px 7px 10px;
  border-radius: 23px;
  height: 32px;
  font-weight: 400;
  min-width: 72px;
  font-size: 14px;
  line-height: 16.52;
  text-align: center;
  margin-right: 24px;
}
</style>
