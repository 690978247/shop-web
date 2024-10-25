<template>
  <div class="container">
    <template v-if="items && items.length > 0">
      <el-card class="box-card">
        <el-row
          v-for="(item, index) in items"
          :key="item.index"
          :class="[
            'list-item',
            {
              'drop-target':
                isDropTarget !== null
                  ? isDropTarget.toString() === index.toString()
                  : false
            }
          ]"
          :data-index="index"
          draggable="true"
          @dragstart="onDragStart"
          @dragover="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
          @click="cellClick(item, index)"
        >
          <el-col
            :span="1"
            :class="currentSelectedIndex === index ? 'cell-icon' : ''"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6.75 2.25h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3zm-7.5 5.5h3v3h-3zm7.5 0h3v3h-3z"
              />
            </svg>
          </el-col>
          <template v-if="item.type === 'image' && item.getElement()?.src">
            <el-tooltip content="This is an image tooltip" placement="right">
              <template #content>
                <img :src="item.getElement().src" alt="image" width="100" />
              </template>
              <el-col :span="10" class="cell-text">
                {{ cellText(item) }}</el-col
              >
            </el-tooltip>
          </template>
          <template v-else
            ><el-col :span="10" class="cell-text">
              {{ cellText(item) }}</el-col
            ></template
          >
          <el-col :span="5" class="buttons">
            <span @click="toggleVisibility(item)">
              <span class="btn" v-show="item.visible"
                ><el-icon><View /></el-icon
              ></span>
              <span class="btn" v-show="!item.visible"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" fill-rule="evenodd">
                    <path
                      d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                    />
                    <path
                      fill="red"
                      d="M2.5 9a1.5 1.5 0 0 1 2.945-.404c1.947 6.502 11.158 6.503 13.109.005a1.5 1.5 0 1 1 2.877.85a10.1 10.1 0 0 1-1.623 3.236l.96.96a1.5 1.5 0 1 1-2.122 2.12l-1.01-1.01a9.6 9.6 0 0 1-1.67.915l.243.906a1.5 1.5 0 0 1-2.897.776l-.251-.935c-.705.073-1.417.073-2.122 0l-.25.935a1.5 1.5 0 0 1-2.898-.776l.242-.907a9.6 9.6 0 0 1-1.669-.914l-1.01 1.01a1.5 1.5 0 1 1-2.122-2.12l.96-.96a10.1 10.1 0 0 1-1.62-3.23A1.5 1.5 0 0 1 2.5 9"
                    />
                  </g></svg
              ></span>
            </span>
            <el-icon class="btn" @click="removeItem(item, index)"
              ><Delete
            /></el-icon>
          </el-col>
        </el-row>
      </el-card>
    </template>
    <template v-else>
      <div class="empty">
        <svg
          t="1722783573922"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3106"
          width="64"
          height="64"
        >
          <path
            d="M884.363636 320.349091a29.090909 29.090909 0 0 1-3.723636-58.181818l69.818182-9.192728a29.090909 29.090909 0 1 1 7.563636 58.181819l-69.818182 9.192727zM853.992727 174.545455a29.090909 29.090909 0 0 1-20.596363-49.687273L889.134545 69.818182a29.090909 29.090909 0 0 1 41.192728 41.192727l-55.738182 55.738182a28.974545 28.974545 0 0 1-20.596364 7.796364zM708.770909 144.407273h-3.84a29.090909 29.090909 0 0 1-25.018182-32.698182l9.192728-69.818182a29.090909 29.090909 0 0 1 58.181818 7.563636l-9.192728 69.818182a29.090909 29.090909 0 0 1-29.323636 25.134546z"
            fill="#D5D5D5"
            p-id="3107"
          ></path>
          <path
            d="M731.112727 995.723636H246.341818a122.298182 122.298182 0 0 1-122.181818-122.181818V270.894545a122.298182 122.298182 0 0 1 122.181818-122.181818h333.963637l272.98909 227.490909v497.338182a122.298182 122.298182 0 0 1-122.181818 122.181818zM246.341818 206.894545a64.116364 64.116364 0 0 0-64 64v602.763637a64.116364 64.116364 0 0 0 64 64h484.770909a64.116364 64.116364 0 0 0 64-64V403.432727L559.243636 206.894545z"
            fill="#D5D5D5"
            p-id="3108"
          ></path>
          <path
            d="M797.090909 442.181818h-139.636364A122.298182 122.298182 0 0 1 535.272727 320v-116.363636a29.090909 29.090909 0 0 1 58.181818 0v116.363636a64.116364 64.116364 0 0 0 64 64h139.636364a29.090909 29.090909 0 0 1 0 58.181818z"
            fill="#D5D5D5"
            p-id="3109"
          ></path>
        </svg>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useSelect from '@/components/DIYSKU/hooks/select'
const { canvasEditor, store, mixinState } = useSelect()
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

const loading = ref(true)
const items = ref([])
const currentSelectedIndex = ref<number | null>(null)
const isDropTarget = ref<number | null>(null)

const toggleVisibility = (obj: any) => {
  obj.set('visible', !obj.visible)
  updateCanvas()
}

const updateCanvas = () => {
  canvasEditor.renderAll()
}

const cellText = (object: any) => {
  const { type, text } = object
  let name = type.toString()

  if (type === 'rect') {
    name = 'Rect'
  } else if (type === 'image') {
    const src = object.getElement().src
    if (src?.includes('http')) {
      const shadowSrc = store?.getCurrentStateShadowSrc() || ''
      name = src === shadowSrc ? 'shadow' : src.split('/').pop() || 'image'
    } else {
      name = 'image'
    }
  } else if (type.includes('text')) {
    name = text || ''
  }
  // 截取字符串的后8个字符
  return name.length > 8 ? name.slice(-8) : name
}

//更新图层列表
const updateItemList = (from: string) => {
  if (loading.value) {
    return
  }
  // console.log('🟧[SKULayerControlPanelWidget] 图层更新 from:', from)
  if (!canvasEditor || typeof canvasEditor.getObjects !== 'function') {
    return
  }
  const objects = canvasEditor.getObjects().filter((obj: any) => {
    return obj.layerType === 'custom'
  })

  items.value = objects
}
const removeItem = (obj: any, index: any) => {
  canvasEditor.deleteLayer({ layer: obj })
  updateItemList('removeItem')

  designEventBus.emit(DESIGN_EVENTS.USER_REMOVE_OBJECT, {
    type: 'removeItem'
  })
}
const cellClick = (obj: any, index: any) => {
  isDropTarget.value = index
  const objects = canvasEditor.getObjects()
  canvasEditor.activeObject(objects[index + 3])
}

let draggedIndex: number = 0

const onDragStart = (event: { currentTarget: { dataset: { index: any } } }) => {
  draggedIndex = event.currentTarget.dataset.index
}

const onDragOver = (event: any) => {
  event.preventDefault()
  isDropTarget.value = event.currentTarget.dataset.index
  console.log('🟧[SKULayerControlPanelWidget]onDragOver:', isDropTarget.value)
}

const onDragLeave = () => {
  console.log('🟧[SKULayerControlPanelWidget] onDragLeave:', isDropTarget.value)
}

//这里不依赖图层的顺序, 而是根据更换顺序来更新图层的顺序
const onDrop = (event: any) => {
  if (draggedIndex === null) {
    return
  }

  const targetIndex = event.currentTarget.dataset.index
  const objectToMove = items.value[draggedIndex]
  const diff = targetIndex - parseInt(draggedIndex.toString())
  console.log('🟧[SKULayerControlPanelWidget] onDrop diff:', diff)
  canvasEditor.moveToIndex(objectToMove, diff)
  updateItemList('onDrop')
  updateSelectedLayer()
  // isDropTarget.value = null
}

const updateSelectedLayer = () => {
  if (
    !canvasEditor ||
    typeof canvasEditor.getActiveObjectIndex !== 'function'
  ) {
    return
  }
  currentSelectedIndex.value = null
  isDropTarget.value = currentSelectedIndex.value

  const currentIndex = canvasEditor.getActiveObjectIndex()
  if (currentIndex <= 0) {
    return
  }
  const diff = canvasEditor.getObjects().length - items.value.length
  currentSelectedIndex.value = currentIndex - diff
  isDropTarget.value = currentSelectedIndex.value
}

const didAdderNameChange = (adderName: string) => {
  updateItemList(`didAdderNameChange:${adderName}`)
}

const didDesignObjectUpdated = (data: any) => {
  updateItemList('didDesignObjectUpdated')
}
const didFabricJSONLoad = () => {
  loading.value = false
  updateItemList('didFabricJSONLoad')
}
const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.FABRIC_JSON_LOADED, didFabricJSONLoad)
  designEventBus.on(DESIGN_EVENTS.FABRIC_OBJECT_UPDATED, didDesignObjectUpdated)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.FABRIC_JSON_LOADED, didFabricJSONLoad)
  designEventBus.off(
    DESIGN_EVENTS.FABRIC_OBJECT_UPDATED,
    didDesignObjectUpdated
  )
}
onMounted(() => {
  setupListeners()
  updateItemList('onMounted')
})

onUnmounted(() => {
  clearListeners()
})

//选中状态跟新
watch(() => mixinState.mSelectActive, updateSelectedLayer)
//左侧菜单栏点击
watch(() => store.currentAdderName, didAdderNameChange)
</script>

<style scoped>
.container {
  width: 100%;
}

.box-card {
  background: #ffffff;
  color: #666666;
  font-size: 14px;
  border: none;
}

:deep(.el-card) {
  box-shadow: none;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  padding: 5px;

  border-radius: 32px;
  justify-content: space-between;
  border: 1px solid #ebeef5;
  padding-left: 20px;
  padding-right: 20px;
  height: 44px;
}

.drop-target {
  border: 1px solid red; /* 添加红线提示 */
}

.list-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.btn {
  margin: 0 2px 0 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.cell-text {
  font-size: 14px;
  font-weight: 500;
  color: #666666;
}

.cell-icon {
  color: red;
}

.empty {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bc0d34;
}
</style>
