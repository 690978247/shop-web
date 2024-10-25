<template>
  <div class="top100" v-if="!skeletonLoading">
    <div class="top100-header">
      <div class="header-lt">
        <el-image :src="fireImg" class="header-lt-img"></el-image>
        <div class="header-title">
          <span>Top <i>100</i></span>
          <span>Products</span>
        </div>
        <el-image
          :src="questionImg"
          class="question-img"
          @click="openMask"
        ></el-image>
      </div>
      <div class="header-rt">
        <div class="header-rt-wrap" @click="jumpDetail">
          <span>{{
            memberInfo.GradeId < 3 ? $t('unlocknow') : $t('viewmore')
          }}</span>
          <span class="header-rt-icon">
            <el-icon style="color: red"><Right /></el-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="top100-wrap">
      <div class="wrap-carousel">
        <top100-carousel
          :data="carouselData"
          @didConnectClick="didConnectClick"
          @didItemClick="didItemClick"
        />
      </div>
    </div>

    <!-- mask -->
    <Transition name="fade">
      <div class="top100-mask" v-if="showMask">
        <div class="header">
          <el-icon class="icon-close" @click="closeMask"><CloseBold /></el-icon>
        </div>
        <div class="wrap">
          <div class="title">Top 100 Products</div>
          <div class="info">
            It Is Our Carefully Selected Top 100 Most Popular Products.It Will
            Fully Display Sales Volume, Google Trends, YouTube, Tiktok, Facebook
            And Other Content
          </div>
          <div class="pics">
            <div class="pics-1">
              <el-image
                :src="saleTrendsImg"
                class="pics-img"
                @click="openMask"
              ></el-image>
            </div>
            <div class="pics-2">
              <el-image
                :src="platformTrendsImg"
                class="pics-img"
                @click="openMask"
              ></el-image>
            </div>
            <div class="pics-3">
              <el-image
                :src="googleTrendsImg"
                class="pics-img"
                @click="openMask"
              ></el-image>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-button
            class="footer-btn-lock"
            round
            color="#BC0C34"
            v-if="memberInfo.GradeId < 3"
            @click="jumpDetail"
            ><span>{{ $t('unlocknow') }}</span></el-button
          >
        </div>
      </div>
    </Transition>
    <memberTips
      v-model:visible="memberVisible"
      :title="memberTitle"
      @confirm="memberConfirm"
    />
  </div>
  <template v-else>
    <el-skeleton class="top100-skeleton" animated>
      <template #template>
        <div class="top100-header-skeleton">
          <el-skeleton-item variant="p" class="header-item header-item-1" />
          <el-skeleton-item variant="p" class="header-item header-item-2" />
        </div>
        <div class="top100-wrap-skeleton">
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </div>
      </template>
    </el-skeleton>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHotProductData } from '@/api/goods'
import { GlobalStore } from '@/store/modules/global'
import {
  randomLinksValue,
  memberUpgradeConfirm,
  loginEventBus,
  go2UDProConnect
} from '@/utils/common.ts'
import top100Carousel from './carousel/top100Carousel.vue'
import memberTips from '../components/memberTips.vue'
import router from '@/utils'
import fireImg from '@/assets/images/home/fire.svg'
import questionImg from '@/assets/images/home/question.svg'
import googleTrendsImg from '@/assets/images/home/google-trends.svg'
import platformTrendsImg from '@/assets/images/home/platform-trends.png'
import saleTrendsImg from '@/assets/images/home/sale-trends.png'

const props = defineProps({
  memberInfo: {
    type: Object,
    default: () => ({
      GradeId: 1
    })
  }
})

const globalStore = GlobalStore()
const skeletonLoading = ref(false)

const carouselData = ref([])
const getHotData = () => {
  // GradeId   1 普通   2 pro    3 plus
  // tabType   0 find  1 winning 2 top
  const postData = {
    hotType: 2,
    isVip: props.memberInfo.GradeId,
    platform: 2,
    country: globalStore.language,
    pageNum: 1,
    size: 6,
    vipLevel: props.memberInfo.GradeId
  }
  skeletonLoading.value = true
  getHotProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      skeletonLoading.value = false
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
      })
      carouselData.value = res.data.records
    })
    .catch(() => {
      skeletonLoading.value = false
    })
}

const jumpDetail = () => {
  const isShow = showPop()
  if (!isShow) {
    router.push({
      name: 'HotProducts',
      query: {
        type: '2'
      }
    })
  }
}

/* 弹窗 */
const memberVisible = ref(false)
const memberTitle = ref('')

const didConnectClick = (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    go2UDProConnect(itemData.goodsCode)
  }
}

const didItemClick = (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    window.open(`/productDetail/v2/${itemData.goodsCode}`, '_blank')
  }
}

// 弹窗权限
const showPop = () => {
  const userInfo = localStorage.getItem('userInfo') ?? ''
  // 权限限制 - 登录弹窗
  if (!userInfo) {
    loginEventBus.emit()
    return true
  }
  // 权限限制 - 升级弹窗
  memberTitle.value = 'Upgrade to the Plus Plan for full access to all features'
  if (props.memberInfo.GradeId <= 2) {
    memberVisible.value = true
    return true
  }
  // 有权限
  return false
}

const memberConfirm = () => {
  memberUpgradeConfirm()
}

onMounted(() => {
  getHotData()
})

/* mask */
const showMask = ref(false)

const openMask = () => {
  showMask.value = true
}

const closeMask = () => {
  showMask.value = false
}
</script>

<style lang="scss" scoped>
.top100,
.top100-skeleton {
  width: 100%;
  height: 640px;
}
.top100 {
  background-image: url('@/assets/images/home/too100-bg.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  position: relative;

  .top100-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    padding: 16px 80px 50px 80px;
    color: #fff;
    display: flex;
    flex-direction: column;
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .icon-close {
        font-size: 30px;
        color: #e61e25;
        padding: 4px;
        cursor: pointer;
      }
    }
    .wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      .title {
        font-size: 40px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .info {
        text-align: center;
        width: 60%;
        margin-top: 32px;
        font-size: 24px;
        line-height: 38px;
      }
      .pics {
        width: 100%;
        height: 160px;
        margin-top: 40px;
        display: flex;
        align-items: center;
        .pics-1 {
          flex: 1.5;
          height: 100%;
        }
        .pics-2 {
          flex: 1;
          margin-left: 20px;
          height: 100%;
        }
        .pics-3 {
          flex: 2;
          margin-left: 20px;
          height: 100%;
        }
        .pics-img {
          width: 100%;
          height: 100%;
          background-color: #fff;
        }
      }
    }
    .footer {
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;
      .footer-btn-lock {
        font-size: 24px;
        height: 50px;
        width: 240px;
      }
    }
  }
}

.top100-header {
  width: 100%;
  height: 110px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 48px;

  .header-lt {
    flex: 1;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .header-lt-img {
      width: 62px;
      height: 62px;
    }
    .header-title {
      margin: 0 25px;
      font-size: 40px;
      font-weight: 700;
      > span:first-child {
        color: #ff6a00;
        margin-right: 10px;
      }
    }
    .question-img {
      width: 42px;
      height: 42px;
      cursor: pointer;
    }
  }
  .header-rt {
    width: 490px;
    height: 100%;
    background-image: url('@/assets/images/home/top100-header-bg.png');
    background-size: 100% 83%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    color: #fff;
    font-size: 24px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 60px;
    .header-rt-wrap {
      height: 40%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      top: -10px;
    }
    .header-rt-icon {
      width: 46px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      background-color: #fff;
      margin-left: 20px;
    }
  }
}

.top100-wrap {
  flex: 1;
  background-image: url('@/assets/images/home/top100-wrap-bg.png');
  background-repeat: no-repeat;
  background-position: bottom 20px right;
  background-size: 100% 200px;
  .wrap-carousel {
    width: 100%;
    height: calc(100% - 100px);
    box-sizing: border-box;
    padding: 0 40px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 骨架屏 */
.top100-skeleton {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  flex-direction: column;
  .top100-header-skeleton {
    width: 100%;
    height: 120px;
    display: flex;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    justify-content: space-between;
    .header-item {
      width: 100%;
      height: 80%;
    }
    .header-item-1 {
      width: 60%;
    }
    .header-item-2 {
      width: 30%;
    }
  }
  .top100-wrap-skeleton {
    flex: 1;
    box-sizing: border-box;
    padding: 20px;
  }
}
</style>
