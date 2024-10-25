<template>
  <div class="edit-container">
    <span>Size:</span>
    <el-slider
      v-model="sliderValue"
      :min="0"
      :max="100"
      :step="1"
      @input="updateScale"
      class="slider"
    ></el-slider>
    <span>{{ sliderValue }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { throttle } from 'lodash-es'
import useSelect from '@/components/DIYSKU/hooks/select'

const { canvasEditor } = useSelect()

const sliderValue = ref(0.2)

const throttledError = throttle((message: string) => {
  ElMessage.error(message)
}, 3000)

const updateScale = (value: number) => {
  const activeObject = canvasEditor.getActiveObject()
  if (!activeObject) {
    throttledError('Please select object first')
    return
  }
  let scale = value / 200.0
  if (activeObject.type.includes('text')) {
    scale = value / 10.0
  }

  canvasEditor.setScale(activeObject, scale)
}
</script>

<style scoped>
.edit-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-left: 20px;

  height: 100%;
}

.slider {
  margin-left: 20px;
  margin-right: 20px;
  min-width: 100px;
}
</style>
