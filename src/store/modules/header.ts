import { defineStore } from 'pinia'

export const HeaderStore = defineStore('HeaderState', {
  state: () => ({
    valueChange: false
  }),
  getters: {},
  actions: {
    setValueChange(value: any) {
      this.valueChange = value
    }
  }
})
