<template>
  <!-- Recommended Product 区域 -->
  <div class="recommend">
    <div class="recommend-wrap">
      <div class="header">
        <el-image class="header-icon" :src="goodImg"></el-image>
        <span class="header-title">Recommended</span>
      </div>
      <div class="container">
        <div class="podList">
          <div v-for="item in recommendList" :key="item.id">
            <podProductItem :item="item" :showCollect="false" />
          </div>
        </div>

        <!-- 查看更多 -->
        <div class="more" v-if="enableAutoLoadNextPage === false">
          <div v-if="!isground" class="more-wrap" @click="loadMore">
            <span>Learn More</span>
            <el-icon class="icon-more">
              <ArrowDown />
            </el-icon>
          </div>
          <div v-else>{{ $t('podNoMoreData') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getPODRecommend } from '@/api/pod'
import { randomLinksValue } from '@/utils/common.ts'
import podProductItem from '@/views/pod/components/podProductItem.vue'
import goodImg from '@/assets/images/home/good.svg'
import { GlobalStore } from '@/store/modules/global'

const props = defineProps({
  productData: {
    type: Object,
    required: true,
    default: () => {}
  },
  currentCountry: {
    type: String,
    required: true,
    default: ''
  }
})

const globalStore = GlobalStore()

const skeletonLoading = ref(true)
const isground = ref(false)
const recommendList = ref([])
const showAddLoading = ref(false)
const enableAutoLoadNextPage = ref(true)

const pageData = ref({
  currentPage: 1,
  pageSize: 32,
  total: 0
})

const updateAutoLoadStatus = () => {
  if (pageData.value.currentPage > 3 || isground.value === true) {
    enableAutoLoadNextPage.value = false
  } else {
    enableAutoLoadNextPage.value = true
  }
}

const queryLastCategoryIdValue = () => {
  try {
    const categoryIdList = props.productData.categoryIdList || []
    const lastCategoryId = categoryIdList[categoryIdList.length - 1]
    return lastCategoryId
  } catch (error) {
    return ''
  }
}

const getData = (type: 'init' | 'add') => {
  if (!props.productData?.goodsCode) {
    return
  }
  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    categoryId: queryLastCategoryIdValue(),
    // goodsCodeList: [],
    // isHot: 0,
    // isRecommend: 1,
    // excludeOfferId: props.productData.offerId, //排除当前商品
    excludeGoodsCode: props.productData.goodsCode, //排除当前商品
    country: props.currentCountry
  }

  showAddLoading.value = true
  getPODRecommend(postData)
    .then((res: any) => {
      res.data.records = res.data.records ?? []
      skeletonLoading.value = false
      showAddLoading.value = false
      pageData.value.currentPage = res.data.current
      pageData.value.total = res.data.total
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })
      if (type === 'init') {
        recommendList.value = res.data.records
      }
      if (type === 'add') {
        recommendList.value = recommendList.value.concat(res.data.records)
      }
      isground.value = res.data.records.length < res.data.size
      updateAutoLoadStatus()
    })
    .catch(() => {
      skeletonLoading.value = false
      showAddLoading.value = false
    })
}

const loadMore = () => {
  pageData.value.currentPage++
  getData('add')
}

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

watch(
  () => props.currentCountry,
  () => {
    getData('init')
  },
  {
    deep: true
  }
)
watch(
  () => props.productData?.goodsCode,
  () => {
    recommendList.value = []
    getData('init')
  }
)

const mainElement = ref(null)

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

onMounted(async () => {
  getData('init')
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
</script>

<style lang="scss" scoped>
.recommend {
  width: 100%;
  min-height: 500px;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  background: linear-gradient(180deg, #e3edff 0%, #ffffff 21.15%);
}

.recommend-wrap {
  width: 1560px;
  margin: 0 auto;
  padding: 40px 0;
  box-sizing: border-box;
  .header {
    border-bottom: 1px dashed #999999;
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    .header-icon {
      width: 62px;
      height: 62px;
    }
    .header-title {
      color: #bc0c34;
      font-size: 40px;
      font-weight: 600;
      margin-left: 32px;
    }
  }
  .container {
    padding-top: 40px;
  }
  .more {
    height: 40px;
    padding-top: 50px;
    padding-bottom: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #222222;
    background-color: #fff;

    .more-wrap {
      width: 240px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 32px;
      font-weight: 600;
      cursor: pointer;
      .icon-more {
        color: #bc0c34;
        font-size: 24px;
      }
    }
  }
}

.podList {
  width: 110%;
  padding: 10px 10% 10px 4px;
  overflow: auto;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(4, 24%);
  grid-column-gap: 20px;
  grid-row-gap: 24px;

  .podSkeleton {
    background: #fff;
    width: 270px;

    .podSkeletonItem {
      width: 270px;
      height: 270px;
    }

    .podSkeletonItemBottom {
      height: 100px;
      display: flex;
      flex-direction: column;
      background: #fff;
      align-items: flex-start;
      justify-content: center;
    }
  }
}
</style>
