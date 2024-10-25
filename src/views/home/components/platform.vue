<template>
  <div>
    <div class="platform" v-if="!skeletonLoading">
      <div class="platform-wrap" v-for="(item, index) in items" :key="index">
        <div class="item-header">
          <div class="header-lt">
            <el-image :src="item.img" class="header-lt-img"> </el-image>
            <span class="header-lt-title">{{ item.name }}</span>
          </div>
          <div class="header-rt" @click="jumpDetail(item)">
            <div class="header-rt-icon">
              <el-icon><Right /></el-icon>
            </div>
          </div>
        </div>
        <div class="item-wrap">
          <div
            class="item-wrap-platform"
            v-for="(child, index) in item.list"
            @click="itemClick(child)"
            :key="index"
          >
            <!-- img-mask -->
            <div class="img-mask">
              <div class="footer">
                <el-tooltip
                  content="Connect"
                  placement="top"
                  :show-after="delayTime"
                >
                  <div @click.stop="connectData(child)">
                    <img :src="productStoreImg" alt="" />
                  </div>
                </el-tooltip>
                <el-tooltip
                  content="Import"
                  placement="top"
                  :show-after="delayTime"
                >
                  <div @click.stop="publishData(child)">
                    <img :src="productOrderImg" alt="" />
                  </div>
                </el-tooltip>
              </div>
            </div>
            <!-- wrap -->
            <div class="platform-image">
              <el-image
                class="platform-image-inner"
                :src="child.mainImage"
              ></el-image>
            </div>
            <div class="platfrm-info">
              <div class="platfrm-info-title">
                <el-text class="text" line-clamp="2">{{
                  productName(child)
                }}</el-text>
              </div>
              <div class="platfrm-info-price">
                <el-tooltip
                  content="View for quotation"
                  placement="top"
                  :show-after="delayTime"
                >
                  <div class="price">$ <span>??.??</span></div>
                  <!-- <div class="collect">
                <img :src="starImg" alt="" />
              </div> -->
                </el-tooltip>
                <div class="price-tip">join VIP to Unlock</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-skeleton v-else class="platform-skeleton" animated>
      <template #template>
        <div class="item-skeleton">
          <div class="header-skeleton">
            <el-skeleton-item variant="p" style="height: 45px; width: 60%" />
            <el-skeleton-item variant="p" style="height: 45px; width: 30%" />
          </div>
          <div class="wrap-skeleton">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
        <div class="item-skeleton">
          <div class="header-skeleton">
            <el-skeleton-item variant="p" style="height: 45px; width: 60%" />
            <el-skeleton-item variant="p" style="height: 45px; width: 30%" />
          </div>
          <div class="wrap-skeleton">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
        <div class="item-skeleton">
          <div class="header-skeleton">
            <el-skeleton-item variant="p" style="height: 45px; width: 60%" />
            <el-skeleton-item variant="p" style="height: 45px; width: 30%" />
          </div>
          <div class="wrap-skeleton">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </div>
        </div>
      </template>
    </el-skeleton>
    <memberTips
      v-model:visible="memberVisible"
      :title="memberTitle"
      @confirm="memberConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { getProductData } from '@/api/goods/index'
import { GlobalStore } from '@/store/modules/global.ts'
import {
  loginEventBus,
  go2UDProConnect,
  productPublish,
  memberUpgradeConfirm
} from '@/utils/common.ts'
import router from '@/utils'
import memberTips from './memberTips.vue'
import amazonImg from '@/assets/images/home/amazon.svg'
import aliexpressImg from '@/assets/images/home/aliexpress.svg'
import tiktokImg from '@/assets/images/home/tiktok.svg'
import productStoreImg from '@/assets/images/home/product-store.svg'
import productOrderImg from '@/assets/images/home/product-order.svg'

const props = defineProps({
  memberInfo: {
    type: Object,
    default: () => ({
      GradeId: 1
    })
  }
})
const $t: any = inject('$t')
const globalStore = GlobalStore()
const skeletonLoading = ref(false)

const delayTime = 300

const items = ref([
  {
    name: $t('amazonhotsale'),
    productCollection: 'AMAZON_HOT',
    img: amazonImg,
    list: []
  },
  {
    name: $t('aliexpresshotsale'),
    productCollection: 'ALI_EXPRESS_HOT',
    img: aliexpressImg,
    list: []
  },
  {
    name: $t('tikTokhotsale'),
    productCollection: 'TIKTOK_HOT',
    img: tiktokImg,
    list: []
  }
])

const memberConfirm = () => {
  memberUpgradeConfirm()
}

const productName = (item: any) => {
  const findTrans = item.goodsTransList?.find(
    (item: any) => item.country === globalStore.language
  )
  if (findTrans) {
    return findTrans.subjectTrans
  }
  return item.subject
}

const getHotItemData = (
  type: string,
  productCollection: string,
  size: number
) => {
  const postData = {
    pageNum: 1,
    size: size,
    keyword: '',
    productCollection,
    vipLevel: props.memberInfo.GradeId
  }
  skeletonLoading.value = true
  getProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      if (type === 'amazon') {
        items.value[0].list = res.data.records
      }
      if (type === 'aliexpress') {
        items.value[1].list = res.data.records
      }
      if (type === 'tiktok') {
        items.value[2].list = res.data.records
      }
      skeletonLoading.value = false
    })
    .catch(() => {
      skeletonLoading.value = false
    })
}

// 获取热搜数据
const getPlatformData = () => {
  // 获取Aliexpress hot style 数据
  getHotItemData('amazon', items.value[0].productCollection, 2)
  getHotItemData('aliexpress', items.value[1].productCollection, 2)
  getHotItemData('tiktok', items.value[2].productCollection, 2)
}

onMounted(() => {
  getPlatformData()
})

const memberVisible = ref(false)
const memberTitle = ref('')

const itemClick = (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    window.open(`/productDetail/v2/${itemData.goodsCode}`, '_blank')
  }
}

const connectData = (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    go2UDProConnect(itemData.goodsCode)
  }
}

const publishData = async (itemData: any) => {
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
  memberTitle.value = 'Upgrade to the Plus Plan for full access to all features'
  if (props.memberInfo.GradeId <= 2) {
    memberVisible.value = true
    return true
  }
  // 有权限
  return false
}

const jumpDetail = (itemData: any) => {
  const isShow = showPop()
  if (!isShow) {
    router.push({
      name: 'SearchDetail',
      query: {
        pct: itemData.productCollection
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.platform,
.platform-skeleton {
  width: 100%;
  height: 450px;
}

.platform {
  display: flex;
  > div {
    flex: 1;
    border-radius: 16px;
    box-sizing: border-box;
    padding: 30px;
    display: flex;
    flex-direction: column;
    & + div {
      margin-left: 20px;
    }
    &:nth-child(1n) {
      background-color: #fffaee;
    }
    &:nth-child(2n) {
      background-color: #fff3f0;
    }
    &:nth-child(3n) {
      background-color: #effeff;
    }
  }
  .item-header {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .header-lt {
      font-size: 24px;
      font-weight: 600;
      display: flex;
      align-items: center;
      .header-lt-img {
        width: 42px;
        height: 42px;
      }
      .header-lt-title {
        margin-left: 16px;
      }
    }
    .header-rt-icon {
      width: 30px;
      height: 30px;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .item-wrap {
    flex: 1;
    box-sizing: border-box;
    display: flex;
    min-height: 0;
    padding-top: 20px;
    > div.item-wrap-platform {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s; /* 上浮这个过程需要的时间 */
      box-sizing: border-box;
      position: relative;
      & + div {
        margin-left: 16px;
      }
      &:hover {
        transform: translate(0, -10px);
        .img-mask {
          opacity: 1;
        }
      }
      .img-mask {
        position: absolute;
        width: 100%;
        height: calc(100% - 110px);
        flex: 1;
        z-index: 2;
        box-sizing: border-box;
        // background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding-bottom: 16px;
        opacity: 0;
        transition: all 0.3s;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        .footer {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          > div {
            width: 40px;
            height: 40px;
            background-color: #fff;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            + div {
              margin-left: 24px;
            }
          }
        }
      }
    }

    .platform-image {
      flex: 1;
      min-height: 0;
      box-sizing: border-box;
      // padding: 20px 15px;
      // background-color: #fff;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
      .platform-image-inner {
        width: 100%;
        height: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
    .platfrm-info {
      height: 110px;
      box-sizing: border-box;
      min-height: 0;
      padding: 16px 12px 6px 12px;
    }
    .platfrm-info-title {
      color: #222;
      font-weight: 500;
      font-size: 16px;
      height: 44px;
    }
    .platfrm-info-price {
      margin-top: 10px;
      color: #bc0c34;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      .price {
        padding-right: 20px;
        > span {
          // vertical-align: middle;
        }
      }
      .price-tip {
        color: #bc0c34;
        font-weight: bold;
        font-size: 12px;
        display: flex;
        align-items: center;
      }
      // .collect {
      //   width: 28px;
      //   height: 28px;
      //   background: #e3edff;
      //   border-radius: 50%;
      //   display: flex;
      //   align-items: center;
      //   justify-content: center;
      // }
    }
  }
}

.platform-wrap {
  &:nth-child(1n) {
    .header-lt-title {
      color: #fab000;
    }
    .header-rt-icon {
      color: #bc0c34;
    }
    .item-wrap-platform {
      box-shadow: -5px 5px 0px 0 rgba(234, 219, 183, 0.8);
      background-color: #fff4da;
    }
  }
  &:nth-child(2n) {
    .header-lt-title {
      color: #e82f03;
    }
    .header-rt-icon {
      color: #0069ff;
    }
    .item-wrap-platform {
      box-shadow: -5px 5px 0px 0 rgba(235, 194, 185, 0.8);
      background-color: #ffe8e2;
    }
  }
  &:nth-child(3n) {
    .header-lt-title {
      color: #389b99;
    }
    .header-rt-icon {
      color: #44b0ae;
    }
    .item-wrap-platform {
      box-shadow: -5px 5px 0px 0 rgba(180, 229, 229, 0.8);
      background-color: #e2fdff;
    }
  }
}

/* 骨架屏 */
.platform-skeleton {
  display: flex;
  background-color: #fff;
  box-sizing: border-box;
  .item-skeleton {
    flex: 1;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    + .item-skeleton {
      margin-left: 20px;
    }
    .header-skeleton {
      height: 50px;
      display: flex;
      justify-content: space-between;
    }
    .wrap-skeleton {
      flex: 1;
      box-sizing: border-box;
      padding: 10px 0;
    }
  }
}
</style>
