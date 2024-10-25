<template>
  <div class="print-dialog">
    <el-dialog
      title="View the comparison images of different rendering effects."
      v-model="_showViewDialog"
      class="modalDialog"
      width="45%"
      :before-close="handleChildClose"
    >
      <div class="img_img">
        <img
          src="https://static.hzpdex.com/web/1727156958070_image888.png"
          alt=""
        />
        <img
          src="https://static.hzpdex.com/web/1727156958369_image999.png"
          alt=""
        />
      </div>
      <div class="from_comparison">
        From the comparison images of the two effects above, it can be seen that
        the left side shows the effect after the feature is enabled, where the
        colors of the images blend together naturally. In contrast, the right
        side displays the effect with the feature disabled, where the top image
        completely covers the lower image, preventing any color blending effect.
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  showViewDialog: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:showViewDialog', 'close-parent-dialog'])
const _showViewDialog = computed({
  get: () => props.showViewDialog,
  set: (val) => {
    emit('update:showViewDialog', val)
  }
})
const handleChildClose = () => {
  emit('update:showViewDialog', false)
  emit('close-parent-dialog')
}
</script>

<style scoped lang="scss">
.img_img {
  margin-top: 20px;
  margin-left: 15px;
  img:nth-child(1) {
    width: 250px;
    height: 250px;
  }
  img:nth-child(2) {
    width: 250px;
    height: 250px;
    margin-left: 50px;
  }
}
.from_comparison {
  margin-top: 20px;
  font-size: 20px;
  color: #000;
  line-height: 40px;
}
</style>
