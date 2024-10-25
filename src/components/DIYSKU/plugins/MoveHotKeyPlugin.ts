import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
type IEditor = Editor
// import { v4 as uuid } from 'uuid';

// 实现上下左右扩展
class MoveHotKeyPlugin implements IPluginTempl {
  static pluginName = 'MoveHotKeyPlugin'
  hotkeys: string[] = ['left', 'right', 'down', 'up']
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {}

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown') {
      const { canvas } = this
      const activeObject = canvas.getActiveObject()
      if (!activeObject) return
      switch (eventName) {
        case 'left':
          if (activeObject.left === undefined) return
          activeObject.set('left', activeObject.left - 1)
          break
        case 'right':
          if (activeObject.left === undefined) return
          activeObject.set('left', activeObject.left + 1)
          break
        case 'down':
          if (activeObject.top === undefined) return
          activeObject.set('top', activeObject.top + 1)
          break
        case 'up':
          if (activeObject.top === undefined) return
          activeObject.set('top', activeObject.top - 1)
          break
        default:
      }
      //TODO: 保存数据
      canvas.renderAll()
    }
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default MoveHotKeyPlugin
