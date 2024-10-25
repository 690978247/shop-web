//common层设置
export const commonLayerConfig = {
  crossOrigin: 'anonymous'
}
//背景设置
export const backgroundLayerConfig = {
  hasControls: false,
  hasBorders: false,
  selectable: false,
  lockMovementX: true,
  lockMovementY: true,
  lockScalingX: true,
  lockScalingY: true,
  evented: false //是用来控制对象是否响应事件的属性。
}
//前景设置
export const foregroundLayerConfig = {
  hasControls: true, // 允许控制
  selectable: true, // 允许选择
  lockUniScaling: false, // 允许非等比例缩放
  lockScalingX: false,
  lockScalingY: false,
  evented: true // 允许事件
}
