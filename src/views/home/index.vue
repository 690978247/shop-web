<template>
  <div class="page">
    <!-- banner 区域 -->
    <!-- <Banner class="page-banner" :skeletonLoading="skeletonLoading" /> -->
    <newBanner class="page-banner" />

    <!-- find区域 -->
    <!-- <div class="page-recommended">
      <template v-if="!skeletonLoading">
        <div class="header find-header">
          <div class="header-title">
            <img :src="vipIcon1" alt="" />
            <span style="margin-left: 3px">{{ $t('findproducts') }} </span>
          </div>
          <div class="header-more" @click="handleViewMore('0')">
            <span>{{ $t('viewmore') }}</span>
            <span class="header-more-arrow">>></span>
          </div>
        </div>
      </template>
      <template v-else>
        <home-title-skeleton />
      </template>
      <recommended-product
        :recommendList="findData"
        :showAddLoading="false"
        :addCount="pageData.pageSize"
        :hideHeader="true"
        :grid="{
          columns: 6,
          width: '15.5%'
        }"
        @viewDetail="viewDetail('0')"
        @didListClick="didListClick($event, '0')"
        @didConnectClick="didConnectClick($event, '0')"
        styleType="productDetail"
      >
      </recommended-product>
    </div> -->

    <!-- 等级权限区域  winning/top100 -->
    <!-- <div class="page-recommended page-grade">
      <div class="grade-lt">
        <template v-if="!skeletonLoading">
          <div class="header winning-header">
            <div class="header-title">
              <img :src="vipIcon2" alt="" />
              <span style="margin-left: 3px">{{ $t('winningproducts') }} </span>
            </div>

            <div class="header-more grade-more" @click="handleViewMore('1')">
              <span>{{
                memberInfo.GradeId < 2
                  ? membershipVisibility()
                    ? $t('unlocknow')
                    : $t('viewmore')
                  : $t('viewmore')
              }}</span>
              <span class="header-more-arrow">>></span>
            </div>
          </div>
        </template>
        <template v-else>
          <home-title-skeleton />
        </template>

        <recommended-product
          :recommendList="winningData"
          :showAddLoading="false"
          :addCount="pageData.pageSize"
          :hideHeader="true"
          :grid="{
            columns: 3,
            width: '31%'
          }"
          @viewDetail="viewDetail('1')"
          @didListClick="didListClick($event, '1')"
          @didConnectClick="didConnectClick($event, '1')"
          styleType="productDetail"
        >
        </recommended-product>
      </div>
      <div class="grade-rt">
        <template v-if="!skeletonLoading">
          <div class="header top-header">
            <div class="header-title">
              <img :src="vipIcon3" alt="" />
              <span style="margin-left: 3px">{{ $t('uastop100') }} </span>
            </div>

            <div class="header-more grade-more" @click="handleViewMore('2')">
              <span>{{
                memberInfo.GradeId < 3
                  ? membershipVisibility()
                    ? $t('unlocknow')
                    : $t('viewmore')
                  : $t('viewmore')
              }}</span>
              <span class="header-more-arrow">>></span>
            </div>
          </div>
        </template>
        <template v-else>
          <home-title-skeleton />
        </template>

        <recommended-product
          :recommendList="topData"
          :showAddLoading="false"
          :addCount="pageData.pageSize"
          :hideHeader="true"
          :grid="{
            columns: 3,
            width: '31%'
          }"
          @viewDetail="viewDetail('2')"
          @didListClick="didListClick($event, '2')"
          @didConnectClick="didConnectClick($event, '2')"
          styleType="productDetail"
        >
        </recommended-product>
      </div>
    </div> -->

    <!-- Recommended Product 区域 -->
    <!-- <div class="page-recommended">
      <template v-if="!skeletonLoading">
        <div class="header recommend-header">
          <div class="header-title">
            <img :src="RecommendIcon" alt="" />
            <span style="margin-left: 3px"
              >{{ $t('recommendedproducts') }}
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <home-title-skeleton />
      </template>
      <recommended-product
        :recommendList="recommendList"
        :showAddLoading="showAddLoading"
        :addCount="pageData.pageSize"
        :hideHeader="true"
        :grid="{
          columns: 6,
          width: '15.5%'
        }"
        @viewDetail="viewDetail('0')"
        @didListClick="didListClick($event, '0')"
        @didConnectClick="didConnectClick($event, '0')"
        styleType="productDetail"
      >
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
    </div> -->

    <!-- top100  -->
    <Top100
      class="page-top100"
      :memberInfo="memberInfo"
      v-if="memberInfo.asyncLoad"
    />

    <!-- winner -->
    <Winner
      class="page-winner"
      :memberInfo="memberInfo"
      v-if="memberInfo.asyncLoad"
    />

    <!-- platform -->
    <Platform
      class="page-platform"
      :memberInfo="memberInfo"
      v-if="memberInfo.asyncLoad"
    />

    <!-- 会员提示弹窗 -->
    <!-- <memberTips
      v-model:visible="memberVisible"
      :title="memberTitle"
      @confirm="memberConfirm"
    /> -->
  </div>
  <!-- Recommend -->
  <Recommend
    class="page-recommend"
    :memberInfo="memberInfo"
    v-if="memberInfo.asyncLoad"
  />
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { membershipVisibility } from '@/utils/common'
import { getHotProductData, getProductData } from '@/api/goods'
// import Banner from './components/banner.vue'
import newBanner from './components/newBanner.vue'
import { GlobalStore } from '@/store/modules/global'
import {
  loginEventBus,
  memberUpgradeConfirm,
  randomLinksValue
} from '@/utils/common.ts'
import { getMemberVo } from '@/api/user/index'
// import memberTips from './components/memberTips.vue'
// import RecommendIcon from '@/assets/images/home_recommend_icon.png'
// import vipIcon1 from '@/assets/images/vipicon1.png'
// import vipIcon2 from '@/assets/images/vipicon2.png'
// import vipIcon3 from '@/assets/images/vipicon3.png'
// import RecommendedProduct from '@/views/home/components/recommendedProduct.vue'
// import homeTitleSkeleton from './components/homeTitleSkeleton.vue'
import router from '@/utils'
import Top100 from './components/top100.vue'
import Winner from './components/winner.vue'
import Platform from './components/platform.vue'
import Recommend from './components/recommend.vue'
import { useUser } from '@/store/modules/user'

defineOptions({
  name: 'Home'
})

const globalStore = GlobalStore()

const backImg = ref({
  recommend: `url(https://static.hzpdex.com/web/home_recommend_bg.png)`,
  winning: `url(https://static.hzpdex.com/web/home_winning_bg.png)`,
  top: `url(https://static.hzpdex.com/web/home_top_bg.png)`,
  find: `url(https://static.hzpdex.com/web/home_find_bg.png)`
})
const skeletonLoading = ref(true)
const isground = ref(false)
const recommendList = ref([])
const showAddLoading = ref(false)
const pageData = ref({
  currentPage: 1,
  pageSize: 30,
  total: 0
})

const memberInfo = ref({
  GradeId: 1,
  asyncLoad: false
})

// 爆款接口，等待 对接
const getHotData = (grade: number, tabType: string, size: number) => {
  // GradeId   1 普通   2 pro    3 plus
  // tabType   0 find  1 winning 2 top
  const postData = {
    hotType: Number(tabType),
    isVip: grade,
    platform: 2,
    country: globalStore.language,
    pageNum: 1,
    size: size,
    vipLevel: memberInfo.value.GradeId
  }
  showAddLoading.value = true
  getHotProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      skeletonLoading.value = false
      showAddLoading.value = false
      // pageData.value.currentPage = res.data.current
      // pageData.value.total = res.data.total
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })

      handleHotData(grade, res)

      // handleGrade(res)
    })
    .catch(() => {
      skeletonLoading.value = false
      showAddLoading.value = false
    })
}

const findData = ref([])
const winningData = ref([])
const topData = ref([])

const handleHotData = (grade: number, res: any) => {
  // 处理 会员等级 权限

  if (grade === 1) {
    if (grade <= memberInfo.value.GradeId) {
      findData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: false
        }
      })
    } else {
      findData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: true
        }
      })
    }
  }

  if (grade === 2) {
    if (grade <= memberInfo.value.GradeId) {
      winningData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: false
        }
      })
    } else {
      winningData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: true
        }
      })
    }
  }

  if (grade === 3) {
    if (grade <= memberInfo.value.GradeId) {
      topData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: false
        }
      })
    } else {
      topData.value = res.data.records.map((item: any) => {
        return {
          ...item,
          showMask: true
        }
      })
    }
  }
}

const handleViewMore = (type: string) => {
  // 0:find 1:winning 2:top
  // 1, 2 需要是否有跳转判断权限
  if (membershipVisibility()) {
    if (type === '1') {
      if (memberInfo.value.GradeId < 2) {
        viewDetail('1')
        return
      }
    }

    if (type === '2') {
      if (memberInfo.value.GradeId < 3) {
        viewDetail('2')
        return
      }
    }
  }

  router.push({
    name: 'HotProducts',
    query: {
      type
    }
  })
}

const memberVisible = ref(false)
const memberTitle = ref('')
// 查看跳转
const viewDetail = (type: string) => {
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    loginEventBus.emit()
    return
  }

  if (membershipVisibility()) {
    if (type === '1') {
      memberTitle.value = 'Get Pro Plan for more features'
      if (memberInfo.value.GradeId <= 1) {
        memberVisible.value = true
      }
    }
    if (type === '2') {
      memberTitle.value =
        'Upgrade to the Plus Plan for full access to all features'
      if (memberInfo.value.GradeId <= 2) {
        memberVisible.value = true
      }
    }
  }
}

const memberConfirm = () => {
  memberUpgradeConfirm()
}

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
  const postData = {
    pageNum: pageData.value.currentPage,
    size: pageData.value.pageSize,
    keyword: '',
    vipLevel: memberInfo.value.GradeId
  }
  showAddLoading.value = true
  getProductData(postData)
    .then((res: any) => {
      res.data.records = res.data.records ?? []
      // 打乱顺序
      if (res.data.records.length >= 2) {
        res.data.records = shuffleArray(res.data.records)
      }
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
    // getHotData()
  },
  {
    deep: true
  }
)

const mainElement = ref(null)

const getGradeData = () => {
  // GradeId   1 普通   2 pro    3 plus
  // tabType   0 find  1 winning 2 top
  getHotData(1, '0', 6)
  getHotData(2, '1', 3)
  getHotData(3, '2', 3)
}

const handleUrlParams = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const code = searchParams.get('d') || ''
  const pid = searchParams.get('pid') || ''
  if (code) {
    localStorage.setItem('invitecode', code.toString())

    // 当code存在，pid 存在。存储pid 并且跳转详情页
    if (pid) {
      localStorage.setItem('pid', pid.toString())
      router.push(`/productDetail/v2/${pid}`)
    } else {
      // 不存在 清除shopPid
      localStorage.setItem('pid', pid.toString())
    }
  }
}

const showRegister = () => {
  const userInfo = localStorage.getItem('userInfo') ?? ''
  if (!userInfo) {
    // no register
    useUser().startRegisterTimer()
  } else {
    useUser().clearTimer()
  }
}

watch(
  () => useUser().state.registerOpen,
  (open) => {
    if (open) {
      useUser().clearTimer()
    } else {
      showRegister()
    }
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(async () => {
  // getData('init')
  const userInfo = localStorage.getItem('userInfo') ?? ''
  handleUrlParams()
  if (userInfo) {
    // 已登录用户, 需要先获取权限
    const res = await getMemberVo()
    memberInfo.value = res.data
  }
  memberInfo.value.asyncLoad = true
  // getData('init')
})

const didListClick = (item: any, type: string) => {
  if (!item.showMask) {
    return
  }
  viewDetail(type)
}
const didConnectClick = (item: any, type: string) => {
  if (!item.showMask) {
    return
  }
  viewDetail(type)
}
</script>

<style lang="scss" scoped>
.page-banner {
  margin-top: 24px;
  width: 100%;
  height: 552px;
}

.page-hot {
  margin-top: 20px;
  height: 480px;
}

.page-grade {
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
  background-color: transparent !important;
  display: flex;
  overflow: hidden;
  justify-content: space-around;

  .grade-lt,
  .grade-rt {
    width: 0;
    flex: 1;
    background-color: #fff;
    box-shadow: 0px 4px 16px 0px #0000001a;
  }

  > div + div {
    margin-left: 35px;
  }
}

.page-recommended {
  margin-top: 20px;
  box-sizing: border-box;
  background-color: #fff;

  .header {
    width: 100%;
    height: 106px;
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

    .header-more {
      color: #fff;
      font-size: 22px;
      cursor: pointer;
      background-color: #bc0c34;
      border-radius: 30px;
      padding: 8px 30px;
      box-shadow: 0px 2px 16px 0px #00226de5;

      :hover {
        font-weight: 600;
      }

      .header-more-arrow {
        margin-left: 10px;
        font-size: 18px;
      }
    }

    .grade-more {
      color: #bc0c34;
      background-color: #fff;
      box-shadow: 0px 2px 16px 0px #c00a31;
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

/*  */
.page-top100,
.page-winner,
.page-platform,
.page-recommend {
  margin-top: 20px;
}
</style>
