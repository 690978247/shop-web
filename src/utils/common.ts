import { reactive } from 'vue'
import { importPublish } from '@/api/user'
import { ElMessageBox } from 'element-plus'
import { useUser } from '@/store/modules/user.ts'
import { useEventBus } from '@vueuse/core'
import { EventIds } from '@/utils/eventIds.ts'
import I18n from '@/language'

const $t: any = I18n.global.t

export const loginEventBus = useEventBus(EventIds.Event_ID_Login_Dialog)
export const registerEventBus = useEventBus(EventIds.Event_ID_Register_Dialog)
export const headerEventBus = useEventBus(EventIds.Event_ID_Header_Search)

export const ProductCollections = [
  {
    label: $t('aliexpresshotstyle'),
    value: 'ALI_EXPRESS_HOT'
  },
  {
    label: $t('tikTokhotstyle'),
    value: 'TIKTOK_HOT'
  },
  {
    label: $t('amazonhotstyle'),
    value: 'AMAZON_HOT'
  }
]

export function makeReactive(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item: any) => makeReactive(item))
  }

  const reactiveObj: any = {}
  for (const key in obj) {
    reactiveObj[key] = makeReactive(obj[key])
  }
  return reactive(reactiveObj)
}

// 下载excel
export function downloadFile(data: any, download: any) {
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  // 获取heads中的filename文件名
  const downloadElement = document.createElement('a')
  // 创建下载的链接
  const href = window.URL.createObjectURL(blob)
  downloadElement.href = href
  // 下载后文件名
  downloadElement.download = download
  document.body.appendChild(downloadElement)
  // 点击下载
  downloadElement.click()
  // 下载完成移除元素
  document.body.removeChild(downloadElement)
  // 释放掉blob对象
  window.URL.revokeObjectURL(href)
}

// import { getNewToken } from '@/api/login'
// import { setToken } from './token'
// export function getNewTokenFn() {
//   return getNewToken()
//     .then((res) => {
//       // 重置token成功
//       if (res.data.Success) {
//         setToken(res.data.Result)
//         return res.data.Result.Token
//       } else {
//         // 清除过期token
//         sessionStorage.removeItem('USAdrop_user')
//         sessionStorage.removeItem('Authorization')
//         //   重置失败返回登录
//         window.location.href = '/login'
//         return Promise.reject()
//       }
//     })
//     .catch(() => {
//       // 清除过期token
//       sessionStorage.removeItem('USAdrop_user')
//       sessionStorage.removeItem('Authorization')
//       //   重置失败返回登录
//       window.location.href = '/login'
//       return Promise.reject()
//     })
// }

export function randomLinksValue() {
  return Math.floor(Math.random() * (2000 - 0 + 1)) + 0
}

export function blob2Base64(blob: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const base64 = reader.result?.toString() || ''
      resolve(base64)
    })
    reader.addEventListener('error', () => {
      reject(new Error('message'))
    })
    reader.readAsDataURL(blob)
  })
}

/**
 * 产品刊登
 * @param goodsCode 产品id
 * @param countryCode 国家
 */
export function productPublish(goodsCode: string, countryCode?: string) {
  return new Promise((resolve) => {
    const wtk = useUser().state.wtk
    const token = useUser().state.token
    if (!wtk || !token) {
      loginEventBus.emit()
      resolve(null)
      return
    }
    const postData = {
      goodsCode: goodsCode,
      country: localStorage.getItem('language'),
      countryCode: countryCode || 'US'
      // cookieVal: token,
      // wtk: wtk
    }
    importPublish(postData)
      .then((res: any) => {
        if (res.success) {
          ElMessageBox.confirm(
            'Upload successfully, do you want to go to USAdrop for details?',
            'Title',
            {
              confirmButtonText: 'Confirm',
              cancelButtonText: 'Cancel',
              customClass: 'usadrop-confirm',
              type: 'warning'
            }
          ).then(() => {
            window.open(
              `${import.meta.env.VITE_UD_BASE_URL}/ImportList?tk=${wtk}`
            )
          })
        } else if (Number(res.code) === 401) {
          loginEventBus.emit()
        }
        resolve(res)
      })
      .catch((error) => {
        if (error.response?.data?.code === 401) {
          //需要触发登录
          loginEventBus.emit()
        }
        resolve(null)
      })
  })
}

//商品connect页面
export function go2UDProConnect(goodsCode: any) {
  const tk = useUser()?.state?.token
  if (!tk) {
    loginEventBus.emit()
    return
  }
  window.open(
    `${import.meta.env.VITE_UD_BASE_URL}/ProConnect?tk=${tk}&goodsCode=${goodsCode}`
  )
}

//会员升级页面
export function memberUpgradeConfirm() {
  const tk = useUser()?.state?.token
  if (!tk) {
    loginEventBus.emit()
    return
  }
  window.open(`${import.meta.env.VITE_UD_BASE_URL}/Upgrade?tk=${tk}`)
}

/**
 * 获取token
 */
export function getTKData(array: Array<any> = []) {
  const tk = array.find((f) => f.Key === '__user_state_cookie__')?.Value ?? ''
  const wtk = array.find((f) => f.Key === 'wtk')?.Value ?? ''
  return { tk, wtk }
}

/**
 * 删除指定参数并替换当前浏览器url
 * @param keys 参数key 列表
 */
export function deleteUrlParamsAndReplaceUrl(keys: string[]) {
  if (keys === undefined || keys.length === 0) return
  const searchParams = new URLSearchParams(window.location.search)
  keys.forEach((item) => {
    searchParams.delete(item)
  })
  const newUrl =
    window.location.origin +
    window.location.pathname +
    '?' +
    searchParams.toString()
  window.location.replace(newUrl)
}

//显示会员体系
export function membershipVisibility() {
  return true
}

/**
 * POD 文本图层默认颜色
 */
export const podPredefineColors = [
  '#D0021B',
  '#F5A623',
  '#F8E71C',
  '#8B572A',
  '#7ED321',
  '#417505',
  '#BD10E0',
  '#9013FE',
  '#4A90E2',
  '#50E3C2',
  '#B8E986',
  '#000000',
  '#4A4A4A',
  '#9B9B9B'
]
