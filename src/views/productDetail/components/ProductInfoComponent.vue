<template>
  <div class="product-info">
    <div class="info-container" id="info-container">
      <h1 class="product-title">
        {{ productData.subject ?? '' }}
      </h1>
      <div class="product-price">
        <template v-if="!isLogin">
          <!-- 未登录 -->
          <p>
            <span class="product-price-title">{{ $t('productPrice') }} </span>
            <span class="product-price-price">${{ goodsPrice }}</span>
          </p>
        </template>

        <!-- 有会员等级 -->
        <template v-else>
          <!-- 巴西,欧洲 -->
          <template v-if="list.includes(selectCountry)">
            <p>
              <span class="product-price-title">{{ $t('productPrice') }} </span>
              <span class="product-price-price"
                >${{
                  (
                    (goodsPrice * memberInfo.MallDiscountRate * 100) /
                    100
                  ).toFixed(2)
                }}</span
              >
              <template v-if="selectCountry">
                <span class="product-price-free">(Tax-Free)</span>
                <span class="product-originprice">
                  Original Price: ${{
                    calculatePrice(goodsPrice, memberInfo.TaxRate)
                  }}
                </span>
              </template>
            </p>
          </template>
          <!-- 其他 -->
          <template v-else>
            <p>
              <span class="product-price-title">{{ $t('productPrice') }} </span>
              <span class="product-price-price"
                >${{
                  (
                    (goodsPrice * memberInfo.MallDiscountRate * 100) /
                    100
                  ).toFixed(2)
                }}</span
              >
              <template v-if="selectCountry">
                <span class="product-originprice">
                  Original Price: ${{ goodsPrice }}
                </span>
              </template>
            </p>
          </template>
        </template>
      </div>
      <product-country-selected-bar
        :default-country="selectCountry"
        @on-country-click="onCountryChange"
      ></product-country-selected-bar>
      <ProductPodSpecInfoComponent
        v-if="props.isPod"
        :productData="props.productData"
      ></ProductPodSpecInfoComponent>
      <div class="product-sku">
        <div
          class="product-sku-item"
          v-for="(item, index) in skuList"
          :key="index"
        >
          <ProductSkuSelectedBar
            :type="item._type"
            :items="item.attrValueVOs"
            :title="item.attributeNameTrans + ':'"
            @onSkuClick="onSkuClick($event, item.attributeId)"
            :lowestSpecValueCode="item.lowestSpecValueCode"
          />
        </div>
      </div>
      <ProductAliExpressGarantie :type="isPod ? 'pod' : 'default'" />
    </div>
    <div class="product-release" v-if="!props.isPreview">
      <template v-if="props.isPod">
        <el-button
          type="primary"
          color="#bc0c34"
          class="product-release-button"
          id="product-release-button"
          @click="onStartDesignClick()"
          >{{ $t('Start Design') }}
        </el-button>
      </template>
      <template v-else>
        <el-button
          color="#bc0c34"
          class="product-release-button-left"
          style="background-color: #fff; color: #bc0c34"
          plain
          :loading="showButtonLoading"
          @click="onConnectClick"
          >{{ $t('connect') }}
        </el-button>
        <el-button
          type="primary"
          color="#bc0c34"
          class="product-release-button"
          id="product-release-button"
          :loading="showButtonLoading"
          @click="onProductReleaseClick"
          >{{ $t('list') }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue'
import { go2UDProConnect, loginEventBus, productPublish } from '@/utils/common'
import ProductSkuSelectedBar from '@/views/productDetail/components/ProductSkuSelectedBar.vue'
import ProductCountrySelectedBar from '@/views/productDetail/components/ProductCountrySelectedBar.vue'
import ProductAliExpressGarantie from '@/views/productDetail/components/ProductAliExpressGarantie.vue'
import ProductPodSpecInfoComponent from '@/views/productDetail/components/ProductPodSpecInfoComponent.vue'
import { getMemberVo, getSolutionRate } from '@/api/user/index'
import { TPodInfo, TProductDetail } from '../model/model'
import router from '@/utils'
import { useUser } from '@/store/modules/user.ts'

const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  podInfo: {
    type: Object as PropType<TPodInfo>
  },
  isPod: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onSkuImageClick', 'onCountryChange'])

const list = [
  'IE',
  'EE',
  'AT',
  'BR',
  'BG',
  'BE',
  'PL',
  'DK',
  'DE',
  'FR',
  'FI',
  'NL',
  'CZ',
  'HR',
  'LV',
  'LT',
  'LU',
  'RO',
  'MT',
  'PT',
  'SE',
  'CY',
  'SK',
  'SI',
  'ES',
  'GR',
  'HU',
  'IT'
]

const skuList = ref<any[]>([])
const selectSkuValues = ref<any[]>([])

let skuVOs = ref(null as any)
const qtyNum = ref(1)
const showButtonLoading = ref(false)
const selectCountry = ref('')

const initialConfiguration = () => {
  skuVOs = ref(props.productData.skuVOs || [])
}

/**
 * 计算最终价格
 * @param {number} originalPrice 原始价格
 * @param {number} taxRate 税率
 * @param {number} discountRate 商场折扣率
 * @returns {number} 最终价格
 */
function calculatePrice(originalPrice, taxRate /* discountRate */) {
  // 首先根据税率调整价格
  let priceAfterTax = originalPrice / (1 - taxRate)
  priceAfterTax = Math.floor(priceAfterTax * 100) / 100
  // 应用商场折扣
  // let finalPrice = priceAfterTax * (1 - discountRate)
  // let finalPrice = priceAfterTax * discountRate
  // finalPrice = Math.floor(finalPrice * 100) / 100

  return priceAfterTax
}

const isLogin = ref(false)
const handleShipChange = (price: number) => {
  // memberInfo.value.GradeId = 1
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    // 未登录 则return出去
    isLogin.value = false
    return
  }
  isLogin.value = true

  // 选择运费国家
  // if (list.includes(selectCountry.value)) {
  //   if (selectCountry.value === 'BR') {
  //     rateText.value = 'ICMS'
  //   } else {
  //     rateText.value = 'IOSS'
  //   }
  //   // showShip.value = true
  //   // // 处理 运费显示
  //   // const userInfo = localStorage.getItem('userInfo') ?? ''
  //   // // 未登录/vip1 显示rate
  //   // // vip2/vip3 显示price
  //   // if (!userInfo) {
  //   //   handleRate(price)
  //   //   return
  //   // }
  //   // if (memberInfo.value.GradeId === 1) {
  //   //   // handleRate(price)
  //   //   return
  //   // }

  //   // if ([2, 3].includes(memberInfo.value.GradeId)) {
  //   //   showRate.value = false
  //   //   showPrice.value = true
  //   //   originPrice.value = calculatePrice(
  //   //     price,
  //   //     memberInfo.value.TaxRate,
  //   //     memberInfo.value.MallDiscountRate
  //   //   )
  //   //   return
  //   // }
  // } else {
  //   showShip.value = false
  // }
}

const findSelectedSkuInfo = () => {
  if (selectSkuValues.value.length === 0) {
    return null
  }
  const findSelected = skuVOs.value.find((item: any) => {
    const specValueCodeItem = item.specValueCodeItem
    if (!specValueCodeItem) {
      return null
    }
    return selectSkuValues.value
      .map((i: any) => i.specValueCode)
      .every((code) => specValueCodeItem.join(',').includes(code))
  })
  handleShipChange(Number(findSelected?.price || 0.0))
  return findSelected
}

const goodsPrice = computed<number>(() => {
  return +findSelectedSkuInfo()?.price || 0.0
})

const initSkuList = () => {
  initialConfiguration()
  const tempList: any[] = []
  props.productData.productAttributes?.forEach((item: any) => {
    if (item.attrValueVOs?.length > 0) {
      // 最低价格的sku
      const lowestSpecValueCodeArr = findDefaultSku()
      if (
        selectSkuValues.value.findIndex((i: any) => {
          return i.specCode === item.attributeId
        }) === -1
      ) {
        const lowestSpecValueCode = lowestSpecValueCodeArr.find((a: string) =>
          a.startsWith(item.attributeId)
        )
        selectSkuValues.value.push({
          specCode: item.attributeId,
          specValueCode: lowestSpecValueCode
        })
        item.lowestSpecValueCode = lowestSpecValueCode
      }
      if (item.attrValueVOs[0]?.skuImageUrl) {
        item['_type'] = 'image'
      } else {
        item['_type'] = 'text'
      }
      tempList.push(item)
    }
  })
  skuList.value = tempList
}

const mainElement = ref(null)

const memberInfo = ref({
  //税费
  TaxRate: 0,
  GradeId: 0,
  //会员折扣
  MallDiscountRate: 0
})

const getMemberInfo = () => {
  getMemberVo().then((res: any) => {
    // res.data.GradeId = 1
    if (res?.success) {
      memberInfo.value = res.data
    }
  })
}

const getMemberRate = () => {
  getSolutionRate(1).then((res: any) => {
    if (res?.success) {
      memberInfo.value.TaxRate = res.data
    }
  })
}

const handleMember = () => {
  const isLoggedIn = useUser().state.isLoggedIn
  // 未登录则不需要 走会员等级接口
  if (isLoggedIn) {
    getMemberInfo()
  } else {
    // 获取税费
    getMemberRate()
  }
}

onMounted(() => {
  selectSkuValues.value = []
  initSkuList(props.productData)
  // 会员数据
  handleMember()

  mainElement.value = document.querySelector('.el-main')
  if (mainElement.value) {
    mainElement.value.addEventListener('scroll', checkScroll)
  }
})

onBeforeUnmount(() => {
  if (mainElement.value) {
    mainElement.value.removeEventListener('scroll', checkScroll)
  }
})

const transformDocument = (scrollTop: any, item: any) => {
  const button: any = document.querySelector(item)
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize
  )

  const scale = document.documentElement.clientWidth / 1920

  // 40为ProductHeaderComponent.vue的高度
  const headTop = 40 * scale

  if (scrollTop < headTop) {
    const initialTop = parseFloat(button?.style?.top || 0) // 假设style.top也是用rem设置的
    const initialTopInPx = initialTop * rootFontSize // 将rem转换回像素
    const newTop = (initialTopInPx + scrollTop) / rootFontSize // 将总像素值转换为rem
    // 临时禁用动画效果
    const originalTransition = button.style.transition
    button.style.transition = 'none'

    // 应用变换
    button.style.transform = `translateY(${newTop}rem)`

    // 强制浏览器立即应用变更
    button.offsetHeight

    // 恢复原来的动画效果
    button.style.transition = originalTransition
  } else {
    const initialTop = parseFloat(button.style.top) || 0 // 假设style.top也是用rem设置的
    const initialTopInPx = initialTop * rootFontSize // 将rem转换回像素
    const newTop = (initialTopInPx + headTop) / rootFontSize // 将总像素值转换为rem
    // 临时禁用动画效果
    const originalTransition = button.style.transition
    button.style.transition = 'none'

    // 应用变换
    button.style.transform = `translateY(${newTop}rem)`

    // 强制浏览器立即应用变更
    button.offsetHeight

    // 恢复原来的动画效果
    button.style.transition = originalTransition
  }
}
const checkScroll = () => {
  const { scrollTop } = mainElement.value

  // transformDocument(scrollTop, '.info-container')
  transformDocument(scrollTop, '.product-release-button')
  transformDocument(scrollTop, '.product-release-button-left')
}
watch(
  () => props.productData,
  (val) => {
    skuVOs.value = val.skuVOs
    initSkuList(val)
  },
  {
    deep: true
  }
)

const showShip = ref(false)
const showPrice = ref(false)
const originPrice = ref(0.0)
const showRate = ref(false)
const rateText = ref('')
const ratePrice = ref(0.0)

const handleRate = (price: number) => {
  showRate.value = true
  showPrice.value = false
  ratePrice.value = Math.floor(price * memberInfo.value.TaxRate * 100) / 100
}

const onSkuClick = (obj: any, attributeId: string) => {
  const { value, type } = obj
  if (type === 'num') {
    qtyNum.value = value
  } else {
    if (type === 'image') {
      //图片SKU点击主图切换
      emit('onSkuImageClick', value.skuImageUrl)
    }
    const findSpecCodeInfo = selectSkuValues.value.find(
      (item: any) => item.specCode === value.specCode
    )
    if (findSpecCodeInfo) {
      findSpecCodeInfo.specValueCode = value.specValueCode
    } else {
      selectSkuValues.value.push({
        specCode: value.specCode,
        specValueCode: value.specValueCode
      })
    }
  }
}
const onProductReleaseClick = async () => {
  showButtonLoading.value = true
  await productPublish(props.productData.goodsCode, selectCountry.value)
  showButtonLoading.value = false
}
const onConnectClick = () => {
  go2UDProConnect(props.productData.goodsCode)
}

const onCountryChange = (country: string) => {
  selectCountry.value = country
  emit('onCountryChange', selectCountry.value)
}

/**
 * 查找默认选中的sku组合，默认是最低价格的
 */
const findDefaultSku = () => {
  const { goodsSkuList, minPrice } = props.productData
  const matchedItem = goodsSkuList.find(
    (item: any) => item.channelPrice === +minPrice
  )
  let result = []
  try {
    result = JSON.parse(matchedItem?.specValueCodeItem)
  } catch (error) {
    result = []
  }
  return result
}

const pushToPod = () => {
  if (!props.podInfo.pNo || !props.podInfo.spuNo) {
    ElMessage.error('Data anomaly, please try refreshing')

    return
  }
  // 跳转设计器
  router.push({
    path: '/pod/index',
    query: {
      pNo: props.podInfo.pNo,
      spuNo: props.podInfo.spuNo
    }
  })
}

const onStartDesignClick = () => {
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    loginEventBus.emit()
    return
  }
  pushToPod()
}
</script>

<style lang="scss" scoped>
.product-info {
  width: 100%;
  height: calc(100vh - 78px);
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
}

.info-container {
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
  padding-top: 10px;
  padding-right: 24px;
}

.product-title {
  font-family: 'SourceSans3';
  font-weight: bold;
  font-size: 20px;
  line-height: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.product-price {
  margin-top: 16px;
  background-color: #f1f4ff;
  color: #bc0c34;
  padding: 16px 24px 16px 24px;
  border-radius: 10px;

  .product-price-title {
    font-size: 22px;
  }

  .product-price-price {
    font-size: 32px;
    font-weight: bold;
    padding-left: 10px;
  }

  .product-price-free {
    margin-left: 24px;
    font-weight: bold;
    color: #bc0c34;
    font-size: 14px;
  }

  .product-originprice {
    color: #999999;
    font-size: 14px;
    text-decoration: line-through;
    margin-left: 5px;
    font-weight: normal;
  }

  .product-free {
    color: #999;
    font-size: 12px;
  }
}

.product-info p:nth-of-type(1) {
  font-weight: 600;
  font-size: 30px;
  line-height: 42px;
}

.product-info p:nth-of-type(2) {
  font-weight: 400;
  font-size: 12px;
  line-height: 16.8px;
}

.product-sku {
  /* background-color: aquamarine; */
  margin-top: 24px;
  margin-bottom: 24px;

  .product-sku-item {
    margin-bottom: 16px;
  }
}

.product-fee {
  display: flex;
  background-color: #f5f5f5;
  height: 72px;
  padding: 16px 24px 16px 24px;

  .product-fee-card {
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 16px;

    .product-fee-card-title {
      font-weight: 400;
      font-size: 12px;
      line-height: 16.8px;
      color: #999999;
    }

    .product-fee-card-price {
      font-weight: 500;
      font-size: 14px;
      line-height: 19.6px;
      color: #3f6aff;
    }
  }
}

.product-release {
  margin-top: 16px;
  margin-bottom: 76px;

  .product-release-button-left {
    width: 140px;
    height: 40px;
    border-radius: 20px;
  }

  .product-release-button {
    width: 140px;
    height: 40px;
    border-radius: 20px;
  }
}

.sku-value {
  font-size: 12px;
}

.group-card-n {
  margin-right: 18px;
  width: 66px;
  height: 66px;
  border-radius: 4px;
  border: 1px solid #e5e5e5; /* 更简洁的方式合并 border-color 和 border-width */
  box-sizing: border-box; /* 保证边框宽度包含在元素总宽度内 */
}

.group-card-s {
  margin-right: 18px;
  width: 66px;
  height: 66px;
  border-radius: 4px;
  border: 2px solid var(--el-color-primary); /* 更简洁的方式合并 border-color 和 border-width */
  box-sizing: border-box; /* 保证边框宽度包含在元素总宽度内 */
}
</style>
