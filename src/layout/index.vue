<template>
  <el-container>
    <!-- <el-aside>
      <Menu />
    </el-aside> -->
    <el-container>
      <el-header :class="hide ? 'hide' : ''">
        <Header />
        <SubHeader />
        <Tabs v-if="settingConfig.tabs" />
      </el-header>
      <el-main>
        <RouterView />
        <Footer :class="hide ? 'hide' : ''" backgroundColor="#fff" />
        <!--        <el-backtop target=".el-main" :right="20" :bottom="20">-->
        <!--          <div class="upload-button">-->
        <!--            <img src="@/assets/images/ic_back_top.svg" />-->
        <!--          </div>-->
        <!--        </el-backtop>-->
        <BackTopButton />
        <GTranslate :class="hide ? 'hide' : ''" />
        <!-- <language :class="hide ? 'hide' : ''" /> -->
      </el-main>
      <!-- <el-footer class="container-footer">
        <Footer />
      </el-footer> -->
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { GlobalStore } from '@/store/modules/global'
import { RouterView, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Header from './header/index.vue'
import SubHeader from './subHeader/index.vue'
import Tabs from './tabs/index.vue'
import Footer from './footer-new/index.vue'
import BackTopButton from '@/components/BackToTopButton/index.vue'
import GTranslate from '@/components/GTranslate/index.vue'
const globalStore = GlobalStore()
const settingConfig = storeToRefs(globalStore).settingConfig

const hide = ref(false)

const route = useRoute()

onBeforeMount(() => {
  if (route.query.from === 'usadropIframe') {
    hide.value = true
    window.Intercom('shutdown')
  }
})
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.el-container {
  width: 100%;
  min-width: 970px;
  height: 100%;
  // overflow-x: hidden;
  overflow: hidden;

  .el-aside {
    width: auto;
    overflow: inherit;
  }

  .el-header,
  .el-footer {
    height: auto;
    padding: 0;
  }

  .el-main {
    box-sizing: border-box;
    padding: 0;
    font-size: 14px;
    background: #f0f2f5;

    &::-webkit-scrollbar {
      width: 4px;
    }
    /* 滚动条内的滑块 */
    &::-webkit-scrollbar-thumb {
      background-color: #c1c1c1; /* 滑块的背景色 */
    }
  }

  .container-footer {
    // height: 30px;
    // background: #ffffff;
    // border-top: 1px solid #e4e7ed;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
}

:deep(.el-backtop__icon) {
  color: #fa4756;
}
</style>
