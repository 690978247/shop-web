import { createApp } from 'vue'
import App from './App.vue'
import router from './utils'
import './utils/rem'

import '@/styles/main.scss'
// 统一导入 element 图标
import * as Icons from '@element-plus/icons-vue'
// 引入element样式
// import 'element-plus/dist/index.css'
// 使用pinai store
import pinia from '@/store/index'
/* 引入iconfont */
import '@/assets/iconfont/iconfont.css'
import '@/assets/iconfont/iconfont.js'
// 使用国际化 vue-i18n
import I18n from '@/language/index'
// import { JSCoreGlobalConfig } from 'sm-js-core'

// 注册swiper
import { register } from 'swiper/element/bundle'
import 'swiper/css'

const app = createApp(App)

register()

// 注册全局 element-icons 组件
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons])
})

// 添加性能监控
// const Sentry = useSentry()
// Sentry.init(app)

// JSCoreGlobalConfig.getInstance().setOptions({
//   ossBaseUrl: window.location.origin + '/goodsapi'
// })

//UD强制英语
localStorage.setItem('language', 'en')

app.use(router).use(pinia).use(I18n)
app.provide('$t', I18n.global.t)

app.mount('#app')
