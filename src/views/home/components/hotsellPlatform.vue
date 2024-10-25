<!-- 第一版 的 hotsell  已弃用 -->
<template>
  <div class="wrap-hot">
    <template v-if="!skeletonLoading">
      <div class="header">
        <div class="title">
          <img :src="hotImg" alt="" />
          <span>{{ $t('hotsellingplatform') }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="header">
        <el-skeleton animated>
          <template #template>
            <div class="header-box">
              <el-skeleton-item class="line-lf" variant="p" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </template>

    <div class="content">
      <div
        v-for="item in hotList"
        :class="item.imgList.length === 1 ? 'item-1' : 'item-4'"
      >
        <template v-if="!item.loading">
          <div v-for="img in item.imgList">
            <el-image
              :src="img.mainImage"
              style="width: 100%; height: 100%"
              fit="contain"
            />
          </div>
          <!-- 蒙层 -->
          <div class="item-mask" @click="searchHotData(item)">
            <span>{{ item.name }}</span>
          </div>
        </template>
        <template v-else>
          <p class="content-box">
            <el-skeleton animated style="width: 100%; height: 100%">
              <template #template>
                <el-skeleton-item class="item" variant="image" />
              </template>
            </el-skeleton>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue'
import hotImg from '@/assets/images/hot.png'
import router from '@/router/router'
import { GlobalStore } from '@/store/modules/global'
import { getProductData } from '@/api/goods/index'

const $t: any = inject('$t')
const globalStore = GlobalStore()

watch(
  () => globalStore.language,
  () => {
    hotList.value = [
      {
        name: $t('aliexpresshotstyle'),
        productCollection: 'ALI_EXPRESS_HOT',
        loading: true,
        imgList: []
      },
      {
        name: $t('tikTokhotstyle'),
        productCollection: 'TIKTOK_HOT',
        loading: true,
        imgList: []
      },
      {
        name: $t('amazonhotstyle'),
        productCollection: 'AMAZON_HOT',
        loading: true,
        imgList: []
      }
    ]
    getHotSells()
  },
  {
    deep: true
  }
)

const hotList = ref([
  {
    name: $t('aliexpresshotstyle'),
    productCollection: 'ALI_EXPRESS_HOT',
    loading: true,
    imgList: []
  },
  {
    name: $t('tikTokhotstyle'),
    productCollection: 'TIKTOK_HOT',
    loading: true,
    imgList: []
  },
  {
    name: $t('amazonhotstyle'),
    productCollection: 'AMAZON_HOT',
    loading: true,
    imgList: []
  }
])

const skeletonLoading = ref(false)

const searchHotData = (item: any) => {
  router.push({
    name: 'SearchDetail',
    query: {
      kw: item.name
    }
  })
}

// 获取热搜数据
const getHotSells = () => {
  // 获取Aliexpress hot style 数据
  getHotItemData('aliexpress', hotList.value[0].productCollection, 4)
  getHotItemData('tiktok', hotList.value[1].productCollection, 1)
  getHotItemData('amazon', hotList.value[2].productCollection, 4)
}

const getHotItemData = (
  type: string,
  productCollection: string,
  size: number
) => {
  const postData = {
    pageNum: 1,
    size: size,
    keyword: '',
    productCollection
    // vipLevel: memberInfo.value.GradeId
  }
  getProductData(postData)
    .then((res) => {
      res.data.records = res.data.records ?? []
      skeletonLoading.value = false
      if (type === 'aliexpress') {
        hotList.value[0].loading = false
        hotList.value[0].imgList = res.data.records
      }
      if (type === 'tiktok') {
        hotList.value[1].loading = false
        hotList.value[1].imgList = res.data.records
      }
      if (type === 'amazon') {
        hotList.value[2].loading = false
        hotList.value[2].imgList = res.data.records
      }
    })
    .catch(() => {
      hotList.value = hotList.value.map((item) => ({
        ...item,
        loading: false
      }))
      skeletonLoading.value = false
    })
}

onMounted(() => {
  skeletonLoading.value = true
  getHotSells()
})
</script>
<style lang="scss" scoped>
.wrap-hot {
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .header {
    height: 72px;
    border-bottom: 1px solid #e9e9ec;
    padding: 0 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 24px;
      display: flex;
      align-items: center;
    }

    .more {
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .content {
    flex: 1;
    display: flex;
    justify-content: space-around;
    padding: 24px 0;

    .item-1,
    .item-4 {
      width: 360px;
      border-radius: 8px;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      position: relative;

      .item-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        font-size: 32px;
        color: #fff;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.3);

        > span {
          filter: drop-shadow(0px 0px 4px #00000080);
        }
      }
    }

    .item-4 > div {
      width: 50%;
      height: 50%;
    }
  }

  // 骨架屏
  .header-box {
    height: 40px;
    display: flex;
    justify-content: space-between;

    .line-lf {
      width: 300px;
      height: 100%;
    }

    .line-rt {
      width: 160px;
      height: 100%;
    }
  }

  .content-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .item {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
