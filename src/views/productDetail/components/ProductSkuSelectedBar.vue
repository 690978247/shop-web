<template>
  <div class="sku-item-container">
    <div class="index-group-box">
      <span class="sku-title" ref="skuTitleRef">{{ title }}</span>

      <div ref="groupBoxRef" class="index-group-boxIn">
        <template v-if="type === 'image'">
          <span class="sku-select-text">
            ({{ dataList[currentSelectedIndex]?.attrVauleTrans || '' }})</span
          >
        </template>
        <template v-else-if="type === 'text'">
          <div
            class="sku-text-container"
            ref="skuContainerRef"
            :class="{ collapsed: !expanded }"
          >
            <span
              v-for="(item, index) in expanded
                ? dataList
                : dataList.slice(0, maxItems)"
              :key="index"
              @click="onItemClick(index, item)"
              :class="{
                'sku-item-text-s': index === currentSelectedIndex,
                'sku-item-text-n': index !== currentSelectedIndex
              }"
              >{{ item?.attrVauleTrans || '' }}</span
            >
            <div ref="skuToggleButtonRef" class="toggle-button-view">
              <span v-if="!expanded && needShowExpand">...</span>
              <el-button
                v-if="needShowExpand"
                class="toggle-button"
                :icon="expanded ? ArrowUp : ArrowDown"
                circle
                @click="toggleExpand"
              >
              </el-button>
            </div>
          </div>
        </template>
        <template v-else-if="type === 'num'">
          <el-input-number
            v-model="currentNum"
            :step="1"
            :min="1"
            :max="9999"
            class="sku-input"
            @change="numValueChange"
          ></el-input-number>
        </template>
      </div>
    </div>
    <template v-if="type === 'image'">
      <div ref="skuContainerRef" class="sku-image-info">
        <el-image
          v-for="(item, index) in dataList"
          :key="'thumb-' + index"
          :src="item.skuImageUrl || ''"
          :alt="'Thumbnail ' + index"
          :class="{
            'group-card-s': index === currentSelectedIndex,
            'group-card-n': index !== currentSelectedIndex
          }"
          ref="groupCardRef"
          @click="onItemClick(index, item)"
        >
          <template #error>
            <div class="image-slot" @click="onItemClick(index, item)">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick, PropType, ref, watch } from 'vue'
import { TProductAttrValueVOs } from '@/views/productDetail/model/model'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array as PropType<TProductAttrValueVOs[]>,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  currentIndex: {
    type: Number
  },
  lowestSpecValueCode: {
    type: String
  }
})

const dataList = ref<TProductAttrValueVOs[]>(props.items || [])
const currentSelectedIndex = ref(0)
const currentNum = ref(1)
const groupBoxRef = ref<HTMLElement | null>(null)
const didSelectIndexEmits = defineEmits(['onSkuClick'])
const skuTitleRef = ref(null)
const skuContainerRef = ref(null)
const skuToggleButtonRef = ref(null)
const expanded = ref(false)
const maxItems = ref(props.items.length)
const needShowExpand = ref(true)

const numValueChange = (value: number) => {
  onItemClick(value, null)
}

watch(
  () => props.lowestSpecValueCode,
  (val) => {
    // console.log({ lowestSpecValueCode: props.lowestSpecValueCode })
    if (val) {
      currentSelectedIndex.value = dataList.value.findIndex(
        (item) => item.specValueCode === val
      )
    }
  },
  {
    immediate: true
  }
)

watch(
  () => props.items,
  (val) => {
    if (val) {
      nextTick().then(() => {
        if (props.type !== 'text') {
          return
        }
        if (skuContainerRef.value) {
          const containerWidth = skuContainerRef.value.offsetWidth
          const items =
            skuContainerRef.value.querySelectorAll('.sku-item-text-n')
          const toggleButtonWidth = skuToggleButtonRef.value.offsetWidth
          const gap = 16 // 间距大小
          let totalWidth = toggleButtonWidth
          let i = 1

          for (const item of items) {
            totalWidth = totalWidth + item.offsetWidth + gap
            i++
            if (totalWidth > containerWidth) {
              break
            }
          }

          maxItems.value = i * 1.65
          if (maxItems.value === 0 || maxItems.value >= props.items.length) {
            maxItems.value = props.items.length
            needShowExpand.value = false
          } else {
            needShowExpand.value = true
          }
        }
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const onItemClick = (value: number, item: any) => {
  currentSelectedIndex.value = value
  if (props.type === 'num') {
    didSelectIndexEmits('onSkuClick', {
      type: props.type,
      value: value
    })
  } else {
    didSelectIndexEmits('onSkuClick', {
      type: props.type,
      index: value,
      value: item
    })
  }
}

const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<style lang="scss" scoped>
.sku-item-containe {
  background-color: white;
}

.index-group-box {
  display: flex;
  justify-content: start;
  width: 100%;

  :deep(.sku-input.el-input-number) {
    .el-input-number__increase,
    .el-input-number__decrease {
      color: black;
      font-weight: 600;
      background-color: white;
    }

    .el-input__inner {
      color: black;
      font-size: 14px;
      font-weight: 600;
      border: 0;
    }

    .el-input__wrapper.is-focus {
      box-shadow: 0 0 0 1px var(--el-color-primary);
    }
  }
}

.index-group-boxIn {
  display: flex;
  flex: 1;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 18px;
}

.group-card-n,
.group-card-s {
  margin-right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1.5px solid #e5e5e5;
  cursor: pointer;
}

.group-card-s {
  border-width: 1.5px;
  border-color: var(--el-color-primary);
}

.sku-title {
  padding-right: 8px;
  margin-top: 8px;
  font-size: 18px;
  font-weight: 400;
  color: #333333;
  min-width: 40px;
  font-family: 'SourceSans3';
}

.sku-select-text {
  font-size: 16px;
  padding-right: 16px;
  margin-top: 10px;
  font-weight: 400;
  color: #666666;
  min-width: 40px;
  font-family: 'SourceSans3';
}

.sku-item-text-s,
.sku-item-text-n {
  //height: 32px;
  padding: 5px 16px;
  font-size: 16px;
  color: #999999;
  border-radius: 16px;
  border: 1.5px solid #e5e5e5;
  cursor: pointer;
  font-family: 'SourceSans3';
  text-align: center;
  min-width: 32px;
}

.sku-item-text-s {
  color: var(--el-color-primary);
  border: 1.5px solid var(--el-color-primary);
}

.sku-text-container {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  flex-wrap: wrap; /* 添加 flex-wrap 属性以允许子视图换行 */
  gap: 16px; /* 设置项目之间的间隔为16px */
}

.collapsed {
  overflow: hidden;
}

.toggle-button-view {
  display: flex;
  align-items: center;

  .toggle-button {
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
  }
}

.sku-image-info {
  margin-top: 8px;
}
</style>
