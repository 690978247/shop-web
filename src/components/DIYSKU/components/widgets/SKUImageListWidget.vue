<template>
  <div class="sku-image-list">
    <div
      v-for="(obj, index) in props.initialImages"
      :key="index"
      class="sku-image-item"
    >
      <div @click="addImage(obj)" class="sku-image-wrapper">
        <el-image
          :src="obj.url"
          fit="contain"
          alt="product image"
          class="sku-image"
        />
        <div class="sku-image-index">{{ index + 1 }}</div>
      </div>

      <div
        @click="deleteImage(index)"
        class="delete-button"
        v-if="!props.disableDelete"
      >
        <img
          src="https://static.hzpdex.com/web/1719303453111_ic_image_close.png"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useSelect from '@/components/DIYSKU/hooks/select'

const { canvasEditor, store } = useSelect()

const emits = defineEmits(['delete-image'])

interface ImageItem {
  url: string
}

const props = defineProps<{
  initialImages: ImageItem[]
  disableDelete: boolean
}>()

const deleteImage = (index: number) => {
  emits('delete-image', index)
}

const addImage = (res: any) => {
  canvasEditor.addImage({
    url: res.url,
    uid: res.uid,
    width: res.width,
    height: res.height
  })
  setTimeout(async () => {
    canvasEditor.activateFrontImageLayer()
    store.updateCurrentStageScreenshot({
      canvasEditor: canvasEditor
    })
  }, 250)
}
</script>

<style scoped>
.sku-image-list {
  display: flex;
  flex-wrap: wrap;
  margin-left: 16px;

  /*
  margin-right: 8px; */
}

.sku-image-item {
  width: calc(50% - 16px);
  position: relative;
  margin-right: 8px;
  margin-top: 8px;

  /*margin-bottom: 8px; */
}

.delete-button {
  position: absolute;
  top: 0;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgb(130, 130, 130);
  border-radius: 10px;
}
.sku-image {
  display: block;
  width: 100%;
  height: 150px;
  border-radius: 8px;
}
.sku-image-wrapper {
  position: relative;
}
.sku-image-index {
  position: absolute; /* 子元素绝对定位 */
  top: 5px;
  left: 10px;
  font-size: 12px;
  color: #000000;
  min-width: 20px;
  min-height: 20px;
  text-align: center;
  line-height: 16px;
  border-radius: 50%;

  /* background: rgb(130, 130, 130); */
  z-index: 1; /* 控制层叠顺序 */
}
</style>
