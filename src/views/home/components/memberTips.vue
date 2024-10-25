<template>
  <div class="member-tips">
    <el-dialog
      :model-value="visible"
      class="tips-dialog"
      top="35vh"
      @close="handleClose"
    >
      <div class="dialog-footer">
        <el-button color="#DCDFE6" class="footer-btn" @click="handleClose"
          >Cancel
        </el-button>
        <el-button color="#15104B" class="footer-btn" @click="jumpPage"
          >Upgrade
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:visible', 'confirm'])

const handleClose = () => {
  emits('update:visible', false)
}

const jumpPage = () => {
  emits('confirm')
}
</script>
<style lang="scss" scoped>
.member-tips {
  :deep(.el-dialog.tips-dialog) {
    width: 496px;
    height: 316px;
    border-radius: 38px;
    background: url('/static/bg_upgrade_dialog.svg') no-repeat;
    background-size: 496px 316px;

    .el-dialog__header {
      display: none;
    }

    .tips-wrap {
      padding: 48px 40px;
      font-size: 20px;
      text-align: center;
    }

    .dialog-footer {
      position: absolute;
      bottom: 70px;
      left: 76px;
      right: 76px;
      display: flex;
      justify-content: center;
    }

    .footer-btn {
      width: 200px;
      height: 42px;
      border-radius: 30px;
      font-size: 16px;
    }
  }
}
</style>
