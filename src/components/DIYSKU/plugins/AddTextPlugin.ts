import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { safeGet } from '../service/SafeGet'
import { generateObjectID } from '../service/utils'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

type IEditor = Editor

class AddTextPlugin implements IPluginTempl {
  public static pluginName = 'AddTextPlugin'
  static apis = ['addText']
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor

  constructor(canvas: fabric.Canvas, editor: IEditor, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }

  private _init() {}

  // 通过 id 查找 fabric 对象
  private getObjectById = (id: any) => {
    const objects: any[] = this.canvas.getObjects()
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) {
        return objects[i]
      }
    }
    return null
  }

  private getEditZoneType(): string | null {
    const editZoneObject = this.getObjectById('edit_zone')
    return editZoneObject ? editZoneObject.type : null
  }

  private didAddTextComplete(data: {
    complete?: (success: boolean) => void
  }): void {
    if (data.complete) {
      data.complete(true)
    }

    designEventBus.emit(DESIGN_EVENTS.USER_ADD_OBJECT, {
      type: 'text'
    })
  }

  private fixNotEditable(data: any): void {
    const objects = this.canvas.getObjects().filter((obj) => {
      const id = safeGet.string(obj, 'id', '')
      return id.includes('object')
    })

    if (objects.length > 0) {
      const selection = new fabric.ActiveSelection(objects, {
        canvas: this.canvas
      })
      this.canvas.setActiveObject(selection)
      this.canvas.discardActiveObject()
      this.canvas.renderAll()
    }

    this.didAddTextComplete(data)
  }

  private createTextObject(
    type: string,
    text: string,
    options: any
  ): fabric.IText | fabric.Textbox {
    if (type === 'itext') {
      return new fabric.IText(text, options)
    } else if (type === 'textbox') {
      return new fabric.Textbox(text, options)
    }
    throw new Error(`Unsupported text type: ${type}`)
  }

  centerPoint = (id: string = 'workspace') => {
    const defaultWorkspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === id)
    const center = defaultWorkspace.getCenterPoint()
    return center
  }

  addText(data: any): void {
    if (!this.canvas) {
      console.error('❌[LayerHandlerPlugin] canvas is null')
      return
    }

    if (!data) {
      console.error('❌[designerAction] data is null')
      return
    }

    const { type, style } = data
    const canvasWidth = this.canvas.getWidth()
    const textWidth = canvasWidth * 0.5
    const fontSize = 20
    const fontFamily = 'Arial'
    const text = `usadrop${Math.floor(Math.random() * 100)}`
    const fill = 'black'

    const editZoneObject = this.getObjectById('edit_zone')
    if (!editZoneObject) {
      console.error('❌[AddTextPlugin] Object with id "edit_zone" not found')
      return
    }

    editZoneObject.clone((clonedEditZoneObject: any) => {
      clonedEditZoneObject.set({
        absolutePositioned: true,
        inverted: false
      })

      let left = clonedEditZoneObject.left! - clonedEditZoneObject.width! * 0.5
      let top = clonedEditZoneObject.top!

      if (this.getEditZoneType() === 'image') {
        left = 400 * 0.5 - 30
        top = 400 * 0.5 - 40
      }

      const options = {
        left,
        top: top + (type === 'textbox' ? 20 : 0),
        fill,
        fontSize,
        fontFamily,
        width: textWidth,
        clipPath: clonedEditZoneObject,
        id: generateObjectID(),
        layerType: 'custom',
        ...style
      }

      const textObject = this.createTextObject(type, text, options)
      this.canvas.add(textObject)
      this.canvas._centerObject(textObject, this.centerPoint('edit_zone'))
      this.canvas.setActiveObject(textObject)
      textObject.enterEditing()
      this.canvas.renderAll()

      this.fixNotEditable(data)
    })
  }

  // 示例钩子
  hookImportBefore(): Promise<void> {
    console.log('hookImportBefore in AddTextPlugin')
    return Promise.resolve()
  }

  hookImportAfter(): Promise<void> {
    console.log('hookImportAfter in AddTextPlugin')
    return Promise.resolve()
  }

  hookSaveBefore(): Promise<void> {
    console.log('hookSaveBefore in AddTextPlugin')
    return Promise.resolve()
  }

  hookSaveAfter(): Promise<void> {
    console.log('hookSaveAfter in AddTextPlugin')
    return Promise.resolve()
  }

  hookTransform(): Promise<void> {
    console.log('hookTransform in AddTextPlugin')
    return Promise.resolve()
  }
}

export default AddTextPlugin
