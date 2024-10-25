<template>
  <div class="container">
    <template v-if="pageStatus == LoadingStatus.LOADING"></template>
    <template v-if="pageStatus == LoadingStatus.LOADED">
      <DIYSKU :dataInfo="dataInfo()"></DIYSKU>
    </template>
    <template v-if="pageStatus == LoadingStatus.ERROR">
      <PODErrorPageComponent></PODErrorPageComponent>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router' // 导入 useRoute 钩子函数
import PODErrorPageComponent from '../components/PODErrorPageComponent.vue'
import DIYSKU from '@/components/DIYSKU/previewDiySku.vue'
import PodPreviewComponent from '../components/PodPreviewComponent.vue'

// eslint-disable-next-line no-unused-vars
enum LoadingStatus {
  // eslint-disable-next-line no-unused-vars
  LOADING = 'loading',
  // eslint-disable-next-line no-unused-vars
  LOADED = 'loaded',
  // eslint-disable-next-line no-unused-vars
  PREVIEW = 'preview',
  // eslint-disable-next-line no-unused-vars
  ERROR = 'error'
}

defineOptions({
  name: 'Home'
})

//http://localhost:3308/pod/index?did=123456&preview=0

const route = useRoute() // 获取当前路由信息
const did = route.query.did // 从 URL 查询参数中获取 did
const pNo = route.query.pNo
const spuNo = route.query.spuNo
const preview = route.query.preview === 'true' || route.query.preview === '1'

const dataInfo = () => {
  return {
    did: did,
    pNo: pNo,
    spuNo: spuNo
  }
}
const pageStatus = ref(LoadingStatus.LOADING)

const initialConfiguration = () => {
  // 退出 intercom
  if (window.Intercom) {
    console.log('intercom[退出]')
    window.Intercom('shutdown')
  }
  if (!did) {
    pageStatus.value = LoadingStatus.ERROR
    return
  }
  pageStatus.value = LoadingStatus.LOADED
}

onMounted(() => {
  initialConfiguration()
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: white;
  overflow-x: hidden;
}
</style>
