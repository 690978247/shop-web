<template>
  <div>
    <div
      class="ul"
      v-for="(item, index) in list"
      :key="index"
      :class="item.status ? 'heightAuto' : 'height'"
    >
      <CategorySelect
        :key="item.categoryId + '' + index"
        :chosedId="chosedId"
        :category="item"
        @updateChossed="updateChossed"
      />
    </div>
  </div>
</template>
<script setup>
// import CategorySelect from '../CategorySelect.vue'
import CategorySelect from './categorySelect.vue'
import { getCategory } from '@/api/pod'
import { ref } from 'vue'
const list = ref([])
const chosedId = ref(null)
const emits = defineEmits(['updateCategoryId'])
const clearAllCategory = () => {
  chosedId.value = ''
  emits('updateCategoryId', '')
}
defineExpose({
  clearAllCategory
})
function updateChossed(id) {
  chosedId.value = id
  emits('updateCategoryId', id)
}
onMounted(() => {
  getCategory().then((res) => {
    if (res.success) {
      list.value = res.data
    }
  })
})
</script>
<style>
.ul {
  cursor: pointer;
  overflow: hidden;
}
.li {
  min-height: 34px;
  font-size: 14px;
  color: #666666;
  height: auto;
  cursor: pointer;
  display: block;
  display: flex;
  align-items: center;
}
.li:hover {
  background: #dedede;
}
.height {
  height: 36px;
}
.heightAuto {
  height: auto;
}
</style>
