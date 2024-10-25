<template>
  <div id="view">
    <el-config-provider :locale="i18nLocale" :size="assemblySize">
      <RouterView />
      <LoginRegister></LoginRegister>
      <!-- <GTranslate /> -->
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { GlobalStore } from '@/store/modules/global'
import { storeToRefs } from 'pinia'
// 配置element中英文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import es from 'element-plus/es/locale/lang/es'
import ptBr from 'element-plus/es/locale/lang/pt-br'
// 使用主题
import { useTheme } from '@/hooks/useTheme'
import LoginRegister from '@/components/LoginRegister/index.vue'
/* import GTranslate from '@/components/GTranslate/index.vue' */

useTheme()

const globalStore = GlobalStore()

const { assemblySize, language } = storeToRefs(globalStore)
// element 语言配置
const i18nLocale = computed(() => {
  if (language.value && language.value === 'zh') return zhCn
  if (language.value && language.value === 'en') return en
  if (language.value && language.value === 'es') return es
  if (language.value && language.value === 'br') return ptBr
  return en
})
let timer: any = null
onUnmounted(() => {
  clearInterval(timer)
  timer = null
  sessionStorage.removeItem('newToken')
})
</script>

<style scoped>
#view {
  width: 100%;
  height: 100%;
  overflow-y: hidden;
}
</style>
