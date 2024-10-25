<template>
  <div id="podView">
    <LoginDialog
      v-model:visible="dialogLoginVisible"
      @goRegisterEmit="showRegisterDialog"
    ></LoginDialog>
    <RegisterDialog
      v-model:visible="dialogRegisterVisible"
      @onSignInClick="showLoginDialog"
    ></RegisterDialog>
  </div>
</template>

<script setup lang="ts">
import LoginDialog from '@/layout/header/components/logindialog.vue'
import RegisterDialog from '@/layout/header/components/registerdialog.vue'
import { useUser } from '@/store/modules/user'
import { loginEventBus /* registerEventBus */ } from '@/utils/common'

const dialogLoginVisible = ref(false)
const dialogRegisterVisible = ref(false)
const { tryAutoLogin, logout } = useUser()

const showLoginDialog = () => {
  dialogLoginVisible.value = true
}

const showRegisterDialog = () => {
  dialogRegisterVisible.value = true
}

const loginEventListener = () => {
  logout()
  showLoginDialog()
}

// const registerEventListener = () => {
//   logout()
//   showRegisterDialog()
// }

onMounted(() => {
  tryAutoLogin()
  loginEventBus.on(loginEventListener)
  // registerEventBus.on(registerEventListener)
})

onBeforeUnmount(() => {
  loginEventBus.off(loginEventListener)
  // registerEventBus.off(registerEventListener)
})
</script>

<style scoped>
#podView {
  width: 100%;
  height: 100%;
}
</style>
