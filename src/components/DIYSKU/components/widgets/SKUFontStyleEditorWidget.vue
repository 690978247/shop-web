<template>
  <div class="text-controls">
    <div class="text-specific-controls">
      <label class="title">Text content:</label>
      <el-input
        type="textarea"
        class="text-content"
        rows="2"
        columns="10"
        v-model="textInfo.textContent"
      ></el-input>
      <label for="font-family" class="title">Font family:</label>
      <el-select
        id="font-family"
        class="select-content"
        v-model="textInfo.fontFamily"
      >
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
      <label class="title">Font size: {{ textInfo.fontSize }}</label>
      <el-slider
        v-model="textInfo.fontSize"
        :min="1"
        :max="120"
        :step="1"
        class="value-content"
      ></el-slider>
      <!-- <input
        type="range"
        v-model="fontSize"
        min="1"
        max="120"
        step="1"
        class="value-content"
      /> -->
      <label class="title">Font Opacity: {{ textInfo.opacity }}</label>
      <el-slider
        v-model="textInfo.opacity"
        :min="0"
        :max="100"
        :step="1"
        class="value-content"
      ></el-slider>
      <!-- <input
        type="range"
        v-model="opacity"
        min="0"
        max="100"
        step="1"
        class="value-content"
      /> -->
      <label for="text-lines-bg-color" class="title"
        >Text color: {{ textInfo.textBgColor }}</label
      >
      <el-color-picker
        v-model="textInfo.textBgColor"
        id="text-lines-bg-color"
        class="btn-object-action"
        :predefine="podPredefineColors"
      >
      </el-color-picker>
    </div>
    <div class="font-actions">
      <el-button
        :plain="!textInfo.isBold"
        @click="toggleBold"
        :type="textInfo.isBold ? 'primary' : null"
        :style="{ fontWeight: textInfo.isBold ? 'bold' : 'normal' }"
      >
        Bold
      </el-button>
      <el-button
        class="action-btn"
        :plain="!textInfo.isItalic"
        @click="toggleItalic"
        :type="textInfo.isItalic ? 'primary' : null"
        :style="{ fontStyle: textInfo.isItalic ? 'italic' : 'normal' }"
      >
        Italic
      </el-button>
      <el-button
        class="action-btn"
        :type="textInfo.isUnderline ? 'primary' : null"
        :plain="!textInfo.isUnderline"
        @click="toggleUnderline"
        :style="{ textDecoration: textInfo.isUnderline ? 'underline' : 'none' }"
      >
        Underline
      </el-button>
      <el-button
        class="action-btn"
        :plain="!textInfo.isLineThrough"
        :type="textInfo.isLineThrough ? 'primary' : null"
        @click="toggleLineThrough"
        :style="{
          textDecoration: textInfo.isLineThrough ? 'line-through' : 'none'
        }"
      >
        Linethrough
      </el-button>
      <el-button
        class="action-btn"
        :type="textInfo.isOverline ? 'primary' : null"
        :plain="!textInfo.isOverline"
        @click="toggleOverline"
        :style="{ textDecoration: textInfo.isOverline ? 'overline' : 'none' }"
      >
        Overline
      </el-button>
    </div>

    <br />

    <div class="apply-btn-container">
      <template v-if="currentEditorStatus === 'addText'">
        <el-button round type="primary" class="add-btn" @click="addTextLayer"
          >Add Text
        </el-button>
      </template>
      <template v-if="currentEditorStatus === 'editText'">
        <el-button
          round
          type="primary"
          class="apply-btn"
          @click="applyFontStyle"
          >Apply
        </el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import useSelect from '@/components/DIYSKU/hooks/select'
import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'
import { podPredefineColors } from '@/utils/common.ts'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'
import { text } from 'stream/consumers'
const store = useDesignerStore()
const { canvasEditor, fabric, mixinState } = useSelect()

const props = defineProps({
  visible: Boolean
})

const emits = defineEmits(['update:visible', 'apply'])

const currentEditorStatus = ref('addText')

const localVisible = ref(props.visible)
const textInfo = ref({
  fontFamily: 'Arial',
  textAlign: 'left',
  fontSize: 20,
  textContent: 'usadrop',
  textBgColor: '#000000',
  opacity: 100,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isLineThrough: false,
  isOverline: false
})
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
const textOptions = [
  { label: 'left', value: 'left' },
  { label: 'center', value: 'center' },
  { label: 'right', value: 'right' },
  { label: 'justify', value: 'justify' }
]
const updateInfo = () => {
  if (!canvasEditor || typeof canvasEditor.getActiveObject !== 'function') {
    return
  }
  const activeObject = canvasEditor.getActiveObject()
  if (activeObject && activeObject instanceof fabric.Text) {
    textInfo.value.textContent = activeObject.text || ''
    textInfo.value.fontFamily = activeObject.fontFamily || 'Arial'
    textInfo.value.textAlign = activeObject.textAlign || 'left'
    textInfo.value.fontSize = activeObject.fontSize || 40
    textInfo.value.textBgColor = activeObject.fill || ''
    textInfo.value.isBold = activeObject.fontWeight === 'bold'
    textInfo.value.isItalic = activeObject.fontStyle === 'italic'
    textInfo.value.isUnderline = !!activeObject.underline
    textInfo.value.isLineThrough = !!activeObject.linethrough
    textInfo.value.isOverline = !!activeObject.overline
    textInfo.value.opacity = activeObject.opacity * 100
    currentEditorStatus.value = 'editText'
  } else {
    currentEditorStatus.value = 'addText'
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

watch(
  () => textInfo,
  (newVal) => {
    console.log('textInfo', newVal, textInfo.value)
    if (currentEditorStatus.value === 'editText') {
      applyFontStyle()
    }
  },
  { deep: true }
)

watch(localVisible, (newVal) => {
  emits('update:visible', newVal)
})
const addTextLayer = () => {
  canvasEditor.addText({
    type: 'itext',
    style: {
      text: textInfo.value.textContent,
      fontFamily: textInfo.value.fontFamily,
      textAlign: textInfo.value.textAlign,
      fontSize: textInfo.value.fontSize,
      fill: textInfo.value.textBgColor,
      fontWeight: textInfo.value.isBold ? 'bold' : 'normal',
      fontStyle: textInfo.value.isItalic ? 'italic' : 'normal',
      underline: textInfo.value.isUnderline,
      linethrough: textInfo.value.isLineThrough,
      overline: textInfo.value.isOverline,
      opacity: textInfo.value.opacity / 100
    }
  })

  setTimeout(() => {
    canvasEditor.activateFrontTextLayer()
    store.updateCurrentStageScreenshot({
      canvasEditor: canvasEditor
    })
  }, 250)
}

const applyFontStyle = () => {
  if (!canvasEditor || typeof canvasEditor.getActiveObject !== 'function') {
    return
  }
  const activeObject = canvasEditor.getActiveObject()
  if (activeObject && activeObject instanceof fabric.Text) {
    const info = {
      text: textInfo.value.textContent,
      fontFamily: textInfo.value.fontFamily,
      textAlign: textInfo.value.textAlign,
      fontSize: textInfo.value.fontSize,
      fill: textInfo.value.textBgColor,
      fontWeight: textInfo.value.isBold ? 'bold' : 'normal',
      fontStyle: textInfo.value.isItalic ? 'italic' : 'normal',
      underline: textInfo.value.isUnderline,
      linethrough: textInfo.value.isLineThrough,
      overline: textInfo.value.isOverline,
      opacity: textInfo.value.opacity / 100
    }
    activeObject.set(info)
    canvasEditor.renderAll()
    localVisible.value = false
    designEventBus.emit(DESIGN_EVENTS.USER_OBJECT_Text_UPDATE, {
      info: info
    })
  } else {
    ElMessage.error('Please select a text object first')
  }
}

const toggleBold = () => {
  textInfo.value.isBold = !textInfo.value.isBold
}

const toggleItalic = () => {
  textInfo.value.isItalic = !textInfo.value.isItalic
}

const toggleUnderline = () => {
  textInfo.value.isUnderline = !textInfo.value.isUnderline
}

const toggleLineThrough = () => {
  textInfo.value.isLineThrough = !textInfo.value.isLineThrough
}

const toggleOverline = () => {
  textInfo.value.isOverline = !textInfo.value.isOverline
}

watch(
  () => mixinState.mSelectId, //监听text图层的id变化（而不是内容），更新左侧数据
  (val) => {
    updateInfo()
    if (val === undefined) {
      return
    }
    if (typeof val === 'string' && val.length <= 1) {
      return
    }

    if (val && val.includes('text')) {
      updateInfo()
    }
  }
)

onMounted(() => {
  updateInfo()
})
</script>

<style scoped>
.text-controls {
  background: #ffffff;
  border: 1px solid #ffffff;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 6px;
  padding-right: 16px;
  margin-bottom: 5px;
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
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5px;
  font-size: 18px;
  color: #666666;
}

.text-content {
  margin-left: 5px;
  margin-right: 5px;
  width: 100%;
}

.select-content {
  margin-left: 5px;
  margin-right: 20px;
  height: 30px;
  width: 100%;
  font-size: 20px;
}

.value-content {
  margin-left: 5px;
  margin-right: 20px;
  /* height: 44px; */
  width: 80%;
}

.apply-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
.add-btn {
  width: 80%;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  background: white;
  color: rgb(67, 67, 67);
  border-color: rgb(67, 67, 67);
}

.apply-btn {
  width: 80%;
  height: 40px;
  font-size: 20px;
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
