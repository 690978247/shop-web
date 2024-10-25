<template>
  <div class="dialog-no2rem">
    <el-dialog
      :model-value="showDialog"
      :showClose="true"
      class="myDialog"
      width="342"
      top="20vh"
      destroy-on-close
      @close="handleClose"
    >
      <div class="wrap">
        <GraphicValidation
          :phone-code="props.areacode"
          :phone-num="props.mobile"
          @on-success="handleSuccess"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { ElDialog } from 'element-plus'

// 定义 props 接收来自父组件的值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  areacode: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['update:visible'])
const showDialog = ref(props.visible)
const handleClose = () => {
  emit('update:visible', false)
}

// 处理接收到的消息
function handleSuccess() {
  setTimeout(() => {
    showDialog.value = false
  }, 1000)
}

watch(
  () => props.visible,
  (value) => {
    showDialog.value = value
  }
)
</script>

<style lang="scss" scoped>
.dialog-no2rem {
  :deep(.el-dialog) {
    box-shadow: none !important;
  }

  :deep(.myDialog) {
    border-radius: 0 !important;
    background: transparent !important;
    width: 340px;
    height: 300px;

    .el-dialog__header {
      padding-top: 0;
      border-bottom: none;
      padding-bottom: 0;
    }

    .el-dialog__body {
      padding: 0;
      border-radius: 0 !important;
    }
  }

  .wrap {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
