<template>
  <div class="product-header">
    <template v-if="isPod">
      <div class="inner-bg">
        <div>Home</div>
        <div>--</div>
        <div>POD Product</div>
      </div>
    </template>
    <template v-else>
      <div class="inner-bg">
        <div v-html="formatHeader()"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { productTypeMap } from '@/utils/constants'

const props = defineProps({
  type: {
    type: [Number, String],
    default: 0
  },
  isPod: {
    type: Boolean,
    default: false
  }
})

const formatHeader = () => {
  const base = '<span>Home</span><span> -- </span>'
  return (
    base +
    productTypeMap[+props.type]
      .split(' ')
      .map(
        (word) => `
          <span>${word}</span>
          `
      )
      .join('')
  )
}
</script>

<style lang="scss" scoped>
.product-header {
  background-color: #001f4f;
  height: 64.8px;
  line-height: 64.8px;
  border-radius: 30px 30px 0 0;
  color: #fff;
  font-size: 16px;
  overflow: hidden;

  .inner-bg {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-direction: row;
    padding: 0 100px;
    background: linear-gradient(90deg, #ff5925 0%, #ff0d3c 92.08%);
    width: 80%;
    border-radius: 30px 30px 30px 0;
  }

  .inner-bg > div {
    margin-right: 10px;
  }
}
</style>
