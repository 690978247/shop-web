import { reactive, readonly, watch } from 'vue'
import { getUserInfo, googleLogin } from '@/api/user'
// import router from '@/router/router'
// import Cookies from 'js-cookie'
import { registerEventBus } from '@/utils/common.ts'

// 定义用户信息接口
interface User {
  isLoggedIn: boolean
  token: string | null
  loginOpen: boolean
  registerOpen: boolean
  wtk: string | null
  timer: null | any
  timerSwitch: boolean
  userInfo: {
    name: string | null
    email: string | null
    mobile_prefix: string | null
    mobile: string | null
    EnterpriseCode: string | null
  }
}

// 初始用户状态
const state = reactive<User>({
  isLoggedIn: false,
  loginOpen: false,
  registerOpen: false,
  token: null,
  wtk: null,
  timer: null,
  timerSwitch: false,
  userInfo: {
    name: null,
    email: null,
    mobile_prefix: null,
    mobile: null,
    EnterpriseCode: null
  }
})

// 用户状态操作方法
const methods = {
  // 登录成功时调用，保存用户信息和token
  // wtk: 跳转wiio的时候用到的tk
  login(
    token: string,
    userInfo: {
      name: string
      email: string
      mobile_prefix: string
      mobile: string
      EnterpriseCode: string
    },
    wtk: string
  ) {
    state.isLoggedIn = true
    state.token = token
    state.wtk = wtk
    state.userInfo = { ...userInfo }
    // 保存到本地存储，以便页面刷新后仍然保留登录状态
    localStorage.setItem('userToken', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('wtk', wtk)

    const currentTime = new Date().getTime()
    localStorage.setItem('lastLoginTime', currentTime.toString())
    methods.updateIntercom()
  },

  // 查询登录时间
  getWTokenTime() {
    const loginTime = localStorage.getItem('lastLoginTime')
    if (loginTime) {
      return new Date(parseInt(loginTime))
    } else {
      return null
    }
  },

  // 判断Wtk是否过期
  isWtkExpired() {
    const loginTime = localStorage.getItem('lastLoginTime')
    if (loginTime) {
      const currentTime = new Date().getTime()
      const halfHourInMillis = 30 * 60 * 1000 // 半小时的毫秒数
      const elapsedTime = currentTime - parseInt(loginTime)
      return elapsedTime > halfHourInMillis
    } else {
      // 如果没有记录上次登录时间，则认为已过期
      return true
    }
  },

  /**
   * 登出时调用，清除用户信息和token
   * @param clearInviteCode 是否清除邀请码
   */
  logout(clearInviteCode: boolean = false) {
    state.isLoggedIn = false
    state.token = null
    state.wtk = null
    state.userInfo = {
      name: null,
      email: null,
      mobile_prefix: null,
      mobile: null,
      EnterpriseCode: null
    }
    // 清除本地存储
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('wtk')
    localStorage.removeItem('lastLoginTime')
    if (clearInviteCode) {
      localStorage.removeItem('invitecode')
      localStorage.removeItem('pid')
    }

    methods.logoutIntercom()
    console.log('✅ 退出登录,数据已清空')
  },

  // 尝试恢复登录状态（例如，页面刷新时）
  tryAutoLogin() {
    const token = localStorage.getItem('userToken')
    const wtk = localStorage.getItem('wtk')
    const userInfo = localStorage.getItem('userInfo')
    if (token && userInfo) {
      const parsedUserInfo = JSON.parse(userInfo)
      methods.login(token, parsedUserInfo, wtk) // 修改这里的调用方式
      console.log('✅ 自动登录成功: ', parsedUserInfo)
    } else {
      console.log('❌ 自动登录失败，未找到存储的用户信息')
    }
  },
  syncUserInfo(token: string) {
    methods.logout()
    localStorage.setItem('userToken', token)
    localStorage.removeItem('wtk')
    return new Promise((resolve) => {
      getUserInfo()
        .then((res: any) => {
          if (res.success) {
            const data = res.data || {}
            const userInfo: any = {}
            // 处理用户信息
            userInfo.name = data.RealName || ''
            userInfo.email = data.Email || ''
            methods.login(token, userInfo, token)
            resolve({ success: true })
          } else {
            resolve(false)
          }
        })
        .catch(() => {
          resolve(false)
        })
    })
  },
  doGoogleLogin(state: string, code: string) {
    return new Promise((resolve, reject) => {
      try {
        googleLogin({
          Code: code,
          State: state
        })
          .then((res: any) => {
            if (res.success) {
              const result = res?.data || res.Result
              if (result) {
                const token = result.Token
                const wtk = result.Token

                const userInfo: any = {}
                // 处理用户信息
                userInfo.name = result.userName || ''
                userInfo.email = result.email || ''
                userInfo.mobile_prefix = result.mobile_prefix || ''
                userInfo.mobile = result.mobile || ''
                userInfo.EnterpriseCode = result.EnterpriseCode || ''
                methods.login(token, userInfo, wtk)
                resolve({ success: true })
              } else {
                reject({ success: false, msg: 'Error' })
              }
            } else {
              reject({ success: false, msg: 'Error' })
            }
          })
          .catch(() => {
            reject({ success: false, msg: 'Error' })
          })
      } catch (e) {
        reject({ success: false, msg: 'Error' })
      }
    })
  },
  updateIntercom() {
    if (window.Intercom) {
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo)
        console.log('intercom[更新] 个人信息 ', parsedUserInfo)
        const name = parsedUserInfo.name
        const email = parsedUserInfo.email
        window.Intercom('update', {
          name: name,
          email: email,
          created_at: new Date().getTime()
        })
      } else {
        console.log('intercom[更新] 无个人信息')
        window.Intercom('update', {
          created_at: new Date().getTime()
        })
      }
    }
  },
  logoutIntercom() {
    if (window.Intercom) {
      console.log('intercom[退出]')
      window.Intercom('shutdown')
    }
    methods.updateIntercom()
  },
  setLoginOpen(isOpen: boolean) {
    state.loginOpen = isOpen
  },
  setRegisterOpen(isOpen: boolean) {
    state.registerOpen = isOpen
  },
  // 添加注册弹窗 定时器
  startRegisterTimer(time: number = 10000) {
    if (state.timerSwitch) {
      this.clearTimer()
      return
    }
    state.timer = setInterval(() => {
      registerEventBus.emit()
      state.registerOpen = true
    }, time)
  },
  // 清除定时器
  clearTimer() {
    clearInterval(state.timer)
    state.timer = null
  },
  // 注册弹窗 定时器开关
  changeTimerSwitch(value: boolean) {
    state.timerSwitch = value
  }
}

watch(
  () => state.timerSwitch,
  (value) => {
    if (value === true) {
      methods.clearTimer()
    }
  }
)

// 提供外部使用的用户状态和操作
export const useUser = () => {
  return {
    state: readonly(state), // 使用 readonly 防止外部直接修改状态
    ...methods
  }
}
