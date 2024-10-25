import { defineStore } from 'pinia'
import { DEFAULT_PRIMARY } from '@/config/config'
import { refreshToken } from '@/api/user'

interface SettingConfigProp {
  primary: string
  breadcrumb: boolean
  tabs: boolean
  footer: boolean
}

export const GlobalStore = defineStore('global', {
  state: () => ({
    // language
    language: localStorage.getItem('language') ?? 'en',
    // element组件大小
    assemblySize: 'default',
    // 全局设置
    settingConfig: {
      // 默认 primary 主题颜色
      primary: DEFAULT_PRIMARY,
      // 面包屑导航
      breadcrumb: false,
      // 标签页
      tabs: false,
      // 页脚
      footer: false
    },
    freshToken: ''
  }),
  getters: {},
  actions: {
    setSettingConfig(settingConfig: SettingConfigProp) {
      this.settingConfig = settingConfig
    },
    setAssemblySize(value: string) {
      this.assemblySize = value
    },
    setLanguage(value: string) {
      this.language = value
    },
    async getRefreshToken() {
      const token = localStorage.getItem('userToken')
      const newToken = await refreshToken(token)
      this.freshToken = newToken.data.result
      sessionStorage.setItem('newToken', newToken.data.result)
    }
  }
})
