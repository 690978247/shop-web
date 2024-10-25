import router from '@/router/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUser } from '@/store/modules/user.ts'
import { ElMessage } from 'element-plus'
import { deleteUrlParamsAndReplaceUrl } from '@/utils/common.ts'

const { doGoogleLogin, syncUserInfo, updateIntercom } = useUser()

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: true, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

/**
 * @description 路由拦截 beforeEach
 * */

router.beforeEach(async (to, from, next) => {
  updateIntercom()
  NProgress.start()
  const searchParams = new URLSearchParams(window.location.search)
  const tk = searchParams.get('tk')
  const state = searchParams.get('state')
  const code = searchParams.get('code')
  const scope = searchParams.get('scope')
  if (tk) {
    try {
      await syncUserInfo(tk)
      deleteUrlParamsAndReplaceUrl(['tk'])
      next()
    } catch (error) {
      next()
    }
  } else if (scope && state && code) {
    const authScope = scope.split(' ')[0]
    if (authScope.indexOf('google') === -1) {
      ElMessage.error(
        'Google account cannot be available, please use Email registration.'
      )
      next()
    } else {
      try {
        await doGoogleLogin(state, code)
        deleteUrlParamsAndReplaceUrl([
          'state',
          'code',
          'scope',
          'authuser',
          'prompt'
        ])
        next()
      } catch (error) {
        next()
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
