import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import {
  commonLayerConfig,
  backgroundLayerConfig,
  foregroundLayerConfig
} from '@/components/DIYSKU/service/FabricObjectConfig'
type IEditor = Editor

import 'fabric-history'
import { safeGet } from '../service/SafeGet'

type extendCanvas = {
  undo: () => void
  redo: () => void
  clearHistory: () => void
  historyUndo: any[]
  historyRedo: any[]
}

class HistoryPlugin implements IPluginTempl {
  static pluginName = 'HistoryPlugin'
  static apis = ['undo', 'redo']
  static events = ['historyUpdate']
  hotkeys: string[] = ['ctrl+z', 'ctrl+shift+z', '⌘+z', '⌘+shift+z']
  constructor(
    public canvas: fabric.Canvas & extendCanvas,
    public editor: IEditor
  ) {
    fabric.Canvas.prototype._historyNext = () => {
      return this.editor.getJson()
    }

    this._init()
  }

  _init() {
    this.canvas.on('history:append', () => {
      this.historyUpdate()
    })
    window.addEventListener('beforeunload', (e) => {
      if (this.canvas.historyUndo.length > 0) {
        ;(e || window.event).returnValue = '确认离开'
      }
    })
  }

  historyUpdate() {
    const { historyUndo, historyRedo } = this.canvas
    this.editor.emit('historyUpdate', historyUndo.length, historyRedo.length)
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.canvas.clearHistory()
    this.historyUpdate()
    return Promise.resolve()
  }
  //历史undo操作后,会出现问题
  fixLayerConfig() {
    this.canvas.getObjects().forEach((obj: any) => {
      const id = safeGet.string(obj, 'id', '')
      obj.set(commonLayerConfig)
      if (id.includes('object')) {
        obj.set(foregroundLayerConfig)
      } else {
        obj.set(backgroundLayerConfig)
      }
    })
    this.canvas.renderAll()
  }

  undo() {
    // fix 历史记录退回到第一步时，画布区域可被拖拽
    if (this.canvas.historyUndo.length === 1) {
      this.editor.clear()
      this.canvas.clearHistory()
      return
    }
    this.canvas.undo()
    this.historyUpdate()
    setTimeout(() => {
      this.fixLayerConfig()
    }, 250)
  }

  redo() {
    this.canvas.redo()
    this.historyUpdate()
    setTimeout(() => {
      this.fixLayerConfig()
    }, 250)
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown') {
      switch (eventName) {
        case 'ctrl+z':
        case '⌘+z':
          this.undo()
          break
        case 'ctrl+shift+z':
        case '⌘+shift+z':
          this.redo()
          break
      }
    }
  }
}

export default HistoryPlugin
