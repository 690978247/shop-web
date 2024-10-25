<template>
  <div>
    <div class="index-group-box">
      <span class="sku-title">Ship to:</span>
      <div class="index-group-boxIn">
        <div style="display: flex; align-items: center">
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
          <el-button class="check-button" @click="quote" v-if="!isPod">
            Check USAdrop quote
          </el-button>
        </div>
        <div class="frequency" v-if="isLogin && !isPod">
          <img
            width="24"
            src="https://static.hzpdex.com/web/1721022811231_Frame.svg"
            alt=""
          />
          &nbsp; Frequency:&nbsp;
          <span
            class="frequency-times"
            v-if="
              FrequencyTimes.TotalTimes === -1 &&
              FrequencyTimes.UsedTimes === -1
            "
          >
            Unlimited
          </span>
          <span class="frequency-times" v-else
            >{{ FrequencyTimes.UsedTimes }} /
            {{ FrequencyTimes.TotalTimes }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="shipping-method"
      v-if="productData.type === EnumProductTypes.Top100Product"
    >
      <div class="download" @click="downloadFile" v-loading="loading">
        One Click Download
        <ElTooltip
          content="Download the video and pictures of this product to scale your business right now."
          placement="top"
        >
          <ElIcon style="margin-left: 4px">
            <question-filled />
          </ElIcon>
        </ElTooltip>
      </div>
      <!-- <div v-if="selectCountry" class="right-tip">
        Shipping Method: <span class="right-tip active">USAdrop Fast Line</span>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import EN from '@/language/country/en.json'
import { EnumProductTypes } from '@/utils/constants'
import { TProductDetail } from '../../model/model'
import { downloadResourceByZip } from '@/utils/download'
import { loginEventBus } from '@/utils/common'
import {
  getExistMemberProductOuote,
  getRightsWithWinnerQuote
} from '@/api/user'

const props = defineProps({
  defaultCountry: {
    type: String,
    default: null
  },
  isLogin: {
    type: Boolean,
    default: false
  },
  quoted: {
    type: Boolean,
    default: false
  }
})

const productData: Ref<TProductDetail> = inject('productData')
const FrequencyTimes = ref({
  UsedTimes: 0,
  TotalTimes: 0
})
const isPod = computed(() => {
  return productData.value?.goodsCode.startsWith('SPUP')
})
const loading = ref(false)

const countryList = EN.list.map((item) => {
  return {
    label: item.label + ' [' + item.value + ']',
    value: item.value
  }
})
const selectCountry = ref(props.defaultCountry)
const didSelectIndexEmits = defineEmits([
  'onCountryClick',
  'quote',
  'debuteQuote'
])

watch(
  () => selectCountry.value,
  (newValue) => {
    didSelectIndexEmits('onCountryClick', newValue)
  }
)

const getQuoteTimes = () => {
  getRightsWithWinnerQuote({}).then((res) => {
    if (res.success) {
      FrequencyTimes.value.UsedTimes = res.Result.UsedTimes
      FrequencyTimes.value.TotalTimes = res.Result.TotalTimes
      // if (res.Result.TotalTimes === -1) {
      //   // 最高等级会员，不限次数，直接查看
      //   didSelectIndexEmits('quote')
      // }
    }
  })
}

watch(
  () => props.isLogin,
  async (newValue) => {
    if (!newValue) {
      return
    }
    getQuoteTimes()
    const quotedRes = await getExistMemberProductOuote(
      productData.value?.goodsCode
    )
    if (quotedRes.success && quotedRes.Result) {
      // 已经查看过报价，直接展示价格
      didSelectIndexEmits('quote')
    }
  }
)

defineExpose({
  getQuoteTimes
})

const downloadFile = () => {
  if (!productData.value?.images || !productData.value?.images?.length) {
    ElMessage.error('No image or video found')
    return
  }
  loading.value = true
  try {
    downloadResourceByZip({
      imageUrls: productData.value?.images || [],
      videoUrls: [productData.value?.mainVideo],
      fileName: productData.value?.goodsCode
    })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

/**
 * 点击quote
 */
const quote = () => {
  if (!props.isLogin) {
    loginEventBus.emit()
    return
  }
  if (props.quoted) {
    ElMessage.warning('Already quoted')
    return
  }

  // plus会员不做次数限制直接查看
  if (
    FrequencyTimes.value.UsedTimes >= FrequencyTimes.value.TotalTimes &&
    FrequencyTimes.value.TotalTimes !== -1 &&
    FrequencyTimes.value.UsedTimes !== -1
  ) {
    ElMessage.warning(
      'The maximum number of times to view quotations has been reached'
    )
    return
  }

  didSelectIndexEmits('debuteQuote')
}
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
  justify-content: space-between;

  :deep(.el-select .el-select__wrapper) {
    border-radius: 31px;
    //border: 1.5px solid #3f6aff;
  }

  .select-class {
    width: 180px;
    // margin-right: 24px;
  }
}

.right-tip {
  flex: 1;
  font-size: 16px;
  font-family: 'SourceSans3';
  text-align: right;

  &.active {
    color: #bc0c34;
    font-weight: 600;
  }
}

.check-button {
  color: #fff;
  border: none;
  background: #bc0c34;
  border-radius: 50px;
  padding: 0 12px;
  margin-left: 12px;
}

.frequency {
  display: flex;
  align-items: center;
  font-size: 16px;

  .frequency-times {
    color: #bc0c34;
  }
}

.shipping-method {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  background-color: #f6f6f6;
  border-radius: 4px;
  padding: 12px 32px;
  box-sizing: border-box;

  .download {
    cursor: pointer;
    color: #666666;
    font-size: 16px;
    display: flex;
    align-items: center;
  }
}
</style>
