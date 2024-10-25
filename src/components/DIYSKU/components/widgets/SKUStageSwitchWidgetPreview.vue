<template>
  <div class="layersContainer">
    <div
      v-for="(obj, index) in store.thumbanilImageList"
      :key="index"
      :class="['thumbnail', { selected: index === store.currentStageIndex }]"
      @click="handleClick(index)"
    >
      <div class="img-wrapper">
        <img :src="obj.src" alt="Thumbnail" />
        <label class="label" for="{{ index }}"> {{ obj.name }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/components/DIYSKU/hooks/select'
const { canvasEditor, store } = useSelect()

const handleClick = async (index: number) => {
  const currentIndex = store.currentStageIndex
  if (currentIndex === index) {
    console.log(
      '🟩[SKUStageSwitchWidget] index is same as current stage index, do nothing'
    )
    return
  }
  //跳转
  store.doAction('currentStageIndex', {
    canvasEditor: canvasEditor,
    index: index
  })
}
</script>

<style lang="scss" scoped>
.layersContainer {
  width: 100%;
  height: 100%;
  gap: 22px;
  overflow-y: auto;
  display: flex;
  flex-direction: column; /* 设置为水平排布 */
  align-items: center; /* 垂直居中 */
  justify-content: center;
  // overflow-y: auto;
  // overflow-x: hidden;
}

.thumbnail {
  position: relative;
  margin: 10px; /* 添加间距 */
  background: white;
  border: 1px solid #ccc; /* 灰色边框 */
  cursor: pointer; /* 添加手型光标 */
  width: 64px; /* 固定宽度 */
  height: 64px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.thumbnail.selected {
  border-color: var(--el-color-primary); /* 选中时的红色边框 */
  .label {
    color: var(--el-color-primary);
  }
}

.thumbnail .index {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 12px;
}

.img-wrapper {
  width: 90%; /* 调整图片容器大小 */
  height: 90%; /* 调整图片容器大小 */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  overflow: hidden;
  color: #999999;
  .label {
    position: absolute;
    bottom: -20px;
    font-size: 14px;
  }
}

.thumbnail img {
  width: 100%;
  height: auto;
  object-fit: contain; /* 保持图片比例 */
}
</style>
