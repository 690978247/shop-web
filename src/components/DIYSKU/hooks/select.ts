// import { useI18n } from 'vue-i18n'
import { SelectMode } from '@/components/DIYSKU/service/FabricLayerEventType'
import Editor from '@/components/DIYSKU/service/Editor'
import { fabric } from 'fabric'
import { inject } from 'vue'
/*
使用
import useSelect from '@/components/DIYSKU/hooks/select'
const { mixinState, canvasEditor } = useSelect();
*/
interface Selector {
  mSelectMode: (typeof SelectMode)[keyof typeof SelectMode]
  mSelectOneType: string | undefined
  mSelectId: string | undefined
  mSelectIds: (string | undefined)[]
  mSelectActive: unknown[]
}

export default function useSelect() {
  const fabric = inject('fabric') as fabric.Canvas
  // const { t } = useI18n()
  const canvasEditor = inject('canvasEditor') as Editor
  const mixinState = inject('mixinState') as Selector
  const store = inject('store') as any

  return {
    fabric,
    canvasEditor,
    mixinState,
    store
    // t
  }
}
