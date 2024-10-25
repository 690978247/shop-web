import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { isGroup, isActiveSelection } from '@/components/DIYSKU/service/utils'
import { v4 as uuid } from 'uuid'
type IEditor = Editor

class GroupPlugin implements IPluginTempl {
  static pluginName = 'GroupPlugin'
  static apis = ['unGroup', 'group']
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor
  ) {}

  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group
    if (!activeObject) return
    // 先获取当前选中的对象，然后打散
    const activeObjectList = activeObject.getObjects()
    activeObject.toActiveSelection()
    for (const item of activeObjectList) {
      item.set('id', uuid())
    }
    this.canvas.discardActiveObject().renderAll()
  }

  group() {
    // 组合元素
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection
    if (!activeObj) return
    const activegroup = activeObj.toGroup()
    const objectsInGroup = activegroup.getObjects()
    activegroup.clone((newgroup: fabric.Group) => {
      newgroup.set('id', uuid())
      this.canvas.remove(activegroup)
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object)
      })
      this.canvas.add(newgroup)
      this.canvas.setActiveObject(newgroup)
    })
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject()

    if (isActiveSelection(activeObject)) {
      return [
        {
          text: 'group',
          hotkey: 'Ctrl+V',
          disabled: false,
          onclick: () => this.group()
        }
      ]
    }

    if (isGroup(activeObject)) {
      return [
        {
          text: 'ungroup',
          hotkey: 'Ctrl+V',
          disabled: false,
          onclick: () => this.unGroup()
        }
      ]
    }
  }
  destroy() {
    console.log('pluginDestroy')
  }
}

export default GroupPlugin
