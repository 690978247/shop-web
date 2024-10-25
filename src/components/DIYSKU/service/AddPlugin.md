## 添加插件模板

```typescript
import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'

type IEditor = Editor

class LayerSelectPlugin implements IPluginTempl {
  public static pluginName = 'LayerSelectPlugin'
  static apis = ['activateFrontTextLayer']
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
  activateFrontTextLayer() {
    const activeObject = this.canvas.getActiveObject()

    if (activeObject && activeObject instanceof fabric.Text) {
      return false
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
```
