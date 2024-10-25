<template>
  <div class="sku-stage-list">
    <el-button
      @click="handleUpClick"
      class="sku-nav-button"
      :disabled="store.currentStageIndex === 0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m12 8l-6 6l1.41 1.41L12 10.83l4.59 4.58L18 14z"
        />
      </svg>
    </el-button>

    <div class="sku-layers-container">
      <div
        v-for="(obj, index) in store.thumbanilImageList"
        :key="index"
        :class="[
          'sku-thumbnail',
          { 'sku-thumbnail-selected': index === store.currentStageIndex }
        ]"
        @click="handleClick(index)"
      >
        <span class="sku-index">{{ index + 1 }}</span>
        <div class="sku-img-wrapper">
          <img :src="obj.src" alt="Thumbnail" />
          <label class="sku-label" for="{{ index }}"> {{ obj.name }}</label>
        </div>
      </div>
    </div>

    <el-button
      @click="handleDownClick"
      class="sku-nav-button"
      :disabled="
        store.currentStageIndex === store.thumbanilImageList.length - 1
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6z"
        />
      </svg>
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/components/DIYSKU/hooks/select'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'
const { canvasEditor, store } = useSelect()
const isShowTop = ref(true)

const firstLoadFabricJSON = ref(true)
const updateURLWithTab = (index: any) => {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  url.searchParams.set('stageIndex', index.toString())
  // 使用 pushState 修改 URL
  window.history.pushState({}, '', url)
}
const handleUpClick = () => {
  const currentIndex = store.currentStageIndex
  if (currentIndex > 0) {
    handleClick(currentIndex - 1)
  }
}

const handleDownClick = () => {
  const currentIndex = store.currentStageIndex
  if (currentIndex < store.thumbanilImageList.length - 1) {
    handleClick(currentIndex + 1)
  }
}

const handleClick = async (index: number) => {
  console.log('🟩[SKUStageSwitchWidget] will switch stage index:', index)
  const currentIndex = store.currentStageIndex
  if (currentIndex === index) {
    console.log(
      '🟩[SKUStageSwitchWidget] index is same as current stage index, do nothing'
    )
    return
  }
  isShowTop.value = false

  updateURLWithTab(index)
  designEventBus.emit(DESIGN_EVENTS.STAGE_WILL_SWITCH, {
    fromIndex: currentIndex,
    toIndex: index
  })
  console.log('🟩[SKUStageSwitchWidget] updateCurrentStageScreenshot')
  //更新缩略图
  store.updateCurrentStageScreenshot({
    canvasEditor: canvasEditor,
    complete: () => {
      //跳转
      console.log('🟩[SKUStageSwitchWidget] switch stage index:', index)
      store.doAction('currentStageIndex', {
        canvasEditor: canvasEditor,
        index: index
      })

      setTimeout(() => {
        isShowTop.value = true
      }, 800)
    }
  })
}

const switchTab = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const stageIndex = urlParams.get('stageIndex')
  if (stageIndex) {
    const index = parseInt(stageIndex)
    handleClick(index)
  }
}
const firstLoad = () => {
  if (firstLoadFabricJSON.value) {
    switchTab()
    return
  }
}

const updateThumbnail = (data: any) => {
  executeUpdate()
}

const executeUpdate = () => {
  store.updateCurrentStageScreenshot({
    canvasEditor: canvasEditor,
    complete: () => {}
  })
  console.log('🟩[SKUStageSwitchWidget] 当前更新截图')
}
const onSceneWillSwitch = (data: any) => {
  // executeUpdate()
}
const onSceneSwitch = (data: any) => {
  updateURLWithTab(0)
}
const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.FABRIC_JSON_LOADED, firstLoad)
  designEventBus.on(DESIGN_EVENTS.USER_REMOVE_OBJECT, updateThumbnail)
  designEventBus.on(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.on(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.FABRIC_JSON_LOADED, firstLoad)
  designEventBus.off(DESIGN_EVENTS.USER_REMOVE_OBJECT, updateThumbnail)
  designEventBus.off(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.off(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}

onMounted(() => {
  setupListeners()
})

onUnmounted(() => {
  clearListeners()
})
</script>

<style lang="scss" scoped>
.sku-stage-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
}
.sku-layers-container {
  width: 100%;
  height: 100%;
  gap: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* 设置为水平排布 */
  align-items: center; /* 垂直居中 */
  // overflow-y: auto;
  overflow-x: hidden;
}

.sku-thumbnail {
  position: relative;
  margin: 10px; /* 添加间距 */
  background: white;
  border: 1px solid #ccc; /* 灰色边框 */
  cursor: pointer; /* 添加手型光标 */
  width: 165px; /* 固定宽度 */
  height: 200px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.sku-thumbnail-selected {
  border-color: var(--el-color-primary); /* 选中时的红色边框 */
  .sku-label {
    color: var(--el-color-primary);
  }
}

.sku-thumbnail .sku-index {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
}

.sku-img-wrapper {
  width: 90%; /* 调整图片容器大小 */
  height: 90%; /* 调整图片容器大小 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  overflow: hidden;
  color: #999999;
  .sku-label {
    position: absolute;
    bottom: -20px;
    font-size: 14px;
  }
}

.sku-thumbnail img {
  width: 100%;
  height: auto;
  object-fit: contain; /* 保持图片比例 */
}
.sku-nav-button {
  border-radius: 50%;
  width: 25px;
  height: 25px;
}
</style>
