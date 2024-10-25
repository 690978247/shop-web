<template>
  <div class="podProduct">
    <div class="podCatTitle">
      <img
        src="https://static.hzpdex.com/web/1718602883887_Frame.png"
        alt=""
        class="iconImg"
      />
      <span>{{ $t('customization') }}</span>
    </div>
    <div class="podMain">
      <el-tabs v-model="activeTabName" class="podTabs">
        <el-tab-pane
          v-for="tab in tabs"
          :label="tab.label"
          :key="tab.name"
          :name="tab.name"
        >
        </el-tab-pane>
      </el-tabs>
      <podTabItem :tabs="tabs" :activeTabName="activeTabName"></podTabItem>
    </div>
  </div>
</template>
<script setup lang="ts">
import categoryList from '../components/categoryList.vue'
import { inject, ref } from 'vue'
import podTabItem from '../components/podTabItem.vue'
const $t: any = inject('$t')
const tabs = [
  {
    label: $t('allProducts'),
    name: 'all'
  },
  {
    label: $t('myFav'),
    name: 'favorite'
  }
  // {
  //   label: 'Best Sellers',
  //   name: 'best'
  // }
]
const activeTabName = ref('all')
</script>
<style lang="scss" scoped>
.podProduct {
  width: 1470px;
  margin: 0 auto;
  margin-top: 24px;
  .podCatTitle {
    background: url('https://static.hzpdex.com/web/1718602365573_Frame 427319534.png')
      no-repeat center;
    background-size: contain;
    width: 1470px;
    height: 106px;
    font-weight: 700;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 24px;
    color: #fff;
    .iconImg {
      margin-left: 46px;
      width: 64px;
      height: 64px;
    }
  }
  .podMain {
    // background: #fff;
    padding: 10px 24px;
    .podTabs {
      :deep(.el-tabs__item) {
        font-size: 16px;
      }
    }
  }
}
</style>
