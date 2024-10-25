<template>
  <div class="container" :class="isFromIframe ? 'no-margin' : ''">
    <!-- 分类显示区域 -->
    <template v-if="pageStatus == LoadingStatus.LOADED">
      <!-- 显示产品头部信息 -->
      <ProductHeader
        :type="productData.type"
        v-if="!isFromIframe"
        :isPod="isPod"
      />
      <div class="detail-wrapper">
        <!-- 产品详情区域 -->
        <div class="detail">
          <div class="d-lt">
            <div class="product-top-images">
              <ProductImagesComponent
                ref="productImagesComponentRef"
                :product-data="productData"
              />
            </div>
          </div>
          <div class="d-rt">
            <template v-if="pageStatus === LoadingStatus.LOADED">
              <div class="product-top-info" v-if="memberInfo.asyncLoad">
                <ProductInfoComponent
                  :product-data="productData"
                  :member-info="memberInfo"
                  :is-preview="isPreview"
                  :is-pod="isPod"
                  :pod-info="podInfo"
                  @on-sku-image-click="onSkuImageChange"
                  @on-country-change="onCountryChange"
                />
              </div>
            </template>
          </div>
        </div>
        <!-- Top100推广区域 -->
        <div
          v-if="
            productData.type === EnumProductTypes.Top100Product &&
            productData.goodsPromotionShow
          "
          class="margin-top-40"
        >
          <Top100Popularize :popularizeData="productData.goodsPromotionShow" />
        </div>
        <div class="margin-top-40" />
        <!-- 商品详情 -->
        <ProductDescription :product-data="productData" :isPod="isPod" />
        <div class="margin-top-40" />
        <!-- 产品优势 -->
        <ProductAdvantage :isPod="isPod" />
      </div>
    </template>

    <!-- 加载状态区域 -->
    <template v-if="pageStatus == LoadingStatus.LOADING">
      <ProductSkeleton></ProductSkeleton>
    </template>

    <!-- 错误状态区域 -->
    <template v-if="pageStatus == LoadingStatus.ERROR">
      <ProductErrorPageComponent></ProductErrorPageComponent>
    </template>
  </div>

  <div class="margin-top-40"></div>

  <template v-if="pageStatus == LoadingStatus.LOADED">
    <!-- 推荐产品区域 -->
    <template v-if="!isPod">
      <ProductRecommendList
        v-if="!isFromIframe"
        :product-data="productData"
        :current-country="currentCountry"
        :member-info="memberInfo"
      />
    </template>

    <template v-if="isPod">
      <PodRecommendList
        v-if="!isFromIframe"
        :product-data="productData"
        :current-country="currentCountry"
      />
    </template>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, provide, ref, watch } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import { useRoute } from 'vue-router'
import ProductImagesComponent from './components/v2/ProductImagesComponent.vue'
import ProductInfoComponent from './components/v2/ProductInfoComponent.vue'
import ProductAdvantage from './components/v2/ProductAdvantage.vue'
import Top100Popularize from './components/v2/Top100Popularize.vue'
import ProductSkeleton from './components/ProductSkeleton.vue'
import ProductErrorPageComponent from './components/ProductErrorPageComponent.vue'
import ProductRecommendList from './components/v2/ProductRecommendList.vue'
import ProductHeader from './components/v2/ProductHeader.vue'
import ProductDescription from './components/v2/ProductDescription.vue'
import PodRecommendList from '@/views/productDetail/components/v2/PodRecommendList.vue'
import { getProductDetail, getProductDetailPreview } from '@/api/goods'
import { getPODProductDetail } from '@/api/pod'
import { GlobalStore } from '@/store/modules/global.ts'
import { EnumProductTypes } from '@/utils/constants'
import './ProductDetail.scss'
import {
  TPodInfo,
  TProductAttributes,
  TProductAttrValueVOs,
  TProductDetail,
  TProductSkuVOs,
  TSpecValueInfo
} from './model/model'

import { getMemberVo, getSolutionRate } from '@/api/user'

// 定义加载状态枚举
// eslint-disable-next-line no-unused-vars
enum LoadingStatus {
  // eslint-disable-next-line no-unused-vars
  LOADING = 'loading',
  // eslint-disable-next-line no-unused-vars
  LOADED = 'loaded',
  // eslint-disable-next-line no-unused-vars
  ERROR = 'error'
}

defineOptions({
  name: 'ProductDetail',
  components: {
    ElCarousel,
    ElCarouselItem
  }
})

const productData = ref<TProductDetail>({
  productBaseNo: '',
  isPodProduct: false,
  goodsCode: '',
  erpGoodsCode: '',
  platform: '',
  offerId: '',
  categoryId: [],
  categoryName: '',
  publishedTime: '',
  description: '',
  sizeTable: '',
  printInfo: '',
  subject: '',
  subjectTrans: '',
  mainImage: '',
  mainVideo: '',
  detailVideo: '',
  images: [],
  saleInfo: [],
  minOrderQuantity: 0,
  productAttributes: [],
  skuVOs: [],
  markCode: '',
  goodsSkuList: [],
  productionCycle: '',
  minWeight: '',
  minPrice: '',
  texture: '',
  type: undefined,
  goodsPromotionShow: undefined,
  pNo: '',
  spuNo: ''
})

const globalStore = GlobalStore()
const offerId = ref('')
const goodsCode = ref('')
// 产品类型: 默认/POD
const productType = ref('')
const isPod = ref(false)

const currentCountry = ref('')
const isPreview = ref(false)
const podInfo = ref<TPodInfo>()

const pageStatus = ref(LoadingStatus.LOADING)

const productImagesComponentRef = ref()
provide('productData', productData)

const isFromIframe = ref(false)

const route = useRoute()

onBeforeMount(() => {
  const from = route.query.from
  if (from === 'usadropIframe') {
    isFromIframe.value = true
  }
})

const fetchDetail = () => {
  if (isPod.value) {
    requestPODDetail()
    return
  }

  if (isPreview.value) {
    requestDetailPreview()
  } else {
    requestDetail()
  }
}

const requestPODDetail = () => {
  const params = {
    goodsCodeList: [goodsCode.value],
    country: currentCountry.value
  }
  getPODProductDetail(params).then((res: any) => {
    if (res.code === 0 || res.success === true) {
      productData.value = res.data
      podInfo.value = {
        ...podInfo.value,
        pNo: productData.value.productBaseNo,
        spuNo: goodsCode.value
      }
      initDetailData(res.data)
    } else {
      pageStatus.value = LoadingStatus.ERROR
    }
  })
}

const requestDetailPreview = () => {
  getProductDetailPreview(goodsCode.value, currentCountry.value)
    .then((res: any) => {
      if (res.success) {
        productData.value = res.data
        initDetailData(res.data)
      } else {
        pageStatus.value = LoadingStatus.ERROR
      }
    })
    .catch(() => {
      pageStatus.value = LoadingStatus.ERROR
    })
}

const requestDetail = () => {
  getProductDetail(offerId.value, goodsCode.value, currentCountry.value)
    .then((res: any) => {
      if (res.success) {
        productData.value = res.data
        initDetailData(res.data)
      } else {
        pageStatus.value = LoadingStatus.ERROR
      }
    })
    .catch(() => {
      pageStatus.value = LoadingStatus.ERROR
    })
}

function initDetailData(detailData: any) {
  const productAttributes: TProductAttributes[] = []
  detailData?.goodsDetailSpecList?.forEach((item: any) => {
    const spaceNames = JSON.parse(item.specName)
    const specValues = JSON.parse(item.specValue)
    const attrValueVOs: TProductAttrValueVOs[] = []
    specValues.forEach((specValue: any) => {
      attrValueVOs.push({
        skuImageUrl: specValue.fileUrl,
        attrValue: specValue.zh,
        attrVauleTrans: specValue.en,
        specValueCode: specValue.specValueCode,
        specCode: item.specCode
      })
    })
    productAttributes.push({
      attributeId: item.specCode,
      attributeName: spaceNames['zh'],
      attributeNameTrans: spaceNames['en'],
      attrValueVOs: attrValueVOs
    })
  })
  productData.value.productAttributes = productAttributes

  const skuVOs: TProductSkuVOs[] = []
  detailData?.goodsSkuList?.forEach((item: any) => {
    const specValueInfos: TSpecValueInfo[] = []
    item.specValueInfoList?.forEach((specValueInfo: any) => {
      if (specValueInfo) {
        specValueInfos.push({
          specName: JSON.parse(specValueInfo.specName || '{}'),
          specValue: JSON.parse(specValueInfo.specValue || ' {}'),
          specValueCode: specValueInfo.specValueCode,
          specCode: specValueInfo.specCode
        })
      }
    })
    skuVOs.push({
      goodsCode: item.goodsCode,
      skuId: item.skuId,
      specId: item.specId,
      price: item.channelPrice,
      jxhyPrice: item.jxhyPrice,
      consignPrice: item.consignPrice,
      image: item.image,
      shippingInfo: JSON.parse(item.shippingInfo),
      specValueCodeItem: JSON.parse(item.specValueCodeItem),
      specValueInfoList: specValueInfos
    })
  })
  productData.value.skuVOs = skuVOs
  const findTrans = detailData?.goodsTransList?.find(
    (item: any) => item.country === globalStore.language
  )
  if (findTrans) {
    productData.value.subject = findTrans.subjectTrans || ''
    productData.value.description = findTrans.description || ''
    productData.value.sizeTable = findTrans.sizeTable || ''
    productData.value.printInfo = findTrans.printInfo || ''
  }
  pageStatus.value = LoadingStatus.LOADED
}

// 迁移 V1 代码， 处理 pod 逻辑
const initialConfiguration = () => {
  offerId.value = useRoute().params.id as string
  goodsCode.value = useRoute().params.gid as string

  if (goodsCode.value.startsWith('SPUP')) {
    productType.value = 'pod'
    isPod.value = true
  }
  isPreview.value = useRoute().query.preview === 'true' ? true : false
}

watch(
  () => globalStore.language,
  () => {
    fetchDetail()
  }
)

const handleScroll = (scroll: any) => {
  console.log('Current Scroll Position:', scroll)
}
const memberInfo = ref({
  //税费
  TaxRate: 0,
  GradeId: 0,
  //会员折扣
  MallDiscountRate: 0,
  asyncLoad: false
})

const getMemberInfo = () => {
  getMemberVo().then((res: any) => {
    // res.data.GradeId = 1
    if (res?.success) {
      memberInfo.value = res.data
      memberInfo.value.asyncLoad = true
    }
  })
}

const getMemberRate = () => {
  getSolutionRate(1).then((res: any) => {
    if (res?.success) {
      memberInfo.value.TaxRate = res.data
      memberInfo.value.asyncLoad = true
    }
  })
}

const handleMember = () => {
  const userInfo = localStorage.getItem('userInfo') ?? ''
  // 未登录则不需要 走会员等级接口
  if (userInfo) {
    getMemberInfo()
  } else {
    // 获取税费
    getMemberRate()
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  initialConfiguration()
  fetchDetail()
  // 会员数据
  handleMember()
})

const onSkuImageChange = (imgUrl: string) => {
  productImagesComponentRef.value.resetIndicatorPosition(imgUrl)
}

const onCountryChange = (country: string) => {
  currentCountry.value = country
  fetchDetail()
}
</script>
