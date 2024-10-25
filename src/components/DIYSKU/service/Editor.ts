// 事件驱动 on / emit
import EventEmitter from 'events'
import { fabric } from 'fabric'
import hotkeys from 'hotkeys-js'
import ContextMenu from '@/components/DIYSKU/plugins/menu/ContextMenu.js'
// 轻量级的事件插件库 ˈtæpəbl/
// https://github.com/webpack/tapable
// https://juejin.cn/post/7040982789650382855
// AsyncSeriesHook : 异步串联执行
import { AsyncSeriesHook } from 'tapable'
import Utils from './utils'

// 事件管理实例
class Editor extends EventEmitter {
  // fabric画布实例
  private canvas: fabric.Canvas | null = null
  // 右键菜单实例
  contextMenu: ContextMenu | null = null

  // 插件集合
  private pluginMap: { [propName: string]: IPluginTempl } = {}
  // 自定义事件
  private customEvents: string[] = []
  // 自定义API
  private customApis: string[] = []
  // 生命周期函数名
  private hooks: IEditorHooksType[] = [
    'hookImportBefore',
    'hookImportAfter',
    'hookSaveBefore',
    'hookSaveAfter',
    'hookTransform'
  ]
  // 生命周期函数实体
  public hooksEntity: { [propName: string]: AsyncSeriesHook<any, any> } = {};

  [key: string]: any

  // 初始化编辑器
  init(canvas: fabric.Canvas) {
    if (!canvas) {
      console.log('❌创建编辑器失败，请检查 canvas 是否正确初始化')
      return
    }
    this.canvas = canvas
    // this._initContextMenu()
    // this._bindContextMenu()
    this._initActionHooks()
    this.Utils = Utils
    console.log('🟩[Editor]创建编辑器成功')
  }

  // 获取fabric画布实例
  // get fabricCanvas() {
  //   return this.canvas
  // }

  // 注入插件
  use(plugin: IPluginClass, options?: IPluginOption) {
    if (this._checkPlugin(plugin) && this.canvas) {
      this._saveCustomAttr(plugin)
      const pluginRunTime = new plugin(
        this.canvas,
        this,
        options || {}
      ) as IPluginClass
      pluginRunTime.pluginName = plugin.pluginName
      this.pluginMap[plugin.pluginName] = pluginRunTime
      this._bindingHooks(pluginRunTime)
      this._bindingHotkeys(pluginRunTime)
      this._bindingApis(pluginRunTime)
      //console.log('🟩[Editor]注入插件成功:', plugin.pluginName)
    }
  }

  // 销毁编辑器
  destroy() {
    this.canvas = null
    this.contextMenu = null
    this.pluginMap = {}
    this.customEvents = []
    this.customApis = []
    this.hooksEntity = {}
  }

  // 获取插件
  getPlugin(name: string) {
    return this.pluginMap[name]
  }

  // 生命周期事件初始化
  private _initActionHooks() {
    this.hooks.forEach((hookName) => {
      this.hooksEntity[hookName] = new AsyncSeriesHook(['data'])
    })
    console.log('🟩[Editor]初始化生命周期事件')
  }

  // 初始化右键菜单
  private _initContextMenu() {
    if (!this.canvas!.wrapperEl) {
      console.error('❌创建右键菜单失败，请检查 canvas 是否正确初始化')
      return
    }
    this.contextMenu = new ContextMenu(this.canvas!.wrapperEl, [])
    if (!this.contextMenu) {
      console.error('❌创建右键菜单失败')
      return
    }
    this.contextMenu.install()
    console.log('🟩[Editor]创建右键菜单成功')
  }

  // 右键菜单绑定
  private _bindContextMenu() {
    this.canvas?.on('mouse:down', (opt: any) => {
      if (opt.button === 3) {
        let menu: IPluginMenu[] = []
        Object.keys(this.pluginMap).forEach((pluginName) => {
          const pluginRunTime = this.pluginMap[pluginName]
          const pluginMenu =
            pluginRunTime.contextMenu && pluginRunTime.contextMenu()
          if (pluginMenu) {
            menu = menu.concat(pluginMenu)
          }
        })
        this._renderMenu(opt, menu)
      }
    })
    console.log('🟩[Editor]绑定右键菜单')
  }

  // 渲染右键菜单
  private _renderMenu(opt: { e: MouseEvent }, menu: IPluginMenu[]) {
    if (menu.length !== 0 && this.contextMenu) {
      this.contextMenu.hideAll()
      this.contextMenu.setData(menu)
      this.contextMenu.show(opt.e.clientX, opt.e.clientY)
    }
  }

  // 检查插件
  private _checkPlugin(plugin: IPluginClass) {
    const { pluginName, events = [], apis = [] } = plugin
    if (this.pluginMap[pluginName]) {
      throw new Error(pluginName + '插件重复初始化')
    }
    events.forEach((eventName: string) => {
      if (this.customEvents.includes(eventName)) {
        throw new Error(pluginName + '插件中' + eventName + '重复')
      }
    })

    apis.forEach((apiName: string) => {
      if (this.customApis.includes(apiName)) {
        throw new Error(pluginName + '插件中' + apiName + '重复')
      }
    })
    return true
  }

  // 绑定钩子
  private _bindingHooks(plugin: IPluginTempl) {
    this.hooks.forEach((hookName) => {
      const hook = plugin[hookName]
      if (hook) {
        this.hooksEntity[hookName].tapPromise(
          plugin.pluginName + hookName,
          (...args) => {
            const result = hook.apply(plugin, args)
            return result instanceof Promise ? result : Promise.resolve(result)
          }
        )
      }
    })
  }

  // 绑定快捷键
  private _bindingHotkeys(plugin: IPluginTempl) {
    plugin?.hotkeys?.forEach((keyName: string) => {
      hotkeys(keyName, { keyup: true }, (e) => {
        plugin.hotkeyEvent && plugin.hotkeyEvent(keyName, e)
      })
    })
  }

  // 保存插件自定义事件与API
  private _saveCustomAttr(plugin: IPluginClass) {
    const { events = [], apis = [] } = plugin
    this.customApis = this.customApis.concat(apis)
    this.customEvents = this.customEvents.concat(events)
  }

  // 代理API事件
  private _bindingApis(pluginRunTime: IPluginTempl) {
    const { apis = [] } = (pluginRunTime.constructor as any) || {}
    apis.forEach((apiName: string) => {
      this[apiName] = function () {
        // eslint-disable-next-line prefer-rest-params
        return pluginRunTime[apiName].apply(pluginRunTime, [...arguments])
      }
    })
  }

  // 解决 listener 为 undefined 的时候卸载错误
  off(eventName: string, listener: any): this {
    return listener ? super.off(eventName, listener) : this
  }
}

export default Editor
