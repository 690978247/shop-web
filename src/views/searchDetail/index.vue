<template>
  <div class="page">
    <div class="header">
      <el-image :src="frameImg" style="width: 100%; height: 100%" />
    </div>
    <ProductHeaderComponent
      v-if="currentCategoryID || searchCategoryIDs.length > 0"
      :category-Id="currentCategoryID"
      :category-name="searchWord"
    />
    <div class="wrap" id="wrap">
      <recommended-product
        :grid="{
          columns: 6,
          width: '15.5%'
        }"
        :recommendList="recommendList"
        :addCount="pageData.pageSize"
        :showAddLoading="showAddLoading"
        :hideHeader="hideHeader"
        styleType="productDetail"
      >
        <!-- slot 需要手动设置 骨架屏 -->
        <template #header>
          <!-- 全局搜索 -->
          <template v-if="!productCollection">
            <el-image
              v-if="searchImageUrl"
              class="searchImage"
              :src="searchImageUrl"
              :preview-src-list="[searchImageUrl]"
            >
            </el-image>
            <span class="header-title" v-else
              >{{ searchText }}"{{ inputValue }}"</span
            >
          </template>
          <!-- 平台下搜索 -->
          <template v-else>
            <span class="header-title" v-if="!searchImageUrl">
              {{ $t('searchresultsfor') }}
              <span>"{{ productCollectionName }}"<!--  -  --></span>
              <!-- "<span v-if="inputValue">{{ inputValue }}</span
              >" -->
            </span>
            <span v-else>
              <span class="header-title">{{ productCollectionName }}" - </span>
              <img
                class="searchImage"
                v-if="searchImageUrl"
                :src="searchImageUrl"
              />
            </span>
          </template>
        </template>
      </recommended-product>
      <div
        class="more"
        v-if="enableAutoLoadNextPage === false && !showAddLoading"
      >
        <div v-if="!isground" class="more-wrap" @click="loadMore">
          <span>{{ $t('viewmore') }}</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <div
          class="empty-view"
          v-else-if="pageData.currentPage == 1 && recommendList.length == 0"
        >
          <el-empty
            :description="$t('nomoredata')"
            class="empty-img"
            :image="EmptyData"
          >
            <el-button
              class="button"
              round
              color="#15104B"
              type="primary"
              @click="sourcingBtn"
              >{{ $t('sourcing') }}
            </el-button>
          </el-empty>
        </div>
        <div v-else>
          {{ $t('nomoredata') }}
          <a href="javascript: void(0)" @click="toSourcing">{{
            $t('trySourcing')
          }}</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { HeaderStore } from '@/store/modules/header'
import frameImg from '@/assets/images/frame.jpg'
import RecommendedProduct from '@/views/home/components/recommendedProduct.vue'
import { getProductData, imageSearch } from '@/api/goods'
import { GlobalStore } from '@/store/modules/global'
import { useRoute } from 'vue-router'
import {
  loginEventBus,
  ProductCollections,
  randomLinksValue,
  headerEventBus
} from '@/utils/common.ts'
import EmptyData from '@/assets/images/empty_data.svg'
import { useUser } from '@/store/modules/user.ts'
import ProductHeaderComponent from '@/views/productDetail/components/ProductHeaderComponent.vue'
import { getMemberVo } from '@/api/user/index'

defineOptions({
  name: 'SearchDetail'
})

const $t: any = inject('$t')
const globalStore = GlobalStore()

const route = useRoute()

const showAddLoading = ref(false)
// 是否加载完成所有数据
const isground = ref(false)

const headerStore = HeaderStore()
const inputValue = ref('')

const recommendList = ref()
const searchText = ref('')

const searchImageUrl = ref()
const hideHeader = ref(false)

// 分页
const pageData = ref({
  currentPage: 1,
  pageSize: 32,
  total: 0
})

const enableAutoLoadNextPage = ref(true)
const currentCategoryID = ref('')
const searchCategoryID = ref()
const searchCategoryIDs = ref([])
const searchWord = ref()
const productCollection = ref()
const productCollectionName = ref()

const memberInfo = ref({
  GradeId: 1
})

const initSearch = async () => {
  const query: any = route.query
  searchCategoryID.value = query.cid
  searchCategoryIDs.value = query.cids?.split(',') || []
  searchWord.value = query.kw
  productCollection.value = query.pct
  // 分类为 热销平台时， 输入框内容可以为空 查询
  inputValue.value = searchWord.value
  if (searchWord.value?.trim() === '' && !productCollection.value) return
  if (productCollection.value) {
    productCollectionName.value = ProductCollections.find(
      (item) => item.value === productCollection.value
    )?.label
  }
  updateCategoryPath()
  // 添加 权限
  // getData('init')
  const userInfo = localStorage.getItem('userInfo') ?? ''

  if (userInfo) {
    const res = await getMemberVo()
    memberInfo.value = res.data
    getData('init')
  } else {
    // 未登录用户
    getData('init')
  }
}

const updateAutoLoadStatus = () => {
  if (pageData.value.currentPage > 3 || isground.value === true) {
    enableAutoLoadNextPage.value = false
  } else {
    enableAutoLoadNextPage.value = true
  }
}

const updateCategoryPath = () => {
  if (!searchImageUrl.value) {
    currentCategoryID.value = searchCategoryID.value
  } else {
    currentCategoryID.value = ''
  }
  // 存在searchCategoryID 则不显示 recommen 头部
  hideHeader.value =
    !!searchCategoryID.value || searchCategoryIDs.value.length > 0
}

watch(
  () => globalStore.language,
  () => {
    if (searchCategoryID.value || searchCategoryIDs.value.length > 0) {
      // 分类跳转的多语言需要修改
      searchText.value = $t('displayOf')
    } else {
      searchText.value = $t('searchresultsfor')
    }
    updateCategoryPath()
  },
  {
    immediate: true
  }
)

// 洗牌算法
const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    // 随机选择一个比当前元素索引小的元素
    const j = Math.floor(Math.random() * (i + 1))
    // 交换这两个元素
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const getData = (type: 'init' | 'add') => {
  if (searchCategoryID.value || searchCategoryIDs.value.length > 0) {
    searchText.value = $t('displayOf')
  } else {
    searchText.value = $t('searchresultsfor')
  }

  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    keyword:
      searchCategoryID.value || searchCategoryIDs.value.length > 0
        ? ''
        : inputValue.value,
    categoryId: searchCategoryID.value || null,
    categoryIdList:
      searchCategoryIDs.value.length > 0 ? searchCategoryIDs.value : null,
    productCollection: productCollection.value ?? null,
    vipLevel: memberInfo.value.GradeId
  }

  showAddLoading.value = true
  getProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      // 打乱顺序
      // if (res.data.records.length >= 2) {
      //   res.data.records = shuffleArray(res.data.records)
      // }
      showAddLoading.value = false
      pageData.value.currentPage = res.data.current
      pageData.value.pageSize = res.data.size
      pageData.value.total = res.data.total
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })
      if (type === 'init') {
        scrollToTop()
        recommendList.value = res.data.records
      }
      if (type === 'add') {
        recommendList.value = recommendList.value.concat(res.data.records)
      }
      if (res.data.records.length < res.data.size) {
        isground.value = true
      } else {
        isground.value = false
      }
      updateAutoLoadStatus()
    })
    .catch(() => {
      enableAutoLoadNextPage.value = false
      isground.value = true
      showAddLoading.value = false
    })
}

const getImgData = (type: 'init' | 'add', imgId: string) => {
  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    imageUrl: imgId
    // productCollection: product?.productCollection ?? null
  }
  headerStore.setValueChange(!headerStore.valueChange)
  showAddLoading.value = true
  imageSearch(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      // 打乱顺序
      // if (res.data.records.length >= 2) {
      //   res.data.records = shuffleArray(res.data.records)
      // }
      showAddLoading.value = false
      pageData.value.currentPage = res.data.current
      pageData.value.pageSize = res.data.size
      pageData.value.total = res.data.total
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })
      if (type === 'init') {
        scrollToTop()
        recommendList.value = res.data.records
      }
      if (type === 'add') {
        recommendList.value = recommendList.value.concat(res.data.records)
      }
      if (res.data.records.length < res.data.size) {
        isground.value = true
      } else {
        isground.value = false
      }
      updateAutoLoadStatus()
    })
    .catch(() => {
      enableAutoLoadNextPage.value = false
      isground.value = true
      showAddLoading.value = false
    })
}

const toSourcing = () => {
  const tk = useUser()?.state?.token
  if (tk) {
    window.open(`${import.meta.env.VITE_UD_BASE_URL}/Sourcing?tk=${tk}&from=2`)
  } else {
    loginEventBus.emit()
  }
  window.open(`${import.meta.env.VITE_UD_BASE_URL}/Sourcing?tk=${tk}&from=2`)
}

watch(
  () => route.query.imageId,
  (imgId: string) => {
    if (!imgId) return
    inputValue.value = ''
    searchWord.value = ''
    searchCategoryID.value = ''
    searchCategoryIDs.value = []
    productCollection.value = ''
    searchImageUrl.value = imgId
    pageData.value.currentPage = 1
    pageData.value.pageSize = 32
    pageData.value.total = 0
    recommendList.value = []
    updateCategoryPath()
    getImgData('init', imgId)
  },
  { immediate: true, deep: true }
)

watch(
  () => globalStore.language,
  () => {
    recommendList.value = []
    getData('init')
  },
  {
    deep: true
  }
)

const loadMore = () => {
  pageData.value.currentPage++
  if (!route.query.imageId) {
    getData('add')
  } else {
    getImgData('add', route.query.imageId as string)
  }
}

const scrollToTop = () => {
  const wrap = document.querySelector('.el-main')
  wrap.scrollTop = 0
}

const sourcingBtn = () => {
  const tk = useUser()?.state?.token
  if (tk) {
    window.open(`${import.meta.env.VITE_UD_BASE_URL}/Sourcing?tk=${tk}&from=2`)
  } else {
    loginEventBus.emit()
  }
}

// enter category
const handleSearch = (type: string = '', eventData: any) => {
  pageData.value.currentPage = 1
  pageData.value.pageSize = 32
  pageData.value.total = 0
  recommendList.value = []
  if (type === 'enter') {
    // 输入框触发事件
    inputValue.value = eventData.kw
    searchWord.value = eventData.kw
    searchCategoryID.value = ''
    searchCategoryIDs.value = []
    productCollection.value = ''
    searchImageUrl.value = ''
    updateCategoryPath()
    getData('init')
    return
  }
  if (type === 'category') {
    // 分类-父节点
    inputValue.value = ''
    searchWord.value = eventData.kw
    searchCategoryID.value = ''
    searchCategoryIDs.value = eventData.cids?.split(',') || []
    productCollection.value = null
    searchImageUrl.value = ''
    updateCategoryPath()
    getData('init')
    return
  }
  if (type === 'child-category') {
    searchWord.value = eventData.kw
    // 分类-子节点
    inputValue.value = ''
    searchCategoryID.value = eventData.cid
    searchCategoryIDs.value = []
    productCollection.value = null
    searchImageUrl.value = ''
    updateCategoryPath()
    getData('init')
    return
  }
}

// event bus
headerEventBus.on((event: any) => {
  // 搜索框 查询按钮触发
  if (event.type === 'enter') {
    handleSearch('enter', event)
  }
  // 分类搜索- 父节点
  if (event.type === 'category') {
    handleSearch('category', event)
  }
  // 分类搜索- 子节点
  if (event.type === 'child-category') {
    handleSearch('child-category', event)
  }
})

const mainElement = ref(null)

onMounted(() => {
  const imageId = route.query.imageId
  scrollToTop()

  if (!imageId) {
    initSearch()
  }
  mainElement.value = document.querySelector('.el-main')
  if (mainElement.value) {
    mainElement.value.addEventListener('scroll', checkScroll)
  }
})

onBeforeUnmount(() => {
  if (mainElement.value) {
    mainElement.value.removeEventListener('scroll', checkScroll)
  }
})

const checkScroll = () => {
  if (enableAutoLoadNextPage.value === false) {
    console.log('❎ 自动加载下一页关闭中')
    return
  }
  const { scrollTop, scrollHeight, clientHeight } = mainElement.value
  const footerHeight = document.querySelector('.footer')?.clientHeight ?? 0
  if (scrollTop + clientHeight + footerHeight + 200 >= scrollHeight) {
    if (showAddLoading.value === true) {
      console.log('❎ 达到底部，已经发起过请求下一页')
    } else {
      console.log('✅ 达到底部，加载下一页')
      nextPage()
    }
  }
}

const nextPage = () => {
  if (isground.value) return
  pageData.value.currentPage++
  getData('add')
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  margin-top: 16px;
}

.wrap {
  background: #fff;

  .more {
    padding-bottom: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;

    .more-wrap {
      width: 140px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      cursor: pointer;

      > span {
        margin-right: 10px;
      }
    }
  }
}

.searchImage {
  width: 50px;
  vertical-align: middle;
  max-height: 100%;
  box-sizing: border-box;
  padding: 2px;
}

.empty-view {
  position: relative;
  top: -80px;

  .empty-img {
    :deep(.el-empty__image) {
      width: 400px;
      height: 400px;
    }
  }

  .button {
    height: 44px;
    min-width: 240px;
  }
}
</style>
