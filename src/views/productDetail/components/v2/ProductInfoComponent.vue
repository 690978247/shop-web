<template>
  <div class="product-info">
    <div class="info-container" id="info-container">
      <h1 class="product-title">
        {{ productData.subject ?? '' }}
      </h1>
      <ProductCountrySelectedBar
        :default-country="selectCountry"
        @on-country-click="onCountryChange"
        @quote="quoted = true"
        :is-login="isLogin"
        :quoted="quoted"
        @debute-quote="debuteQuote"
        ref="countrySelectedBarRef"
      />
      <ProductPodSpecInfoComponent
        v-if="props.isPod"
        :productData="props.productData"
      ></ProductPodSpecInfoComponent>
      <ProductPrice
        v-if="!props.isPod"
        :member-info="memberInfo"
        :select-country="selectCountry"
        :goods-price="goodsPrice"
        :is-login="isLogin"
        :quoted="quoted"
      />
      <div v-else class="product-price">
        <!-- 未登录 -->
        <p>
          <span class="product-price-title">{{ $t('productPrice') }} </span>
          <span class="product-price-price">${{ goodsPrice }}</span>
        </p>
      </div>
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
      <!-- <ProductAliExpressGarantie /> -->
    </div>
    <div class="product-release" v-if="!isPreview">
      <template v-if="props.isPod">
        <el-button
          type="primary"
          color="#bc0c34"
          class="pod-design-button"
          id="product-release-button"
          @click="onStartDesignClick()"
          >{{ $t('Start Design') }}
        </el-button>
      </template>
      <template v-else>
        <ElTooltip
          content="Connect our products with your store's products"
          placement="top"
        >
          <el-button
            color="#bc0c34"
            class="product-release-button-left"
            style="background-color: #fff; color: #bc0c34"
            plain
            :loading="showButtonLoading"
            @click="onConnectClick"
            >{{ $t('connect') }}
          </el-button>
        </ElTooltip>
        <ElTooltip content="Import our products to your store" placement="top">
          <el-button
            type="primary"
            color="#bc0c34"
            class="product-release-button"
            id="product-release-button"
            :loading="showButtonLoading"
            @click="onProductReleaseClick"
            >{{ $t('list') }}
          </el-button>
        </ElTooltip>
      </template>
    </div>
    <div
      v-if="
        productData.type === EnumProductTypes.Top100Product &&
        productData.goodsPromotionShow
      "
      style="margin-top: 32px"
    >
      <ProductChart />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { TPodInfo, TProductDetail } from '@/views/productDetail/model/model'
import { go2UDProConnect, productPublish } from '@/utils/common.ts'
import ProductSkuSelectedBar from '@/views/productDetail/components/ProductSkuSelectedBar.vue'
import ProductCountrySelectedBar from '@/views/productDetail/components/v2/ProductCountrySelectedBar.vue'
import ProductPodSpecInfoComponent from '@/views/productDetail/components/ProductPodSpecInfoComponent.vue'
// import ProductAliExpressGarantie from '@/views/productDetail/components/ProductAliExpressGarantie.vue'
import ProductPrice from './ProductPrice.vue'
import {
  addMallQuoteLogAndExt,
  getMemberVo,
  getSolutionRate
} from '@/api/user/index'
import ProductChart from './ProductChart.vue'
import { EnumProductTypes } from '@/utils/constants'
import { useUser } from '@/store/modules/user'
import { loginEventBus } from '@/utils/common'

const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true,
    default: () => {}
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
  },
  memberInfo: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['onSkuImageClick', 'onCountryChange'])

const skuList = ref<any[]>([])
const selectSkuValues = ref<any[]>([])
const skuVOs = ref(props.productData.skuVOs || [])
const qtyNum = ref(1)
const showButtonLoading = ref(false)
const selectCountry = ref('')
const countrySelectedBarRef = ref(null)

const quoted = ref(false)

const isLogin = ref(false)

const onStartDesignClick = () => {
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    loginEventBus.emit()
    return
  }
  pushToPod()
}

const pushToPod = () => {
  if (!props.podInfo.pNo || !props.podInfo.spuNo) {
    ElMessage.error('Data anomaly, please try refreshing')

    return
  }

  window.open(
    `/pod/index?pNo=${props.podInfo.pNo}&spuNo=${props.podInfo.spuNo}`
  )
}
const handleShipChange = (price: number) => {
  // memberInfo.value.GradeId = 1
  const userInfo = localStorage.getItem('userInfo') ?? ''
  if (!userInfo) {
    // 未登录 则return出去
    isLogin.value = false
    return
  }
  isLogin.value = true
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

const initSkuList = (productData: any) => {
  const tempList: any[] = []
  productData.productAttributes?.forEach((item: any) => {
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

// const memberInfo = ref({
//   //税费
//   TaxRate: 0,
//   GradeId: 0,
//   //会员折扣
//   MallDiscountRate: 0
// })

// const getMemberInfo = () => {
//   getMemberVo().then((res: any) => {
//     // res.data.GradeId = 1
//     if (res?.success) {
//       memberInfo.value = res.data
//     }
//   })
// }

// const getMemberRate = () => {
//   getSolutionRate(1).then((res: any) => {
//     if (res?.success) {
//       memberInfo.value.TaxRate = res.data
//     }
//   })
// }

// const handleMember = () => {
//   const userInfo = localStorage.getItem('userInfo') ?? ''
//   // 未登录则不需要 走会员等级接口
//   if (userInfo) {
//     getMemberInfo()
//   } else {
//     // 获取税费
//     getMemberRate()
//   }
// }

onMounted(() => {
  selectSkuValues.value = []
  initSkuList(props.productData)
  // 会员数据
  // handleMember()
})

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

const debuteQuote = async () => {
  const res = await addMallQuoteLogAndExt(props.productData.goodsCode)
  if (res.success && res.Result) {
    quoted.value = true
    countrySelectedBarRef.value.getQuoteTimes()
  } else {
    ElMessage.error(res.ErrMsg || res.message)
  }
}
</script>

<style lang="scss" scoped>
.product-info {
  width: 100%;
  // height: calc(100vh - 78px);
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
}

.info-container {
  flex: 1;
  box-sizing: border-box;
  overflow: auto;
}

.product-title {
  font-family: 'SourceSans3';
  font-weight: bold;
  font-size: 24px;
  line-height: 38.4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
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
  // margin-top: 16px;
  // margin-bottom: 76px;

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

.pod-design-button {
  margin-top: 80px;
  width: 140px;
  height: 40px;
  border-radius: 20px;
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
  border: 2px solid #3f6aff; /* 更简洁的方式合并 border-color 和 border-width */
  box-sizing: border-box; /* 保证边框宽度包含在元素总宽度内 */
}
</style>
