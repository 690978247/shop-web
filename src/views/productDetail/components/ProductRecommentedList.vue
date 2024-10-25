<template>
  <div>
    <!-- Recommended Product 区域 -->
    <div class="page-recommended">
      <recommended-product
        :recommendList="recommendList"
        :showAddLoading="showAddLoading"
        :addCount="pageData.pageSize"
        styleType="productDetail"
      >
        <template #header>
          <!-- 插槽内容需要手动添加骨架屏 -->
          <template v-if="!skeletonLoading">
            <div class="header">
              <div class="header-title">
                <img :src="recommendImg" alt="" />
                <span style="margin-left: 3px"
                  >{{ $t('recommendedproducts') }}
                </span>
                <img :src="recommendImg" alt="" />
              </div>
            </div>
          </template>
          <template v-else>
            <div class="header">
              <el-skeleton animated>
                <template #template>
                  <div class="header-box">
                    <el-skeleton-item class="line-lf" variant="p" />
                  </div>
                </template>
              </el-skeleton>
            </div>
          </template>
        </template>
      </recommended-product>
      <div class="more" v-if="enableAutoLoadNextPage === false">
        <div v-if="!isground" class="more-wrap" @click="loadMore">
          <span> {{ $t('viewmore') }}</span>
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <div v-else>{{ $t('nomoredata') }}...</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { queryRecommandList } from '@/api/goods'

import RecommendedProduct from '@/views/home/components/recommendedProduct.vue'
import recommendImg from '@/assets/images/recommend2.svg'
import { GlobalStore } from '@/store/modules/global'
import { randomLinksValue } from '@/utils/common.ts'
import { TProductDetail } from '../model/model'

defineOptions({
  name: 'Home'
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
  pageSize: 30,
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
  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    categoryId: queryLastCategoryIdValue(),
    // excludeOfferId: props.productData.offerId, //排除当前商品
    excludeGoodsCode: props.productData.goodsCode, //排除当前商品
    country: props.currentCountry
  }

  showAddLoading.value = true
  queryRecommandList(postData)
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
</script>

<style lang="scss" scoped>
.page-banner {
  margin-top: 24px;
  // width: 100%;
  height: 500px;
}

.page-hot {
  margin-top: 20px;
  height: 480px;
}

.page-recommended {
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #fff;

  .header {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .header-title {
      font-size: 24px;
      display: flex;
      align-items: center;
      color: #15104b;
      font-weight: 600;

      img {
        width: 24px;
        height: 24px;
      }
    }

    .header-more {
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  // 骨架屏
  .header-box {
    height: 40px;
    display: flex;
    justify-content: center;

    .line-lf {
      width: 300px;
      height: 100%;
    }

    .line-rt {
      width: 160px;
      height: 100%;
    }
  }

  .more {
    height: 40px;
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
</style>
