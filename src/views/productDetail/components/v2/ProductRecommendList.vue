<template>
  <!-- Recommended Product 区域 -->
  <div class="recommend">
    <div class="recommend-wrap">
      <div class="header">
        <el-image class="header-icon" :src="goodImg"></el-image>
        <span class="header-title">Recommended</span>
      </div>
      <div class="container">
        <recommend-pros
          :recommendList="recommendList"
          :showAddLoading="showAddLoading"
          :addCount="pageData.pageSize"
          :grid="{
            columns: 4,
            width: '24%'
          }"
        >
        </recommend-pros>
        <!-- 查看更多 -->
        <div class="more" v-if="enableAutoLoadNextPage === false">
          <div v-if="!isground" class="more-wrap" @click="loadMore">
            <span>Learn More</span>
            <el-icon class="icon-more">
              <ArrowDown />
            </el-icon>
          </div>
          <div v-else>{{ $t('nomoredata') }}...</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, PropType, ref, watch } from 'vue'
import { queryIndexRecommandList } from '@/api/goods'

import recommendPros from '@/views/home/components/recommendPros.vue'
import goodImg from '@/assets/images/home/good.svg'
import { GlobalStore } from '@/store/modules/global'
import { randomLinksValue } from '@/utils/common.ts'
import { TProductDetail } from '../../model/model'

defineOptions({
  name: 'ProductRecommendList'
})

const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true,
    default: () => {}
  },
  currentCountry: {
    type: String,
    required: true,
    default: ''
  },
  memberInfo: {
    type: Object,
    default: () => {}
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

const loadMore = () => {
  pageData.value.currentPage++
  getData('add')
}

const updateAutoLoadStatus = () => {
  if (pageData.value.currentPage > 3 || isground.value === true) {
    enableAutoLoadNextPage.value = false
  } else {
    enableAutoLoadNextPage.value = true
  }
}

const queryLastCategoryIdValue = () => {
  try {
    const listJSONStr: any = props.productData.categoryId
    const categoryIdList: any[] = JSON.parse(listJSONStr)
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
  const ids = JSON.parse(props?.productData?.categoryId) || ['']
  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    categoryId: queryLastCategoryIdValue(),
    // excludeOfferId: props.productData.offerId, //排除当前商品
    excludeGoodsCode: props.productData.goodsCode, //排除当前商品
    country: props.currentCountry,
    ecommercePlatform: props.memberInfo.MainPlatform,
    categoryIdList: /* JSON.parse(props.productData.categoryId) */ [ids[0]]
  }

  showAddLoading.value = true
  queryIndexRecommandList(postData)
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

const mainElement = ref(null)

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
</style>
