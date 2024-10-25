import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

type IEditor = Editor

//图层操作, 激活图层,取消激活图层,获取图层信息
class LayerSelectPlugin implements IPluginTempl {
  public static pluginName = 'LayerSelectPlugin'
  static apis = [
    'getObjects',
    'getObjectList',
    'activeObject',
    'getActiveObject',
    'getActiveObjectIndex',
    'setActiveObject',
    'activateFrontTextLayer',
    'activateFrontImageLayer',
    'discardActive',
    'renderAll'
  ]
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor

  constructor(canvas: fabric.Canvas, editor: any, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }
  _init() {
    this.evnet()
  }

  evnet() {
    // 监听对象添加事件
    this.canvas.on('object:added', function (event) {
      designEventBus.emit(DESIGN_EVENTS.FABRIC_OBJECT_UPDATED, {
        event: event,
        type: 'added'
      })
    })

    // 监听对象移除事件
    this.canvas.on('object:removed', function (event) {
      designEventBus.emit(DESIGN_EVENTS.FABRIC_OBJECT_UPDATED, {
        event: event,
        type: 'removed'
      })
    })
  }

  renderAll() {
    this.canvas.renderAll()
  }
  getObjects() {
    return this.canvas.getObjects()
  }
  getObjectList() {
    const objects: any[] = []
    // 遍历画布上的所有对象
    this.canvas.getObjects().forEach((obj) => {
      objects.push(obj)
    })
    return objects
  }
  //删除当前激活的对象
  discardActive() {
    this.canvas.discardActiveObject()
    this.canvas.renderAll()
  }
  //激活对象
  activeObject(object: any) {
    if (!(object instanceof fabric.Object)) {
      console.error(
        '❌[LayerSelectPlugin]Provided object is not a valid Fabric.js object'
      )
      return
    }
    this.canvas.setActiveObject(object)
    this.canvas.renderAll()
  }
  //获取当前激活的对象
  //const activeObject = canvasEditor.getActiveObject()
  //if (activeObject && activeObject instanceof fabric.Text) {
  getActiveObject() {
    return this.canvas.getActiveObject()
  }
  //获取当前激活对象的索引
  getActiveObjectIndex() {
    const activeObject = this.getActiveObject()
    if (activeObject) {
      return this.canvas.getObjects().indexOf(activeObject)
    }
    return -1
  }
  setActiveObject(activeObject: any, info: any) {
    activeObject.set(info)
    this.canvas.renderAll()
  }
  //激活最前面的textLayer
  activateFrontTextLayer() {
    const activeObject = this.canvas.getActiveObject()

    if (activeObject && activeObject instanceof fabric.Text) {
      return true
    } else {
      const objects = this.canvas.getObjects()
      let textObject = null

      for (let i = objects.length - 1; i >= 0; i--) {
        if (objects[i].type.includes('text')) {
          textObject = objects[i]
          break
        }
      }
      if (textObject) {
        this.canvas.setActiveObject(textObject)
        this.canvas.renderAll()
        return true
      } else {
        return false
      }
    }
  }

  activateFrontImageLayer() {
    const objects = this.canvas.getObjects()
    if (objects.length < 1) {
      console.log('[activateFrontImageLayer]no objects')
      return false
    }
    let imageObject = null
    for (let i = objects.length - 1; i >= 0; i--) {
      if (objects[i].type.includes('image') && i > 2) {
        imageObject = objects[i]
        break
      }
    }
    if (imageObject) {
      this.canvas.setActiveObject(imageObject)
      this.canvas.renderAll()
      return true
    }
    console.log('[activateFrontImageLayer]no imageObject')
    return false
  }
  // 示例钩子
  hookImportBefore() {
    console.log('hookImportBefore in LayerSelectPlugin')
    return Promise.resolve()
  }

  hookImportAfter() {
    console.log('hookImportAfter in LayerSelectPlugin')
    return Promise.resolve()
  }

  hookSaveBefore() {
    console.log('hookSaveBefore in LayerSelectPlugin')
    return Promise.resolve()
  }

  hookSaveAfter() {
    console.log('hookSaveAfter in LayerSelectPlugin')
    return Promise.resolve()
  }

  hookTransform() {
    console.log('hookTransform in LayerSelectPlugin')
    return Promise.resolve()
  }
}

export default LayerSelectPlugin
