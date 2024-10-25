// import * as Sentry from '@sentry/vue'
// import router from '@/router/router'
//
// export function useSentry() {
//   const init = (component: any) => {
//     Sentry.init({
//       app: component,
//       dsn: import.meta.env.VITE_SENTRY_KEY,
//       // 跟踪应用的组件   开启影响应用渲染性能
//       // trackComponents: true,
//       // 跟踪的生命周期
//       // hooks: ['activate', 'create', 'unmount', 'mount', 'update'],
//       // 修改默认集成
//       integrations: [
//         // 集成路由
//         Sentry.browserTracingIntegration({ router }),
//         Sentry.replayIntegration({
//           maskAllText: false,
//           blockAllMedia: false
//         })
//       ],
//       // Performance Monitoring
//       tracesSampleRate: 1.0, //  Capture 100% of the transactions
//       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//       tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
//       // Session Replay
//       replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//       replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//     })
//     console.log('【Sentry】init ✅')
//   }
//
//   /**
//    * 捕获异常错误并发送到 Sentry
//    * @param error 错误对象
//    */
//   const captureException = (error: Error) => {
//     Sentry.captureException(error)
//     console.log('【Sentry】captureException ： ', error)
//   }
//
//   /**
//    * 捕获消息并发送到 Sentry
//    * @param message 消息字符串
//    */
//   const captureMessage = (message: string) => {
//     Sentry.captureMessage(message)
//     console.log('【Sentry】captureMessage ： ', message)
//   }
//
//   /**
//    * 添加面包屑信息到 Sentry
//    * @param breadcrumb 面包屑对象
//    */
//   const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
//     Sentry.addBreadcrumb(breadcrumb)
//     console.log('【Sentry】breadcrumb ： ', breadcrumb)
//   }
//
//   /**
//    * 设置用户信息到 Sentry
//    * @param user 用户对象
//    */
//   const setUser = (user: Sentry.User) => {
//     Sentry.setUser(user)
//     console.log('【Sentry】setUser ： ', user)
//   }
//
//   return { init, captureException, captureMessage, addBreadcrumb, setUser }
// }
