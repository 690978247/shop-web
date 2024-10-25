```
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

```

```
  designEventBus.emit(DESIGN_EVENTS.FABRIC_OBJECT_ADDED, {
    type: 'image'
  })
```

event

```
const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.FABRIC_OBJECT_ADDED, didDesignAddLayer)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.FABRIC_OBJECT_ADDED, didDesignAddLayer)
}

onMounted(() => {
  setupListeners()
})

onUnmounted(() => {
  clearListeners()
})
```

| **事件名**                 | **描述**                                                      |
| -------------------------- | ------------------------------------------------------------- |
| `object:modified`          | 当对象被修改（如移动、缩放、旋转等）时触发。                  |
| `object:moving`            | 当对象正在被移动时触发。                                      |
| `object:scaling`           | 当对象正在被缩放时触发。                                      |
| `object:rotating`          | 当对象正在被旋转时触发。                                      |
| `object:skewing`           | 当对象正在被倾斜时触发。                                      |
| `object:resizing`          | 当对象正在被调整大小时触发。                                  |
| `object:selected`          | 当对象被选中时触发。                                          |
| `object:added`             | 当对象被添加到画布时触发。                                    |
| `object:removed`           | 当对象从画布中移除时触发。                                    |
| `group:selected`           | 当一个组对象被选中时触发。                                    |
| `before:transform`         | 在对象转换（如旋转、缩放等）之前触发。                        |
| `before:selection:cleared` | 在选择清除之前触发。                                          |
| `selection:cleared`        | 当选择被清除时触发。                                          |
| `selection:created`        | 当创建新的选择时触发。                                        |
| `selection:updated`        | 当选择被更新时触发。                                          |
| `mouse:up`                 | 当鼠标按键被释放时触发。                                      |
| `mouse:down`               | 当鼠标按键被按下时触发。                                      |
| `mouse:move`               | 当鼠标移动时触发。                                            |
| `mouse:up:before`          | 在鼠标按键释放之前触发。                                      |
| `mouse:down:before`        | 在鼠标按键按下之前触发。                                      |
| `mouse:move:before`        | 在鼠标移动之前触发。                                          |
| `mouse:dblclick`           | 当鼠标双击时触发。                                            |
| `mouse:wheel`              | 当鼠标滚轮滚动时触发。                                        |
| `mouse:over`               | 当鼠标移到对象上方时触发。                                    |
| `mouse:out`                | 当鼠标移出对象时触发。                                        |
| `drop:before`              | 在拖拽对象放下之前触发。                                      |
| `drop`                     | 当拖拽对象放下时触发。                                        |
| `dragover`                 | 当对象在拖动过程中悬停在某一元素上方时触发。                  |
| `dragenter`                | 当拖动对象进入某一元素时触发。                                |
| `dragleave`                | 当拖动对象离开某一元素时触发。                                |
| `before:render`            | 在画布渲染之前触发。                                          |
| `after:render`             | 在画布渲染之后触发。                                          |
| `before:path:created`      | 在路径创建之前触发。                                          |
| `path:created`             | 当路径被创建时触发。                                          |
| `canvas:cleared`           | 当画布被清除时触发。                                          |
| `moving`                   | 当对象移动时触发。                                            |
| `scaling`                  | 当对象缩放时触发。                                            |
| `rotating`                 | 当对象旋转时触发。                                            |
| `skewing`                  | 当对象倾斜时触发。                                            |
| `resizing`                 | 当对象大小被调整时触发。                                      |
| `mouseup`                  | 当鼠标按键被释放时触发（同 `mouse:up`）。                     |
| `mousedown`                | 当鼠标按键被按下时触发（同 `mouse:down`）。                   |
| `mousemove`                | 当鼠标移动时触发（同 `mouse:move`）。                         |
| `mouseup:before`           | 在鼠标按键释放之前触发（同 `mouse:up:before`）。              |
| `mousedown:before`         | 在鼠标按键按下之前触发（同 `mouse:down:before`）。            |
| `mousemove:before`         | 在鼠标移动之前触发（同 `mouse:move:before`）。                |
| `mousedblclick`            | 当鼠标双击时触发（同 `mouse:dblclick`）。                     |
| `mousewheel`               | 当鼠标滚轮滚动时触发（同 `mouse:wheel`）。                    |
| `mouseover`                | 当鼠标移到对象上方时触发（同 `mouse:over`）。                 |
| `mouseout`                 | 当鼠标移出对象时触发（同 `mouse:out`）。                      |
| `drop:before`              | 在拖拽对象放下之前触发（同 `drop:before`）。                  |
| `drop`                     | 当拖拽对象放下时触发（同 `drop`）。                           |
| `dragover`                 | 当对象在拖动过程中悬停在某一元素上方时触发（同 `dragover`）。 |
| `dragenter`                | 当拖动对象进入某一元素时触发（同 `dragenter`）。              |
| `dragleave`                | 当拖动对象离开某一元素时触发（同 `dragleave`）。              |
