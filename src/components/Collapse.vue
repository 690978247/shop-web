<!--
 * @Author: jiangshiyang
 * @Date: 2024-07-15 16:16:13
 * @LastEditors: jiangshiyang
 * @Description: Collapse 折叠面板
-->

<template>
  <div
    v-if="mode === 'viewMore'"
    class="collapse-view-more"
    id="collapseViewMore"
  >
    <div class="header">
      <p class="title" :style="titleStyle">{{ title }}</p>
    </div>
    <div class="content" :class="viewAll ? 'view-all' : ''">
      <slot name="content"></slot>
    </div>
    <div class="view-all-btn-wrapper" :class="viewAll ? '' : 'shadow'">
      <ElButton type="primary" link class="view-all-btn" @click="handleFold">
        {{ viewAll ? 'fold up' : 'view all' }}
        <el-icon style="margin-left: 6px">
          <ArrowDown v-if="!viewAll" />
          <ArrowUp v-else />
        </el-icon>
      </ElButton>
    </div>
  </div>
  <ElCollapse v-model="expandedKey" v-else>
    <ElCollapseItem name="1">
      <template #title>
        <div class="header">
          <p class="title" :style="titleStyle">{{ title }}</p>
        </div>
      </template>
      <div class="content view-all">
        <slot name="content"></slot>
      </div>
    </ElCollapseItem>
  </ElCollapse>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Collapse'
  },
  titleStyle: {
    type: Object
  },
  defaultExpand: {
    type: Boolean,
    default: false
  },
  // 不可折叠
  mode: {
    type: String,
    default: ''
  }
})

const expandedKey = ref(props.defaultExpand ? '1' : undefined)
const viewAll = ref(false)
const handleFold = () => {
  if (viewAll.value) {
    // 收起
    setTimeout(() => {
      const collapseViewMore = document.getElementById('collapseViewMore')
      collapseViewMore.scrollIntoView({
        behavior: 'smooth'
      })
    }, 100)
  }
  viewAll.value = !viewAll.value
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    font-size: 40px;
    color: #000;
  }
}

.el-collapse,
.collapse-view-more {
  border-top: none;
  border-bottom: none;
  box-shadow: 0px 2px 16px 0px #0000001a;
  padding: 36px 120px;
  border-radius: 16px;
  background: linear-gradient(180deg, #e3edff 0, #ffffff 85px);
  position: relative;
  &.collapse-view-more {
    padding-bottom: 70px;
  }

  .content {
    margin-top: 36px;
    padding: 20px 0;
    border-top: 2px dashed #cececed0;
    overflow: hidden;
    max-height: 500px;
    transition: max-height 1s ease-in-out;
    &.view-all {
      max-height: 9999px;
    }
  }

  .view-all-btn-wrapper {
    width: 100%;
    text-align: center;
    padding-top: 78px;
    font-size: 18px;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 80px;
    line-height: 80px;
    border-radius: 0 0 16px 16px;
    &.shadow {
      background-image: linear-gradient(
        -180deg,
        rgba(255, 255, 255, 0) 0%,
        #fff 100%
      );
    }
    .view-all-btn {
      font-size: 18px;
    }
  }
}

:deep(.el-collapse-item__header) {
  border-bottom: none;
  background-color: transparent;
}

:deep(.el-collapse-item__wrap) {
  border-bottom: none;
}
:deep(.el-collapse-item__arrow) {
  font-size: 20px;
  color: #222222;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
</style>
