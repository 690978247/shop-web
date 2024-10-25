<template>
  <div
    ref="podListContent"
    :class="['podListContent']"
    @click.prevent="goPodDesc(item)"
  >
    <div class="topPodContent">
      <div class="imageContainer">
        <img
          :src="
            item.images.length
              ? item.images[0]
              : 'https://static.hzpdex.com/web/1719902450_failedImg.png'
          "
          alt=""
          class="mainImg mainImg1"
        />
        <img
          :src="item.images.length > 1 ? item.images[1] : item.images[0]"
          alt=""
          class="mainImg mainImg2"
        />
      </div>

      <div class="favIconContent" v-if="showCollect">
        <img
          @click.stop="favOperate(item)"
          :src="item.isFavorite === 1 ? fav : unFav"
          alt=""
          class="favIcon"
        />
      </div>
      <div class="design" @click.stop="goDesign(item)">
        <el-icon style="margin-right: 5px">
          <Plus />
        </el-icon>
        {{ $t('design') }}
      </div>
    </div>
    <div class="bottomPodContent">
      <div class="title">{{ getTitle(item.goodsTransList) }}</div>
      <div class="price notranslate">${{ item.minPrice }}</div>
    </div>
    <div class="bottomPodContent2">
      <div class="part1">
        <div class="notranslate">${{ item.minPrice }}</div>
        <div>
          <span class="ellipseTxt">{{ item.texture }}</span>
        </div>
      </div>

      <div class="part2">
        <div class="partItem">
          <span>{{ $t('weight') }}</span>
          <span>{{ item.minWeight || 0 }}</span>
        </div>
        <div class="partItem">
          <span>{{ $t('productCycle') }}</span>
          <span>{{ item.productionCycle }}</span>
        </div>
        <div class="partItem">
          <span>{{ $t('designTimes') }}</span>
          <span>{{ item.designTimes || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import fav from '@/assets/images/detail/fav.png'
import unFav from '@/assets/images/detail/unfav.png'
import { loginEventBus } from '@/utils/common.ts'
import { useUser } from '@/store/modules/user.ts'

defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  showCollect: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['favOrCancel'])

const goPodDesc = (item: any) => {
  const { goodsCode } = item
  localStorage.setItem('pid', goodsCode.toString())
  window.open(`/productDetail/v2/${goodsCode}`)
}

const favOperate = (item: any) => {
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    loginEventBus.emit()
    return
  }
  emits('favOrCancel', item)
}

const goDesign = (item: any) => {
  const isLoggedIn = useUser().state.isLoggedIn
  if (!isLoggedIn) {
    loginEventBus.emit()
    return
  }
  const { productBaseNo, goodsCode } = item
  if (!productBaseNo || !goodsCode) {
    ElMessage.error('Data anomaly, please try refreshing')
    return
  }

  // 新打开一个页签跳转到设计器
  window.open(`/pod/index?pNo=${productBaseNo}&spuNo=${goodsCode}`)
}

const getTitle = (listLang: any) => {
  return (
    listLang?.find((item: any) => item.country === 'en')?.subjectTrans || ''
  )
}
</script>

<style lang="scss" scoped>
@mixin flex_center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin ellipse {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-line;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.lastItem {
  margin-bottom: 100px;
}

.podListContent {
  box-shadow: 1px 1px 6px 1px #dcdedf;
  box-sizing: border-box;
  border-radius: 14px;
  height: auto;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform-style: preserve-3d; /* 保持3D效果 */
  &:hover {
    box-shadow: 6px 6px 10px rgba(89, 89, 89, 0.3);
    transform: scale(1.03);
  }

  .topPodContent {
    transform: translateZ(20px); /* 使元素弹出 */
    line-height: 0;
    width: 100%;
    position: relative;
    display: flex;
    overflow: hidden;
    flex: 1;

    .best {
      @include flex_center;
      width: 80px;
      height: 24px;
      background: var(--el-color-primary);
      border-radius: 14px;
      color: #ffffff;
      position: absolute;
      top: 8px;
      left: 8px;
    }
    .imageContainer {
      position: relative;
      width: 100%; /* 图片宽度为屏幕宽度的50% */
      overflow: hidden; /* 隐藏超出部分 */
      padding-bottom: 100%; /* 初始值为0，稍后计算 */
      .mainImg {
        position: absolute;
        border-radius: 8px 8px 0 0;
        top: 0;
        left: 0;
        width: 100%; /* 图片宽度为容器宽度的100% */
        height: 100%; /* 图片高度为容器高度的100% */
        object-fit: cover; /* 保持宽高比的同时填充容器 */
      }
    }
    .favIconContent {
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 8px;
      right: 8px;
      cursor: pointer;
      @include flex_center;

      .favIcon {
        width: 16px;
        height: 16px;
        min-width: 16px;
        transition: transform 0.3s;

        &:hover {
          transform: scale(1.4);
          transition: transform 0.3s;
        }
      }
    }

    .design {
      width: 128px;
      height: 40px;
      border-radius: 40px;
      @include flex_center;
      font-size: 14px;
      font-weight: 600;
      color: #000000;
      position: absolute;
      visibility: hidden;
      opacity: 0;
      left: 50%;
      top: 80%;
      transform: translate(-64px, -20px);
      background: #ffffffb2;
      box-sizing: border-box;
      border: 2px solid #ffffffb2;
      transition: all 0.3s;

      &:hover {
        border: 2px solid var(--el-color-primary);
        color: var(--el-color-primary);
        transition: all linear 0.5s;
      }
    }

    .mainImg2 {
      // transform: translateX(-100%);
      visibility: hidden;
      opacity: 0;
    }

    .mainImg1 {
      visibility: visible;
      opacity: 1;
    }

    .mainImg {
      width: 100%;
      height: 100%;
      border-radius: 8px 8px 0 0;
      aspect-ratio: 1 / 1;
      // min-width: 270px;
      box-sizing: border-box;
      transition: all linear 0.6s;
    }

    &:hover {
      transition: all 0.6s;
      .mainImg2 {
        visibility: visible;
        opacity: 1;
      }

      .mainImg1 {
        visibility: hidden;
        opacity: 0;
      }
    }
  }

  .bottomPodContent {
    z-index: 2;
    border-radius: 0px 0px 8px 8px;
    height: 112px;
    width: calc(100% - 16px);
    display: flex;
    flex-direction: column;
    font-weight: 700;
    padding: 8px;
    background: #fff;
    align-items: flex-start;
    justify-content: center;
    border-top: 1px solid #cccccc;

    .title {
      margin-bottom: 10px;
      color: #333333;
      width: 100%;
      font-size: 14px;
      @include ellipse;
    }

    .price {
      color: #f00033;
      font-size: 20px;
    }
  }

  .bottomPodContent2 {
    z-index: 1;
    border-radius: 0px 0px 8px 8px;
    display: flex;
    height: 128px;
    flex-direction: column;
    background: #fff;
    display: none;
    border-top: 1px solid #cccccc;

    .part1 {
      width: 100%;
      display: flex;
      height: 48px;

      div {
        width: 50%;
        @include flex_center;
        font-size: 12px;
        color: #f00033;
        font-weight: 500;
        text-align: center;
        border-bottom: 1px solid #cccccc;

        &:nth-child(2) {
          color: #666666;
          border-left: 1px solid #cccccc;

          .ellipseTxt {
            @include ellipse;
          }
        }
      }
    }

    .part2 {
      padding: 8px;
      display: flex;
      padding: 8px;
      color: #999999;
      flex-direction: column;
      font-size: 12px;
      font-weight: 500;
      height: calc(100% - 48px);
      justify-content: space-around;

      .partItem {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  &:hover {
    .topPodContent {
      .design {
        // display: flex;
        visibility: visible;
        opacity: 1;
      }
    }

    .bottomPodContent {
      display: none;
    }

    .bottomPodContent2 {
      display: flex;
    }
  }
}
</style>
