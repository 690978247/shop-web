import { fabric } from 'fabric'
import {
  commonLayerConfig,
  backgroundLayerConfig,
  foregroundLayerConfig
} from '@/components/DIYSKU/service/FabricObjectConfig'
import Editor from '@/components/DIYSKU/service/Editor'
import { safeGet } from '@/components/DIYSKU/service/SafeGet'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

type IEditor = Editor

class LayerHandlerPlugin implements IPluginTempl {
  public static pluginName = 'LayerHandlerPlugin'
  static apis = [
    'renderStageJSON',
    'renderPreviewStageJSON',
    'clearAllLayers',
    'deleteLayer',
    'moveBackwardLayer',
    'moveForwardLayer',
    'setScale',
    'moveToIndex',
    'flipX',
    'flipY',
    'getObjectById',
    'getEditZoneType'
  ]
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor

  constructor(canvas: fabric.Canvas, editor: any, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }
  _init() {}

  flipX(object: any) {
    object.flipX = !object.flipX
    this.canvas.renderAll()
  }
  flipY(object: any) {
    object.flipY = !object.flipY
    this.canvas.renderAll()
  }

  clearAllLayers() {
    const removeObjects: any[] = []

    this.canvas.getObjects().forEach((obj: any) => {
      const id = safeGet.string(obj, 'id', '')
      if (id.includes('object')) {
        removeObjects.push(obj)
      }
    })
    if (removeObjects.length === 0) {
      return
    }
    removeObjects.forEach((obj) => {
      this.canvas.remove(obj)
    })
    //删除所有
    this.canvas.renderAll()
  }

  fixNotEditable() {
    // 修复 fabric 画布中不能选中不可编辑的对象,
    //添加延迟主要为了保证代码在最后
    setTimeout(() => {
      const objects: any[] = []
      this.canvas.getObjects().forEach((obj: any) => {
        const id = safeGet.string(obj, 'id', '')

        if (id.includes('object')) {
          objects.push(obj)
        }
      })
      const selection = new fabric.ActiveSelection(objects, {
        canvas: this.canvas
      })
      this.canvas.setActiveObject(selection)
      // this.canvas.renderAll()
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    }, 100)
  }
  renderPreviewStageJSON(data: any) {
    const { json } = data
    if (!json) {
      console.log('❌[LayerHandlerPlugin] json is null')
      return
    }
    if (!this.canvas) {
      console.log('❌[LayerHandlerPlugin] canvas is null')
      return
    }
    this.canvas.loadFromJSON(
      json,
      (o: any, object: any) => {
        this.canvas.getObjects().forEach((obj: any) => {
          obj.set(commonLayerConfig)
          obj.set(backgroundLayerConfig)
        })
      },
      (error: any, options: any) => {}
    )
  }
  renderStageJSON(data: any) {
    const { json } = data
    if (!json) {
      console.log('❌[LayerHandlerPlugin] json is null')
      return
    }
    if (!this.canvas) {
      console.log('❌[LayerHandlerPlugin] canvas is null')
      return
    }
    this.canvas.loadFromJSON(
      json,
      (o: any, object: any) => {
        const objects: any[] = []
        this.canvas.getObjects().forEach((obj: any) => {
          const id = safeGet.string(obj, 'id', '')
          obj.set(commonLayerConfig)
          if (id.includes('object')) {
            obj.set(foregroundLayerConfig)
            objects.push(obj)
          } else {
            obj.set(backgroundLayerConfig)
          }
          if (id === 'edit_zone') {
            obj.set({
              visible: true
            })
          }
        })
        this.canvas.renderAll()
        designEventBus.emit(DESIGN_EVENTS.FABRIC_JSON_LOADED, {})
      },
      (error: any, options: any) => {}
    )
    console.log('🟪[LayerHandlerPlugin]renderStageJSON')
  }

  //通过id查找fabric对象
  getObjectById = (id: any) => {
    const objects: any[] = this.canvas.getObjects()
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) {
        return objects[i]
      }
    }
    return null
  }

  getEditZoneType = () => {
    const editZoneObject = this.getObjectById('edit_zone')
    if (editZoneObject) {
      return editZoneObject.type
    }
    return null
  }
  // 其他方法...

  deleteLayer(object: any) {
    const { layer } = object
    if (!layer) {
      console.log('❌[LayerHandlerPlugin] layer is null')
      return
    }
    this.canvas.remove(layer)
    this.canvas.renderAll()
  }

  moveBackwardLayer(object: any) {
    const minLayer = 4
    const activeObject = this.editor.getActiveObject()
    if (activeObject) {
      const index = this.editor.getActiveObjectIndex()
      if (index > minLayer - 1) {
        this.canvas.sendBackwards(activeObject)
        this.canvas.renderAll()
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  moveForwardLayer(object: any) {
    const activeObject = this.editor.getActiveObject()
    if (activeObject) {
      this.canvas.bringForward(activeObject)
      this.canvas.renderAll()
      return true
    } else {
      return false
    }
  }

  moveToIndex(object: any, diff: number) {
    console.log('🟪[LayerHandlerPlugin]object:', object)

    const currentIndex = this.canvas.getObjects().indexOf(object)
    const targetIndex = currentIndex + diff
    // console.log('🟪[LayerHandlerPlugin]length', this.canvas.getObjects().length)
    // console.log('🟪[LayerHandlerPlugin]diff', diff)
    // console.log('🟪[LayerHandlerPlugin]targetIndex', targetIndex)
    // console.log('🟪[LayerHandlerPlugin]moveToIndex', targetIndex)
    this.canvas.moveTo(object, targetIndex)

    this.canvas.renderAll() // 重新渲染 canvas
  }

  setScale(object: any, scale: number) {
    object.scale(scale)
    this.canvas.renderAll()
  }
  // 绑定事件
  bindEvents() {
    console.log('Binding events for LayerHandlerPlugin')
  }

  // 示例钩子
  hookImportBefore() {
    console.log('hookImportBefore in LayerHandlerPlugin')
    return Promise.resolve()
  }

  hookImportAfter() {
    console.log('hookImportAfter in LayerHandlerPlugin')
    return Promise.resolve()
  }

  hookSaveBefore() {
    console.log('hookSaveBefore in LayerHandlerPlugin')
    return Promise.resolve()
  }

  hookSaveAfter() {
    console.log('hookSaveAfter in LayerHandlerPlugin')
    return Promise.resolve()
  }

  hookTransform() {
    console.log('hookTransform in LayerHandlerPlugin')
    return Promise.resolve()
  }
}

export default LayerHandlerPlugin
