<template>
  <div class="print-dialog">
    <el-dialog
      title="Function Development Description："
      v-model="_showDesciptionDialog"
      class="modalDialog"
      width="45%"
      :before-close="handleClose">
      <div class="enable_words">
        “Enable feature” refers to a common image blending mode. When this feature is activated, the colors of multiple overlaid images blend together, creating a more natural transition effect. Each layer's color information interacts, resulting in new color effects. Conversely, if you “disable this feature”, the top image will completely cover the ones below, preventing the lower images from affecting the final display.
      </div>
      <div class="checked_box">
        <el-checkbox v-model="checkedSkip" label="Skip these tips for the future" size="large" />
      </div>
      <div class="btn_btn_box">
        <el-button type="primary" @click="handleUnderstand">I understand</el-button>
        <div @click="openChildDialog" class="view_words">
          <p>View the comparison images of different rendering effects.</p>
        </div>
      </div>
    </el-dialog>
    <SKUViewDialog
      v-model:showViewDialog="showViewDialog"
      @close-parent-dialog="closeParentDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SKUViewDialog from './SKUViewDialog.vue'

const props = defineProps({
  showDesciptionDialog: {
    type: Boolean,
    required: true
  },
  checkedSkip: {
    type: Boolean,
    required: true
  }
})
const showViewDialog = ref(false)

const emit = defineEmits(['update:showDesciptionDialog', 'handle-understand'])

const _showDesciptionDialog = computed({
  get: () => props.showDesciptionDialog,
  set: (val) => {
    emit('update:showDesciptionDialog', val)
  }
})

const checkedSkip = computed({
  get: () => props.checkedSkip,
  set: (val) => {
    emit('update:checkedSkip', val)
  }
})

const handleClose = () => {
  emit('update:showDesciptionDialog', false)
}

const openChildDialog = () => {
  showViewDialog.value = true
  emit('update:showDesciptionDialog', false)
}

const closeParentDialog = () => {
  emit('update:showDesciptionDialog', false)
}

const handleUnderstand = () => {
  const userInfo = localStorage.getItem('userInfo') ?? ''
  try {
    const parsedUserInfo = JSON.parse(userInfo)
    emit('handle-understand', parsedUserInfo.email, checkedSkip.value)
  } catch (error) {
    console.error('Error parsing userInfo from localStorage', error)
  }
}
</script>

<style scoped lang="scss">
.enable_words {
  font-size: 20px;
  color: #000;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: keep-all;
  line-height: 50px;
}
.checked_box {
  margin-top: 10px;
}
.btn_btn_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.view_words {
  color: #35aef2;
  font-size: 16px;
  cursor: pointer;
}
:deep(.el-dialog__title) {
  color: #000;
  font-size: 18px;
  font-weight: 500;
}
</style>
