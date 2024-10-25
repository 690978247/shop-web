import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { obj } from '../service/SafeGet'
type IEditor = Editor

class CenterAlignPlugin implements IPluginTempl {
  static pluginName = 'CenterAlignPlugin'
  static apis = ['position']
  // public hotkeys: string[] = ['space'];
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {}

  center(workspace: fabric.Rect, object: fabric.Object) {
    const center = workspace.getCenterPoint()
    return this.canvas._centerObject(object, center)
  }

  centerV(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y)
    )
  }

  centerH(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y)
    )
  }

  alignLeft(workspace: fabric.Rect, object: fabric.Object) {
    object.set({ left: 0 })
    return object.setCoords()
  }

  alignRight(workspace: fabric.Rect, object: fabric.Object) {
    object.set({ left: workspace.width - object.width * object.scaleX })
    return object.setCoords()
  }

  alignTop(workspace: fabric.Rect, object: fabric.Object) {
    object.set({ top: 0 })
    return object.setCoords()
  }

  alignBottom(workspace: fabric.Rect, object: fabric.Object) {
    object.set({ top: workspace.height - object.height * object.scaleY })
    return object.setCoords()
  }

  position(
    name:
      | 'centerH'
      | 'center'
      | 'centerV'
      | 'alignLeft'
      | 'alignRight'
      | 'alignTop'
      | 'alignBottom'
  ) {
    const alignType = [
      'centerH',
      'center',
      'centerV',
      'alignLeft',
      'alignRight',
      'alignTop',
      'alignBottom'
    ]
    const activeObject = this.canvas.getActiveObject()
    if (alignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas
        .getObjects()
        .find((item: any) => item.id === 'workspace')
      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject)
      }
      this.canvas.renderAll()
    }
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default CenterAlignPlugin
