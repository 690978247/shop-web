<template>
  <div class="index-group-box">
    <div class="scrollX left-button" @click="prevSlide">
      <img :src="ic_arr_left" alt="左箭头" style="width: 16px; height: 16px" />
    </div>
    <!-- 卡⽚ -->
    <div class="index-group-boxIn" ref="groupBoxRef">
      <img
        v-for="(item, index) in productFiles"
        :key="'thumb-' + index"
        :src="String(item)"
        :alt="'Thumbnail ' + index"
        class="group-card-n"
        :class="{
          'group-card-s': index === currentSelectedIndex
        }"
        @click="handleThumbnailClick(index)"
      />
    </div>
    <div class="scrollX right-button" @click="nextSlide">
      <img :src="ic_arr_right" alt="右箭头" style="width: 16px; height: 16px" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import ic_arr_right from '@/assets/images/detail/ic_arr_right.png'
import ic_arr_left from '@/assets/images/detail/ic_arr_left.png'

// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productFiles: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  }
})

const currentSelectedIndex = ref(props.currentIndex)
// 定义状态和 refs
const groupInfo = ref([])
const direction = ref('right')
const groupBoxRef = ref<HTMLElement>()
const emits = defineEmits(['didThumbnailsIndexChange'])

const updateScrollXPosition = () => {
  setTimeout(() => {
    document.getElementsByClassName('group-card-s')[0]?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth'
    })
  }, 50)
  //回调
  emits('didThumbnailsIndexChange', {
    val: Math.trunc(currentSelectedIndex.value)
  })
}

const prevSlide = () => {
  if (groupBoxRef.value && currentSelectedIndex.value > 0) {
    currentSelectedIndex.value--
  }
}

const nextSlide = () => {
  const lastCardIndex = props.productFiles.length - 1
  if (currentSelectedIndex.value < lastCardIndex) {
    currentSelectedIndex.value++
  }
}

const handleThumbnailClick = (index: number) => {
  currentSelectedIndex.value = index
}

watch(
  () => currentSelectedIndex.value,
  (newValue) => {
    currentSelectedIndex.value = newValue
    updateScrollXPosition()
  },
  {
    immediate: true // 立即执行一次
  }
)

const setScrollXPosition = (index: number) => {
  currentSelectedIndex.value = index
}
// 返回暴露给模板的变量和方法
defineExpose({
  groupInfo,
  direction,
  groupBoxRef,
  setScrollXPosition
})
</script>
<style lang="scss" scoped>
.index-group-box {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 66px;
  -webkit-user-select: none;
  user-select: none;
}

.scrollX {
  width: 32px;
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.scrollX:hover {
  cursor: pointer;
  background-color: #65447d;
}

.index-group-boxIn {
  display: flex;

  scroll-behavior: smooth;
  white-space: nowrap;
  overflow-x: auto;
  flex: none;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  margin-left: 32px;
  margin-right: 32px;
}

.index-group-boxIn::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.group-card-n {
  cursor: pointer;
  margin-right: 18px;
  width: 66px;
  height: 66px;
  border-radius: 4px;
  border: 1px solid #e5e5e5; /* 更简洁的方式合并 border-color 和 border-width */
  box-sizing: border-box; /* 保证边框宽度包含在元素总宽度内 */

  &.group-card-s {
    cursor: pointer;
    margin-right: 18px;
    width: 66px;
    height: 66px;
    border-radius: 4px;
    border: 2px solid var(--el-color-primary); /* 更简洁的方式合并 border-color 和 border-width */
    box-sizing: border-box; /* 保证边框宽度包含在元素总宽度内 */
  }
}

.left-button {
  left: 0;
  background-color: #eff1f3;
  width: 16px;
}

.right-button {
  right: 0;
  background-color: #eff1f3;
  width: 16px;
}

.scrollX:hover {
  background-color: #eff1f3;
}

.left-button img,
.right-button img {
  width: 16px;
  height: 100%;
}
</style>
