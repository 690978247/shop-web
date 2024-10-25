<template>
  <div class="popularize">
    <div class="item">
      <div class="title">Google Trends</div>
      <div class="content goodsTrendsList">
        <div v-for="item in goodsTrendsList" :key="item">
          <ElImage :src="item" alt="" :preview-src-list="[item]" />
        </div>
      </div>
    </div>
    <div class="item">
      <div class="title">Comparison</div>
      <div class="content price">
        <img
          src="https://static.hzpdex.com/web/1721121924734_Frame 427319432.png"
          alt=""
        />
        <div class="price-content">
          <div>${{ platformPrice.aliexpress }}</div>
          <div>${{ platformPrice.cj }}</div>
          <div class="price-item-ud">${{ platformPrice.ud }}</div>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="title">YouTube&Tiktok</div>
      <div class="content video">
        <div
          v-for="videoSrc in [...youtubeList, ...tiktokList]"
          :key="videoSrc"
          class="video-wrapper"
        >
          <VideoPlatform :iframeSrc="videoSrc" />
        </div>
      </div>
    </div>
    <div class="item">
      <div class="title">Facebook</div>
      <div class="content facebook">
        <div v-for="item in facebookList" :key="item">
          <ElImage :src="item" alt="" :preview-src-list="[item]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoPlatform from '@/components/VideoPlatform.vue'

interface IProps {
  popularizeData: {
    goodsTrendsList: string[]
    facebookList: string[]
    tiktokList: string[]
    youtubeList: string[]
    platformPrice: any
  }
}

defineOptions({
  name: 'Top100Popularize'
})
const props = defineProps<IProps>()
const {
  goodsTrendsList,
  facebookList,
  tiktokList,
  youtubeList,
  platformPrice
} = props.popularizeData
</script>

<style lang="scss" scoped>
.popularize {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  div {
    box-sizing: border-box;
  }
  .item {
    border-radius: 16px;
    overflow: hidden;
    .title {
      font-weight: 600;
      font-size: 32px;
      height: 96px;
      line-height: 96px;
      background: linear-gradient(180deg, #e3edff 0%, #f5f8ff 122.3%);
      padding: 0 32px;
    }
    .content {
      width: 100%;
      border: 1px solid #dddddd;
      height: 380px;
      border-radius: 0 0 16px 16px;
      padding: 40px 32px;
    }
    .goodsTrendsList {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      :deep(.el-image) {
        width: 100%;
        & > img {
          width: 100%;
          aspect-ratio: 596 / 141; // 纵横比
        }
      }
    }

    .price {
      position: relative;
      img {
        width: 100%;
      }
      .price-content {
        width: 72%;
        position: absolute;
        top: 55%;
        left: 49%;
        transform: translateX(-35%);
        font-size: 24px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #bc0c34;
        font-weight: 600;
        .price-item-ud {
          flex-basis: 120px;
          text-align: center;
          color: #fff;
          font-size: 40px;
        }
      }
    }

    .video {
      display: inline-grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 20px;
      height: 410px;
      .video-wrapper {
        width: 185.3px;
        height: 330px;
      }
    }

    .facebook {
      display: inline-grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 20px;
      height: 410px;
      :deep(.el-image) {
        width: 100%;
        & > img {
          width: 100%;
          aspect-ratio: 9 / 16; // 纵横比
        }
      }
    }
  }
}
</style>
