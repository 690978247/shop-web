<template>
  <div class="product-pod-spec">
    <p class="product-pod-spec-title">Specification:</p>
    <div class="product-pod-spec-item">
      <p class="product-pod-spec-item-title">Material</p>
      <p class="product-pod-spec-item-desc">
        {{ props.productData.texture || '' }}
      </p>
    </div>
    <div class="product-pod-spec-item">
      <p class="product-pod-spec-item-title">Weight</p>
      <p class="product-pod-spec-item-desc">
        {{ props.productData.minWeight || '' }}{{ ' kg' }}
      </p>
    </div>
    <div class="product-pod-spec-item">
      <p class="product-pod-spec-item-title">Production Time</p>
      <p class="product-pod-spec-item-desc">
        {{ handleProductCycleDisplay(props.productData.productionCycle || '') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { TProductDetail } from '@/views/productDetail/model/model'

// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  }
})

//日期处理, 将days替换为' days'
const handleProductCycleDisplay = (cycle: string) => {
  return cycle ? cycle.replace(/(?<!\s)days/g, ' days') : ''
}
</script>
<style lang="scss" scoped>
.product-pod-spec {
  width: 100%; /* 或者你想要的固定宽度，如 500px */
  height: 90px;
  margin-top: 24px;
  margin-bottom: 24px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 确保子项平均分布 */
}

.product-pod-spec-title {
  font-size: 18px;
  font-weight: 400;
  width: 134px;
  color: #333333;
}

.product-pod-spec-item {
  background: #fafafa; /* 背景颜色 */
  flex: 1; /* 平均分配宽度 */
  display: flex;
  flex-direction: column;
  align-items: start; /* 居中对齐 */
  padding: 16px; /* 内边距 */
}

.product-pod-spec-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #999999;
  margin-bottom: 8px;
}

.product-pod-spec-item-desc {
  font-size: 14px;
  font-weight: 500;
  color: #333333;
}
</style>
