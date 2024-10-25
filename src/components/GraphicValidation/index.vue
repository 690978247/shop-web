<script setup lang="ts">
import LazySlideCaptcha from '@/components/LazySlideCaptcha/index.vue'
import { getCaptche, getVerifyCode } from '@/api/user'

defineOptions({ name: 'GraphicValidation' })

const props = defineProps({
  phoneNum: {
    type: String,
    required: true,
    default: ''
  },
  phoneCode: {
    type: String,
    required: true,
    default: ''
  }
})

const emits = defineEmits(['onSuccess'])

const captchaRef = ref()
const requestId = ref()
const successTip = ref('')
const failTip = ref('')

const generate = () => {
  // 改变内部状态，标识生成请求开始
  captchaRef.value.startRequestGenerate()
  getCaptche()
    .then((res: any) => {
      if (res.success) {
        requestId.value = res.data.Id
        // 改变内部状态，标识生成请求结束，同时设定background，slider图像
        captchaRef.value.endRequestGenerate(
          res.Result.BackgroundImage,
          res.Result.SliderImage
        )
      } else {
        failTip.value = 'Error'
        captchaRef.value.endRequestVerify(false)
      }
    })
    .catch((error) => {
      failTip.value = 'Error'
      captchaRef.value.endRequestVerify(false)
    })
}

const handleFinish = (data: any) => {
  // 改变内部状态，标识验证请求开始
  captchaRef.value.startRequestVerify()
  getVerifyCode({
    MobileNumber: props.phoneNum,
    phoneCode: props.phoneCode,
    Id: requestId.value,
    SmSlideTrack: data
  })
    .then((res: any) => {
      if (res.success) {
        // 验证通过时显示信息
        successTip.value = 'The code has been sent successfully.'
        captchaRef.value.endRequestVerify(true)
        setTimeout(() => {
          captchaRef.value.reset()
        }, 1000)
        emits('onSuccess')
      } else {
        // 验证失败时显示信息
        failTip.value = 'Error'
        captchaRef.value.endRequestVerify(false)
        setTimeout(() => {
          generate()
        }, 1000)
      }
    })
    .catch((error) => {
      failTip.value = 'Error'
      // 标识验证请求结束
      captchaRef.value.endRequestVerify(false)
      setTimeout(() => {
        generate()
      }, 1000)
    })
}

onMounted(() => {
  generate()
})
</script>

<template>
  <lazy-slide-captcha
    ref="captchaRef"
    :show-refresh="true"
    :fail-tip="failTip"
    :success-tip="successTip"
    @finish="handleFinish"
    @refresh="generate"
  >
  </lazy-slide-captcha>
</template>

<style lang="scss" scoped></style>
