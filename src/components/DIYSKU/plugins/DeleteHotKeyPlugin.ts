import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { getCurrentTimestamp } from '@/components/DIYSKU/service/utils.ts'
type IEditor = Editor

// 实现右键delete功能
class DeleteHotKeyPlugin implements IPluginTempl {
  static pluginName = 'DeleteHotKeyPlugin'
  static apis = ['del']
  hotkeys: string[] = ['backspace']
  public store: any
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor,
    options: IPluginOption
  ) {
    this.store = options.store
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown' && eventName === 'backspace') {
      this.del()
    }
  }

  del() {
    const { canvas } = this
    const activeObject = canvas.getActiveObjects()
    if (activeObject) {
      console.log('del', activeObject)
      activeObject.map((item: any) => canvas.remove(item))
      canvas.requestRenderAll()
      canvas.discardActiveObject()
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      return [
        null,
        {
          text: 'delete',
          hotkey: 'Ctrl+V',
          disabled: false,
          onclick: () => this.del()
        }
      ]
    }
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default DeleteHotKeyPlugin
