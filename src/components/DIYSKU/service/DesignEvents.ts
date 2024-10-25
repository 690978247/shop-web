//注释掉的事件,代表没有发送的事件
export const DESIGN_EVENTS = {
  // fabric 对象相关事件
  FABRIC_LOADED: 'fabric:loaded', // fabric init 加载完成事件
  FABRIC_JSON_LOADED: 'fabric:json_loaded', // fabric JSON 加载完成事件
  FABRIC_OBJECT_UPDATED: 'fabric:update', // fabric object update
  FABRIC_OBJECT_MODE_CHANGED: 'fabric:object:mode_changed', // fabric object mode changed

  // 数据相关事件
  DATA_LOADED: 'data:loaded', // 数据加载事件

  // 视图切换相关事件
  STAGE_WILL_SWITCH: 'stage:will_switch', // 视图即将切换事件
  STAGE_DID_SWITCH: 'stage:did_switch', // 视图切换完成事件

  // 情景切换相关事件
  SCENE_WILL_SWITCH: 'scene:will_switch', // 情景即将切换事件
  SCENE_DID_SWITCH: 'scene:did_switch', // 情景切换完成事件

  TAB_DID_SWITCH: 'tab:did_switch', // tab切换完成事件

  //用户相关
  USER_ADD_OBJECT: 'user:add_object', // 用户添加对象事件
  USER_REMOVE_OBJECT: 'user:remove_object', // 用户移除对象事件
  USER_PRODUCT_COLOR_DID_CHANGE: 'user:product_color_did_change', // 用户改变商品颜色事件
  USER_OBJECT_Text_UPDATE: 'user:object_text_update' // 用户改变商品文字事件
}
