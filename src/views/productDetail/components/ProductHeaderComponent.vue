<template>
  <div class="product-header">{{ categoryName || categoryPath }}</div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue'
import { GlobalStore } from '@/store/modules/global'
import { TProductDetail } from '@/views/productDetail/model/model'
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'

const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: false,
    default: () => {}
  },
  categoryId: {
    type: String,
    required: false,
    default: ''
  },
  categoryName: {
    type: String,
    default: null
  }
})

const globalStore = GlobalStore()

// 使用映射表来简化语言资源的管理
const languageMappings: any = ref({
  pt: BR.list,
  es: ES.list,
  zh: ZH.list,
  en: EN.list
})

// 响应式引用当前语言对应的类别列表
const leftItems = computed(() => languageMappings.value[globalStore.language])

const categoryPath = computed(() => {
  if (props.categoryId) {
    const name = findCategoryNameById(props.categoryId || '', leftItems.value)
    return name
  }

  const categoryId: any = props.productData?.categoryId || '[]'

  let categoryIds = []
  try {
    categoryIds = JSON.parse(categoryId)
  } catch (error) {
    categoryIds = []
  }
  if (categoryIds.length === 0) {
    return ''
  }

  const categoryNames = categoryIds
    .map((id: string) => {
      const name = findCategoryNameById(id, leftItems.value)
      return name || ''
    })
    .filter((name: any) => name !== '')
  return categoryNames.filter((name: string) => name).join('/')
})

function findCategoryNameById(id: string, list: any[]): string | null {
  for (const item of list) {
    if (item.categoryID === id) {
      return item.name
    }
    if (item.children) {
      const found = findCategoryNameById(id, item.children)
      if (found) return found
    }
  }
  return null
}

watch(
  () => globalStore.language,
  () => {},
  {
    immediate: true,
    deep: true
  }
)
</script>

<style scoped>
.product-header {
  display: flex;
  justify-content: start;
  align-items: center;
  height: 40px;
  font-size: 14px;
  color: #666666;
}
</style>
