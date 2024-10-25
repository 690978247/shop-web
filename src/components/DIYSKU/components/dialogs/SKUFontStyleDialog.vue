<template>
  <el-dialog
    class="sku-font-style-dialog"
    v-model="localVisible"
    width="800px"
    title="Edit Font Style"
  >
    <template #header>
      <label class="header-title">Edit Font Style</label>
    </template>
    <div class="text-controls">
      <div class="text-specific-controls">
        <label class="title">Text content:</label>
        <el-input
          type="textarea"
          class="text-content"
          rows="2"
          columns="10"
          v-model="textContent"
        ></el-input>
        <label for="font-family" class="title">Font family:</label>
        <el-select id="font-family" class="select-content" v-model="fontFamily">
          <el-option
            v-for="item in fontOptions"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <!-- <label for="text-align" class="title">Text align:</label>
        <el-select id="text-align" class="select-content" v-model="textAlign">
          <el-option
            v-for="item in textOptions"
            :key="item.value"
            :label="item.lab"
            :value="item.value"
          ></el-option>
        </el-select> -->
        <label for="font-size" class="title">Font size: {{ fontSize }}</label>
        <el-slider
          v-model="fontSize"
          :min="1"
          :max="120"
          :step="1"
          class="value-content"
        ></el-slider>
        <label class="title">Font Opacity: {{ opacity }}</label>
        <el-slider
          v-model="opacity"
          :min="0"
          :max="100"
          :step="1"
          class="value-content"
        ></el-slider>
        <label for="text-lines-bg-color" class="title"
          >Text color: {{ textBgColor }}</label
        >
        <el-color-picker
          v-model="textBgColor"
          id="text-lines-bg-color"
          class="btn-object-action"
        >
        </el-color-picker>
      </div>
      <div class="font-actions">
        <el-button
          :plain="!isBold"
          @click="toggleBold"
          :type="isBold ? 'primary' : ''"
          :style="{ fontWeight: isBold ? 'bold' : 'normal' }"
        >
          Bold
        </el-button>
        <el-button
          :type="isItalic ? 'primary' : ''"
          :plain="!isItalic"
          @click="toggleItalic"
          :style="{ fontStyle: isItalic ? 'italic' : 'normal' }"
        >
          Italic
        </el-button>
        <el-button
          :type="isUnderline ? 'primary' : ''"
          :plain="!isUnderline"
          @click="toggleUnderline"
          :style="{ textDecoration: isUnderline ? 'underline' : 'none' }"
        >
          Underline
        </el-button>
        <el-button
          :type="isLinethrough ? 'primary' : ''"
          :plain="!isLinethrough"
          @click="toggleLinethrough"
          :style="{ textDecoration: isLinethrough ? 'line-through' : 'none' }"
        >
          Linethrough
        </el-button>
        <el-button
          :type="isOverline ? 'primary' : ''"
          :plain="!isOverline"
          @click="toggleOverline"
          :style="{ textDecoration: isOverline ? 'overline' : 'none' }"
        >
          Overline
        </el-button>
      </div>

      <br />

      <div class="apply-btn-container">
        <el-button
          round
          type="primary"
          class="apply-btn"
          @click="applyFontStyle"
          >Apply
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import useSelect from '@/components/DIYSKU/hooks/select'

const { canvasEditor, fabric } = useSelect()

const props = defineProps({
  visible: Boolean
})

const emits = defineEmits(['update:visible', 'apply'])

const localVisible = ref(props.visible)
const fontFamily = ref('Arial')
const textAlign = ref('left')
const fontSize = ref(40)
const textContent = ref('')
const textBgColor = ref('#000000')
const opacity = ref(100)

const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const isLinethrough = ref(false)
const isOverline = ref(false)
const fontOptions = [
  {
    label: 'Arial',
    value: 'Arial'
  },
  {
    label: 'Helvetica',
    value: 'Helvetica'
  },
  {
    label: 'Myriad Pro',
    value: 'Myriad Pro'
  },
  {
    label: 'Delicious',
    value: 'Delicious'
  },
  {
    label: 'Verdana',
    value: 'Verdana'
  },
  {
    label: 'Georgia',
    value: 'Georgia'
  },
  {
    label: 'Courier',
    value: 'Courier'
  },
  {
    label: 'Comic Sans MS',
    value: 'Comic Sans MS'
  },
  {
    label: 'Monaco',
    value: 'Monaco'
  },
  {
    label: 'Optima',
    value: 'Optima'
  },
  {
    label: 'Hoefler Text',
    value: 'Hoefler Text'
  },
  {
    label: 'Plaster',
    value: 'Plaster'
  },
  {
    label: 'Engagement',
    value: 'Engagement'
  }
]
// const textOptions = [
//   { label: 'left', value: 'left' },
//   { label: 'center', value: 'center' },
//   { label: 'right', value: 'right' },
//   { label: 'justify', value: 'justify' }
// ]
const updateInfo = () => {
  const activeObject = canvasEditor.getActiveObject()
  if (activeObject && activeObject instanceof fabric.Text) {
    textContent.value = activeObject.text || ''
    fontFamily.value = activeObject.fontFamily || 'Arial'
    textAlign.value = activeObject.textAlign || 'left'
    fontSize.value = activeObject.fontSize || 40
    textBgColor.value = activeObject.fill || ''
    isBold.value = activeObject.fontWeight === 'bold'
    isItalic.value = activeObject.fontStyle === 'italic'
    isUnderline.value = !!activeObject.underline
    isLinethrough.value = !!activeObject.linethrough
    isOverline.value = !!activeObject.overline
    opacity.value = activeObject.opacity * 100
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      updateInfo()
      localVisible.value = newVal
    }
  }
)

watch(localVisible, (newVal) => {
  emits('update:visible', newVal)
  if (newVal === false) {
    canvasEditor.discardActive()
  }
})

const applyFontStyle = () => {
  const activeObject = canvasEditor.getActiveObject()
  if (activeObject && activeObject instanceof fabric.Text) {
    activeObject.set({
      text: textContent.value,
      fontFamily: fontFamily.value,
      textAlign: textAlign.value,
      fontSize: fontSize.value,
      fill: textBgColor.value,
      fontWeight: isBold.value ? 'bold' : 'normal',
      fontStyle: isItalic.value ? 'italic' : 'normal',
      underline: isUnderline.value,
      linethrough: isLinethrough.value,
      overline: isOverline.value,
      opacity: opacity.value / 100
    })
    canvasEditor.renderAll()
    localVisible.value = false
    emits('apply')
  } else {
    ElMessage.error('Please select a text object first')
  }
}

const toggleBold = () => {
  isBold.value = !isBold.value
}

const toggleItalic = () => {
  isItalic.value = !isItalic.value
}

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value
}

const toggleLinethrough = () => {
  isLinethrough.value = !isLinethrough.value
}

const toggleOverline = () => {
  isOverline.value = !isOverline.value
}
</script>

<style lang="scss" scoped>
.sku-font-style-dialog {
  margin: 0;
  padding: 0;
}

.text-controls {
  background: white;
}

.text-specific-controls {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 20px; */
  /* margin-top: 20px; */
}

.header-title {
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  color: #666666;
}

.title {
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 5px;
  font-size: 18px;
  color: #666666;
}

.text-content {
  margin-left: 5px;
  margin-right: 20px;
  width: 50%;
}

.select-content {
  margin-left: 5px;
  margin-right: 20px;
  height: 34px;
  width: 50%;
  font-size: 20px;
}

.value-content {
  margin-left: 5px;
  margin-right: 20px;
  height: 44px;
  width: 25%;
}

.apply-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}

.apply-btn {
  width: 80%;
  height: 44px;
  font-size: 22px;
  font-weight: bold;
}

.font-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
  margin-right: 5px;
  margin-top: 20px;
  /* margin: 5px; */
  min-width: 80px;
}
</style>
