<template>
  <div class="wrap-banner" id="wrap">
    <template v-if="!skeletonLoading">
      <Category :items="leftItems" from="banner" />
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

      <!-- 热销 -->
      <div class="wrap-banner-rt">
        <div class="hotTitle">
          <img
            src="https://static.hzpdex.com/temp/ud-shop/ic_hot_img.png"
            alt=""
          />
        </div>
        <div class="wrap">
          <div
            v-for="(item, index) in hotList"
            :key="item.name"
            :class="['item-1', { item_bottom: index === 0 || index === 1 }]"
          >
            <div
              v-for="img in item.imgList"
              :key="img.id"
              @click="searchHotData(item)"
            >
              <el-image :src="img.mainImage" fit="contain" class="item-img" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- left -->
      <div class="skeleton-lf">
        <el-skeleton animated class="lf-inner">
          <template #template>
            <!--            <el-skeleton-item variant="p" class="inner-header" />-->
            <div class="inner-item">
              <el-skeleton-item
                class="item-line"
                variant="p"
                v-for="item in leftItems.length"
              />
            </div>
          </template>
        </el-skeleton>
      </div>
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
import { inject, onMounted, ref, watch } from 'vue'
import router from '@/router/router'
import { GlobalStore } from '@/store/modules/global'
import { membershipVisibility } from '@/utils/common'
import { getMemberVo } from '@/api/user/index'
import memberTips from './memberTips.vue'

// 分类多语言
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'
import Category from './category.vue'
import { memberUpgradeConfirm, ProductCollections } from '@/utils/common.ts'

const props = defineProps({
  skeletonLoading: {
    type: Boolean,
    default: false
  }
})
// const dealImg = (srcName: string) => {
//   const src = `/static/${srcName}.svg`
//   return new URL(src, import.meta.url).href
// }
const $t: any = inject('$t')
const globalStore = GlobalStore()

const leftItems = ref([])

watch(
  () => globalStore.language,
  (value) => {
    if (value === 'pt') {
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
    img: 'https://static.hzpdex.com/web/1721382170207_ud_shop_banner_2.jpg'
  },
  {
    img: 'https://static.hzpdex.com/web/1721382170368_ud_shop_banner_3.jpg'
  }
])

// const searchBannerData = (event: any, item: any) => {
//   if (event.target.nodeName !== 'SPAN') return
//   localStorage.setItem('searchValue', item.name)
//   // 第一层级传递 keyword 关键词
//   localStorage.setItem('searchCategoryID', '')
//   router.push('/searchdetail')
// }

// const searchChildData = (item: any) => {
//   localStorage.setItem('searchValue', item.name)
//   localStorage.setItem('searchCategoryID', item.categoryID)
//   router.push('/searchdetail')
// }

// 0315 新增处理hotsellplatform
// AMAZON_HOT(190136176, "AMAZON_HOT", "亚马逊热销"),
// TIKTOK_HOT(190136186, "TIKTOK_HOT", "TikTok热销"),
// ALI_EXPRESS_HOT(190136187, "ALI_EXPRESS_HOT", "速卖通热销"),
// NORMAL(190136184, "NORMAL", "普通商品"),
const hotList = ref<any[]>([])

const getHotSells = () => {
  // en pt es
  let currentImg: any[] = []
  if (globalStore.language === 'en') {
    currentImg = [
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Aliexpress_en1.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_tiktok_en3.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Amazon_en2.jpg'
    ]
  }
  if (globalStore.language === 'pt') {
    currentImg = [
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Aliexpress_pt1.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_tiktok_pt3.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Amazon_pt2.jpg'
    ]
  }
  if (globalStore.language === 'es') {
    currentImg = [
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Aliexpress_es1.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_tiktok_es3.jpg',
      'https://static.hzpdex.com/temp/ud-shop/ic_shop_Amazon_es2.jpg'
    ]
  }
  hotList.value = ProductCollections.map((item, index) => {
    return {
      name: item.value,
      productCollection: item.value,
      imgList: [
        {
          mainImage: currentImg[index]
        }
      ]
    }
  })
}

watch(
  () => globalStore.language,
  () => {
    getHotSells()
  },
  {
    deep: true,
    immediate: true
  }
)

const memberVisible = ref(false)
const searchHotData = (item: any) => {
  if (!membershipVisibility()) {
    router.push({
      name: 'SearchDetail',
      query: {
        pct: item.productCollection
      }
    })
    return
  }
  // 添加会员等级
  // GradeId   1 普通   2 pro    3 plus
  getMemberVo().then((res: any) => {
    // res.data.GradeId = 1
    if (res?.success) {
      if (res?.data?.GradeId === 1) {
        memberVisible.value = true
      } else {
        router.push({
          name: 'SearchDetail',
          query: {
            pct: item.productCollection
          }
        })
      }
    }
  })
}

const memberConfirm = () => {
  memberUpgradeConfirm()
}

onMounted(() => {
  getHotSells()
})
</script>

<style lang="scss" scoped>
.wrap-banner {
  width: inherit;
  height: inherit;
  display: flex;
  background-color: #01226f;
  box-shadow: 0px 2px 16px 0px #0000001a;
  border-radius: 8px;

  .wrap-banner-md {
    background: url('https://static.hzpdex.com/temp/ud-shop/ic_home_banner_bg.png')
      no-repeat center center;
    background-size: cover; /* 按比例覆盖整个容器 */
    flex: 1;
    margin: 0 14px;

    padding: 24px 28px;

    .md-carousel {
      height: 100%;
      border: 6px solid white;

      :deep(.el-carousel__container) {
        height: 100%;
      }
    }
  }

  .wrap-banner-rt {
    width: 300px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    .title {
      display: flex;
      align-items: center;
      background-color: #fff;
      font-size: 20px;
      padding-left: 16px;
      border-bottom: 1px solid #e9e9ec;
    }

    .hotTitle {
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
      height: 50px;
      margin-top: 24px;
      margin-bottom: 32px;
      margin-right: 14px;
    }

    .hotTitle > img {
      width: 100%;
      height: auto;
    }

    .source {
      height: 188px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      background-color: #fff;

      .source-input {
        padding: 40px 16px 24px 16px;
      }

      .source-btn {
        width: calc(100% - 32px);
        margin-left: 16px;
      }
    }

    .delivery {
      margin-top: 12px;
      flex: 1;
      background-color: #fff;
      border-radius: 8px;
      display: flex;
      flex-direction: column;

      .header {
        height: 48px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9ec;

        .ship {
          font-size: 12px;
          cursor: pointer;
          color: #999999;
        }
      }

      .content {
        padding: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .info {
          font-size: 12px;
          line-height: 18px;

          .info-img {
            vertical-align: bottom;
          }

          .info-subimg {
            width: 18px;
            vertical-align: middle;
          }
        }

        .pos {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .el-dropdown-link {
          display: flex;
          align-items: center;

          .delivery-img {
            width: 40px;
            height: 30px;
            border-radius: 3px;
            margin-right: 5px;
          }
        }
      }
    }

    // 热销
    .wrap {
      height: 100%;

      display: flex;
      flex-direction: column;
      margin-right: 14px;
      margin-bottom: 24px;
      box-sizing: border-box;

      .item-img {
        width: 100%;
        height: 120px;
        border-radius: 24px;
        transition: 0.5s all;
        transform: scale(1);

        &:hover {
          transition: 0.5s all;
          transform: scale(1.15);
        }
      }

      .item-1 {
        width: 100%;
        height: 120px;
        border-radius: 24px;
        display: flex;
        position: relative;
        cursor: pointer;
        overflow: hidden;
      }

      .item_bottom {
        margin-bottom: 24px;
      }
    }
  }

  // 骨架屏
  .skeleton-lf {
    width: 240px;
    background-color: #fff;

    .lf-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 10px;

      .inner-header {
        height: 30px;
        width: 80%;
        margin-top: 10px;
      }

      .inner-item {
        display: flex;
        width: 100%;
        height: 100%;
        flex-direction: column;
        align-items: center;
        //padding: 10px 0;

        .item-line {
          width: 95%;
          flex: 1;
          margin-top: 5px;
        }
      }
    }
  }

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
    width: 300px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .rt-title {
      height: 48px;
      background-color: #fff;
      padding: 20px;
      box-sizing: border-box;

      .item-line {
        width: 50%;
        height: 30px;
      }
    }

    .rt-top {
      height: 188px;
      padding: 20px;
      background-color: #fff;
      box-sizing: border-box;

      .item-line {
        margin-top: 20px;
        height: 50px;
      }
    }

    .rt-bottom {
      padding: 0 20px;
      margin-top: 12px;
      flex: 1;
      background-color: #fff;

      .inner-header {
        margin: 6px 0;
      }

      .item-line {
        height: 30px;
      }

      .inner-item {
        display: flex;
        flex-direction: column;
        align-items: center;

        .item-line1 {
          height: 50px;
        }

        .item-line2 {
          height: 60px;
          width: 60%;
          margin-top: 20px;
        }
      }
    }

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
