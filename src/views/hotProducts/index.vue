<template>
  <div class="page">
    <div class="header" :class="bannerData[productType].classname">
      <div class="header-title">
        <img :src="bannerData[productType].icon" alt="" />
        <span style="margin-left: 3px"
          >{{ bannerData[productType].title }}
        </span>
      </div>
    </div>

    <div class="wrap" id="wrap">
      <recommended-product
        :grid="{
          columns: 6,
          width: '15.5%'
        }"
        :hideHeader="true"
        :recommendList="recommendList"
        :addCount="pageData.pageSize"
        :showAddLoading="showAddLoading"
        styleType="productDetail"
      >
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
        <div v-else>{{ $t('nomoredata') }}...</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import RecommendedProduct from '@/views/home/components/recommendedProduct.vue'
import { getHotProductData } from '@/api/goods'
import { GlobalStore } from '@/store/modules/global'
import { useRoute } from 'vue-router'
import { loginEventBus, randomLinksValue } from '@/utils/common.ts'
import EmptyData from '@/assets/images/empty_data.svg'
import { useUser } from '@/store/modules/user.ts'
import vipIcon1 from '@/assets/images/vipicon1.png'
import vipIcon2 from '@/assets/images/vipicon2.png'
import vipIcon3 from '@/assets/images/vipicon3.png'
import { getMemberVo } from '@/api/user/index'

defineOptions({
  name: 'HotProducts'
})

const backImg = ref({
  recommend: `url(https://static.hzpdex.com/web/home_recommend_bg.png)`,
  winning: `url(http://static.hzpdex.com/web/1715322905233_home_winning_bg.png)`,
  top: `url(http://static.hzpdex.com/web/1715323085648_home_top_bg.png)`,
  find: `url(https://static.hzpdex.com/web/home_find_bg.png)`
})

const $t: any = inject('$t')
const globalStore = GlobalStore()

const route = useRoute()

const showAddLoading = ref(false)
// 是否加载完成所有数据
const isground = ref(false)

const recommendList = ref([])

// 分页
const pageData = ref({
  currentPage: 1,
  pageSize: 30,
  total: 0
})

const enableAutoLoadNextPage = ref(true)

const updateAutoLoadStatus = () => {
  if (pageData.value.currentPage > 3 || isground.value === true) {
    enableAutoLoadNextPage.value = false
  } else {
    enableAutoLoadNextPage.value = true
  }
}

const bannerData = ref([
  {
    // find
    icon: vipIcon1,
    title: $t('findproducts'),
    classname: 'find-header'
  },
  {
    // winning
    icon: vipIcon2,
    title: $t('winningproducts'),
    classname: 'winning-header'
  },
  {
    // top
    icon: vipIcon3,
    title: $t('uastop100'),
    classname: 'top-header'
  }
])

// 处理 多语言
watch(
  () => globalStore.language,
  () => {
    bannerData.value[0].title = $t('findproducts')
    bannerData.value[1].title = $t('winningproducts')
    bannerData.value[2].title = $t('uastop100')
  },
  {
    deep: true
  }
)

// 爆款接口，等待 对接
const getHotData = () => {
  const postData = {
    hotType: Number(productType.value),
    isVip: memberInfo?.value?.GradeId ?? 1,
    platform: 2,
    country: globalStore.language,
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    vipLevel: memberInfo?.value?.GradeId
  }
  showAddLoading.value = true
  getHotProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      showAddLoading.value = false
      pageData.value.currentPage = res.data.current
      pageData.value.total = res.data.total
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })

      handleGrade(res)
      updateAutoLoadStatus()
    })
    .catch(() => {
      showAddLoading.value = false
    })
}

// 处理会员等级权限
const handleGrade = (res: any) => {
  // 处理 会员等级 权限
  const GradeId = memberInfo?.value?.GradeId ?? 1
  recommendList.value = recommendList.value.concat(res.data.records)
  // Find Products
  if (productType.value === '0') {
    // 所有 用户 都有权限观看
    if (recommendList.value.length >= res.data.total) {
      isground.value = true
    }
  }

  // Winning Products
  if (productType.value === '1') {
    // vip2 和 vip3 可以看
    if (GradeId >= 2) {
      recommendList.value = recommendList.value.map((item) => {
        return {
          ...item,
          showMask: false
        }
      })
    } else {
      recommendList.value = recommendList.value.map((item) => {
        return {
          ...item,
          showMask: true
        }
      })
    }

    if (recommendList.value.length >= res.data.total) {
      isground.value = true
    }
  }

  // USEdrop Top100
  if (productType.value === '2') {
    // vip3 可以看
    if (GradeId >= 3) {
      recommendList.value = recommendList.value.map((item, index) => {
        return {
          ...item,
          showMask: false
        }
      })
    } else {
      recommendList.value = recommendList.value.map((item, index) => {
        return {
          ...item,
          showMask: true
        }
      })
    }
    if (recommendList.value.length >= 100) {
      recommendList.value.length = 100
      isground.value = true
    }
  }
}

watch(
  () => globalStore.language,
  () => {
    recommendList.value = []
    // getData('init')
    getHotData()
  },
  {
    deep: true
  }
)

const loadMore = () => {
  pageData.value.currentPage++
  // getData('add')
  getHotData()
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

const mainElement = ref(null)

const productType = ref<any>('0')

const memberInfo = ref({
  //税费
  TaxRate: 0,
  GradeId: 0,
  //会员折扣
  MallDiscountRate: 0
})
onMounted(async () => {
  productType.value = route.query.type
  scrollToTop()
  const isLoggedIn = useUser().state.isLoggedIn

  if (isLoggedIn) {
    const res = await getMemberVo()
    memberInfo.value = res.data
    getHotData()
  } else {
    // 未登录用户
    getHotData()
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
  // getData('add')
  getHotData()
}
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 106px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  padding: 0 47px 0 24px;
  box-sizing: border-box;

  .header-title {
    font-size: 32px;
    display: flex;
    align-items: center;
    color: #15104b;
    font-weight: 600;
    color: #fff;

    img {
      width: 64px;
      height: 64px;
    }
  }
}

.recommend-header {
  background-image: v-bind('backImg.recommend');
  background-size: 100% 100%;
}

.find-header {
  background-image: v-bind('backImg.find');
  background-size: 100% 100%;
}

.winning-header {
  background-image: v-bind('backImg.winning');
  background-size: 100% 100%;
}

.top-header {
  background-image: v-bind('backImg.top');
  background-size: 100% 100%;
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
