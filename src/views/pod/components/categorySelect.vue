<template>
  <div
    v-if="!categoryObj.children || categoryObj.children.length === 0"
    class="li"
    style="padding-left: 18px"
    :class="categoryObj.categoryId == chosedId ? 'choosed' : null"
  >
    <div
      style="width: 100%"
      @click="$emit('updateChossed', categoryObj.categoryId)"
    >
      {{ getTranName(categoryObj.transName) }}
    </div>
  </div>
  <div
    class="ul"
    v-else
    :key="categoryObj.categoryId"
    style="padding-left: 10px"
    :class="categoryObj.status ? 'heightAuto' : 'height'"
  >
    <div
      class="li childrenLi"
      :key="categoryObj.categoryId"
      style="padding-left: 0px"
    >
      <img
        class="arrow"
        :src="categoryObj.status ? Icon2 : Icon1"
        @click.stop="categoryObj.status = !categoryObj.status"
      />
      <div
        style="width: calc(100% - 14px)"
        @click="$emit('updateChossed', categoryObj.categoryId)"
        :class="categoryObj.categoryId == chosedId ? 'liChoosed' : null"
      >
        {{ getTranName(categoryObj.transName) }}
      </div>
    </div>
    <categorySelect
      v-for="(child, index) in categoryObj.children"
      :key="child.categoryId + '' + index"
      :category="child"
      :chosedId="_chosedId"
      @updateChossed="getSearchCategory"
    />
  </div>
</template>

<script setup>
import Icon1 from '@/assets/images/pod/icon1.svg'
import Icon2 from '@/assets/images/pod/icon2.svg'
import { ref } from 'vue'
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  chosedId: {
    type: Number,
    required: false
  }
})
const categoryObj = props.category
// const _chosedId = ref(0)
const emits = defineEmits(['updateChossed'])
function getSearchCategory(categoryId) {
  emits('updateChossed', categoryId)
}

const getTranName = (transName, lang = 'en') => {
  if (transName) {
    return JSON.parse(transName)[lang]
  } else {
    return ''
  }
}
const _chosedId = computed(() => props.chosedId)
</script>
<style lang="scss" scoped>
.childrenLi {
  &:hover {
    text-decoration: underline;
    // text-decoration-color: var(--el-color-primary);
  }
}
.arrow {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
.arrow1 {
  transform: rotate(-90deg);
}
.choosed {
  color: var(--el-color-primary);
  background: #fff0f4;
  border-left: 2px solid var(--el-color-primary);
}
.liChoosed {
  color: var(--el-color-primary);
}
.height {
  height: 36px;
}
.heightAuto {
  height: auto;
}
</style>
