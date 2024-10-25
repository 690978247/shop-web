<template>
  <div class="index-group-box">
    <span class="sku-title">Ship to:</span>
    <div class="index-group-boxIn">
      <el-select
        class="select-class"
        v-model="selectCountry"
        :clearable="true"
        filterable
      >
        <el-option
          v-for="item in countryList"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <div v-if="selectCountry" class="right-tip">
        Shipping Method: <span class="right-tip active">USAdrop Fast Line</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import EN from '@/language/country/en.json'

const props = defineProps({
  defaultCountry: {
    type: String,
    default: null
  }
})

const countryList = EN.list.map((item) => {
  return {
    label: item.label + ' [' + item.value + ']',
    value: item.value
  }
})
const selectCountry = ref(props.defaultCountry)
const didSelectIndexEmits = defineEmits(['onCountryClick'])

watch(
  () => selectCountry.value,
  (newValue) => {
    didSelectIndexEmits('onCountryClick', newValue)
  }
)
</script>

<style lang="scss" scoped>
.index-group-box {
  display: flex;
  justify-content: start;
  width: 100%;
  margin-top: 16px;
}

.sku-title {
  margin-right: 16px;
  margin-top: 8px;
  font-size: 18px;
  font-weight: 400;
  color: #333333;
  max-width: 120px;
  min-width: 40px;
  font-family: 'SourceSans3';
}

.index-group-boxIn {
  flex: 1;
  display: flex;
  align-items: center;

  :deep(.el-select .el-select__wrapper) {
    border-radius: 31px;
    border: 1.5px solid var(--el-color-primary);
  }

  .select-class {
    width: 180px;
    margin-right: 24px;
  }

  .right-tip {
    flex: 1;
    font-size: 16px;
    font-family: 'SourceSans3';

    &.active {
      color: #bc0c34;
      font-weight: 600;
    }
  }
}
</style>
