<template>
  <el-result title="404" sub-title="Sorry, request error">
    <ProductEmpty :width="'600px'" :height="'600px'" />
    <template #extra>
      <el-button type="primary" @click="backHome">Back</el-button>
    </template>
  </el-result>
</template>

<script lang="ts" setup>
import ProductEmpty from './ProductEmpty.vue'
import { useRoute } from 'vue-router'

const hide = ref(false)
const route = useRoute()

onBeforeMount(() => {
  const from = route.query.from
  if (from === 'usadropIframe') {
    hide.value = true
  }
})

const backHome = () => {
  if (hide.value) {
    // 检查window.parent是否存在以避免跨域错误
    if (window.parent && window.parent.location) {
      window.parent.postMessage('back', import.meta.env.VITE_UD_BASE_URL)
    } else {
      window.location.href = '/'
    }
    return
  }
  window.location.href = '/'
}
</script>
