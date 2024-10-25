<!--
 * @Author: jiangshiyang
 * @Date: 2024-07-16 17:58:34
 * @LastEditors: jiangshiyang
 * @Description: 视频组件
-->

<template>
  <div style="position: relative">
    <!-- 视频封面 -->
    <div class="mask" @click="show = true">
      <img
        alt=""
        src="https://static.hzpdex.com/web/1721182097500_Polygon 21.png"
      />
    </div>
    <video :id="videoId" :controls="false" crossorigin="anonymous" width="100%">
      <source :src="src" type="video/mp4" />
      <source :src="src" type="video/webm" />
      <source :src="src" type="video/ogg" />
      Your browser does not support the video tag or the current video format.
    </video>
    <ElDialog v-model="show" title="Video Preview" width="23%" top="10vh">
      <video controls width="100%" crossorigin="anonymous" autoplay>
        <source :src="src" type="video/mp4" />
        <source :src="src" type="video/webm" />
        <source :src="src" type="video/ogg" />
        Your browser does not support the video tag or the current video format.
      </video>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
import { ElDialog } from 'element-plus'

const show = ref(false)

defineProps({
  src: {
    type: String,
    default: ''
  },
  videoId: {
    type: String,
    default: 'myVideo'
  }
})
</script>

<style lang="scss" scoped>
video {
  object-fit: cover;
  aspect-ratio: 9 / 16;
}
.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(79, 79, 79, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 99;
  img {
    width: 20px;
    height: 17px;
  }
}
</style>
