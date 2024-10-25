import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
type IEditor = Editor

class LayerPlugin implements IPluginTempl {
  static pluginName = 'LayerPlugin'
  static apis = ['up', 'upTop', 'down', 'downTop']
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {}

  _getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace')
  }

  _workspaceSendToBack() {
    const workspace = this._getWorkspace()
    workspace && workspace.sendToBack()
  }

  up() {
    const actives = this.canvas.getActiveObjects()
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0]
      activeObject && activeObject.bringForward()
      this.canvas.renderAll()
      this._workspaceSendToBack()
    }
  }

  upTop() {
    const actives = this.canvas.getActiveObjects()
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0]
      activeObject && activeObject.bringToFront()
      this.canvas.renderAll()
      console.log(this)
      this._workspaceSendToBack()
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects()
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0]
      activeObject && activeObject.sendBackwards()
      this.canvas.renderAll()
      this._workspaceSendToBack()
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects()
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0]
      activeObject && activeObject.sendToBack()
      this.canvas.renderAll()
      this._workspaceSendToBack()
      //禁止放最后一层
      this.up()
      this.up()
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      return [
        {
          text: 'layer',
          hotkey: '❯',
          subitems: [
            {
              text: 'layer up',
              hotkey: 'key',
              onclick: () => this.up()
            },
            {
              text: 'layer down',
              hotkey: 'key',
              onclick: () => this.down()
            },
            {
              text: 'layer top',
              hotkey: 'key',
              onclick: () => this.upTop()
            },
            {
              text: 'layer bottom',
              hotkey: 'key',
              onclick: () => this.downTop()
            }
          ]
        }
      ]
      // return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy')
  }
}

export default LayerPlugin
