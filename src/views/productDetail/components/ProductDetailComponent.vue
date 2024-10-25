<template>
  <div class="product-detail">
    <p class="title">{{ $t('description') }}</p>
    <div class="describe">
      <ProductDetailHtmlComponent
        :productData="productData"
        :htmlContent="productData.description"
      ></ProductDetailHtmlComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import ProductDetailHtmlComponent from '@/views/productDetail/components/ProductDetailHtmlComponent.vue'
import { TProductDetail } from '@/views/productDetail/model/model'

// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.product-detail {
  background-color: white;
  font-family: Arial, sans-serif;
  padding-left: 20px;
  padding-right: 20px;

  .title {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 10px;
  }

  .sub-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 34.2px;
  }

  .text {
    font-size: 18px;
    font-weight: 400;
    line-height: 34.2px;
  }

  .describe {
    overflow: visible; /* 允许内容根据需要扩展 */
  }

  .divider {
    margin-top: 10px;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
