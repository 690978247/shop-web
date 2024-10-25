export const viteProxyConfig = (mode: string) => {
  const target =
    mode === 'development' || mode === 'test'
      ? 'http://udshop-test.hzpdex.com'
      : 'https://product.usadrop.com'

  // 定义不同的代理路径和各自的配置
  return {
    '/api': {
      target: target,
      changeOrigin: true
    },
    '/goodsapi': {
      target: target,
      changeOrigin: true
    },
    '/podapi': {
      target: target,
      changeOrigin: true
    }
  }
}
