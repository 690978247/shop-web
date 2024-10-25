<template>
  <div class="slider-container" v-if="displayAlpha">
    <span class="title">Opacity</span>
    <el-slider
      v-model="imageAlpha"
      :min="0"
      :max="100"
      :step="1"
      @input="imageAlphaFn"
    />
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/components/DIYSKU/hooks/select'

const imageAlpha = ref(1)
const displayAlpha = ref(false)
const { canvasEditor, mixinState } = useSelect()

const imageAlphaFn = (value: any) => {
  const currentActiveObject = canvasEditor.getActiveObject()
  if (currentActiveObject) {
    currentActiveObject.opacity = value / 100.0
    canvasEditor.renderAll()
  }
}

const updateInfo = () => {
  const currentActiveObject = canvasEditor.getActiveObject()
  if (currentActiveObject) {
    imageAlpha.value = currentActiveObject.opacity * 100.0
    displayAlpha.value = true
  } else {
    displayAlpha.value = false
  }
}
watch(
  () => mixinState.mSelectOneType,
  (val) => {
    updateInfo()
  }
)
</script>

<style scoped lang="scss">
.operateUndo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  gap: 10px;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #333333;
    color: #333333;
  }
}
.divider {
  margin-left: 20px;
  margin-right: 20px;
}
.slider-container {
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 180px;
  margin-left: 20px;
  .title {
    width: 80px;
    margin-right: 10px;
    font-size: 18px;
  }
}
</style>
