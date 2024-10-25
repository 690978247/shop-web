import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { safeGet } from '../service/SafeGet'
import { generateObjectID } from '../service/utils'
import {
  commonLayerConfig,
  foregroundLayerConfig
} from '../service/FabricObjectConfig'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'
import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'
const store = useDesignerStore()
class AddImagePlugin implements IPluginTempl {
  public static pluginName = 'AddImagePlugin'
  static apis = ['addImage']
  public hotkeys: string[] = []
  public canvas: fabric.Canvas
  public editor: IEditor
  private imageQueue: any[] = []
  private isAddingImage = false

  constructor(canvas: fabric.Canvas, editor: any, options: IPluginOption) {
    this.canvas = canvas
    this.editor = editor
    this._init()
  }
  _init() {}

  //通过id查找fabric对象
  private getObjectById = (id: any) => {
    const objects: any[] = this.canvas.getObjects()
    for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) {
        return objects[i]
      }
    }
    return null
  }
  private getEditZoneType = () => {
    const editZoneObject = this.getObjectById('edit_zone')
    if (editZoneObject) {
      return editZoneObject.type
    }
    return null
  }

  private fixNotEditable(data: any) {
    // 修复 fabric 画布中不能选中不可编辑的对象,
    //添加延迟主要为了保证代码在最后
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
    this.canvas.discardActiveObject()
    this.canvas.renderAll()
    this.didAddImageComplete(data)
  }
  private didAddImageComplete(data: any) {
    const { complete } = data
    if (complete) {
      complete(true)
    }
    this.checkImageQueue('didAddImageComplete')

    designEventBus.emit(DESIGN_EVENTS.USER_ADD_OBJECT, {
      type: 'image'
    })
  }
  addImage(data: any) {
    const { url, width = 0, height = 0, isRealModel } = data

    if (!url) {
      console.log('❌[AddImagePlugin]addImage url is null')
      return
    }

    if (!this.canvas) {
      console.log('❌[AddImagePlugin]addImage canvas is null')
      return
    }

    // 如果 width 或 height 小于或等于 0，则设置为 400
    const updatedWidth = width <= 0 ? 400 : width
    const updatedHeight = height <= 0 ? 400 : height

    // 更新数据对象
    const updatedData = { ...data, width: updatedWidth, height: updatedHeight }

    this.imageQueue.push(updatedData)
    console.log('🟩[AddImagePlugin]📣新增数据:', updatedData)
    console.log(
      '🟩[AddImagePlugin]启用正片叠底效果:',
      isRealModel ? '是' : '否'
    )

    if (!this.isAddingImage) {
      this.isAddingImage = true
      this.checkImageQueue()
    }
  }

  checkImageQueue(from: any = 'addImage') {
    console.log('🟩[AddImagePlugin]checkImageQueue from =', from)
    if (this.imageQueue.length > 0) {
      console.log(
        '🟩[AddImagePlugin]开始处理队列,剩下长度',
        this.imageQueue.length
      )
      this.processImageQueue()
      return
    }
    console.log('🟩[AddImagePlugin]开始处理队列,队列已空 ✅')
    this.isAddingImage = false
  }

  async processImageQueue() {
    const data = this.imageQueue.shift()
    const { url, isRealModel } = data

    console.log('🟩[AddImagePlugin]processImageQueue:', data)

    const editZoneObject = this.getObjectById('edit_zone')

    if (!editZoneObject) {
      console.log('❌[AddImagePlugin]"edit_zone" not found')
      this.checkImageQueue('processImageQueue')
      return
    }

    editZoneObject.clone((clonedEditZoneObject: any) => {
      clonedEditZoneObject.set({
        absolutePositioned: true, // 绝对定位
        inverted: false // 反转
      })

      try {
        this.addImageToCanvas(
          url,
          clonedEditZoneObject,
          isRealModel,
          data
        ).then((data) => {
          this.fixNotEditable(data)
        })
      } catch (error) {
        console.error('❌[AddImagePlugin]Error adding image:', error)
      }
    })
  }
  // 计算图片的位置
  calculateImageDimensions(width: any, height: any, editZoneObject: any) {
    const editZoneType = this.getEditZoneType()
    let imageWidth = 0
    let imageHeight = 0
    let left = 0
    let top = 0

    if (editZoneType === 'rect') {
      // 矩形编辑区
      if (width > height) {
        imageWidth = editZoneObject.width * editZoneObject.scaleX
        imageHeight = (imageWidth * height) / width
      } else {
        imageHeight = editZoneObject.height * editZoneObject.scaleY
        imageWidth = (imageHeight * width) / height
      }

      const editZoneObjectCenterX = editZoneObject.left + imageWidth / 2
      const editZoneObjectCenterY = editZoneObject.top + imageHeight / 2
      left = editZoneObjectCenterX - imageWidth
      top = editZoneObjectCenterY - imageHeight
    } else {
      // 圆形编辑区
      if (width >= height) {
        imageWidth = editZoneObject.width * editZoneObject.scaleX
        imageHeight = (imageWidth * height) / width
      } else {
        imageHeight = editZoneObject.height * editZoneObject.scaleY
        imageWidth = (imageHeight * width) / height
      }
      left = Math.abs(400 - imageWidth) / 2
      top = 0
    }

    return { imageWidth, imageHeight, left, top }
  }

  centerPoint = (id: string = 'workspace') => {
    const defaultWorkspace = this.canvas
      .getObjects()
      .find((item: any) => item.id === id)
    const center = defaultWorkspace.getCenterPoint()
    return center
  }

  addImageToCanvas(
    url: any,
    editZoneObject: any,
    isRealModel: boolean,
    data: any
  ) {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        url,
        (img: any) => {
          let w = img.width
          let h = img.height
          const targetWidth = editZoneObject.width * editZoneObject.scaleX
          const targetHegiht = editZoneObject.height * editZoneObject.scaleY
          if (w >= h) {
            //编辑区域宽度
            w = targetWidth
            h = (img.height * targetHegiht) / img.width
          } else {
            //编辑区域高度
            h = targetHegiht
            w = (img.width * targetWidth) / img.height
          }

          img.scaleToWidth(Math.ceil(w))
          img.scaleToHeight(Math.ceil(h))
          img.set({
            clipPath: editZoneObject,
            id: generateObjectID(),
            layerType: 'custom'
          })

          if (store.isRealModel) {
            img.set({ globalCompositeOperation: 'multiply' })
          }

          this.canvas.add(img)
          this.canvas._centerObject(img, this.centerPoint('edit_zone'))
          this.canvas.renderAll()
          console.log('🟩[AddImagePlugin]addImage end ✅ renderAll')
          resolve(data)
        },
        {
          ...commonLayerConfig,
          ...foregroundLayerConfig
        }
      )
    })
  }
}

export default AddImagePlugin
