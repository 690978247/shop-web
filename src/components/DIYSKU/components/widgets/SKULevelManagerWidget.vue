<template>
  <div class="container">
    <el-button round @click="moveBackward" :disabled="isAtBottom"
      >Backward</el-button
    >
    <div>Arrange layers</div>
    <el-button round @click="moveForward">Forward</el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import useSelect from '@/components/DIYSKU/hooks/select'
const { canvasEditor, store } = useSelect()

const minLayer = 4

const isAtBottom = computed(() => {
  const index = canvasEditor.getActiveObjectIndex()
  return index !== -1 && index < minLayer
})

const moveBackward = () => {
  if (!canvasEditor.moveBackwardLayer()) {
    ElMessage.error('Layer cannot be moved below the minimum layer.')
  }
}

const moveForward = () => {
  if (!canvasEditor.moveForwardLayer()) {
    ElMessage.error('No active object selected.')
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
</style>
