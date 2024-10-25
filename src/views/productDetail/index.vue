<template>
  <div class="container">
    <!-- 分类显示区域 -->
    <template v-if="pageStatus == LoadingStatus.LOADED">
      <!-- ❗️ 不要在这里直接处理业务逻辑,到组件去处理,不然后期难维护 -->
      <ProductHeaderComponent :product-data="productData" />
      <!-- 产品详情区域 -->
      <div class="detail">
        <div class="d-lt">
          <template v-if="pageStatus === LoadingStatus.LOADED">
            <div class="product-top-images">
              <ProductImagesComponent
                ref="productImagesComponentRef"
                :product-data="productData"
              />
            </div>
            <div class="product-bottom-detail">
              <template v-if="isPod">
                <ProductPODDetailComponent :product-data="productData" />
              </template>
              <template v-else>
                <ProductDetailComponent :product-data="productData" />
              </template>
            </div>
          </template>
        </div>
        <div class="d-rt">
          <template v-if="pageStatus === LoadingStatus.LOADED">
            <div class="product-top-info">
              <ProductInfoComponent
                :isPod="isPod"
                :product-data="productData"
                :isPreview="isPreview"
                :podInfo="podInfo"
                @on-sku-image-click="onSkuImageChange"
                @on-country-change="onCountryChange"
              />
            </div>
          </template>
        </div>
      </div>
      <!-- recommended 区域 -->
      <div class="product-bottom-recommend" v-if="productType !== 'pod'">
        <ProductRecommentedList
          :product-data="productData"
          :current-country="currentCountry"
        />
      </div>
    </template>
    <template v-if="pageStatus == LoadingStatus.LOADING">
      <ProductSkeleton></ProductSkeleton>
    </template>
    <template v-if="pageStatus == LoadingStatus.ERROR">
      <ProductErrorPageComponent></ProductErrorPageComponent>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import ProductImagesComponent from './components/ProductImagesComponent.vue'
import ProductInfoComponent from './components/ProductInfoComponent.vue'
import ProductDetailComponent from './components/ProductDetailComponent.vue'
import ProductPODDetailComponent from './components/ProductPODDetailComponent.vue'
import ProductSkeleton from './components/ProductSkeleton.vue'
import ProductErrorPageComponent from './components/ProductErrorPageComponent.vue'
import ProductRecommentedList from './components/ProductRecommentedList.vue'
import ProductHeaderComponent from './components/ProductHeaderComponent.vue'

import { getProductDetail, getProductDetailPreview } from '@/api/goods'
import { getPODProductDetail } from '@/api/pod'
import { useRoute } from 'vue-router'
import type {
  TPodInfo,
  TProductAttributes,
  TProductAttrValueVOs,
  TProductDetail,
  TProductSkuVOs,
  TSpecValueInfo
} from '@/views/productDetail/model/model'
import { GlobalStore } from '@/store/modules/global'

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

const globalStore = GlobalStore()
const pageStatus = ref(LoadingStatus.LOADING)
// 产品详情
const productData = ref<TProductDetail>()

// 产品类型: 默认/POD
const productType = ref('')
const isPod = ref(false)

const offerId = ref('')
const goodsCode = ref('')
//当前语言
const currentCountry = ref('')
//是否语言
const isPreview = ref(false)
const podInfo = ref<TPodInfo>()

const productImagesComponentRef = ref()

const initialConfiguration = () => {
  offerId.value = useRoute().params.id as string
  goodsCode.value = useRoute().params.gid as string

  if (goodsCode.value.startsWith('SPUP')) {
    productType.value = 'pod'
    isPod.value = true
  }
  isPreview.value = useRoute().query.preview === 'true' ? true : false
  console.log('[🟩] initialConfiguration isPod=', isPod.value)
  console.log('[🟩] initialConfiguration podInfo=', podInfo.value)
  console.log('[🟩] initialConfiguration isPreview=', isPreview.value)
}
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

watch(
  () => globalStore.language,
  () => {
    fetchDetail()
  }
)

onMounted(async () => {
  initialConfiguration()
  fetchDetail()
})

const onSkuImageChange = (imgUrl: string) => {
  productImagesComponentRef.value.resetIndicatorPosition(imgUrl)
}

const onCountryChange = (country: string) => {
  currentCountry.value = country
  fetchDetail()
}
</script>

<style lang="scss" scoped>
.container {
  width: 1442px;
  margin: 0 auto 0;

  display: flex;
  flex-direction: column;
  border-radius: 10px;
  position: relative;
}

.product-top {
  display: flex;
  flex-direction: row;
  background-color: #f9fafb;
  border-radius: 10px;
}

.product-top-images {
  padding: 10px 10px 13px 20px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
}

.product-top-info {
  //margin-top: 50px;
  //margin-right: 50px;
  flex: 1;
}

.product-bottom-detail {
  margin-top: 16px;
  background-color: #f9fafb;
  border-radius: 10px;
  margin-bottom: 100px;
}

/* 布局修改样式 */
.top {
  height: 26px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.detail {
  display: flex;
  background-color: #fff;

  .d-lt {
    flex: 1;
  }

  .d-rt {
    height: calc(100vh - 78px);
    flex: 1;
    top: 0;
    padding-left: 20px;
    box-sizing: border-box;
    position: sticky;
  }
}

.product-bottom-recommend {
}
</style>
