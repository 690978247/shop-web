<template>
  <div class="product-price">
    <div v-if="!quoted">
      <p>
        <span class="product-price-title"
          >{{ priceTitle[memberInfo.GradeId as keyof typeof priceTitle] }}
        </span>
        <span class="product-price-price">??.??</span>
        <ElTooltip content="Purchase VIP To View Prices" placement="top">
          <ElIcon class="icon-question">
            <question-filled />
          </ElIcon>
        </ElTooltip>
      </p>
      <p
        class="product-plus-price"
        v-if="
          ![EnumMemberTypes.Pro, EnumMemberTypes.Plus].includes(
            memberInfo.GradeId
          )
        "
      >
        <span class="product-price-title">{{ $t('Pro Price') }} </span>
        <span class="product-price-price">??.??</span>
      </p>
      <p
        class="product-plus-price"
        v-if="memberInfo.GradeId !== EnumMemberTypes.Plus"
      >
        <span class="product-price-title">{{ $t('Plus Price') }} </span>
        <span class="product-price-price">??.??</span>
      </p>
    </div>
    <template v-else>
      <p style="display: flex; align-items: center">
        <span class="product-price-title">
          {{ priceTitle[memberInfo.GradeId as keyof typeof priceTitle] }}
        </span>
        <span class="product-price-price"> ${{ currentPrice }} </span>
        <template v-if="selectCountry && isLogin">
          <!-- 巴西,欧洲 -->
          <span
            class="product-price-free"
            v-if="countryList.includes(selectCountry)"
          >
            (Tax-Free)
          </span>
          <span class="product-originprice">
            Original Price: ${{
              calculateOriginalPrice(countryList.includes(selectCountry))
            }}
          </span>
        </template>
      </p>
      <!-- 当前不是任何会员的显示 -->
      <p
        v-if="
          ![EnumMemberTypes.Pro, EnumMemberTypes.Plus].includes(
            memberInfo.GradeId
          )
        "
        class="product-plus-price"
      >
        {{ $t('Pro Price') }}：${{ currentPriceVip.pro }}
      </p>
      <!-- 当前不是plus会员的才显示 -->
      <p
        v-if="memberInfo.GradeId != EnumMemberTypes.Plus"
        class="product-plus-price"
      >
        {{ $t('Plus Price') }}：${{ currentPriceVip.plus }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  countryList,
  EnumMemberTypes,
  MEMBER_DISCOUNT
} from '@/utils/constants'
import { defineProps, computed } from 'vue'

const priceTitle: Record<number, string> = {
  0: 'Product Price',
  [EnumMemberTypes.Free]: 'Product Price',
  [EnumMemberTypes.Pro]: 'Pro Price',
  [EnumMemberTypes.Plus]: 'Plus Price'
}

const props = defineProps({
  goodsPrice: {
    type: Number,
    default: 0
  },
  selectCountry: {
    type: String,
    default: ''
  },
  isLogin: {
    type: Boolean,
    default: false
  },
  quoted: {
    type: Boolean,
    default: false
  },
  memberInfo: {
    type: Object,
    default: () => ({
      //税费
      TaxRate: 0,
      GradeId: 1,
      //会员折扣
      MallDiscountRate: 1
    })
  }
})
/**
 * 计算最终价格
 * @param {number} goodsPrice 原始价格
 * @param {number} taxRate 税率
 * @returns {number} 最终价格
 */
const currentPrice = computed(() => {
  // 未登录
  if (!props.isLogin) {
    return props.goodsPrice
  }

  return (
    (props.goodsPrice * props.memberInfo.MallDiscountRate * 100) /
    100
  ).toFixed(2)
})

/**
 * 计算划线价
 * @param {number} goodsPrice 原始价格
 * @param {number} taxRate 税率
 * @param {boolean} isBrOrEu 是否巴西或欧洲
 * @returns {number} 最终价格
 */
function calculateOriginalPrice(isBrOrEu: boolean) {
  if (!isBrOrEu) {
    return props.goodsPrice
  }
  // 首先根据税率调整价格
  let priceAfterTax = props.goodsPrice / (1 - props.memberInfo.TaxRate)
  priceAfterTax = Math.floor(priceAfterTax * 100) / 100

  return priceAfterTax
}

const currentPriceVip = computed(() => {
  const currentPricePro = (
    (props.goodsPrice * MEMBER_DISCOUNT[EnumMemberTypes.Pro] * 100) /
    100
  ).toFixed(2)
  const currentPricePlus = (
    (props.goodsPrice * MEMBER_DISCOUNT[EnumMemberTypes.Plus] * 100) /
    100
  ).toFixed(2)
  return {
    pro: currentPricePro,
    plus: currentPricePlus
  }
})
</script>

<style lang="scss" scoped>
.product-price {
  margin-top: 30px;
  // background-color: #f1f4ff;
  color: #bc0c34;
  border-radius: 10px;

  .product-price-title {
    font-size: 16px;
    width: 96px;
    display: inline-block;
  }

  .product-price-price {
    font-size: 32px;
    font-weight: 600;
    padding-left: 10px;
  }

  .icon-question {
    margin-left: 4px;
    color: #333;
    font-size: 20px;
    position: relative;
    top: 2px;
    margin-left: 10px;
    font-size: 25px;
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

  .product-plus-price {
    color: #00b243;
    font-size: 14px;
    cursor: pointer;
    align-self: flex-start;
  }
}
</style>
