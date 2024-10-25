<template>
  <div class="winner-carousel">
    <!-- :initialSlide="1" -->
    <swiper-container
      effect="cards"
      :grabCursor="true"
      :centeredSlides="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }"
      :pagination="{
        type: 'fraction'
      }"
      :navigation="false"
      class="winner-swiper"
    >
      <swiper-slide
        v-for="(item, index) in items"
        :key="index"
        @click="itemClick(item)"
      >
        <div class="item-wrap">
          <div class="item-img">
            <img :src="item.mainImage" alt="" />
            <!-- mask -->
            <div class="img-mask">
              <div class="group img-mask-group">
                <el-tooltip
                  effect="dark"
                  content="Connect"
                  placement="right"
                  :show-after="delayTime"
                >
                  <div @click.stop="connectData(item)">
                    <el-image :src="storeImg"></el-image>
                  </div>
                </el-tooltip>
                <el-tooltip
                  effect="dark"
                  content="Import"
                  placement="right"
                  :show-after="delayTime"
                >
                  <div @click.stop="publishData(item)">
                    <el-image :src="orderImg"></el-image>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div class="item-info">
            <div class="item-info-title">
              <el-text class="footer-name-text" line-clamp="3">{{
                productName(item)
              }}</el-text>
            </div>
            <!-- <div class="item-info-sales">
              <div>
                <span
                  >Sales volume:
                  <span class="text-red">{{ item.soldOut }}</span></span
                >
              </div>
              <el-icon class="info-icon"><Right /></el-icon>
            </div> -->
          </div>

          <!-- <div class="group">
            <div @click.stop="connectData(item)">
              <el-image :src="storeImg"></el-image>
            </div>
            <div @click.stop="publishData(item)">
              <el-image :src="orderImg"></el-image>
            </div>
          </div> -->
        </div>
      </swiper-slide>
    </swiper-container>
  </div>
</template>

<script setup lang="ts">
import { SwiperSlide } from 'swiper/vue'
import { GlobalStore } from '@/store/modules/global.ts'
import storeImg from '@/assets/images/home/store.svg'
import orderImg from '@/assets/images/home/order.svg'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const globalStore = GlobalStore()

const delayTime = 300

const emits = defineEmits([
  'didConnectClick',
  'didItemClick',
  'didPublishClick'
])
const items: any = computed(() => {
  return props.data
})

const productName = (item: any) => {
  const findTrans = item.goodsTransList?.find(
    (item: any) => item.country === globalStore.language
  )
  if (findTrans) {
    return findTrans.subjectTrans
  }
  return item.subject
}

const itemClick = (item: any) => {
  emits('didItemClick', item)
}

const connectData = (item: any) => {
  emits('didConnectClick', item)
}

const publishData = async (item: any) => {
  emits('didPublishClick', item)
}
</script>

<style lang="scss" scoped>
.winner-carousel {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.winner-swiper {
  // width: 100%;
  // height: 100%;
  // box-sizing: border-box;
}

.swiper-slide {
  width: 100%;
  height: 480px;

  .item-wrap {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    box-sizing: border-box;
    padding: 16px 20px 30px 20px;
    border-radius: 8px;
    box-shadow: 0 1px 4px 1px hsla(0, 0%, 0%, 0.3);
    .group {
      position: absolute;
      top: 30px;
      right: 30px;
      > div {
        width: 40px;
        height: 40px;
        box-shadow: 0px 2px 12px 0px #0000001a;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        & + div {
          margin-top: 16px;
        }
        &:nth-child(1n) {
          background-color: #bc0c34;
        }
        &:nth-child(2n) {
          background-color: #000000;
        }
      }
    }

    &:hover .img-mask {
      opacity: 1;
      transition: opacity 0.3s;
    }
  }

  .item-img {
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    > img {
      // width: 260px;
      // height: 340px;
      width: 100%;
      height: 100%;
    }
    .img-mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      opacity: 0;
      transition: opacity 0.3s;
      background-color: rgba(0, 0, 0, 0.6);
      .img-mask-group {
        right: 10px;
        top: 10px;
      }
    }
  }

  .item-info {
    width: 100%;
    height: 80px;
    margin-top: 30px;
    box-sizing: border-box;
    .item-info-title {
      font-size: 20px;
      font-weight: 500;
    }
    .footer-name-text {
      color: #222222;
      font-size: 20px;
    }
    .item-info-sales {
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 16px;
      justify-content: space-between;
    }
  }
  .text-red {
    color: #ff0000;
    font-weight: bold;
  }
  .info-icon {
    font-size: 24px;
    color: #ff0000;
    padding: 4px;
    cursor: pointer;
  }
}
</style>
