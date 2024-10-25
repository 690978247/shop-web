<template>
  <div class="pod-navigation-contariner">
    <div class="left-action">
      <SKUGoBackWidget />
      <SKUMultiSceneWidget />
    </div>

    <SKULogoWidget />
    <div style="margin-right: 160px">
      <el-dropdown @command="saveWith">
        <el-button type="primary" class="action-btn">Print</el-button>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="saveImg"
              >Save Image as PNG</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        class="action-btn"
        type="primary"
        @click="saveJSON"
        :loading="saveLoading"
      >
        Save
      </el-button>
    </div>
  </div>
  <SKUSaveLoadingWidget v-if="saveLoading" :loading-text="saveLoadingText" />
</template>

<script setup lang="ts">
import { ElLoading, ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'
import useSelect from '@/components/DIYSKU/hooks/select'
import { convertStage, exportImgsZip } from '@/components/DIYSKU/service/utils'
import { generateImageWithStageData } from '@/components/DIYSKU/service/SkuGenerateImageHelper'
import SKUSaveLoadingWidget from '@/components/DIYSKU/components/widgets/SKUSaveLoadingWidget.vue'
import SKUMultiSceneWidget from '@/components/DIYSKU/components/widgets/SKUMultiSceneWidget.vue'
import SKUGoBackWidget from '@/components/DIYSKU/components/widgets/SKUGoBackWidget.vue'
import SKULogoWidget from '@/components/DIYSKU/components/widgets/SKULogoWidget.vue'
import { saveDesign } from '../service/SaveDesignHelper'
import { useUser } from '@/store/modules/user'

const store = useDesignerStore()
const { canvasEditor } = useSelect()
const saveLoading = ref(false)
const saveLoadingText = ref()

type CallbackMap = {
  [key: string]: () => void
}

const cbMap: CallbackMap = {
  clipboard() {
    canvasEditor.clipboard()
  },
  saveJson() {
    saveJSON()
  },
  saveSvg() {
    canvasEditor.saveSvg()
  },
  async saveImg() {
    const loadingInstance = ElLoading.service({})

    try {
      const currentStageName = store.getCurrentStageName()
      const currentStage = canvasEditor.canvasToJSON()
      const stages = JSON.parse(JSON.stringify(store.productInfo.stages))
      stages[currentStageName] = convertStage(
        currentStage,
        currentStageName,
        false
      )

      const imgs: any[] = []
      for (const stageKey in stages) {
        const stage = stages[stageKey]
        stage.screenshot = await generateImageWithStageData(stage, true)
        imgs.push(stage.screenshot)
      }

      setTimeout(() => {
        exportImgsZip(imgs, '效果图')
        ElMessage.success('Save Images success')
        loadingInstance.close()
      }, 250)
    } catch (error) {
      loadingInstance.close()
    }
  },
  clipboardBase64() {
    canvasEditor.clipboardBase64()
  }
}

const goToUDPODList = async () => {
  console.log('准备保存数据:', store.sceneList)
  saveLoading.value = true
  saveLoadingText.value = 'Saving Design...'
  try {
    await store.saveProductInfo(store.sceneList)
    saveLoading.value = false
    const tk = useUser()?.state?.token
    if (tk) {
      window.open(
        `${import.meta.env.VITE_UD_BASE_URL}/podList?tk=${tk}&from=pod`
      )
      window.close()
      return
    }
    window.open(import.meta.env.VITE_UD_BASE_URL)
    window.close()
  } catch (error) {
    saveLoading.value = false
  }
}

const saveJSON = async () => {
  saveLoading.value = true

  console.log('保存前:', store.sceneList)

  saveDesign(
    {
      store: store,
      canvasEditor: canvasEditor
    },
    (text: string) => {
      saveLoadingText.value = text
    },
    (success: boolean) => {
      saveLoading.value = false
      if (success) {
        console.log('保存后:', store.sceneList)
        goToUDPODList()
      }
    }
  )
}

const saveWith = debounce((command: string) => {
  const callback = cbMap[command]
  if (callback) {
    callback()
  } else {
    ElMessage.error('Invalid command')
  }
}, 300)
</script>

<style scoped>
.pod-navigation-contariner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.left-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  margin-right: 10px;
}
</style>
