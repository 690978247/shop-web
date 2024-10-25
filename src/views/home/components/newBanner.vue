<template>
  <div class="wrap-banner" id="wrap">
    <template v-if="!skeletonLoading">
      <!-- 热销 -->
      <div class="wrap-banner-lt">
        <!-- <div
          class="banner-rt-item"
          v-for="(item, index) in hotList"
          :key="index"
        >
          <div class="item-header">
            <el-image :src="item.img" style="width: 30px; height: 28px"
              >"</el-image
            >
            <span class="item-title">{{ item.title }}</span>
          </div>
          <div class="item-content">{{ item.content }}</div>
        </div> -->
        <Category :items="leftItems" width="100%" height="100%" />
      </div>

      <!-- 图片轮播 -->
      <div class="wrap-banner-md">
        <el-carousel class="md-carousel" :autoplay="true">
          <el-carousel-item v-for="item in carouselImgs" :key="item.img">
            <el-image lazy :src="item.img" class="image">
              <template #placeholder>
                <div class="skeleton-md" style="height: 100%; width: 100%">
                  <el-skeleton animated class="md-inner">
                    <template #template>
                      <el-skeleton-item
                        variant="image"
                        style="width: 100%; height: 100%"
                      />
                    </template>
                  </el-skeleton>
                </div>
              </template>
            </el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
    </template>
    <template v-else>
      <!-- middle -->
      <div class="skeleton-md">
        <el-skeleton animated class="md-inner">
          <template #template>
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 100%"
            />
          </template>
        </el-skeleton>
      </div>

      <div class="skeleton-rt">
        <div class="rt-hot-title">
          <el-skeleton animated>
            <template #template>
              <div class="inner-item">
                <el-skeleton-item class="item-line" variant="p" />
              </div>
            </template>
          </el-skeleton>
        </div>
        <div class="rt-hot-bottom">
          <el-skeleton animated>
            <template #template>
              <div class="inner-item">
                <el-skeleton-item class="item-line2" variant="p" />
                <el-skeleton-item class="item-line2" variant="p" style="" />
                <el-skeleton-item class="item-line2" variant="p" style="" />
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
    </template>
    <!-- 会员提示弹窗 -->
    <memberTips
      v-model:visible="memberVisible"
      title="Get Pro Plan for more features"
      @confirm="memberConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import memberTips from './memberTips.vue'
import { memberUpgradeConfirm } from '@/utils/common.ts'
// import productImg from '@/assets/images/home/product.svg'
// import teamImg from '@/assets/images/home/team.svg'
// import priceImg from '@/assets/images/home/price.svg'
import { GlobalStore } from '@/store/modules/global'
// 分类多语言
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'
import Category from './category.vue'

defineProps({
  skeletonLoading: {
    type: Boolean,
    default: false
  }
})
const globalStore = GlobalStore()

const leftItems = ref([])

watch(
  () => globalStore.language,
  (value) => {
    if (value === 'br') {
      leftItems.value = BR.list
    }
    if (value === 'es') {
      leftItems.value = ES.list
    }
    if (value === 'zh') {
      leftItems.value = ZH.list
    }
    if (value === 'en') {
      leftItems.value = EN.list
    }
  },
  {
    immediate: true,
    deep: true
  }
)

// wrap 部分
const carouselImgs = ref([
  {
    img: 'https://static.hzpdex.com/web/1721382170082_ud_shop_banner_1.jpg'
  },
  {
    img: 'https://static.hzpdex.com/web/1722837601363_ud_shop_banner_2.png'
  },
  {
    img: 'https://static.hzpdex.com/web/1721382170368_ud_shop_banner_3.jpg'
  }
])

// const hotList = ref<any[]>([
//   {
//     title: '1 Million Products',
//     img: productImg,
//     content: 'Personalized support from our expert team in dropshipping.'
//   },
//   {
//     title: 'Professional Team Researches Popular Data',
//     img: teamImg,
//     content:
//       'With our efficient fulfillment system , we strive to reach 99.99% delivery rate to shipping your orders to major destinations.'
//   },
//   {
//     title: 'Low Price',
//     img: priceImg,
//     content:
//       'Benefit from our 10+ years of supply chain experience for various product categories and lower price.'
//   }
// ])

const memberVisible = ref(false)

const memberConfirm = () => {
  memberUpgradeConfirm()
}
</script>

<style lang="scss" scoped>
.wrap-banner {
  width: inherit;
  height: inherit;
  display: flex;
  border-radius: 8px;

  .wrap-banner-md {
    flex: 1;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #01b8da;

    .md-carousel {
      height: 100%;
      width: 100%;
      border-radius: 16px;
      box-sizing: border-box;
      :deep(.el-carousel__container) {
        height: 100%;
      }
    }
  }

  .wrap-banner-lt {
    width: 400px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    // margin-left: 20px;
    margin-right: 40px;
    box-sizing: border-box;
    background-color: #e8f0fe;
    padding: 5px 10px;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);

    .banner-rt-item {
      flex: 1;
      border-radius: 16px;
      background-color: #e8f0fe;
      border: 1px solid #b4cdff;
      box-sizing: border-box;
      padding: 20px 40px;
      & + .banner-rt-item {
        margin-top: 20px;
      }
    }

    .item-header {
      display: flex;
      align-items: center;
    }

    .item-title {
      margin-left: 16px;
      font-size: 20px;
      font-weight: 600;
    }

    .item-content {
      margin-top: 12px;
      font-size: 14px;
    }
  }

  // 骨架屏
  .skeleton-md {
    background-color: #fff;
    margin: 0 12px;
    border-radius: 8px;
    padding: 10px;
    flex: 1;
    .md-inner {
      width: 100%;
      height: 100%;
    }
  }

  .skeleton-rt {
    width: 480px;
    height: 100%;
    display: flex;
    flex-direction: column;

    // 0315 hotsell
    .rt-hot-title {
      height: 72px;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;
    }

    .rt-hot-bottom {
      width: 100%;
      height: calc(100% - 72px);
      background-color: #fff;

      .inner-item {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 0 24px;
        box-sizing: border-box;

        .item-line2 {
          height: 125px;

          & + .item-line2 {
            margin-top: 20px;
          }
        }
      }
    }
  }
}

.image {
  width: 100%;
  height: 100%;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  height: 100%;
}
</style>
