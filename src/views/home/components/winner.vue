<template>
  <div class="winner" v-if="!skeletonLoading">
    <div class="winner-lt">
      <div class="winner-lt-header">
        <div class="header-lt">
          <el-image :src="fireImg" class="header-lt-img"></el-image>
          <div class="header-title">
            <span>Winning</span>
            <span>Products</span>
          </div>
          <el-image
            :src="questionImg"
            class="question-img"
            @click="openMask"
          ></el-image>
        </div>
      </div>
      <div class="winner-lt-wrap">
        <recommend-pros
          :recommendList="leftData"
          :showAddLoading="showAddLoading"
          :addCount="3"
          height="20rem"
          :grid="{
            columns: 3,
            width: '32%'
          }"
        />
        <div class="img-mask" @click="showPop" v-if="memberInfo.GradeId < 2">
          <el-image :src="lockImg" class="lock-img"></el-image>
        </div>
      </div>
    </div>
    <div class="winner-rt">
      <div class="winner-rt-header">
        <div class="header-rt-wrap" @click="jumpDetail">
          <span>{{
            memberInfo.GradeId < 2 ? $t('unlocknow') : $t('viewmore')
          }}</span>
          <span class="header-rt-icon">
            <el-icon style="color: red"><Right /></el-icon>
          </span>
        </div>
      </div>
      <div class="winner-rt-wrap">
        <winnerCarousel
          :data="rightData"
          @didConnectClick="didConnectClick"
          @didItemClick="didItemClick"
          @didPublishClick="didPublishClick"
        />
      </div>
    </div>
    <!-- mask -->
    <Transition name="winner">
      <div class="winner-mask" v-if="showMask">
        <div class="header">
          <el-icon class="icon-close" @click="closeMask"><CloseBold /></el-icon>
        </div>
        <div class="wrap">
          <div class="title">Winning Product</div>
          <div class="info">
            Is Our Carefully Selected Top One Thousand Products, Which Will
            Fully Display The Sales Chart
          </div>
          <div class="pics">
            <div class="pics-1">
              <el-image :src="saleTrendsImg" class="pics-img"></el-image>
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
    <el-skeleton class="winner-skeleton" animated>
      <template #template>
        <div class="winner-header-skeleton">
          <el-skeleton-item variant="p" class="header-item header-item-1" />
          <el-skeleton-item variant="p" class="header-item header-item-2" />
        </div>
        <div class="winner-wrap-skeleton">
          <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
        </div>
      </template>
    </el-skeleton>
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getHotProductData } from '@/api/goods'
import { GlobalStore } from '@/store/modules/global'
import {
  randomLinksValue,
  memberUpgradeConfirm,
  loginEventBus,
  go2UDProConnect,
  productPublish
} from '@/utils/common.ts'
import recommendPros from '@/views/home/components/recommendPros.vue'
import winnerCarousel from './carousel/winnerCarousel.vue'
import memberTips from '../components/memberTips.vue'
import router from '@/utils'
import fireImg from '@/assets/images/home/winner.svg'
import lockImg from '@/assets/images/home/lock.svg'
import questionImg from '@/assets/images/home/question.svg'
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

const recommendList = ref([])
const showAddLoading = ref(false)
const getHotData = () => {
  // GradeId   1 普通   2 pro    3 plus
  // tabType   0 find  1 winning 2 top
  const postData = {
    hotType: 1,
    isVip: props.memberInfo.GradeId,
    platform: 2,
    country: globalStore.language,
    pageNum: 1,
    size: 6,
    vipLevel: props.memberInfo.GradeId
  }
  showAddLoading.value = true
  skeletonLoading.value = true
  getHotProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      skeletonLoading.value = false
      showAddLoading.value = false
      res.data.records.forEach((item: any) => {
        item.listsValue = randomLinksValue()
        item.showMask = false
      })

      if (props.memberInfo.GradeId < 2) {
        recommendList.value = res.data.records.map((item: any) => ({
          ...item,
          showMask: true
        }))
      } else {
        recommendList.value = res.data.records
      }
    })
    .catch(() => {
      skeletonLoading.value = false
      showAddLoading.value = false
    })
}

// 左边数据
const leftData = computed(() => {
  return recommendList.value.slice(0, 3)
})

// 右边数据
const rightData = computed(() => {
  return recommendList.value.slice(3, 6)
})

onMounted(() => {
  getHotData()
})

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

const didPublishClick = async (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    await productPublish(itemData.goodsCode)
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
  memberTitle.value = 'Get Pro Plan for more features'
  if (props.memberInfo.GradeId < 2) {
    memberVisible.value = true
    return true
  }
  // 有权限
  return false
}

const memberConfirm = () => {
  memberUpgradeConfirm()
}

const jumpDetail = () => {
  const isShow = showPop()
  if (!isShow) {
    router.push({
      name: 'HotProducts',
      query: {
        type: '1'
      }
    })
  }
}

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
.winner,
.winner-skeleton {
  width: 100%;
  height: 600px;
}
.winner {
  background-size: 100% 100%;
  background: linear-gradient(180deg, #e3edff 0%, #ffffff 21.15%);
  box-shadow: 0px 2px 16px 0px #0000001a;
  border-radius: 16px;
  display: flex;
  box-sizing: border-box;
  padding-left: 48px;
  position: relative;

  .winner-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 20;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    box-sizing: border-box;
    padding: 17px 25px 40px 25px;
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
        width: 80%;
        margin-top: 20px;
        font-size: 24px;
        line-height: 38px;
      }
      .pics {
        width: 100%;
        height: 210px;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        .pics-1 {
          width: 640px;
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

  .winner-lt {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    .winner-lt-header {
      width: 100%;
      height: 100px;
      min-height: 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      border-bottom: 1px dashed #999;

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
      }
      .header-title {
        margin: 0 25px;
        font-size: 40px;
        font-weight: 700;
        > span:first-child {
          color: #bc0c34;
          margin-right: 10px;
        }
        > span:last-child {
          color: #002969;
        }
        .question-img {
          width: 42px;
          height: 42px;
          cursor: pointer;
        }
      }
    }
    .winner-lt-wrap {
      flex: 1;
      box-sizing: border-box;
      padding: 60px 0 40px 0;
      display: flex;
      position: relative;
      min-height: 0;
      .lt-wrap-item {
        flex: 1;
        border: 1px solid #999;
        & + .lt-wrap-item {
          margin-left: 20px;
        }
      }
      .img-mask {
        position: absolute;
        width: 100%;
        height: calc(100% - 40px - 20px - 56px);
        top: 60px;
        left: -1px;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .lock-img {
          cursor: pointer;
        }
      }
    }
  }

  .winner-rt {
    width: 470px;
    height: 100%;
    background: linear-gradient(90deg, #ff5925 0%, #ff0d3c 92.08%);
    border-radius: 16px;
    margin-left: 40px;
    display: flex;
    flex-direction: column;
    .winner-rt-header {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      font-size: 32px;
      color: #fff;
      font-weight: 600;
      cursor: pointer;
      .header-rt-wrap {
        height: 40%;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
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
    .winner-rt-wrap {
      flex: 1;
      min-height: 0;
      box-sizing: border-box;
      padding: 10px 60px;
    }
  }
}

.winner-enter-active,
.winner-leave-active {
  transition: opacity 0.5s ease;
}

.winner-enter-from,
.winner-leave-to {
  opacity: 0;
}

/* 骨架屏 */
.winner-skeleton {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  flex-direction: column;
  .winner-header-skeleton {
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
  .winner-wrap-skeleton {
    flex: 1;
    box-sizing: border-box;
    padding: 20px;
  }
}
</style>
