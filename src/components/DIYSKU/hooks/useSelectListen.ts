import { get } from 'lodash-es'
import {
  SelectEvent,
  SelectMode
} from '@/components/DIYSKU/service/FabricLayerEventType'
import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { onBeforeMount, onMounted } from 'vue'

/*
通过 canvasEditor 监听并处理不同类型的选择事件，将事件数据反映到响应式的 state 对象中，提供给调用方使用和展示

import useSelectListen from '@/components/DIYSKU/hooks/useSelectListen'

*/
interface Selector {
  //监听选中模式
  mSelectMode: (typeof SelectMode)[keyof typeof SelectMode]
  //选中类型 image/ text 无法区分哪个image/text被选中
  mSelectOneType: string | undefined
  //没有唯一id, 因此用数组存储
  mSelectId: string | undefined
  //选中的id数组
  mSelectIds: (string | undefined)[]
  //选中的对象数组
  mSelectActive: unknown[]
}

export default function useSelectListen(canvasEditor: Editor) {
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: []
  })

  // 监听选择事件
  const selectOne = (e: [fabric.Object]) => {
    state.mSelectMode = SelectMode.ONE
    state.mSelectActive = []
    if (e[0] && get(e[0], 'clip')) {
      selectCancel()
      // state.mSelectId = get(e[0], 'targetId');
      state.mSelectOneType = get(e[0], 'type')

      // state.mSelectIds = e.map((item) => get(item, 'targetId'));
      return
    }
    if (e[0]) {
      state.mSelectId = e[0].id
      state.mSelectOneType = e[0].type
      state.mSelectIds = e.map((item) => item.id)
      state.mSelectActive.push(e[0])
    }
  }

  // 监听选择事件
  const selectMulti = (e: fabric.Object[]) => {
    state.mSelectMode = SelectMode.MULTI
    state.mSelectId = ''
    state.mSelectIds = e.map((item) => item.id)
    state.mSelectActive = []
    state.mSelectActive.push(...e)
  }
  // 监听取消选择事件
  const selectCancel = () => {
    state.mSelectId = ''
    state.mSelectIds = []
    state.mSelectMode = SelectMode.EMPTY
    state.mSelectOneType = ''
    state.mSelectActive = []
    console.log('🟨[useSelectListen]selectCancel')
  }

  onMounted(() => {
    canvasEditor.on(SelectEvent.ONE, selectOne)
    canvasEditor.on(SelectEvent.MULTI, selectMulti)
    canvasEditor.on(SelectEvent.CANCEL, selectCancel)
  })

  onBeforeMount(() => {
    canvasEditor.off(SelectEvent.ONE, selectOne)
    canvasEditor.off(SelectEvent.MULTI, selectMulti)
    canvasEditor.off(SelectEvent.CANCEL, selectCancel)
  })

  return {
    mixinState: state
  }
}
