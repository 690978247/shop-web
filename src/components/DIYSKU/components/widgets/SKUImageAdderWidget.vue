<template>
  <div class="container">
    <div class="tab-switch">
      <!--  <el-button
        :class="activeTab === 'upload' ? 'action-selected' : 'action'"
        @click="setActiveTab('upload')"
      >
        + Upload
      </el-button> -->
      <el-button class="action" @click="activeImageDialogFn">
        Stickers</el-button
      >
      <!-- <el-button
        :class="activeTab === 'library' ? 'action-selected' : 'action'"
        @click="setActiveTab('library')"
        @dblclick="handleDoubleClick"
      >
        Stickers
      </el-button> -->
    </div>
    <el-divider class="divider-line"></el-divider>
    <div class="real-mode-switch">
      <div class="real-mode-switch-label">Layer rendering effect :</div>
      <el-switch
        v-model="imageResHasMore"
        @change="onEffectValueChange"
      ></el-switch>
      <el-tooltip content="Show tips" placement="bottom">
        <el-icon
          color="#f4526a"
          @click="activeDesciptionDialogFn"
          style="margin-left: 15px; cursor: pointer"
        >
          <QuestionFilled />
        </el-icon>
      </el-tooltip>
      <!-- <el-image
        class="real-mode-image"
        :preview-src-list="[
          'https://static.hzpdex.com/web/1722845439169_效果图001.png'
        ]"
        :preview-teleported="true"
        src="https://static.hzpdex.com/web/1722845439169_效果图001.png"
      ></el-image> -->
    </div>
    <el-divider class="divider-line"></el-divider>
    <div v-show="activeTab === 'upload'" class="upload-area">
      <div class="upload-section">
        <el-upload
          multiple
          class="upload-button"
          :http-request="uploadImg"
          :show-file-list="false"
          accept="image/*"
        >
          <div class="el-upload__inner">
            <img
              class="log-out-icon"
              src="https://static.hzpdex.com/web/1719298762363_log-out.png"
            />
            <div class="el-upload__text">Drop file here or click to upload</div>
            <div class="el-upload__text_desc">
              jpg/png files with a size less than 500kb
            </div>
          </div>
        </el-upload>
      </div>

      <div>
        <SKUImageListWidget
          :disableDelete="false"
          :initialImages="uploadResList"
          @delete-image="handleDeleteImage"
        ></SKUImageListWidget>
      </div>
    </div>
    <SKUImagesDialog
      v-model:showDialogVisible="activeImageDialog"
    ></SKUImagesDialog>
    <SKUDescriptionDialog
      v-model:showDesciptionDialog="activeDesciptionDialog"
      :checkedSkip="checkedSkip"
      @handle-understand="handleUnderstand"
      @update:checkedSkip="checkedSkip = $event"
    ></SKUDescriptionDialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SKUImageListWidget from './SKUImageListWidget.vue'
import SKUImagesDialog from '@/components/DIYSKU/components/dialogs/SKUImagesDialog.vue'
import SKUDescriptionDialog from '@/components/DIYSKU/components/dialogs/SKUDesciptionDialog.vue'
// import { OSSUploadType, useJSCore } from 'sm-js-core'
import useSelect from '@/components/DIYSKU/hooks/select'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

const { store } = useSelect()
const activeTab = ref('upload')
const imageResList = ref([])
const uploadResList = ref([])
const loading = ref(false)
const imageResHasMore = ref(store.isRealModel)
const activeImageDialog = ref(false)
const activeDesciptionDialog = ref(false)
const checkedSkip = ref(false)
const handleDoubleClick = () => {
  store.queryMaterialImageFirstList()
}
const activeImageDialogFn = () => {
  activeImageDialog.value = true
}
const activeDesciptionDialogFn = () => {
  const userInfo = localStorage.getItem('userInfo') ?? ''
  try {
    const parsedUserInfo = JSON.parse(userInfo)
    const skipTips = localStorage.getItem(`skipTips_${parsedUserInfo.email}`)

    checkedSkip.value = skipTips === 'true'
    activeDesciptionDialog.value = true
  } catch (error) {
    console.error('Error parsing userInfo from localStorage', error)
  }
}

const handleUnderstand = (email, isChecked) => {
  localStorage.setItem(`skipTips_${email}`, isChecked ? 'true' : 'false')
  checkedSkip.value = isChecked
  activeDesciptionDialog.value = false
}

const loadMore = async () => {
  loading.value = true
  await store.queryMaterialImageNextList()
  loading.value = false
}
const didImageResUpdate = () => {
  updateImageResList()
}

const onEffectValueChange = (value: boolean) => {
  store.isRealModel = value
}
const updateImageResList = () => {
  if (store.imageResourceRecords.length <= 0) {
    return
  }
  if (
    JSON.stringify(
      store.imageResourceRecords.map((item: any) => item.imageUrl)
    ) !== JSON.stringify(imageResList.value.map((item: any) => item.url))
  ) {
    imageResList.value = store.imageResourceRecords.map((item: any) => ({
      ...item,
      url: item.imageUrl,
      width: 400,
      height: 400,
      name: item.fileName
    }))
    console.log('🟨[SKUImageAdderWidget]updateImageResList update')
  } else {
    console.log('🟨[SKUImageAdderWidget]updateImageResList no update')
  }
}

/**
 * @description 判断是否不规则设计，是的话默认切换成true
 */
const switchRealModel = () => {
  const currentStageType = store.getCurrentStageType()
  // 不规则设计切换成true
}

onMounted(() => {
  const savedUploadResList = JSON.parse(
    localStorage.getItem('uploadResList') || '[]'
  )
  uploadResList.value = savedUploadResList
  updateImageResList()
  designEventBus.on(DESIGN_EVENTS.STAGE_DID_SWITCH, switchRealModel)
  designEventBus.on(DESIGN_EVENTS.FABRIC_LOADED, switchRealModel)

  const userInfo = localStorage.getItem('userInfo') ?? ''
  try {
    const parsedUserInfo = JSON.parse(userInfo)
    const skipTips = localStorage.getItem(`skipTips_${parsedUserInfo.email}`)

    checkedSkip.value = skipTips === 'true'
    if (!checkedSkip.value) {
      activeDesciptionDialog.value = true
    }
  } catch (error) {
    console.error('Error parsing userInfo from localStorage', error)
  }
})

onUnmounted(() => {
  designEventBus.off(DESIGN_EVENTS.STAGE_DID_SWITCH, switchRealModel)
  designEventBus.off(DESIGN_EVENTS.FABRIC_LOADED, switchRealModel)
})

const setActiveTab = (tab: string) => {
  activeTab.value = tab
}

const itemObject = (url: string, width: number, height: number) => ({
  url,
  width,
  height
})

function getImageSize(
  imageId: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = reject
    img.src = imageId
  })
}

const uploadImg = async (options: any) => {
  try {
    // const { url } = await useJSCore().oss.upload(options.file, {
    //   uploadType: /* OSSUploadType.POD_MATERIAL */ ''
    // })
    const { url }  = { url: '' }
    const { width, height } = await getImageSize(url)
    uploadResList.value.push(itemObject(url, width, height))
    ElMessage.success('Upload successful')
    localStorage.setItem('uploadResList', JSON.stringify(uploadResList.value))
  } catch (error) {
    ElMessage.error('Upload failed.')
  }
}

const handleDeleteImage = (index: number) => {
  uploadResList.value.splice(index, 1)
  localStorage.setItem('uploadResList', JSON.stringify(uploadResList.value))
}

const getCachedImage = (url: string) => {
  if (!localStorage.getItem(url)) localStorage.setItem(url, url)
  return url
}

watch(() => store.imageResourceRecords, didImageResUpdate, { deep: true })
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 20px;
}

.tab-switch {
  width: calc(100% - 32px);
  padding: 0 16px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-switch .el-button {
  flex: 1;
  text-align: center;
  height: 44px;
  font-size: 16px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0px 16px;
  padding: 0px;
  border: 1px dashed #999999;
  border-radius: 5px;
}

.upload-section:hover {
  border-color: var(--el-color-primary);
}

.upload-area {
  text-align: center;
  width: 100%;
}

.upload-button {
  height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.el-upload__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.el-upload__text {
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
}

.el-upload__text_desc {
  margin-top: 4px;
  color: #999999;
  font-size: 12px;
}

.images-container {
  width: 100%;
  height: 100%;
}

.thumbnail {
  position: relative;
  background: #f0f0f0;
  border: 1px solid #ccc;
  width: 100%;
  height: 155px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.action-selected {
  width: 150px;
  height: 40px;
  border-radius: 32px;
  padding: 10px 16px;
  background: var(--el-color-primary);
  color: white;
}

.action {
  width: 150px;
  height: 40px;
  border-radius: 32px;
  border-width: 1px;
  border-color: #666;
  padding: 10px 16px;
}

.log-out-icon {
  width: 32px;
  height: 32px;
}

.load-more-button {
  width: 90%;
  height: 44px;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 20px;
  margin-bottom: 50px;
}

.no-more-data {
  width: 100%;
  color: #999999;
  font-size: 20px;
  text-align: center;
  font-weight: 400;
  margin-top: 40px;
  margin-bottom: 50px;
}
.real-mode-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}
.real-mode-switch-label {
  font-size: 14px;
  margin-right: 20px;
  color: #000;
  font-weight: 500;
}
.real-mode-image {
  margin-left: 20px;
  width: 40px;
  height: 40px;
}
.divider-line {
  margin-top: 0px;
  margin-bottom: 0px;
  padding: 0px;
}
</style>
