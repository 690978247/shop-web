import axios from 'axios'
// import type { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { loginEventBus } from '@/utils/common.ts'
// import { GlobalStore } from '@/store/modules/global'
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000
})

/**
 * @description 请求拦截器
 */
// const globalStore = GlobalStore()
service.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('userToken')
    const newToken = sessionStorage.getItem('newToken')
    if (newToken && newToken !== token) {
      token = newToken
    }
    // token 存在 才添加
    if (token) {
      config.headers.Authorization = 'Bearer ' + token || ''
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * @description 响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    const resData = response.data
    if (typeof resData === 'string') {
      // 谷歌登录
      return resData
    }

    if (resData instanceof Blob) {
      // 流文件
      return resData
    }
    const res = responseAdapter(resData)
    if (res.success === false) {
      if (res.code === 401) {
        return res
      }
      if (response.config.headers['ignoreError'] !== 'true') {
        ElMessage({
          message: res.msg || res.message || 'Error',
          type: 'error',
          grouping: true,
          duration: 5 * 1000
        })
      }
      if (res.code === '401') {
        return res
      }
      return Promise.reject(new Error(res.msg || res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem('hasError401') === '1') {
        loginEventBus.emit()
      } else {
        localStorage.setItem('hasError401', '1')
        ElMessage({
          message: 'Login failed, please log in again',
          type: 'error',
          duration: 2 * 1000
        })
        loginEventBus.emit()
      }
    } else {
      ElMessage({
        message: 'The service is unavailable',
        type: 'error',
        duration: 2 * 1000
      })
      //如果token是错误的,需要清空,重新登录
      localStorage.setItem('userToken', '')
    }
    return Promise.reject(error)
  }
)

const responseAdapter = (response: any): any => {
  if (response.success === undefined || response.code === undefined) {
    return {
      code:
        response.Success || response.code === 0
          ? 10000
          : response.ErrCode || response.msg || -1,
      success: response.Success || response.code === 0,
      debugMsg: response.ErrMsg || response.msg,
      msg: response.ErrMsg || response.msg,
      data:
        response.Result || response.MapData || response.ResData || response.body
    }
  }
  return response
}
export default service
