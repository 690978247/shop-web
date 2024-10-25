import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { throttle } from 'lodash-es'
type IEditor = Editor

/*
初始化和设置：

初始化画布背景和工作区域大小。
监听窗口大小变化并自动调整画布大小。
画布操作：

提供放大、缩小、自动缩放、恢复原始大小等功能。
设置工作区背景色。
事件处理：

监听鼠标滚轮事件进行画布缩放。
*/
class WorkspacePlugin implements IPluginTempl {
  static pluginName = 'WorkspacePlugin'
  static events = ['sizeChange']
  static apis = [
    'big',
    'small',
    'auto',
    'one',
    'setSize',
    'getWorkspase',
    'setWorkspaseBg'
  ]
  workspaceEl!: HTMLElement
  workspace: null | fabric.Rect
  option: any
  zoomRatio: number
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {
    this.workspace = null
    this.init({
      width: 400,
      height: 400
    })
    this.zoomRatio = 1.5 //0.85
  }

  init(option: { width: number; height: number }) {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement

    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!')
    }
    this.workspaceEl = workspaceEl
    this.workspace = null
    this.option = option
    this._initBackground()
    this._initWorkspace()
    this._initResizeObserve()
    this._bindWheel()
    this._drop()
  }

  hookImportAfter() {
    return new Promise((resolve) => {
      const workspace = this.canvas
        .getObjects()
        .find((item: any) => item.id === 'workspace')
      if (workspace) {
        workspace.set('selectable', false)
        workspace.set('hasControls', false)
        workspace.set('evented', false)
        this.setSize(workspace.width, workspace.height)
        this.editor.emit('sizeChange', workspace.width, workspace.height)
      }
      resolve('')
    })
  }

  hookSaveAfter() {
    return new Promise((resolve) => {
      this.auto()
      resolve(true)
    })
  }

  // 初始化背景
  _initBackground() {
    this.canvas.backgroundImage = ''
    this.canvas.setWidth(this.workspaceEl.offsetWidth)
    this.canvas.setHeight(this.workspaceEl.offsetHeight)
  }

  // 初始化画布
  _initWorkspace() {
    const { width, height } = this.option
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width,
      height,
      id: 'workspace',
      strokeWidth: 0
    })
    workspace.set('selectable', false)
    workspace.set('hasControls', false)
    workspace.hoverCursor = 'default'
    this.canvas.add(workspace)
    this.canvas.renderAll()

    this.workspace = workspace
    if (this.canvas.clearHistory) {
      this.canvas.clearHistory()
    }
    this.auto()
  }

  // 返回workspace对象
  getWorkspase() {
    if (!this.canvas) {
      console.log('❌[WorkspacePlugin] canvas is null')
      return null
    }
    if (this.canvas.getObjects().length === 0) {
      console.log('[WorkspacePlugin] canvas has no object')
      return null
    }
    return this.canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace') as fabric.Rect
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this
    const objCenter = obj.getCenterPoint()
    const viewportTransform = canvas.viewportTransform
    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    ) {
      return
    }
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0]
    viewportTransform[5] =
      canvas.height / 2 - objCenter.y * viewportTransform[3]
    canvas.setViewportTransform(viewportTransform)
    canvas.renderAll()
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto()
      }, 50)
    )
    resizeObserver.observe(this.workspaceEl)
  }

  setSize(width: number | undefined, height: number | undefined) {
    this._initBackground()
    this.option.width = width
    this.option.height = height
    // 重新设置workspace
    this.workspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === 'workspace') as fabric.Rect
    this.workspace.set('width', width)
    this.workspace.set('height', height)
    this.editor.emit('sizeChange', this.workspace.width, this.workspace.height)
    this.auto()
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this
    const width = workspaceEl.offsetWidth
    const height = workspaceEl.offsetHeight
    this.canvas.setWidth(width)
    this.canvas.setHeight(height)
    const center = this.canvas.getCenter()
    this.canvas.setViewportTransform(fabric.iMatrix.concat())
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale)
    if (!this.workspace) return
    this.setCenterFromObject(this.workspace)

    // 超出画布不展示
    this.workspace.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned
      this.canvas.requestRenderAll()
    })
    if (cb) cb(this.workspace.left, this.workspace.top)
  }
  _getScale() {
    if (!this.getWorkspase()) {
      return 1 // 返回默认的缩放比例
    }

    const workspaceEl = this.getWorkspase()
    const width = workspaceEl.offsetWidth || 400 // 如果 offsetWidth 不存在，则设定为 400
    const height = workspaceEl.offsetHeight || 400 // 如果 offsetHeight 不存在，则设定为 400

    const scaleToFit = fabric.util.findScaleToFit(workspaceEl, {
      width,
      height
    })

    return scaleToFit || 1 // 如果找不到合适的缩放比例，则返回默认值
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom()
    zoomRatio += 0.25
    const center = this.canvas.getCenter()
    fabric.util.animate({
      startValue: this.canvas.getZoom(),
      endValue: zoomRatio,
      duration: 250, // 动画持续时间（毫秒）
      onChange: (value) => {
        this.canvas.zoomToPoint(
          new fabric.Point(center.left, center.top),
          value
        )
      }
    })
  }
  // 缩小
  small() {
    const zoomRatio = this.canvas.getZoom() - 0.25
    const center = this.canvas.getCenter()

    fabric.util.animate({
      startValue: this.canvas.getZoom(),
      endValue: zoomRatio < 0 ? 0.01 : zoomRatio, // 确保最终值正确
      duration: 250, // 动画持续时间（毫秒）
      onChange: (value) => {
        this.canvas.zoomToPoint(
          new fabric.Point(center.left, center.top),
          value // 使用动态变化的 value
        )
      }
    })
  }

  // 自动缩放
  auto() {
    const scale = this._getScale()
    this.setZoomAuto(scale * this.zoomRatio)
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(1 * this.zoomRatio)
    this.canvas.requestRenderAll()
  }

  setWorkspaseBg(color: string) {
    const workspase = this.getWorkspase()
    workspase?.set('fill', color)
  }

  _bindWheel() {
    this.canvas.on('mouse:wheel', function (this: fabric.Canvas, opt) {
      const delta = opt.e.deltaY
      let zoom = this.getZoom()
      zoom *= 0.999 ** delta
      if (zoom > 20) zoom = 20
      if (zoom < 0.01) zoom = 0.01
      const center = this.getCenter()
      this.zoomToPoint(new fabric.Point(center.left, center.top), zoom)
      opt.e.preventDefault()
      opt.e.stopPropagation()
    })
  }

  _drop() {
    // 假设您已经创建了一个Fabric.Canvas实例叫做canvas
    const _this = this
    let lastPosX: number
    let lastPosY: number

    let isDragging: boolean = false

    _this.canvas.on('mouse:down', (opt) => {
      // 鼠标按下时触发
      const evt = opt.e

      isDragging = true // isDragging 是自定义的，开启移动状态
      lastPosX = evt.clientX // lastPosX 是自定义的
      lastPosY = evt.clientY // lastPosY 是自定义的
    })

    _this.canvas.on('mouse:move', (opt) => {
      // 鼠标移动时触发
      if (isDragging && !opt.target) {
        // console.log('查看e', opt)
        const evt = opt.e
        const vpt = _this.canvas.viewportTransform // 聚焦视图的转换
        vpt[4] += evt.clientX - lastPosX
        vpt[5] += evt.clientY - lastPosY
        // _this.canvas.requestRenderAll() // 重新渲染
        lastPosX = evt.clientX
        lastPosY = evt.clientY
        _this.canvas.requestRenderAll() // 重新渲染
      }
    })

    _this.canvas.on('mouse:up', (opt) => {
      // 鼠标松开时触发
      _this.canvas.setViewportTransform(_this.canvas.viewportTransform) // 设置此画布实例的视口转换
      isDragging = false // 关闭移动状态
    })
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default WorkspacePlugin
