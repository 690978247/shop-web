<template>
  <div class="operateUndo">
    <el-tooltip content="Undo" placement="bottom">
      <img
        class="icon"
        :src="undoBtnStatus === 0 ? undo.disUrl : undo.ableUrl"
        alt=""
        @click="undoFn"
      />
    </el-tooltip>
    <el-tooltip content="Redo" placement="bottom">
      <img
        class="icon"
        :src="redoBtnStatus === 0 ? redo.disUrl : redo.ableUrl"
        alt=""
        @click="redoFn"
      />
    </el-tooltip>

    <el-tooltip content="Reset" placement="bottom">
      <el-button class="clear" @click="clearFn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M9 1h6v8.5h6V23H3V9.5h6zm2 2v8.5H5V14h14v-2.5h-6V3zm8 13H5v5h9v-3h2v3h3z"
          />
        </svg>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import useSelect from '@/components/DIYSKU/hooks/select'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

const { canvasEditor } = useSelect()

const undoBtnStatus = ref(1)
const redoBtnStatus = ref(1)

const undo = {
  disUrl: 'https://static.hzpdex.com/web/1719388606181_fram2.png',
  ableUrl: 'https://static.hzpdex.com/web/1719392399607_ic_pod_undo.png'
}
const redo = {
  disUrl: 'https://static.hzpdex.com/web/1719388605993_fram.png',
  ableUrl: 'https://static.hzpdex.com/web/1719392564903_ic_pod_redo.png'
}

const undoFn = () => {
  if (canvasEditor.getObjects().length < 4) {
    ElMessage.error('Cannot undo')
    undoBtnStatus.value = 0 // 根据实际逻辑更新状态
    return
  }
  canvasEditor.undo()
  // 更新按钮状态
  undoBtnStatus.value = 1 // 根据实际逻辑更新状态
}

const redoFn = () => {
  canvasEditor.redo()
  undoBtnStatus.value = 1 // 根据实际逻辑更新状态
  redoBtnStatus.value = 1 // 根据实际逻辑更新状态
}
const clearFn = () => {
  canvasEditor.clearAllLayers()
  designEventBus.emit(DESIGN_EVENTS.USER_REMOVE_OBJECT, {
    type: 'clearAll'
  })
}
</script>

<style scoped lang="scss">
.operateUndo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .icon {
    cursor: pointer;
    height: 36px;
    width: 36px;
    border-radius: 50%;
  }
  .clear {
    display: flex;
    align-items: center;
    justify-content: center;
    // background: red;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #333333;
    color: #333333;
  }
}
</style>
