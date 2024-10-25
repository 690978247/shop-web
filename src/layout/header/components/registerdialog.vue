<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.visible"
      :showClose="false"
      class="myDialog"
      top="10vh"
      width="35%"
      @open="handleOpen"
      @close="handleClose"
    >
      <div>
        <div class="logo">
          <img src="@/assets/images/login/udLogo.svg" alt="" />
        </div>
        <div class="login-title">
          <p>{{ $t('userRegistration') }}</p>
        </div>
        <div class="progess">
          <div class="step" :class="currentStep === 1 && 'is-step'">Step1</div>
          <div class="dot">························></div>
          <div class="step" :class="currentStep === 2 && 'is-step'">Step2</div>
        </div>
      </div>
      <el-form
        v-if="currentStep === 1"
        label-position="top"
        size="large"
        :rules="stepRules1"
        :model="formData"
        ref="formRef"
        class="form-content"
      >
        <el-form-item label=" " class="option" prop="Account">
          <el-input
            v-model="formData.Account"
            :placeholder="`${$t('fullNamePlaceholder')}`"
          />
        </el-form-item>

        <el-form-item label=" " class="option" prop="Email">
          <el-input
            v-model="formData.Email"
            :placeholder="`${$t('addressPlaceholder')}`"
          />
        </el-form-item>

        <el-form-item label="" class="option" prop="MarketingCode">
          <el-input
            v-model="formData.MarketingCode"
            :placeholder="`${$t('invitationPlaceholder')}`"
          />
        </el-form-item>
      </el-form>

      <el-form
        v-if="currentStep === 2"
        label-position="top"
        size="large"
        :rules="stepRules2"
        :model="lastFormData"
        ref="lastFormRef"
        class="form-content"
      >
        <i class="title">let us help you to scale your business!</i>
        <el-form-item label="" class="option" prop="OrdersByDay">
          <!-- <el-input
            v-model="lastFormData.OrdersByDay"
            :placeholder="`${$t('howManyOrders')}?`"
          /> -->

          <el-select
            style="width: 100%"
            v-model="lastFormData.OrdersByDay"
            :placeholder="` ${$t('howManyOrders')}`"
          >
            <el-option
              v-for="item in dayList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" class="option" prop="MobileNumber">
          <el-input
            v-model="lastFormData.MobileNumber"
            clearable
            :placeholder="`${$t('inputPhoneNumber')}?`"
            class="input-with-select"
          >
            <template #prepend>
              <el-select
                v-model="lastFormData.PhoneCodeId"
                default-first-option
                :placeholder="`${$t('pleaseSelect')}`"
                filterable
                style="
                  text-align: center;
                  width: 120px;
                  background-color: white;
                "
                @change="onPhoneCodeSelected"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                >
                  <span>{{ item.englishName }}({{ item.label }})</span>
                </el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="" class="option" prop="VerifyCode">
          <div class="verify-row">
            <div class="row-input">
              <el-input
                v-model="lastFormData.VerifyCode"
                :placeholder="`${$t('verification')}?`"
              />
            </div>
            <div class="row-btn">
              <el-button
                type="info"
                :loading="showSmsSendLoading"
                color="#EFF1F3"
                class="next-btn"
                @click="handleSendCode"
                >Send Code
              </el-button>
            </div>
            <div class="row-span">
              <span @click="handleNoCode">No Code?</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="" class="option" prop="Passwd">
          <el-input
            v-model="lastFormData.Passwd"
            :show-password="true"
            :placeholder="`${$t('passwordPlaceholder')}`"
          />
        </el-form-item>
        <!-- <el-form-item label="" class="option" prop="isCheck"> -->
        <el-checkbox
          class="check"
          v-model="lastFormData.isCheck"
          :label="$t('agree')"
        />
        <!-- </el-form-item> -->
      </el-form>
      <div class="login-bottom">
        <div class="btns">
          <div class="next-step" v-if="currentStep === 1">
            <el-button
              @click="noregister"
              :loading="loading"
              color="#F0F1F3"
              class="next-step-btn"
              size="large"
              >{{ $t('noRegistration') }}
            </el-button>
            <el-button
              @click="nextStep"
              :loading="loading"
              color="#15104B"
              class="next-step-btn"
              size="large"
              >{{ $t('nextStep') }}
            </el-button>
          </div>

          <div class="next-step" v-if="currentStep === 2">
            <el-button
              @click="backStep"
              color="#EFF1F3"
              class="next-step-btn"
              size="large"
              >{{ $t('back') }}
            </el-button>

            <el-button
              @click="confirm"
              color="#15104B"
              class="next-step-btn"
              :loading="loading"
              size="large"
              >{{ $t('confirm') }}
            </el-button>
          </div>

          <div class="small">
            {{ $t('existingAccount') }}
            <span class="cursor" @click="goSignIn">{{ $t('signIn') }}</span>
          </div>
        </div>
      </div>
      <sendcode-dialog
        v-model:visible="handleDialogSendCode"
        :areacode="lastFormData.PhoneCode || '1'"
        :mobile="lastFormData.MobileNumber || ''"
      ></sendcode-dialog>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElDialog, ElMessage, FormItemRule } from 'element-plus'
import Cookies from 'js-cookie'
import {
  checkAccountExist,
  checkMobileExist,
  logIn,
  Phone,
  Register,
  VetifyMarketingCode
} from '@/api/user'
import { useUser } from '@/store/modules/user'
import SendcodeDialog from './sendcodedialog.vue'

const $t: any = inject('$t')
const currentStep = ref(1)

type Arrayable<T> = T | T[]

interface FormRules {
  [key: string]: Arrayable<FormItemRule>
}

const handleDialogSendCode = ref(false)
// 定义 props 接收来自父组件的值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})
const loading = ref(false)
const showSmsSendLoading = ref(false)
const emit = defineEmits(['update:visible', 'onSignInClick'])
const handleOpen = () => {
  // const code = localStorage.getItem('invitecode') || ''
  // formData.MarketingCode = code
  selectPhoneOptions()
}

const handleClose = () => {
  formData = reactive({
    Account: '',
    Email: '',
    MarketingCode: ''
  })
  lastFormData = reactive({
    OrdersByDay: '',
    PhoneCode: '1',
    PhoneCodeId: '1',
    MobileNumber: '',
    VerifyCode: '',
    Passwd: '',
    isCheck: false,
    FromSite: 'product.usadrop.com' // 区分注册来源
  })

  currentStep.value = 1
  formRef?.value?.resetFields()
  lastFormRef?.value?.resetFields()

  emit('update:visible', false)
}

let formData = reactive({
  Account: '',
  Email: '',
  MarketingCode: ''
})

let lastFormData = reactive({
  OrdersByDay: '',
  PhoneCodeId: '1',
  PhoneCode: '1',
  MobileNumber: '',
  VerifyCode: '',
  Passwd: '',
  isCheck: false,
  FromSite: 'product.usadrop.com' // 区分注册来源
})

// const phoneCode = ref(formData.phoneCode) // 使用ref创建响应式数据
const options = ref<any[]>([
  {
    id: '1',
    phoneCode: '1',
    label: '+1',
    englishName: 'United States'
  }
]) // 使用ref创建响应式数据

const dayList = [
  {
    id: 1,
    value: 'Not started yet',
    label: 'Not started yet'
  },
  {
    id: 2,
    value: '1-5 orders',
    label: '1-5 orders'
  },
  {
    id: 3,
    value: '6-20 orders',
    label: '6-20 orders'
  },
  {
    id: 4,
    value: '21-50 orders',
    label: '21-50 orders'
  },
  {
    id: 5,
    value: 'More than 50 orders',
    label: 'More than 50 orders'
  }
]

const formRef = ref<FormInstance>()
const lastFormRef = ref<FormInstance>()
const stepRules1: FormRules = {
  Account: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'blur'
    }
  ],
  Email: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'blur'
    },
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: 'Please enter a valid email address'
    }
  ]
}

const stepRules2: FormRules = {
  OrdersByDay: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'change'
    }
  ],
  MobileNumber: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'blur'
    }
  ],
  VerifyCode: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'blur'
    }
  ],
  Passwd: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'blur'
    }
  ],
  isCheck: [
    {
      required: true,
      message: `${$t('fieldCannotBeEmpty')}`,
      trigger: 'change'
    }
  ]
}

const noregister = () => {
  useUser().changeTimerSwitch(true)
  emit('update:visible', false)
}

const nextStep = () => {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      checkAccountExist(formData.Email)
        .then((res: any) => {
          loading.value = false
          if (res.success) {
            if (formData.MarketingCode) {
              loading.value = true
              VetifyMarketingCode(formData.MarketingCode)
                .then((res: any) => {
                  if (res.success) {
                    currentStep.value = 2
                  }
                })
                .finally(() => {
                  loading.value = false
                })
            } else {
              currentStep.value = 2
            }
          }
        })
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 100)
        })
    }
  })
}

const backStep = () => {
  lastFormRef.value.resetFields()
  currentStep.value = 1
}

// 处理 邀请码
const getInvite = (code, pid) => {
  const inviteData = {
    ShopPid: ''
  }
  if (code !== '' && pid) {
    inviteData.ShopPid = pid
  }
  return inviteData
}

const handleCode = () => {
  const localStorageCode = localStorage.getItem('invitecode') || ''
  const cookieCode = Cookies.get('MarketingCode') || ''

  // 当两个code 同时存在，使用localStorageCode， 并覆盖cookieCode
  if (localStorageCode !== '' && cookieCode !== '') {
    const currentCode = localStorageCode
    Cookies.set('MarketingCode', currentCode)
    return currentCode
  }
  // localStorageCode存在，cookieCode不存在
  if (localStorageCode) {
    return localStorageCode
  }
  // cookieCode存在, localStorageCode不存在
  if (cookieCode) {
    return cookieCode
  }

  // 都不存在
  return ''
}

const confirm = () => {
  lastFormRef.value.validate((valid) => {
    if (valid) {
      if (!lastFormData.isCheck) {
        ElMessage.warning($t('agreeTo'))
        return
      }
      // const invitecode = localStorage.getItem('invitecode') || ''
      const invitecode = handleCode()
      const pid = localStorage.getItem('pid') || ''
      const code = formData.MarketingCode ? formData.MarketingCode : invitecode
      const inviteData = getInvite(code, pid)
      const postData = {
        ...formData,
        MarketingCode: code,
        ...lastFormData,
        ...inviteData
      }
      loading.value = true
      Register(postData)
        .then((res: any) => {
          loading.value = false
          if (res.success) {
            hanldeLogIn()
            fbGoogle()
          } else {
            ElMessage({
              type: 'warning',
              message: res.message
            })
          }
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}

const hanldeLogIn = () => {
  const postData = {
    email: formData.Email,
    pwd: lastFormData.Passwd
  }
  logIn(postData)
    .then((res: any) => {
      if (res.success) {
        const result = res?.data
        const userInfo = {
          name: '',
          email: '',
          mobile_prefix: '',
          mobile: '',
          EnterpriseCode: ''
        }

        if (result) {
          try {
            const { login } = useUser()
            // const jsonWithoutEscape =
            //   result.cookies?.replace(/\\/g, '') || '[]' // 去掉转义符号，且默认为一个空数组的字符串表示
            // const jsonArray = JSON.parse(jsonWithoutEscape)
            // const tkData = getTKData(jsonArray)
            // const token = tkData.tk
            // const wtk = tkData.wtk

            const token = result.Token
            const wtk = result.Token

            // 处理用户信息
            userInfo.name = result.userName || ''
            userInfo.email = result.email || ''
            userInfo.mobile_prefix = result.mobile_prefix || ''
            userInfo.mobile = result.mobile || ''
            userInfo.EnterpriseCode = result.EnterpriseCode || ''

            login(token, userInfo, wtk)
          } catch (error) {
            ElMessage({
              type: 'warning',
              message: `${$t('loginFailed') - 2}`
            })
          }
        } else {
          ElMessage({
            type: 'warning',
            message: `${$t('loginFailed') - 1}`
          })
        }

        handleClose()
      } else {
        handleClose()
      }
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 100)
    })
}

const handleSendCode = () => {
  if (!lastFormData.PhoneCode) {
    ElMessage({
      type: 'warning',
      message: $t('pleaseSelectYourCountryCode')
    })
    return
  }
  if (!lastFormData.MobileNumber) {
    ElMessage({
      type: 'warning',
      message: $t('pleaseEnterYourMobileNumber')
    })
    return
  }
  showSmsSendLoading.value = true
  checkMobileExist(lastFormData.PhoneCode, lastFormData.MobileNumber)
    .then((res: any) => {
      if (res.success) {
        handleDialogSendCode.value = true
      }
    })
    .finally(() => {
      showSmsSendLoading.value = false
    })
}

const handleNoCode = () => {
  ElMessage({
    message: 'Emails us:info@usadrop.com',
    grouping: true,
    duration: 5000,
    type: 'info'
  })
}

const selectPhoneOptions = async () => {
  try {
    Phone().then((res: any) => {
      if (res.success) {
        try {
          const jsonObj = res.Result
          // 确保jsonObj['country']是一个数组，如果不是或未定义，则使用空数组
          const countries = Array.isArray(jsonObj) ? jsonObj : []
          options.value = countries.map((country) => ({
            id: `${country.Id}`,
            phoneCode: country.PhoneCode,
            label: `+${country.PhoneCode}`,
            englishName: country.EnglishName
          }))
        } catch (error) {
          console.error('phone code error:', error)
          // 可以根据需要处理错误，比如设置options.value为默认值
        }
      } else {
        ElMessage({
          type: 'warning',
          message: res.message
        })
      }
    })
  } catch (error) {
    console.log(error)
  }
}
const onPhoneCodeSelected = (value: string) => {
  lastFormData.PhoneCode =
    options.value.find((item: any) => item.id === value)?.phoneCode || '1'
}

const goSignIn = () => {
  emit('onSignInClick', {})
}

const fbGoogle = () => {
  fbq('track', 'CompleteRegistration')
  gtag('event', 'conversion', {
    send_to: 'AW-10836134056/fDCLCNyq5LsZEKiRia8o'
  })
}
</script>

<style lang="scss" scoped>
.dialog {
  :deep(.myDialog) {
    border-radius: 24px !important;

    .el-dialog__header {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  .language-flag {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    vertical-align: middle;
  }

  .logo {
    text-align: center;

    img {
      width: 90px;
      height: 64px;
    }
  }

  .login-title {
    text-align: center;

    p {
      color: #000;
      font-size: 22px;
      font-weight: 500;
      margin-top: 10px;
    }
  }

  .login-bottom {
    padding: 20px 0px;

    .next-step {
      display: flex;
      justify-content: center;

      .next-step-btn {
        width: 230px;
        border-radius: 24px;
      }
    }
  }

  .progess {
    font-size: 18px;
    padding: 40px 0;
    display: flex;
    justify-content: center;

    .dot {
      margin: 0 10px;
    }

    .step {
      font-weight: bold;
    }

    .is-step {
      color: #3f6aff;
    }
  }

  .small {
    text-align: center;
    margin-top: 10px;
  }

  .form-content {
    width: 100%;
    overflow-x: auto;

    :deep(.el-form-item) {
      position: relative;

      .el-form-item__label {
        position: absolute;
        top: 0;
        left: -16px;
        line-height: 0;
      }
    }

    .title {
      padding-left: 25px;
    }

    .check {
      padding-left: 25px;
    }

    .EnterPhoneNumber {
      margin-left: 15px;
    }

    .option {
      margin-top: 20px;
      margin-left: 25px;
      margin-right: 25px;
    }

    .EnterPhoneCode {
      height: 38px;
      width: 235px;
    }

    .sendPhoneNumber {
      background: #3f6aff;
      color: #fff;
      height: 41px;
      border: #3f6aff;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      width: 264px;
      white-space: nowrap; /* 防止文本换行 */
      overflow: hidden; /* 溢出内容隐藏 */
      text-overflow: ellipsis; /* 溢出时显示省略号 */
    }

    .mobile {
      margin-left: 25px;
    }

    .line {
      width: 1px;
      height: 40px;
      background: #cccccc;
    }

    .selectAreaCode {
      width: 100px;
    }

    .selectPhone {
      width: 182px;
    }
  }

  .mobile_input {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    // flex-direction: row;
  }

  .verify-row {
    width: 100%;
    display: flex;

    .row-input {
      flex: 1;
      margin-right: 8px;
    }

    .row-btn {
      .next-btn {
        width: 100px;
        color: #3f6aff;
      }
    }

    .row-span {
      text-align: right;
      color: #3f6aff;
      padding-left: 8px;

      > span {
        cursor: pointer;
      }
    }
  }

  .pay-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.6);

    .ValidationBox {
      vertical-align: middle;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 200px;
    }
  }
}
</style>
