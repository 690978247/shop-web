<template>
  <div class="container">
    <div class="logo">
      <img src="@/assets/images/menuLogo.png" alt="avatar" class="menuLogo" />
      <SKUMultiSceneWidget />
    </div>

    <div>
      <el-button
        type="primary"
        class="action-btn"
        style="margin-right: 150px"
        @click="exportAll"
        >导出
      </el-button>
    </div>
    <GTranslate />
  </div>
</template>
<script setup lang="ts">
import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'
import { exportImgsZip } from '@/components/DIYSKU/service/utils'
import SKUMultiSceneWidget from '@/components/DIYSKU/components/widgets/SKUMultiSceneWidget.vue'
import GTranslate from '@/components/GTranslate/index.vue'

const store = useDesignerStore()

const getImgs = () => {
  console.log('store.productInfo.stages', store.productInfo.stages)
  const stages = store.productInfo.stages
  const imgs = []
  for (const key in stages) {
    imgs.push({ url: stages[key].screenshot, name: [key] + '' + '效果图' })
    stages[key].objects?.forEach(
      (i: { layerType: string; src: string; type: string }) => {
        if (i.layerType === 'custom' && i.type === 'image') {
          imgs.push({ url: i.src, name: [key] })
        }
      }
    )
  }
  return imgs
}

const exportAll = () => {
  const imgs = getImgs()
  exportImgsZip(imgs, '设计文件')
}
</script>
<style>
#gt_float_wrapper {
  position: fixed;
  top: 5px !important;
  right: 10px !important;
  z-index: 999999 !important;
}
</style>
<style scoped>
.container {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logo {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.logo img {
  width: 107px;
  height: 40px;
}

.action-btn {
  cursor: pointer;
  padding: 7px 10px 7px 10px;
  border-radius: 23px;
  height: 32px;
  font-weight: 400;
  min-width: 72px;
  font-size: 14px;
  line-height: 16.52;
  text-align: center;
}
</style>
