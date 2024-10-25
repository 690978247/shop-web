<template>
  <template v-if="pageLoading">
    <template v-if="showError">
      <div class="loading">
        <ElButton type="primary" size="large" @click="reload">
          Reload
        </ElButton>
      </div></template
    ><template v-else>
      <div class="loading" v-loading="pageLoading"></div>
    </template>
  </template>
  <template v-else>
    <el-container class="container">
      <el-header class="header" height="6%">
        <SKUNavigationSection />
      </el-header>
      <el-container class="content" v-loading="stageLoading">
        <el-container>
          <el-main class="main">
            <SKUMainSection>
              <!-- canvas写在这里, 方便使用依赖注入 -->
              <template v-slot:canvas>
                <div id="workspace" class="canvas-container">
                  <canvas
                    width="400"
                    height="400"
                    ref="canvas"
                    class="canvas"
                  ></canvas>
                </div>
              </template>
            </SKUMainSection>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="footer" height="0%">
        <SKUBottomSection />
      </el-footer>
    </el-container>
  </template>
</template>

<script lang="ts" setup>
import { onMounted, ref, provide } from 'vue'

import SKUBottomSection from '@/components/DIYSKU/components/SKUBottomSection.vue'

import SKUMainSection from './components/SKUMainSectionPreview.vue'

import SKUNavigationSection from './components/SKUNavigationSectionPreview.vue'

import Editor from '@/components/DIYSKU/service/Editor'

import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'

import MoveHotKeyPlugin from '@/components/DIYSKU/plugins/MoveHotKeyPlugin'
import DeleteHotKeyPlugin from '@/components/DIYSKU/plugins/DeleteHotKeyPlugin'
import ControlsPlugin from '@/components/DIYSKU/plugins/ControlsPlugin'
import ServersPlugin from '@/components/DIYSKU/plugins/ServersPlugin'
import LayerPlugin from '@/components/DIYSKU/plugins/LayerPlugin'
import HistoryPlugin from '@/components/DIYSKU/plugins/HistoryPlugin'
import LayerHandlerPlugin from '@/components/DIYSKU/plugins/LayerHandlerPlugin'
import OutputPlugin from '@/components/DIYSKU/plugins/OutputPlugin'
import LayerSelectPlugin from '@/components/DIYSKU/plugins/LayerSelectPlugin'
import WorkspacePlugin from '@/components/DIYSKU/plugins/WorkspacePlugin'
import FiltersPlugin from '@/components/DIYSKU/plugins/FiltersPlugin'
import AddImagePlugin from '@/components/DIYSKU/plugins/AddImagePlugin'
import AddTextPlugin from '@/components/DIYSKU/plugins/AddTextPlugin'
import CenterAlignPlugin from '@/components/DIYSKU/plugins/CenterAlignPlugin'

import useSelectListen from '@/components/DIYSKU/hooks/useSelectListen'
import { fabric } from 'fabric'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

const props = defineProps({
  dataInfo: {
    type: Object,
    required: true,
    default: () => ({
      did: '',
      pNo: '',
      spuNo: '',
      preview: false
    })
  }
})

const pageLoading = ref(true)
const stageLoading = ref(false)
const store = useDesignerStore()
const canvas = ref<HTMLCanvasElement | null>(null)
const fabricCanvas = ref<fabric.Canvas | null>(null)
const canvasEditor = new Editor()
const showError = ref(false)

const initialization = () => {}
const initCanvas = () => {
  console.log('🟪[DIYSKU]initCanvas')
  if (fabricCanvas.value) {
    console.log('🟪[DIYSKU]fabricCanvas is already initialized')
    return
  }
  fabricCanvas.value = new fabric.Canvas(canvas.value, {
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
  })

  const pluginOptions = {
    store: store
  }
  canvasEditor.init(fabricCanvas.value)
  canvasEditor.use(WorkspacePlugin)
  canvasEditor.use(ServersPlugin)
  canvasEditor.use(MoveHotKeyPlugin)
  canvasEditor.use(DeleteHotKeyPlugin, pluginOptions)
  canvasEditor.use(ControlsPlugin)
  canvasEditor.use(LayerPlugin)
  canvasEditor.use(HistoryPlugin)
  canvasEditor.use(LayerHandlerPlugin)
  canvasEditor.use(OutputPlugin)
  canvasEditor.use(LayerSelectPlugin)
  canvasEditor.use(FiltersPlugin)
  canvasEditor.use(AddImagePlugin)
  canvasEditor.use(AddTextPlugin)
  canvasEditor.use(CenterAlignPlugin)

  designEventBus.emit(DESIGN_EVENTS.FABRIC_LOADED, {})
}

const render = (from: string) => {
  console.log('🟪[DIYSKU]render from=', from)
  if (!store.productInfo) {
    console.error('❌productInfo is null')
    return
  }
  if (canvasEditor.getObjects().length !== 0) {
    canvasEditor.clearAllLayers()
  }

  const stage = store.getCurrentStage()

  if (!stage) {
    return
  }
  console.log('🟪[DIYSKU]render stage=', stage)
  canvasEditor.renderPreviewStageJSON({
    json: stage
  })
}

const reload = () => {
  store.loadDataFac(props.dataInfo)
}

const onDesignInfoLoaded = (data: any) => {
  console.log('🟪[DIYSKU]onDesignInfoLoaded')
  const { success } = data
  if (!success) {
    showError.value = true
    return
  }
  pageLoading.value = false
  nextTick(() => {
    initCanvas()
  })
}
const onFabricLoaded = () => {
  render('onFabricLoaded')
}
const onStageWIILSwitch = (data: any) => {
  stageLoading.value = true
}
const onStageSwitch = (data: any) => {
  render('onStageSwitch')
  setTimeout(() => {
    stageLoading.value = false
  }, 250)
}
const onSceneWillSwitch = (data: any) => {
  stageLoading.value = true
}
const onSceneSwitch = (data: any) => {
  stageLoading.value = false
  render('onSceneSwitch')
}

const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.DATA_LOADED, onDesignInfoLoaded)
  designEventBus.on(DESIGN_EVENTS.FABRIC_LOADED, onFabricLoaded)
  designEventBus.on(DESIGN_EVENTS.STAGE_WILL_SWITCH, onStageWIILSwitch)
  designEventBus.on(DESIGN_EVENTS.STAGE_DID_SWITCH, onStageSwitch)
  designEventBus.on(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.on(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.DATA_LOADED, onDesignInfoLoaded)
  designEventBus.off(DESIGN_EVENTS.FABRIC_LOADED, onFabricLoaded)
  designEventBus.off(DESIGN_EVENTS.STAGE_WILL_SWITCH, onStageWIILSwitch)
  designEventBus.off(DESIGN_EVENTS.STAGE_DID_SWITCH, onStageSwitch)
  designEventBus.off(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.off(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}

onMounted(() => {
  initialization()
  setupListeners()
  store.loadDataFac(props.dataInfo)
})
onUnmounted(() => {
  clearListeners()
})

const { mixinState } = useSelectListen(canvasEditor)

provide('fabric', fabric)
provide('canvasEditor', canvasEditor)
provide('mixinState', mixinState)
provide('store', store)
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.content {
  width: 100%;
  height: 90%;
}
.header {
  padding: 0;
  border-bottom: 1px solid #eff1f3;
}
.main {
  padding: 0;
}
.footer {
  padding: 0;
}

.canvas-container {
  background: #eff1f3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #eff1f3;
}

#workspace {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f1f1f1;
  overflow: hidden;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.el-loading-mask {
  background-color: rgba(255, 255, 255, 0.8); /* 透明背景 */
}
</style>
