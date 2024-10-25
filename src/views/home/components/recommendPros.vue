<template>
  <div class="wrap-recommended" :style-type="styleType">
    <div class="content">
      <div class="item" v-for="item in recommendList" :key="item.goodsCode">
        <div
          class="item-wrap"
          @click="item.showMask ? viewDetail(item) : onGo2Detail(item)"
        >
          <!-- flag标识 -->
          <!-- <div class="item-flag">
            <span>New</span>
          </div> -->
          <!-- img-mask -->
          <div class="img-mask">
            <div class="footer">
              <div @click.stop="connectData(item)">
                <el-tooltip
                  content="Connect"
                  placement="top"
                  :show-after="delayTime"
                >
                  <img :src="productStoreImg" alt="" />
                </el-tooltip>
              </div>
              <div @click.stop="publishData(item)">
                <el-tooltip
                  content="Import"
                  placement="top"
                  :show-after="delayTime"
                >
                  <img :src="productOrderImg" alt="" />
                </el-tooltip>
              </div>
            </div>
          </div>
          <el-image class="item-img" :src="getProductMainImage(item)" />
          <div class="item-info">
            <el-text class="text" line-clamp="2">{{
              productName(item)
            }}</el-text>
            <div class="list">{{ $t('lists') }}: {{ item.listsValue }}</div>
            <div class="money">
              <template v-if="!item.showMask">
                <!-- {{ item.unit || '$' }}{{ item.minPrice }} -->
                <el-tooltip
                  content="View for quotation"
                  placement="top"
                  :show-after="delayTime"
                >
                  <div class="price">$ <span>??.??</span></div>
                </el-tooltip>
                <div class="price-tip">join VIP to Unlock</div>
                <!-- <div class="collect">
                  <img :src="starImg" alt="" />
                </div> -->
              </template>
            </div>
          </div>
          <!-- <div class="btn-group">
            <el-button
              color="#bc0c34"
              class="recommend-btn connect-btn"
              style="background-color: #fff; color: #bc0c34"
              plain
              @click.stop="connectData(item)"
              >{{ $t('connect') }}
            </el-button>
            <el-button
              class="recommend-btn"
              :loading="loadingId === item.goodsCode"
              color="#bc0c34"
              @click.stop="publishData(item)"
              >{{ $t('list') }}
            </el-button>
          </div> -->
        </div>
      </div>

      <div class="line-item" v-if="showAddLoading">
        <el-skeleton animated class="line-item-skeleton">
          <template #template>
            <el-skeleton-item class="item-img" variant="image" />
            <div class="item-info">
              <el-skeleton-item class="info-line" variant="p" />
              <el-skeleton-item class="info-line" variant="p" />
            </div>
            <div class="btn-group">
              <el-skeleton-item class="btn-line-lf" variant="p" />
              <el-skeleton-item class="btn-line-rt" variant="p" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { go2UDProConnect, productPublish } from '@/utils/common.ts'
import { GlobalStore } from '@/store/modules/global.ts'
import { membershipVisibility } from '@/utils/common'
import starImg from '@/assets/images/home/star.svg'
import productStoreImg from '@/assets/images/home/product-store.svg'
import productOrderImg from '@/assets/images/home/product-order.svg'

const props = defineProps({
  skeletonLoading: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: '25.52083rem'
  },
  showAddLoading: {
    type: Boolean,
    default: false
  },
  addCount: {
    type: Number,
    default: 1
  },
  recommendList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  grid: {
    type: Object,
    default: () => ({
      columns: 6,
      width: '15.5%'
    })
  },
  styleType: {
    type: String,
    default: 'none' // 默认样式不改变
  }
})

const delayTime = 300

const getProductMainImage = (item: any) => {
  if (item && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0] || item.mainImage
  }
  return item?.mainImage || ''
}

const loadingId = ref()
const globalStore = GlobalStore()

onMounted(() => {})

const emits = defineEmits(['viewDetail', 'didConnectClick', 'didListClick'])

const viewDetail = (itemData: any) => {
  if (!membershipVisibility()) {
    onGo2Detail(itemData)
    return
  }
  emits('viewDetail')
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

// const router = useRouter()
const onGo2Detail = (item: any) => {
  window.open(`/productDetail/v2/${item.goodsCode}`, '_blank')
  // router.push({ name: 'ProductDetail', query: { id: item.offerId } })
}

// 刊登数据
const publishData = async (item: any) => {
  emits('didListClick', item)
  if (item.showMask) {
    return
  }
  loadingId.value = item.goodsCode
  await productPublish(item.goodsCode)
  loadingId.value = null
}
const connectData = async (item: any) => {
  emits('didConnectClick', item)
  if (item.showMask) {
    return
  }
  go2UDProConnect(item.goodsCode)
}
</script>
<style lang="scss" scoped>
.wrap-recommended {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  box-sizing: border-box;
  .content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: grid;
    // padding: 24px 10px 24px 16px;
    // grid-template-columns: var(--grid-template-columns, repeat(9, 10%));
    grid-template-columns: repeat(
      v-bind('props.grid.columns'),
      v-bind('props.grid.width')
    );
    grid-column-gap: 20px;
    grid-row-gap: 24px;
    .item,
    .line-item {
      height: v-bind('props.height');
      min-height: 0;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid #dddddd;
      border-radius: 8px;
      .item-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        .img-mask {
          position: absolute;
          width: 100%;
          height: calc(100% - 136px);
          flex: 1;
          border-radius: 8px;
          z-index: 2;
          box-sizing: border-box;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          padding-bottom: 16px;
          opacity: 0;
          transition: all 0.3s;
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

        .item-flag {
          position: absolute;
          left: 0;
          top: -5px;
          width: 50px;
          height: 48px;
          line-height: 44px;
          padding-left: 7px;
          box-sizing: border-box;
          z-index: 3;
          font-size: 14px;
          color: #fff;
          background-image: url('@/assets/images/home/flag.svg');
          background-repeat: no-repeat;
        }
      }

      .line-item-skeleton {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .item-img {
        flex: 1;
        border-radius: 8px;
      }

      .item-info {
        width: 100%;
        height: 136px;
        padding-top: 16px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .text {
          color: #333333;
          font-size: 20px;
          line-height: 26px;
          font-weight: 600;
          height: 55px;
          align-self: flex-start;
        }

        .list {
          font-weight: 400;
          color: #666;
        }

        .money {
          font-size: 16px;
          display: flex;
          justify-content: space-between;
          .price {
            font-size: 24px;
            color: #bc0c34;
            font-weight: bold;
            padding-right: 30px;
            > span {
              // vertical-align: middle;
            }
          }
          .price-tip {
            color: #bc0c34;
            font-weight: bold;
            font-size: 18px;
            display: flex;
            align-items: center;
          }
        }

        .collect {
          width: 32px;
          height: 32px;
          background: #e3edff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .btn-group {
        display: flex;
        justify-content: space-between;

        .recommend-btn {
          width: 100px;
          height: 24px;
          font-size: 12px;
          border-radius: 50px;
        }
        .connect-btn:hover {
          background-color: #ffdde5 !important;
          border-color: #ffdde5;
        }
      }
    }

    .item {
      cursor: pointer;
      transition: all 0.3s; /* 上浮这个过程需要的时间 */
      position: relative;

      .item-mask {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        background-color: #fff;
        display: flex;
        flex-direction: column;

        .mask-img {
          padding: 20px;

          > .inner_img {
            width: 100%;
            height: 100%;
            filter: blur(18px);
          }
        }

        .mask-btns {
          display: inline-flex;
          flex: 1;
          justify-content: center;
          align-items: flex-end;
          padding-bottom: 20px;

          .btn-item {
            width: 180px;
            font-size: 16px;
            border-radius: 20px;
          }
        }
      }

      &:hover {
        transform: translate(0, -10px);
        box-shadow: 0 2px 8px 0 #00000026;

        .img-mask {
          opacity: 1;
          transition: all 0.3s;
        }
      }
    }
  }

  // 骨架屏
  .header-box {
    height: 40px;
    display: flex;
    justify-content: space-between;

    .line-lf {
      width: 300px;
      height: 100%;
    }

    .line-rt {
      width: 160px;
      height: 100%;
    }
  }

  .content {
    .line-info {
      margin: 10px 0;
      height: 20px;
    }

    .btn-line-lf {
      width: 45%;
    }

    .btn-line-rt {
      width: 45%;
    }
  }
}
</style>
