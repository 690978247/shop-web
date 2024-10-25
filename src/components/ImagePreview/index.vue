<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import {
  Close,
  FullScreen,
  RefreshLeft,
  RefreshRight,
  ZoomIn,
  ZoomOut
} from '@element-plus/icons-vue'

defineOptions({ name: 'ImagePreviewDialog' })

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  previewSrcList: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  },
  zoomRate: {
    type: Number,
    default: 0.8
  },
  maxScale: {
    type: Number,
    default: 7
  },
  minScale: {
    type: Number,
    default: 0.2
  }
})

const emits = defineEmits(['update:visible'])

const showPreviewDialog = ref(false)
const imageList = ref([])
// const currentPreviewImage = ref('')
const zoomFactor = ref(props.zoomRate)
const rotation = ref(0)
const currentIndex = ref(0)

// 放大图片
const zoomIn = () => {
  if (zoomFactor.value > props.maxScale) {
    return
  }
  zoomFactor.value += 0.1
}

// 缩小图片
const zoomOut = () => {
  if (zoomFactor.value < props.minScale) {
    return
  }
  zoomFactor.value -= 0.1
}

// 还原图片尺寸
const resetZoom = () => {
  zoomFactor.value = props.zoomRate
}

// 顺时针旋转图片
const rotateRight = () => {
  rotation.value += 90
}

// 逆时针旋转图片
const rotateLeft = () => {
  rotation.value -= 90
}

watch(
  () => props.visible,
  (newValue) => {
    zoomFactor.value = props.zoomRate
    showPreviewDialog.value = newValue
  }
)

watch(
  () => props.previewSrcList,
  (newValue) => {
    imageList.value = newValue || []
  },
  { immediate: true, deep: true }
)

watch(
  () => props.initialIndex,
  (newVal) => {
    currentIndex.value = newVal || 0
  },
  {
    immediate: true
  }
)

watch(
  () => showPreviewDialog.value,
  (newValue) => {
    if (!newValue) {
      currentIndex.value = props.initialIndex
      rotation.value = 0
    }
    emits('update:visible', newValue)
  }
)
const handleViewerPrev = () => {
  resetAction()
  currentIndex.value =
    currentIndex.value === 0
      ? imageList.value.length - 1
      : currentIndex.value - 1
}

const handleViewerNext = () => {
  resetAction()
  currentIndex.value =
    currentIndex.value === imageList.value.length - 1
      ? 0
      : currentIndex.value + 1
}

// 监听触控板手势放大缩小事件
const handleGesture = (event) => {
  event.preventDefault()
  const delta = Math.sign(event.deltaY) // 获取滚轮滚动方向，正数为向上滚动，负数为向下滚动
  if (delta > 0) {
    zoomOut() // 缩小图片
  } else if (delta < 0) {
    zoomIn() // 放大图片
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    showPreviewDialog.value = false
  } else if (event.key === 'ArrowLeft') {
    handleViewerPrev()
  } else if (event.key === 'ArrowRight') {
    handleViewerNext()
  }
}

const resetAction = () => {
  zoomFactor.value = props.zoomRate
  rotation.value = 0
}

onMounted(() => {
  registerGestureEvent()
})

onUnmounted(() => {
  unregisterGestureEvent()
})

// 注册触控板手势事件
const registerGestureEvent = () => {
  document.addEventListener('wheel', handleGesture)
  document.addEventListener('keydown', handleKeydown)
}

// 移除触控板手势事件
const unregisterGestureEvent = () => {
  document.removeEventListener('wheel', handleGesture)
  document.removeEventListener('keydown', handleKeydown)
}
</script>

<template>
  <div
    class="image-viewer__wrapper"
    v-if="showPreviewDialog"
    @keydown="handleKeydown"
    @click="showPreviewDialog = false"
  >
    <div class="image-viewer__canvas">
      <img
        @click.stop
        :src="imageList[currentIndex]"
        alt=""
        :style="{
          transform: `rotate(${rotation}deg) scale(${zoomFactor})`,
          transition: 'transform 0.3s ease 0s',
          'max-height': '100%',
          'max-width': '100%'
        }"
      />
    </div>
    <div
      class="image-viewer__btn image-viewer__close"
      @click="showPreviewDialog = false"
    >
      <el-icon>
        <Close />
      </el-icon>
    </div>
    <div v-if="imageList.length > 1" class="image-viewer__indicator">
      {{ currentIndex + 1 }} / {{ imageList.length }}
    </div>
    <div class="image-viewer__btn image-viewer__actions" @click.stop>
      <div class="image-viewer__actions__inner">
        <el-icon @click="zoomOut">
          <ZoomOut />
        </el-icon>
        <el-icon @click="zoomIn">
          <ZoomIn />
        </el-icon>
        <el-icon @click="resetZoom">
          <FullScreen />
        </el-icon>
        <el-icon @click="rotateLeft">
          <RefreshLeft />
        </el-icon>
        <el-icon @click="rotateRight">
          <RefreshRight />
        </el-icon>
      </div>
    </div>

    <div
      v-if="imageList.length > 1"
      class="image-viewer__btn image-viewer__prev"
      @click.stop="handleViewerPrev"
    >
      <el-icon>
        <ArrowLeft />
      </el-icon>
    </div>
    <div
      v-if="imageList.length > 1"
      class="image-viewer__btn image-viewer__next"
      @click.stop="handleViewerNext"
    >
      <el-icon>
        <ArrowRight />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer__wrapper {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置背景颜色为半透明黑色 */
  z-index: 999; /* 设置层级，保证遮罩位于其他内容之上 */
  display: flex; /* 使用 Flex 布局使内容垂直水平居中 */
  justify-content: center;
  align-items: center;
  position: fixed;
  transition: opacity 0.3s ease; /* 添加 opacity 属性的过渡效果 */

  .image-viewer__close {
    right: 40px;
    top: 40px;
    width: 44px;
    height: 44px;
    color: #fff;
    font-size: 28px;
    background-color: #606266;
  }

  .image-viewer__canvas {
    position: static;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
  }

  .image-viewer__indicator {
    position: absolute;
    bottom: 90px;
    color: #fff;
    font-size: 16px;
  }

  .image-viewer__actions {
    left: 50%;
    bottom: 30px;
    transform: translate(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 22px !important;

    .image-viewer__actions__inner {
      width: 100%;
      height: 100%;
      cursor: default;
      font-size: 23px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .el-icon {
        cursor: pointer;
      }
    }
  }

  .image-viewer__btn {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0.8;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
  }

  .image-viewer__prev {
    top: 50%;
    transform: translateY(-50%);
    left: 40px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
  }

  .image-viewer__next {
    top: 50%;
    transform: translateY(-50%);
    right: 40px;
    text-indent: 2px;
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
  }
}
</style>
