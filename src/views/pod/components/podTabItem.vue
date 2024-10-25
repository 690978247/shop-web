<template>
  <div class="podItem">
    <div class="search">
      <el-input
        v-model="searchKey"
        type="text"
        size="large"
        clearable
        @keyup.enter="kyeUpDown"
        placeholder="Search  products by keyword"
        @clear="clearKeyword"
      >
      </el-input>
      <el-icon @click="searchByKeyword" class="searchIcon"><Search /></el-icon>
    </div>
    <div class="productMain">
      <div class="podLeftMain">
        <div class="category">
          <span>{{ $t('category') }}</span>
          <span @click="clearAll" class="clearAll">Clear all</span>
        </div>
        <div class="categories">
          <categoryList
            ref="categoryRef"
            @updateCategoryId="updateCategoryId"
          ></categoryList>
        </div>
      </div>
      <div class="podRightMain">
        <div class="productTitle">{{ proNameTitle }}</div>
        <div class="podProductList">
          <podProductList
            @favOrCancel="favOrCancel"
            @loadMore="loadMore"
            :productList="productList"
            :loading="showLoading"
            :enableAutoLoadNextPage="showNextPage && pageInfo.pageNum >= 3"
          ></podProductList>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import categoryList from './categoryList.vue'
import { inject } from 'vue'
import {
  getAllPodProduct,
  getAllPodProduct2,
  addMyFav,
  cancelMyFav,
  getMyFavList
} from '@/api/pod'
import podProductList from './podProductLists.vue'
import { loginEventBus } from '@/utils/common'
import { useUser } from '@/store/modules/user'
import { useRoute } from 'vue-router'
const $t: any = inject('$t')
const props = defineProps({
  activeTabName: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})
const route = useRoute()
const proNameTitle = computed(() => {
  return props.tabs.find(
    (item: { name: string; label: string }) => item.name === props.activeTabName
  )?.label
})
watch(
  () => props.activeTabName,
  (newTab) => {
    const tk = useUser()?.state?.token
    if (!tk && newTab === 'favorite') {
      loginEventBus.emit()
      return
    }
    productList.value = []
    pageInfo.pageNum = 1
    getAllProductFn()
  }
)
const requesting = ref(false)
const refContainer = ref(null)
onMounted(() => {
  console.log('onMounted', route)

  getAllProductFn()
  refContainer.value = document.querySelector('.el-main')
  if (refContainer.value) {
    refContainer.value.addEventListener('scroll', handleScroll)
  }
})
const handleScroll = () => {
  if (pageInfo.pageNum >= 3 || !showNextPage.value || showLoading.value) return
  const footerHeight = document.querySelector('.footer')?.clientHeight ?? 0
  const container = refContainer.value
  if (
    container.scrollTop + container.clientHeight + footerHeight + 200 >=
    container.scrollHeight
  ) {
    pageInfo.pageNum++
    getAllProductFn()
  }
}
const { showLoading, showNextPage } = toRefs(
  reactive({
    showLoading: false,
    showNextPage: false
  })
)
const productList = ref([])
const pageInfo = reactive({
  pageNum: 1,
  size: 8
})
const categoryId = ref('')
const updateCategoryId = (id: any) => {
  categoryId.value = id
  resetSearch()
}
const categoryRef = ref()
const clearAll = () => {
  categoryRef.value.clearAllCategory()
}
const searchByKeyword = () => {
  resetSearch()
}
const clearKeyword = () => {
  resetSearch()
}
const resetSearch = () => {
  productList.value = []
  pageInfo.pageNum = 1
  getAllProductFn()
}
// 获取pod产品列表
const getAllProductFn = async () => {
  if (requesting.value) return
  let method = null
  if (props.activeTabName === 'all') {
    if (route.name === 'podIndex2') {
      method = getAllPodProduct2
    } else {
      method = getAllPodProduct
    }
  } else if (props.activeTabName === 'favorite') {
    method = getMyFavList
  }
  showLoading.value = true
  requesting.value = true
  try {
    method({
      platform: 2,
      pageNum: pageInfo.pageNum,
      size: pageInfo.size,
      categoryId: categoryId.value,
      keyword: searchKey.value
    })
      .then((res) => {
        showLoading.value = false
        requesting.value = false
        if (res.success) {
          if (res.data?.records?.length < pageInfo.size) {
            //当前页如果小于或者等于每页的数量
            showNextPage.value = false
          } else {
            showNextPage.value = true
          }
          productList.value.push(...(res.data?.records || []))
        }
      })
      .catch((err) => {
        requesting.value = false
        showLoading.value = false
      })
  } catch (error) {
    console.log('121212')
    requesting.value = false
    showLoading.value = false
  }
}
const loadMore = () => {
  pageInfo.pageNum++
  getAllProductFn()
}
// 取消收藏或者收藏
const favOrCancel = (item: { isFavorite: number; goodsCode: string }) => {
  const currentIndex = productList.value.findIndex(
    (pod) => pod.goodsCode === item.goodsCode
  )
  const mMethod = item.isFavorite === 1 ? cancelMyFav : addMyFav
  mMethod({ spuNo: item.goodsCode }).then((res: any) => {
    if (res.success) {
      ElMessage.success(
        item.isFavorite === 1 ? $t('cancelFavSuccess') : $t('favSuccess')
      )
      // resetSearch()
      if (props.activeTabName === 'favorite') {
        productList.value.splice(currentIndex, 1)
      } else {
        productList.value[currentIndex].isFavorite =
          item.isFavorite === 1 ? 0 : 1
      }
    } else {
      ElMessage.error(res.msg)
    }
  })
}
// 回车
const kyeUpDown = (e: any) => {
  if (e.keyCode === 13) {
    searchByKeyword()
  }
}
const categoriesList = ref([])
const searchKey = ref('')
</script>
<style lang="scss" scoped>
.podItem {
  width: 100%;
  height: auto;
  .search {
    margin-top: 10px;
    width: 100%;
    position: relative;
    :deep(.el-input) {
      height: 44px;
      border-radius: 30px;
      .el-input__wrapper {
        border-radius: 30px;
        padding-right: 40px;
      }
    }
    .searchIcon {
      width: 40px;
      height: 40px;
      position: absolute;
      top: 2px;
      right: 5px;
      color: #b6b8bc;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  .productMain {
    margin-top: 20px;
    display: flex;
    .podLeftMain {
      position: sticky;
      height: calc(100vh - 100px);
      top: 0;
      flex: 1;
      width: 268px;
      overflow: auto;
      margin-right: 24px;
      min-height: 300px;
      &::-webkit-scrollbar {
        background-color: #f0f2f5;
        width: 2px;
      }
      .category {
        font-family: Inter;
        font-size: 18px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .clearAll {
          cursor: pointer;
          border-radius: 20px;
          padding: 2px 12px;
          font-size: 14px;
          font-weight: 400;
          border: 1px solid var(--el-color-primary);
          color: var(--el-color-primary);
        }
      }
    }
    .podRightMain {
      width: calc(100% - 200px);
      overflow-y: auto;
      overflow-x: hidden;
      .productTitle {
        text-align: center;
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 28px;
      }
    }
  }
}
</style>
