<template>
  <div>
    <el-tabs v-model="activeName" class="desc-tabs" @tab-click="handleClick">
      <el-tab-pane label="Description" name="description">
        <ProductDetailHtmlComponent
          :productData="productData"
          :htmlContent="productData.description"
        ></ProductDetailHtmlComponent
      ></el-tab-pane>
      <el-tab-pane label="Size Guide" name="sizeTable">
        <ProductDetailHtmlComponent
          :productData="productData"
          :htmlContent="productData.sizeTable"
        ></ProductDetailHtmlComponent
      ></el-tab-pane>
      <el-tab-pane label="Print Guide" name="printInfo">
        <ProductDetailHtmlComponent
          :productData="productData"
          :htmlContent="productData.printInfo"
        ></ProductDetailHtmlComponent
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { TProductDetail } from '@/views/productDetail/model/model'
import ProductDetailHtmlComponent from '@/views/productDetail/components/ProductDetailHtmlComponent.vue'
import { TabsPaneContext } from 'element-plus'
// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  }
})

const activeName = ref('description')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background: rgb(0, 0, 0);
  // :deep(.el-tabs__nav-scrol) {
  //   margin-left: 100px;
  // }
}
.desc-tabs {
  background: white;
  margin-left: 0px;

  :deep(.el-tabs__item) {
    font-size: 16px;
  }
  :deep(.el-tabs__nav-scroll) {
    margin-left: 0px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    background-color: white;
  }
}
</style>
