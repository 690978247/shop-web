<template>
  <div class="product-detail-component">
    <div v-if="productFiles.length > 0">
      <el-carousel
        :initial-index="0"
        trigger="click"
        class="carousel"
        indicator-position="none"
        ref="carouselRef"
        :autoplay="false"
        :loop="false"
        arrow="never"
        @change="didTopImageChanage"
      >
        <!-- 视频 -->
        <el-carousel-item v-if="productVideo">
          <video width="100%" height="100%" controls>
            <source :src="productVideo" type="video/mp4" />
          </video>
        </el-carousel-item>

        <!-- 图片 -->
        <el-carousel-item
          v-for="(item, index) in imagePreviewList"
          :key="index"
        >
          <img
            :src="item"
            :alt="'Product Image ' + index"
            class="product-image"
            @click="handlePreviewImage"
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div v-else>
      <ProductEmpty :width="'540px'" :height="'540px'" />
    </div>

    <div class="thumbnails">
      <ProductThumbnailScrollCard
        ref="productThumbnailScrollCardRef"
        :product-files="productFiles"
        :currentIndex="currentIndex"
        @didThumbnailsIndexChange="didThumbnailsIndexChange"
      />
    </div>
  </div>

  <ImagePreviewDialog
    v-model:visible="showPreviewDialog"
    :preview-src-list="productFiles"
    :initial-index="currentIndex"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { ElCarousel, ElCarouselItem } from 'element-plus'
import ProductThumbnailScrollCard from '../ProductThumbnailScrollCard.vue'
import ProductEmpty from '../ProductEmpty.vue'
import type { TProductDetail } from '@/views/productDetail/model/model'
import ImagePreviewDialog from '@/components/ImagePreview/index.vue'

// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  }
})

//数据
const productFiles = computed(() => {
  const images = props.productData.images || []
  props.productData?.productAttributes?.forEach((attribute: any) => {
    //规则第一张是图片才加入到images
    if (attribute.attrValueVOs && attribute.attrValueVOs[0].skuImageUrl) {
      attribute.attrValueVOs.forEach((attrValue: any) => {
        if (attrValue.skuImageUrl) {
          images.push(attrValue.skuImageUrl)
        }
      })
    }
  })

  // video 存在 则 添加图片展示
  if (props.productData.mainVideo) {
    images.unshift(images[0])
  }

  return images
})

// video data
const productVideo = computed(() => {
  const video = props.productData.mainVideo || ''
  return video
})

//顶部滑动
const carouselRef = ref(null)
const productThumbnailScrollCardRef = ref(null)
const currentIndex = ref(0)
const showPreviewDialog = ref(false)

// 处理缩略图点击事件
const didThumbnailsIndexChange = (res: any) => {
  if (carouselRef.value) {
    carouselRef.value.setActiveItem(res.val)
  }
}

const imagePreviewList: any = ref([])
watch(
  () => productFiles.value,
  (data) => {
    if (productVideo.value) {
      imagePreviewList.value = data.slice(1)
    } else {
      imagePreviewList.value = data
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const didTopImageChanage = (res: number) => {
  currentIndex.value = res
}
const resetIndicatorPosition = (imgUrl: string) => {
  currentIndex.value = productFiles.value.indexOf(imgUrl)
  didThumbnailsIndexChange({ val: currentIndex.value })
  productThumbnailScrollCardRef.value.setScrollXPosition(currentIndex.value)
}

const handlePreviewImage = () => {
  showPreviewDialog.value = true
}

onMounted(() => {
  carouselRef.value = carouselRef.value || null
})

defineExpose({
  resetIndicatorPosition
})
</script>

<style lang="scss" scoped>
.product-detail-component {
  width: 540px;
  background-color: red($color: #000000);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  :deep(.el-carousel__container) {
    height: 540px; //图片高度
    border-radius: 8px;
    overflow: hidden;
  }
}

.carousel {
}

.product-image {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.thumbnails {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 66px;
  margin-top: 16px;
}

.thumbnail {
  width: 66px;
  height: 66px;
  object-fit: cover; /* 保持图片比例 */
  margin-right: 8px; /* 右侧间距 */
  box-sizing: border-box; /* 包含边距在宽高的计算之内 */
}

:deep(.el-carousel__arrow) {
  top: 245px !important;
}
</style>
