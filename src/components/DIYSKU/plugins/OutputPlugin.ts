import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { convertStage, downFile } from '@/components/DIYSKU/service/utils'
// import { OSSUploadType, useJSCore } from 'sm-js-core'

import {
  backgroundLayerConfig,
  commonLayerConfig
} from '@/components/DIYSKU/service/FabricObjectConfig'

type IEditor = Editor

class OutputPlugin implements IPluginTempl {
  public static pluginName = 'OutputPlugin'
  static apis = ['canvasToJSON', 'outputImages', 'generateImageWithStageData']
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor

  constructor(canvas: fabric.Canvas, editor: any, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }

  _init() {}

  canvasToJSON(convert: boolean = true) {
    const json = this.canvas.toJSON(['id', 'layerType'])
    if (convert) {
      return convertStage(json)
    }
    return json
  }

  getObjectById = (canvas: any, id: any) => {
    const objects = canvas.getObjects()
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) {
        return objects[i]
      }
    }
    return null
  }

  /*
        fabric.IText	继承自 fabric.Text，支持交互式编辑，如点击后进入编辑模式。支持光标移动、选择和输入。	需要用户交互的文本，如输入框
        fabric.Textbox	继承自 fabric.IText，支持多行文本和自动换行。可以设置文本框的宽度，高度会自动调整。	多行文本展示和编辑，如注释或段落
        */
  addText(data: any) {
    // 具体实现不需要
    //1.找到当前stage,
    //2.插入一个新的image layer
    //3.更新productInfo

    if (!data) {
      console.log('❌[designerAction] data is null')
      return
    }
    const { type } = data

    const canvasWidth = this.canvas.getWidth()
    const canvasHeight = this.canvas.getHeight()

    const textWidth = canvasWidth * 0.5
    // const textHeight = canvasHeight * 0.5
    const left = canvasWidth / 2 - 25
    const top = canvasHeight / 2 - 25
    const fontSize = 20
    const fontFamily = 'Arial'
    const text = 'usadrop'
    const fill = 'black'
    const rectClipPath = this.getObjectById(this.canvas, 'edit_zone')
    if (rectClipPath) {
      rectClipPath.set({
        absolutePositioned: true,
        inverted: false,
        fill: '#e3e3e3' // 决定背景色, 没有的话,图像无法显示
      })
      // 进行进一步操作，例如设置 clipPath 等
    } else {
      console.log('❌Object with id "edit_zone" not found')
    }
    if (type === 'itext') {
      const iText = new fabric.IText(text, {
        left: left,
        top: top,
        fill: fill,
        fontSize: fontSize,
        fontFamily: fontFamily,
        clipPath: rectClipPath
      })
      this.canvas.add(iText)
      this.canvas.setActiveObject(iText)
      iText.enterEditing()
      this.canvas.renderAll() // 重新渲染 canvas
    } else if (type === 'textbox') {
      const textbox = new fabric.Textbox(text, {
        left: left,
        top: top + 20,
        fill: fill,
        fontSize: fontSize,
        fontFamily: fontFamily,
        width: textWidth,
        clipPath: rectClipPath
      })
      this.canvas.add(textbox)
      this.canvas.setActiveObject(textbox)
      textbox.enterEditing()

      this.canvas.renderAll()
    }
  }

  deleteLayer(object: any) {
    const { layer } = object
    if (!layer) {
      console.log('❌[OutputPlugin] layer is null')
      return
    }
    this.canvas.remove(layer)
    this.canvas.renderAll()
  }

  _getSaveOption() {
    const workspace = this.canvas.getObjects()

    const { left, top, width, height } = workspace as fabric.Object
    const option = {
      name: 'New Image',
      format: 'png',
      enableRetinaScaling: true,
      multiplier: 5,
      width,
      height,
      left,
      top
    }
    return option
  }

  async loadImageWithCORS(image: fabric.Image) {
    return new Promise<void>((resolve, reject) => {
      const src = image.getSrc()
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        image.setElement(img)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  // 封装加载 JSON 数据到 Canvas 的函数
  loadJsonToCanvas = (
    fabricCanvas: fabric.Canvas,
    copyStage: any
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      fabricCanvas.loadFromJSON(
        copyStage,
        () => {
          // 设置每个对象的通用配置
          fabricCanvas.getObjects().forEach((obj: any) => {
            obj.set(commonLayerConfig)
            obj.set(backgroundLayerConfig)
          })
          fabricCanvas.renderAll()
          resolve() // 成功时调用 resolve
        },
        (error: any, options: any) => {
          // console.error('Error loading JSON to canvas:', error)
          // reject(error) // 失败时调用 reject
        }
      )
    })
  }

  printCurrentCanvasJSON = () => {}
  //根据stage生成图片
  //useOss: 是否使用OSS上传图片, 默认不使用
  async generateImageWithStageData(
    stage: any,
    useOss: boolean = false,
    complete: any = null
  ) {
    if (!stage || stage.objects.length === 1) {
      console.log('❌[OutputPlugin] stage is null')
      if (complete) {
        complete(null)
      }
      return null
    }
    console.log(
      '🟧[OutputPlugin] 1 Preparing to generate an image => useOss=',
      useOss
    )
    const newCanvas = document.createElement('canvas')
    // 设置 Canvas 的尺寸
    newCanvas.width = 400 // 设置宽度
    newCanvas.height = 400 // 设置高度

    const fabricCanvas = new fabric.Canvas(newCanvas, {
      stopContextMenu: true, // 禁止默认右键菜单
      controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
      imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
      preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
    })
    // console.log('🟧[OutputPlugin] 2 copy stage')
    const copyStage = JSON.parse(JSON.stringify(stage))
    // 删除 id 为 'edit_zone' 的对象
    // console.log('🟧[OutputPlugin] 3 delete edit_zone')
    copyStage.objects = copyStage.objects.filter(
      (item: any) => item.id !== 'edit_zone'
    )
    // console.log('🟧[OutputPlugin] 4 set commonLayerConfig')
    copyStage.objects.forEach((item: any) => {
      if (item.type === 'image') {
        item.crossOrigin = 'anonymous'
      }
    })
    // console.log('🟧[OutputPlugin] 5 loadJsonToCanvas')
    await this.loadJsonToCanvas(fabricCanvas, copyStage)
    // 等待所有图像加载完成
    // console.log('🟧[OutputPlugin] 6 loadImages')
    await Promise.all(
      fabricCanvas.getObjects().map(async (obj: any) => {
        if (obj instanceof fabric.Image) {
          obj.crossOrigin = 'anonymous' // 设置图像对象的
          await this.loadImageWithCORS(obj)
        }
      })
    )

    // 设置导出选项
    const option = {
      name: 'New Image',
      format: 'png',
      enableRetinaScaling: true,
      multiplier: 5,
      width: 400,
      height: 400,
      left: 0,
      top: 0
    }

    fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])

    // 导出 Canvas 数据为 Blob 对象
    const dataURL = fabricCanvas.toDataURL(option)
    // console.log('🟧[OutputPlugin] 7 blob:')
    if (!useOss) {
      // console.log('🟧[OutputPlugin] 8 ✅ useOss return dataURL')
      if (complete) {
        complete(dataURL)
      }
      return dataURL
    }

    // return dataURL
    const blob = await this.dataURLToBlob(dataURL)

    // 创建一个 File 对象
    const file = new File([blob], 'screenshot.png', { type: 'image/png' })

    // 上传截图到 OSS
    try {
      // console.log('🟧[OutputPlugin] 8 upload to oss')
      // const { url } = await useJSCore().oss.upload(file, {
      //   uploadType: /* OSSUploadType.POD_MATERIAL */ ''
      // })
      const url = ''
      // console.log('🟧[OutputPlugin] 9 ✅url:', url)
      if (complete) {
        complete(url)
      }
      return url // 返回上传后的 URL
    } catch (error) {
      if (complete) {
        complete(null)
      }
      return null
    }
  }

  outputImages(stageName: string = '') {
    if (stageName === undefined) {
      console.log('❌[OutputPlugin] stageName is undefined')
      return
    }
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      this.canvas.getObjects().forEach(async (obj: any) => {
        // obj.clipPath = null
        if (obj instanceof fabric.Image) {
          obj.crossOrigin = 'anonymous' // 设置图像对象的
          await this.loadImageWithCORS(obj)
        }
      })

      const option = this._getSaveOption()
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
      const dataUrl = this.canvas.toDataURL(option)
      this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        downFile(dataUrl, 'png', stageName)
      })
    })
  }

  private async dataURLToBlob(dataURL: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const byteString = atob(dataURL.split(',')[1])
      const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uint8Array = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i)
      }

      resolve(new Blob([arrayBuffer], { type: mimeString }))
    })
  }

  // 绑定事件
  bindEvents() {
    console.log('Binding events for OutputPlugin')
  }

  // 快捷键事件
  hotkeyEvent(keyName: string, e: KeyboardEvent) {}

  // 示例钩子
  hookImportBefore() {
    console.log('hookImportBefore in OutputPlugin')
    return Promise.resolve()
  }

  hookImportAfter() {
    console.log('hookImportAfter in OutputPlugin')
    return Promise.resolve()
  }

  hookSaveBefore() {
    console.log('hookSaveBefore in OutputPlugin')
    return Promise.resolve()
  }

  hookSaveAfter() {
    console.log('hookSaveAfter in OutputPlugin')
    return Promise.resolve()
  }

  hookTransform() {
    console.log('hookTransform in OutputPlugin')
    return Promise.resolve()
  }
}

export default OutputPlugin
