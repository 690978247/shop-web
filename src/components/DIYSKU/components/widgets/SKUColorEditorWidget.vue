<template>
  <div class="container">
    <template v-if="colorConfig.colorMode !== EnumColorMode.Non">
      <el-row v-if="colorConfig.colorMode === EnumColorMode.All">
        <el-col :span="24">
          <h3 class="primary-colors-title">Colorsucker</h3>
          <div class="color-picker">
            <input type="color" v-model="pickedColor" @change="onColorPick" />
            <span>{{ pickedColor }} {{ colorName }}</span>
          </div>
        </el-col>
      </el-row>
      <!-- <el-row class="apply-btn">
        <el-col :span="24">
          <el-button type="primary" @click="applyAll">Apply All</el-button>
        </el-col>
      </el-row> -->
      <el-row class="color-options-container">
        <el-col :span="24">
          <h3 class="primary-colors-title">Optional</h3>
          <div class="color-options">
            <div
              v-for="(color, index) in colorConfig.colorMode ===
              EnumColorMode.Designated
                ? colorConfig.colors
                : rainbowColors"
              :key="index"
              class="color-block"
              :style="{ backgroundColor: color }"
              @click="onColorSelect(color)"
            ></div>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <div class="no-color-space">
        <svg
          t="1722838075946"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6620"
          width="48"
          height="48"
        >
          <path
            d="M512 60.069097c-249.594615 0-451.930903 202.337311-451.930903 451.930903 0 249.594615 202.336288 451.930903 451.930903 451.930903 249.593592 0 451.930903-202.336288 451.930903-451.930903C963.930903 262.406408 761.593592 60.069097 512 60.069097zM884.842637 512c0 93.034906-34.154891 178.041976-90.50734 243.35961L268.64039 229.665727c65.317635-56.352449 150.323681-90.508363 243.35961-90.508363C717.913766 139.157363 884.842637 306.08521 884.842637 512zM139.157363 512c0-84.375689 28.060079-162.17766 75.312266-224.658689L736.658689 809.53037c-62.482053 47.252187-140.284023 75.312266-224.658689 75.312266C306.08521 884.842637 139.157363 717.91479 139.157363 512z"
            fill="#CCCCCC"
            p-id="6621"
          ></path>
        </svg>
      </div>
      <div class="no-color-space-text">
        The current design does not support color modification.
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import useSelect from '@/components/DIYSKU/hooks/select'

import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

// eslint-disable-next-line no-unused-vars
enum EnumColorMode {
  // eslint-disable-next-line no-unused-vars
  Designated = 'designated',
  // eslint-disable-next-line no-unused-vars
  All = 'all',
  // eslint-disable-next-line no-unused-vars
  Non = 'nonsupport'
}

const { canvasEditor, store } = useSelect()
const pickedColor = ref('#FFFFFF')
const colorName = ref('')
const colorConfig = ref<{
  colorMode: EnumColorMode
  colors?: string[]
}>({
  colorMode: EnumColorMode.Non
})

const rainbowColors = [
  '#FFFFFF',
  '#000000',
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#8B00FF'
]

/**
 * 更新产品颜色
 */
const updateProductColor = () => {
  const productObject = canvasEditor.getObjectById('product')
  if (!productObject) {
    ElMessage.error('productObject not found!')
    return
  }
  productObject.set('backgroundColor', pickedColor.value)

  canvasEditor.renderAll()
  designEventBus.emit(DESIGN_EVENTS.USER_PRODUCT_COLOR_DID_CHANGE, {
    color: pickedColor.value
  })
}

const onColorPick = () => {
  colorName.value = getColorName(pickedColor.value)
  updateProductColor()
}

const onColorSelect = (color: string) => {
  pickedColor.value = color
  colorName.value = getColorName(color)
  // updateBackgroundColor()
  updateProductColor()
}

const getColorName = (color: string): string => {
  // 实现一个简单的颜色名称映射，可以根据需要扩展
  const colorMap: { [key: string]: string } = {
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#FF0000': 'Red',
    '#FF7F00': 'Orange',
    '#FFFF00': 'Yellow',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#4B0082': 'Indigo',
    '#8B00FF': 'Violet',
    '#00FFFF': 'Cyan',
    '#FF00FF': 'Magenta'
  }
  return colorMap[color] || ''
}

const didCurrentStageIndexChange = () => {
  const _colorConfig = store.getCurrentStage()?.colorConfig
  console.log('🚀 ~ didCurrentStageIndexChange ~ colorConfig:', _colorConfig)
  colorConfig.value = _colorConfig
}

const onStageSwitch = (data: any) => {
  didCurrentStageIndexChange()
}

const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.STAGE_DID_SWITCH, onStageSwitch)
  designEventBus.on(DESIGN_EVENTS.FABRIC_JSON_LOADED, onStageSwitch)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.STAGE_DID_SWITCH, onStageSwitch)
  designEventBus.off(DESIGN_EVENTS.FABRIC_JSON_LOADED, onStageSwitch)
}

onMounted(() => {
  setupListeners()
})
onUnmounted(() => {
  clearListeners()
})
</script>

<style scoped>
.container {
  width: 80%;

  margin-left: 20px;
  margin-top: 20px;
  /*
  padding-left: 20px;
  padding-right: 20px; */
  /* padding: 20px; */
}

.color-picker {
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.color-picker input[type='color'] {
  margin-right: 10px;
}

.color-options {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* flex-wrap: wrap;
  justify-content: center; */
  gap: 12px;
}
.primary-colors {
  display: flex;
  gap: 10px;
  /* width: 80%; */
}

.color-block {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid #ccc;
}

.color-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.color-circle span {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
  display: none;
}

.color-circle:hover span {
  display: block;
}
.apply-btn {
  margin-bottom: 20px;
}
.color-options-container {
  width: 80%;
}
.primary-colors-title {
  color: rgb(92, 92, 92);
  font-size: 16px;
}
.no-color-space {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-color-space-text {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>
