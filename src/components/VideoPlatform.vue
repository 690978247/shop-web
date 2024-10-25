<!--
 * @Author: jiangshiyang
 * @Date: 2024-07-16 17:58:34
 * @LastEditors: jiangshiyang
 * @Description: 视频组件(嵌入youtube或者tiktok视频)
-->

<template>
  <iframe
    v-if="videoType == 'youtube'"
    :src="videoSrc"
    title="Video Player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
  />
  <iframe
    v-else
    width="100%"
    height="100%"
    :src="videoSrc"
    frameborder="0"
    allowfullscreen
    title="Video Player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  ></iframe>
</template>

<script setup lang="ts">
type TVideoType = 'youtube' | 'tiktok'
const videoType: Ref<TVideoType> = ref('youtube')

const props = defineProps({
  iframeSrc: {
    type: String,
    default: ''
  }
})

/**
 * @description 解析youtube视频嵌入iframe的src
 * @param iframeSrc
 */
const parseVideoSrc = (iframeSrc: string) => {
  const parsedSrc = JSON.parse(iframeSrc)
  // 定义匹配YouTube链接的正则表达式
  const regex = /src="([^"]+)"/
  const match = parsedSrc.match(regex)

  if (match) {
    const youtubeUrl = match[1]
    console.log('🚀 ~ parseVideoSrc ~ youtubeUrl:', youtubeUrl) // 输出：https://www.youtube.com/embed/okTVO-7tP4k
    return youtubeUrl
  } else {
    console.log('未找到YouTube链接')
    return null
  }
}

/**
 * @description 解析tiktok视频嵌入iframe的src
 * @param iframeSrc
 */
const parseTiktokVideoSrc = (iframeSrc: string) => {
  const parsedSrc = JSON.parse(iframeSrc)
  // 定义匹配YouTube链接的正则表达式
  const regex = /data-video-id="([^"]+)"/
  const match = parsedSrc.match(regex)

  if (match) {
    const tiktokVideoId = match[1]
    console.log('🚀 ~ parseVideoSrc ~ tiktokVideoId:', tiktokVideoId) // 输出：https://www.youtube.com/embed/okTVO-7tP4k
    return `https://www.tiktok.com/embed/v3/${tiktokVideoId}`
  } else {
    console.log('未找到Tiktok视频链接')
    return null
  }
}

const videoSrc = computed(() => {
  if (props.iframeSrc.includes('www.youtube.com')) {
    videoType.value = 'youtube'
    return parseVideoSrc(props.iframeSrc)
  } else if (props.iframeSrc.includes('www.tiktok.com')) {
    videoType.value = 'tiktok'
    return parseTiktokVideoSrc(props.iframeSrc)
  }
})
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
