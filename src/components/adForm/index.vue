<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    :label-position="labelPosition"
    :label-width="labelWidth"
    label-suffix=":"
    class="common_form"
  >
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in formItem"
        :span="item.span ? item.span : 24"
        :key="index"
      >
        <template v-if="item.type === 'input'">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-input
              :disabled="item.disabled"
              @blur="handleBlur($event, item)"
              :size="item.size ?? 'large'"
              clearable
              :show-password="item.showPassword"
              :placeholder="item.placeholder ? item.placeholder : '请输入'"
              v-model="formData[item.prop]"
            >
              <template :v-slot="item.slotName">
                <slot
                  :name="item.prop"
                  :scope="item"
                  :formData="formData"
                ></slot>
              </template>
            </el-input>
          </el-form-item>
        </template>

        <template v-if="item.type === 'select'">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-select
              v-model="formData[item.prop]"
              @change="handleChange($event, item)"
              class="common_select"
              :size="item.size ?? 'large'"
              :placeholder="item.placeholder ? item.placeholder : '请选择'"
            >
              <el-option
                v-for="opt in item.options"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>

        <template v-if="item.type === 'date'">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker
              class="form-date"
              :size="item.size ?? 'large'"
              v-model="formData[item.prop]"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="date"
              :placeholder="item.placeholder ? item.placeholder : '请选择日期'"
            >
            </el-date-picker>
          </el-form-item>
        </template>

        <template v-if="item.type === 'date-time'">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker
              class="form-date"
              :size="item.size ?? 'large'"
              v-model="formData[item.prop]"
              value-format="YYYY-MM-DD HH:mm:ss"
              :default-time="item.defaultTime"
              type="datetime"
              :placeholder="item.placeholder ? item.placeholder : '请选择日期'"
            >
            </el-date-picker>
          </el-form-item>
        </template>

        <template v-if="item.type === 'range-date'">
          <el-form-item :label="item.label" :prop="item.prop">
            <el-date-picker
              class="form-date"
              :size="item.size ?? 'large'"
              v-model="formData[item.prop]"
              start-placeholder="start date"
              end-placeholder="end date"
              range-separator="To"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              type="datetimerange"
            >
            </el-date-picker>
          </el-form-item>
        </template>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormItem, Props } from './form.d'

// 注意 defineProps的ts类型 vue3.3版本以下不能从外部导入
// interface Props {
//   data: FormData
//   formItem: Array<FormItem>
//   rules?: FormRules
//   labelPosition?: string
//   labelWidth?: string
// }

const props = withDefaults(defineProps<Props>(), {
  data: () => {
    return {}
  },
  rules: () => {
    return {}
  },
  labelPosition: 'left',
  labelWidth: '100px',
  formItem: () => {
    return []
  }
})

// emit
const emit = defineEmits(['blur', 'change'])

const formData = ref(props.data)
const formRef = ref()
defineExpose({ formRef })

const handleBlur = (event: FocusEvent, item: FormItem) => {
  emit('blur', event, item)
}

const handleChange = (event: MouseEvent, item: FormItem) => {
  emit('change', event, item)
}
</script>

<style lang="scss" scoped>
:deep(.el-input) {
  .el-input-group__append,
  .el-input-group__prepend {
    cursor: pointer;
    padding: 0;
  }
}

:deep(.common_select.el-select) {
  width: 100%;
}

.common_form {
  width: 100%;
  height: 100%;

  .el-form-item {
    align-items: center;
  }
}

.form-date {
  width: 100%;
}
</style>
