<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.visible"
      :showClose="false"
      width="30%"
      class="myDialog"
      top="8vh"
      @close="handleClose"
    >
      <div class="login-content">
        <img src="@/assets/images/login/udLogo.svg" alt="" class="logo2" />
        <div class="login-title">{{ $t('welcome') }}</div>
        <el-form
          label-position="top"
          :rules="rules"
          size="large"
          :model="formData"
          ref="formRef"
          class="form-content"
        >
          <el-form-item :label="$t('email')" class="option" prop="Email">
            <el-input v-model="formData.Email" />
          </el-form-item>
          <el-form-item :label="$t('password')" class="option" prop="Pwd">
            <el-input v-model="formData.Pwd" :show-password="true" />
          </el-form-item>
          <div class="ForgetPassword" @click="openForgetPasswordPage">
            {{ $t('forgetPassword') }}
          </div>
          <div class="login-bottom">
            <div class="btns">
              <el-button
                :loading="loading"
                class="sign-btn"
                color="#15104B"
                @click="signIn(formRef)"
                >{{ $t('signIn') }}
              </el-button>
              <div class="small">
                {{ $t('dontHaveAnAccount') }}?
                <span class="cursor" @click="goRegister">{{
                  $t('signUpHere')
                }}</span>
              </div>
            </div>
          </div>
        </el-form>
        <div class="login-footer">
          <div class="divider">
            <el-divider content-position="center">
              <span class="text">OR</span>
            </el-divider>
          </div>
          <div class="google">
            <el-button
              color="#15104B"
              size="large"
              @click="googleLogin"
              class="google-btn"
            >
              <img :src="googleImg" alt="" /> Sign in with Goolgle
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElDialog, ElMessage } from 'element-plus'
import { logIn, platformLogIn } from '@/api/user'
import { useUser } from '@/store/modules/user'
import googleImg from '@/assets/images/login/google.png'

const $t: any = inject('$t')

// 定义 props 接收来自父组件的值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['update:visible', 'goRegisterEmit'])

const handleClose = () => {
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (open) => {
    if (open) {
      useUser().clearTimer()
    } else {
      useUser().startRegisterTimer()
    }
  }
)

const formData = reactive({
  // felix@qq.com
  // 123456
  Email: '',
  Pwd: ''
})
const formRef = ref<FormInstance>()
const rules = {
  Email: [
    {
      required: true,
      message: $t('pleaseEnterTheCorrectEmailAddress'),
      trigger: 'blur'
    }
  ],
  Pwd: [
    {
      required: true,
      message: $t('fieldCannotBeEmpty'),
      trigger: 'blur'
    }
  ]
}

const goRegister = () => {
  emit('goRegisterEmit', {})
}

const loading = ref(false)

const signIn = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    /* debugger */
    if (valid) {
      loading.value = true
      logIn({
        email: formData.Email,
        pwd: formData.Pwd
      })
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
                // 登录成功刷新页面
                location.reload()
                login(token, userInfo, wtk)
              } catch (error) {
                ElMessage({
                  type: 'warning',
                  message: "`$t('loginFailed') -2`"
                })
              }
            } else {
              ElMessage({
                type: 'warning',
                message: "`$t('loginFailed') -1`"
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
    } else {
      return false
    }
  })
}

// 谷歌登录
const googleLogin = () => {
  platformLogIn('Google').then((res: any) => {
    window.location.href = res
  })
}

const openForgetPasswordPage = () => {
  window.open(`${import.meta.env.VITE_UD_BASE_URL}/password`, '_blank')
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

  .logo2 {
    width: 90px;
    height: 64px;
    margin-left: 25px;
  }

  .login-title {
    color: #000;
    font-size: 22px;
    font-weight: 900;
    margin-top: 30px;
    margin-left: 25px;
  }

  .ForgetPassword {
    cursor: pointer;
    text-align: right;
    color: var(--sm-text-color-regular);
    margin-right: 25px;
    &:hover {
      text-decoration: underline;
    }
  }

  .login-bottom {
    text-align: center;
  }

  .form-content {
    margin-top: 30px;
    height: 380px;
  }

  .btns {
    .small {
      margin-top: 15px;
    }
  }

  .option {
    margin-top: 30px;
    margin-left: 25px;
    margin-right: 25px;

    .EnterUsername {
      height: 45px;
    }
  }

  .sign-btn {
    width: 270px;
    height: 40px;
    margin-top: 40px;
    font-size: 18px;
    font-weight: 500;
    border-radius: 24px;
  }

  .login-footer {
    display: flex;
    flex-direction: column;

    .divider {
      padding: 0 20px;
      box-sizing: border-box;
      margin-bottom: 30px;
    }

    span.text {
      color: #3f6aff;
    }

    .google {
      padding-bottom: 40px;
      display: flex;
      justify-content: center;
      text-align: center;
    }

    .google-btn {
      width: 440px;
      border-radius: 24px;

      img {
        width: 40px;
        height: 40px;
        margin-right: 16px;
      }
    }
  }
}
</style>
