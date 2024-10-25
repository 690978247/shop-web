import mitt, { Emitter } from 'mitt'

type Events = {
  [key: string]: any // 可以定义特定的事件类型
}

class DesignEventBus {
  private eventBus: Emitter<Events>

  constructor() {
    this.eventBus = mitt<Events>()
  }

  // 发送事件
  emit(event: string, payload?: any) {
    console.log('📣[DesignEventBus] 📢 ', event, 'payload:', payload)
    this.eventBus.emit(event, payload)
  }

  // 监听事件
  on(event: string, handler: (payload: any) => void) {
    console.log('📣[DesignEventBus] + ', event)
    this.eventBus.on(event, handler)
  }

  // 移除监听器
  off(event: string, handler?: (payload: any) => void) {
    this.eventBus.off(event, handler)
  }
}

// 单例模式，确保整个应用只使用一个事件总线实例
const designEventBus = new DesignEventBus()
export default designEventBus
