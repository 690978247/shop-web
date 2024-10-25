<template>
  <div class="container">
    <div class="undo-level">
      <SKUHistoryNavigatorWidget />
    </div>
    <el-divider direction="vertical"></el-divider>
    <div><SKUAlignEditNavigatorWidget /></div>
    <div><SKUEditNavigatorWidget /></div>
    <el-divider direction="vertical"></el-divider>
    <div><SKUImageEditNavigatorWidget /></div>
  </div>
</template>

<script setup lang="ts">
import SKUHistoryNavigatorWidget from '@/components/DIYSKU/components/widgets/SKUHistoryNavigatorWidget.vue'
import SKUEditNavigatorWidget from '@/components/DIYSKU/components/widgets/SKUEditNavigatorWidget.vue'
import SKUImageEditNavigatorWidget from '@/components/DIYSKU/components/widgets/SKUImageEditNavigatorWidget.vue'
import { ref, watch } from 'vue'
import useSelect from '@/components/DIYSKU/hooks/select'
import { SelectMode } from '@/components/DIYSKU/service/FabricLayerEventType'

const { mixinState } = useSelect()

const imageToolVisible = ref(false)

const resetTooltip = () => {
  imageToolVisible.value = false
}

watch(
  () => mixinState.mSelectOneType,
  (val) => {
    resetTooltip()
    if (!val || (typeof val === 'string' && val.length <= 1)) {
      return
    }

    if (val.includes('text')) {
      imageToolVisible.value = true
    } else if (val.includes('image')) {
      imageToolVisible.value = true
    }
  }
)

watch(
  () => mixinState.mSelectMode,
  (val) => {
    if (val === SelectMode.EMPTY) {
      resetTooltip()
    }
  }
)
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: start;
  flex-direction: row;
  border-left: 1px solid #eff1f3;
  background: white;
}

.undo-level {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
