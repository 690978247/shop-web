<template>
  <div class="pod-multi-scene-widget">
    <!-- 如果 sceneList 有内容，显示下拉列表 -->
    <el-select
      v-if="sceneList.length > 1"
      v-model="selectedScene"
      placeholder="请选择场景"
      class="scene-select"
      @change="handleSceneChange"
    >
      <!-- 绑定场景列表数据到下拉列表项 -->
      <el-option
        v-for="scene in sceneList"
        :key="scene"
        :label="scene"
        :value="scene"
      >
        <!-- 左侧显示场景名称，右侧显示图标 -->
        <div class="scene-option">
          <span class="scene-name">{{ scene }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'
import { useDesignerStore } from '../../stores/designerStore'
import useSelect from '../../hooks/select'
import { convertStage } from '@/components/DIYSKU/service/utils'

const store = useDesignerStore()
const { canvasEditor } = useSelect()
const sceneList = ref([])
const selectedScene = ref<string | null>(null)
const lastSelectedScene = ref<string | null>(null)

const updateSceneData = () => {
  if (store.sceneList.length === 0) {
    return
  }
  // 加载设计信息
  sceneList.value = store.sceneList.map((scene) => {
    return `${scene.name.slice(0, 10)}`
  })

  if (selectedScene.value === null) {
    selectedScene.value = sceneList.value[0] || null
    lastSelectedScene.value = selectedScene.value
  }
}
const initialization = () => {
  updateSceneData()
}
// 监听和清理事件
const onDesignInfoLoaded = (data: any) => {
  updateSceneData()
}

const handleSceneChange = (value: string) => {
  designEventBus.emit(DESIGN_EVENTS.SCENE_WILL_SWITCH, {})

  console.log('[MultiScene]准备保存数据')

  const currentScene =
    store.sceneList[sceneList.value.indexOf(lastSelectedScene.value)]

  console.log('[MultiScene]更新前', currentScene)
  store.updateCurrentStageScreenshot({
    canvasEditor: canvasEditor,
    complete: () => {
      //当前stage
      const currentStageName = store.getCurrentStageName()
      //当前设计
      const currentStage = canvasEditor.canvasToJSON(false)
      //当前scene所有设计信息
      const stages = JSON.parse(JSON.stringify(store.productInfo.stages))
      //格式转换
      const stage = convertStage(currentStage, currentStageName, false)
      ////保留原始截图信息
      const screenshot = stages[currentStageName].screenshot
      stage.screenshot = screenshot

      stages[currentStageName] = {
        ...stages[currentStageName],
        ...stage
      }

      currentScene.designInfo = {
        stages: stages
      }

      console.log('[MultiScene]更新后', currentScene)
      const scene = store.sceneList[sceneList.value.indexOf(value)]

      store.updateSceneList(scene)

      setTimeout(() => {
        designEventBus.emit(DESIGN_EVENTS.SCENE_DID_SWITCH, {})
        lastSelectedScene.value = selectedScene.value
        store.currentSceneIndex = store.sceneList.indexOf(scene)
      }, 0)
    }
  })
}
const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.DATA_LOADED, onDesignInfoLoaded)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.DATA_LOADED, onDesignInfoLoaded)
}

onMounted(() => {
  initialization()
  setupListeners()
})
onUnmounted(() => {
  clearListeners()
})
</script>

<style scoped lang="scss">
.pod-multi-scene-widget {
  margin-left: 30px;
  width: 270px;
  height: 40px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scene-select {
  width: 100%;
}

.scene-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scene-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
