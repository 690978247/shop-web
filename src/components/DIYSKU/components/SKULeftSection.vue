<template>
  <div class="container">
    <!-- 左侧导航栏 -->
    <el-aside width="16%">
      <div class="nav">
        <div
          v-for="item in items"
          :key="item.key"
          :class="['nav-item', { selected: selectedItem === item.key }]"
          @click="selectItem(item.key)"
        >
          <img
            :src="selectedItem === item.key ? item.activeIcon : item.icon"
            alt=""
            :class="['nav-icon', { selected: selectedItem === item.key }]"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </el-aside>
    <!-- 右侧内容区域 -->
    <el-aside width="84%" class="right-side">
      <div class="widget-container">
        <!-- 根据选中的项目显示不同的组件 -->
        <div v-show="selectedItem === 'image'">
          <SKUImageAdderWidget class="widget" />
        </div>
        <div v-show="selectedItem === 'text'">
          <SKUTextAdderWidget class="widget layerWidget" />
        </div>
        <div v-show="selectedItem === 'layers'">
          <SKULayerControlPanelWidget class="widget" />
        </div>
        <div v-show="selectedItem === 'colors'">
          <SKUColorEditorWidget class="widget" />
        </div>
      </div>
    </el-aside>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useSelect from '@/components/DIYSKU/hooks/select'
import designEventBus from '../service/DesignEventBus'
import { DESIGN_EVENTS } from '../service/DesignEvents'

const { store } = useSelect()

// 定义导航项的接口
interface Item {
  key: string
  label: string
  activeIcon: string
  icon: string
}

// 定义导航项列表
const items: Item[] = [
  {
    key: 'image',
    label: 'Image',
    activeIcon: 'https://static.hzpdex.com/web/1719367312508_image.jpg',
    icon: 'https://static.hzpdex.com/web/1719368039442_1-2.png'
  },
  {
    key: 'text',
    label: 'Text',
    activeIcon: 'https://static.hzpdex.com/web/1719367312462_icon2.jpg',
    icon: 'https://static.hzpdex.com/web/1719367917594_2-2.png'
  },
  {
    key: 'layers',
    label: 'Layers',
    activeIcon: 'https://static.hzpdex.com/web/1719367312322_icon3.jpg',
    icon: 'https://static.hzpdex.com/web/1719368039508_3-2.png'
  },
  {
    key: 'colors',
    label: 'colors',
    activeIcon: 'https://static.hzpdex.com/web/common/ic_colors_s.png',
    icon: 'https://static.hzpdex.com/web/common/ic_colors_n.png'
  }
]

// 定义选中的导航项
const selectedItem = ref<string>('image')

const updateURLWithTab = (key: string) => {
  const index = items.findIndex((item) => item.key === key)
  updateURLWithTabIndex(index)
}

const updateURLWithTabIndex = (index: number) => {
  const currentUrl = window.location.href
  const url = new URL(currentUrl)
  url.searchParams.set('tab', index.toString())
  // 使用 pushState 修改 URL
  window.history.pushState({}, '', url)
}
const switchTab = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const tab = urlParams.get('tab')
  if (tab) {
    const index = parseInt(tab)
    if (index >= 0 && index < items.length) {
      selectedItem.value = items[index].key
      store.currentAdderName = items[index].key
    }
  }
}
// 处理导航项点击事件
const selectItem = (key: string) => {
  const fromIndex = items.findIndex((item) => item.key === selectedItem.value)
  selectedItem.value = key
  store.currentAdderName = key
  updateURLWithTab(key)
  designEventBus.emit(DESIGN_EVENTS.TAB_DID_SWITCH, {
    toIndex: items.findIndex((item) => item.key === key),
    fromIndex: fromIndex,
    tabName: key
  })
}

const onSceneSwitch = (data: any) => {
  if (items.length === 0) {
    return
  }
  selectItem(items[0].key)
}

const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}

onMounted(() => {
  switchTab()
  setupListeners()
})

onUnmounted(() => {
  clearListeners()
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #ffffff;
}
.nav {
  background: rgba(188, 12, 52, 0.06);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  color: var(--el-color-primary);
}
.widget-container {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  background: #ffffff;
}
.nav-item {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  text-align: center;
  margin: 0;
  cursor: pointer;
  color: #666666;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.nav-item.selected {
  background: #ffffff;
  color: var(--el-color-primary);
}
.nav-icon {
  width: 24px;
  height: 24px;
  color: var(--el-color-primary);
}
.nav-icon.selected {
  background: #ffffff;
  color: var(--el-color-primary);
}
.widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.layerWidget {
  justify-content: flex-start;
}
.right-side {
  height: 100%;
  background: #3f4652;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  &::-webkit-scrollbar {
    background-color: #dedede;
    width: 4px;
  }
}
</style>
