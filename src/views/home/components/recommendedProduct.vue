<template>
  <div class="wrap-recommended" :style-type="styleType">
    <div class="header" v-if="!hideHeader">
      <slot name="header">
        <span> {{ $t('recommendedproducts') }} </span>
      </slot>
    </div>
    <div class="content">
      <!-- <div class="item" v-for="item in recommendList" :key="item.goodsCode">
        <div @click="item.showMask ? viewDetail(item) : onGo2Detail(item)">
          <el-image class="item-img" :src="getProductMainImage(item)" />
          <div class="item-info">
            <el-text class="text" line-clamp="2">{{
              productName(item)
            }}</el-text>
            <div class="graycolor">
              {{ $t('lists') }}: {{ item.listsValue }}
            </div>
            <div class="money">
              <template v-if="!item.showMask">
                <el-tooltip
                  content="View for quotation"
                  placement="top"
                  :show-after="delayTime"
                >
                  <div class="price">$ <span>??.??</span></div>
                </el-tooltip>
              </template>
            </div>
          </div>
          <div class="btn-group">
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
          </div>
        </div>
      </div> -->

      <recommend-pros
        :recommendList="recommendList"
        :showAddLoading="showAddLoading"
        :addCount="1"
        :grid="{
          columns: 4,
          width: '24%'
        }"
      ></recommend-pros>

      <!-- <div class="line-item" v-if="showAddLoading">
        <el-skeleton animated>
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
      </div> -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { go2UDProConnect, productPublish } from '@/utils/common.ts'
import { GlobalStore } from '@/store/modules/global.ts'
import { membershipVisibility } from '@/utils/common'
import recommendPros from '@/views/home/components/recommendPros.vue'

const props = defineProps({
  skeletonLoading: {
    type: Boolean,
    default: false
  },
  showAddLoading: {
    type: Boolean,
    default: false
  },
  addCount: {
    type: Number,
    default: 1
  },
  hideHeader: {
    type: Boolean,
    default: false
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
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  background-color: #fff;

  .header {
    height: 72px;
    // border-bottom: 1px solid #e9e9ec;
    padding: 0 16px;
    display: flex;
    font-size: 24px;
    align-items: center;
  }

  .content {
    padding-top: 10px;
  }

  // .content {
  //   display: grid;
  //   padding: 24px 10px 24px 16px;
  //   // grid-template-columns: var(--grid-template-columns, repeat(9, 10%));
  //   grid-template-columns: repeat(
  //     v-bind('props.grid.columns'),
  //     v-bind('props.grid.width')
  //   );
  //   grid-column-gap: 20px;
  //   grid-row-gap: 24px;

  //   .item,
  //   .line-item {
  //     height: var(--item-height, 290px);
  //     display: flex;
  //     flex-direction: column;
  //     box-sizing: border-box;
  //     padding: 4px;
  //     border: 1px solid transparent;

  //     .item-img {
  //       width: 100%;
  //       height: 220px;
  //     }

  //     .item-info {
  //       flex: 1;
  //       padding: 6px 0 5px 0;
  //       .text {
  //         color: #333333;
  //         font-size: 14px;
  //         line-height: 14px;
  //         height: 30px;
  //       }

  //       .money {
  //         padding-top: 3px;
  //         font-size: 16px;
  //         height: 23px;
  //         .price {
  //           padding-right: 20px;
  //           display: inline-block;
  //           > span {
  //             vertical-align: middle;
  //           }
  //         }
  //       }
  //     }

  //     .btn-group {
  //       display: flex;
  //       justify-content: space-between;

  //       .recommend-btn {
  //         width: 100px;
  //         height: 24px;
  //         font-size: 12px;
  //         border-radius: 50px;
  //       }
  //       .connect-btn:hover {
  //         background-color: #ffdde5 !important;
  //         border-color: #ffdde5;
  //       }
  //     }
  //   }

  //   .item {
  //     cursor: pointer;
  //     transition: all 0.3s; /* 上浮这个过程需要的时间 */
  //     position: relative;

  //     .item-mask {
  //       position: absolute;
  //       top: 0;
  //       bottom: 0;
  //       width: 100%;
  //       height: 100%;
  //       z-index: 10;
  //       background-color: #fff;
  //       display: flex;
  //       flex-direction: column;

  //       .mask-img {
  //         padding: 20px;

  //         > .inner_img {
  //           width: 100%;
  //           height: 100%;
  //           filter: blur(18px);
  //         }
  //       }

  //       .mask-btns {
  //         display: inline-flex;
  //         flex: 1;
  //         justify-content: center;
  //         align-items: flex-end;
  //         padding-bottom: 20px;

  //         .btn-item {
  //           width: 180px;
  //           font-size: 16px;
  //           border-radius: 20px;
  //         }
  //       }
  //     }

  //     &:hover {
  //       transform: translate(0, -10px);
  //       box-shadow: 0 2px 8px 0 #00000026;
  //     }
  //   }
  // }

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
