<template>
  <div>
    <template v-if="productList.length">
      <div class="podList">
        <div v-for="item in productList" :key="item.id">
          <podProductItem
            :item="item"
            @favOrCancel="(item) => emits('favOrCancel', item)"
          />
        </div>
        <template v-if="loading">
          <el-skeleton class="podSkeleton" :loading="loading" animated>
            <template #template>
              <el-skeleton-item class="podSkeletonItem" variant="image" />
              <div class="podSkeletonItemBottom" style="padding: 14px">
                <el-skeleton-item variant="h3" style="width: 100%" />
                <el-skeleton-item
                  variant="p"
                  style="width: 30%; margin-top: 10%"
                />
              </div>
            </template>
          </el-skeleton>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-if="loading"><div class="loading">loading...</div></template
      ><template v-else
        ><el-empty
          style="width: 100%; height: 100%"
          fit="contain"
          :src="emptyImg"
        ></el-empty
      ></template>
    </template>
  </div>
  <div
    v-show="enableAutoLoadNextPage && productList.length"
    class="more-wrap"
    @click="loadMoreFn"
  >
    <span>{{ $t('viewmore') }}</span>
    <el-icon>
      <ArrowDown />
    </el-icon>
  </div>
</template>
<script lang="ts" setup>
import emptyImg from '@/assets/images/empty_data.svg'
import podProductItem from './podProductItem.vue'

defineProps({
  productList: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    required: false
  },
  enableAutoLoadNextPage: {
    type: Boolean,
    required: false
  }
})

const emits = defineEmits(['loadMore', 'favOrCancel'])
const loadMoreFn = () => {
  emits('loadMore')
}
</script>
<style lang="scss" scoped>
.more-wrap {
  width: 140px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #999999;
  margin: 0 auto;
  cursor: pointer;
  margin-bottom: 60px;
  margin-top: 40px;

  > span {
    margin-right: 10px;
  }
}

.podList {
  width: calc(100% - 6px);
  padding: 10px 0 10px 10px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(4, 23%);
  gap: 20px;
  background: #f0f2f5;

  .podSkeleton {
    background: #fff;
    width: 270px;

    .podSkeletonItem {
      width: 270px;
      height: 270px;
    }

    .podSkeletonItemBottom {
      height: 100px;
      display: flex;
      flex-direction: column;
      background: #fff;
      align-items: flex-start;
      justify-content: center;
    }
  }
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  font-size: 18px;
  color: #999;
}
</style>
