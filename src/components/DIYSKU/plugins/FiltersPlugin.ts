import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'

type IEditor = Editor

class FiltersPlugin implements IPluginTempl {
  public static pluginName = 'FiltersPlugin'
  static apis = ['createBlendImage']
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor

  constructor(canvas: fabric.Canvas, editor: any, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }
  _init() {}

  //激活最前面的textLayer
  createBlendImage(elementId: string) {
    return new fabric.Image.filters.BlendImage({
      image: new fabric.Image(document.getElementById(elementId)),
      mode: 'multiply' // 根据需要更改 blend mode
    })
  }

  // 示例钩子
  hookImportBefore() {
    console.log('hookImportBefore in FiltersPlugin')
    return Promise.resolve()
  }

  hookImportAfter() {
    console.log('hookImportAfter in FiltersPlugin')
    return Promise.resolve()
  }

  hookSaveBefore() {
    console.log('hookSaveBefore in FiltersPlugin')
    return Promise.resolve()
  }

  hookSaveAfter() {
    console.log('hookSaveAfter in FiltersPlugin')
    return Promise.resolve()
  }

  hookTransform() {
    console.log('hookTransform in FiltersPlugin')
    return Promise.resolve()
  }
}

export default FiltersPlugin
