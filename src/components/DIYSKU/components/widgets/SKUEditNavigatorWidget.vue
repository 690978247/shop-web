<template>
  <div class="operateUndo">
    <el-tooltip content="Horizontal flip" placement="bottom">
      <el-button class="action" @click="flipHorizontalFn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.3em"
          height="1.3em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v18m4-14v10h5zM8 7v10H3z"
          />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip content="Vertical flip" placement="bottom">
      <el-button class="action" @click="flipVerticalFn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.3em"
          height="1.3em"
          viewBox="0 0 15 15"
        >
          <path
            fill="currentColor"
            d="m3.5.5l.224-.447A.5.5 0 0 0 3 .5zm8 4V5a.5.5 0 0 0 .224-.947zm-8 0H3a.5.5 0 0 0 .5.5zm0 6V10a.5.5 0 0 0-.5.5zm8 0l.224.447A.5.5 0 0 0 11.5 10zm-8 4H3a.5.5 0 0 0 .724.447zM3.276.947l8 4l.448-.894l-8-4zM11.5 4h-8v1h8zM4 4.5v-4H3v4zM0 8h15V7H0zm3.5 3h8v-1h-8zm7.776-.947l-8 4l.448.894l8-4zM4 14.5v-4H3v4z"
          />
        </svg>
      </el-button>
    </el-tooltip>

    <el-divider class="divider" direction="vertical"></el-divider>
    <!-- shadow -->

    <el-tooltip content="Add shadow for depth" placement="bottom">
      <el-button
        :class="displayShadow() ? 'action' : 'action-disabled'"
        @click="shadow"
        v-loading="addShadow"
      >
        <svg
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.74037 17.4986L15.3959 9.66582C15.6396 9.36114 16.0404 9.36114 16.2865 9.66342L20.3801 15.7971V18.5369C20.3801 19.2237 19.8223 19.7813 19.1355 19.7813H9.27441"
            fill="#CBCBCB"
          />
          <path
            d="M19.1351 20.3251H3.15396C2.1672 20.3251 1.36572 19.5235 1.36572 18.5369V15.8627L4.30008 12.9377C4.52976 12.7103 4.82268 12.5931 5.13216 12.6097C5.44392 12.6261 5.73216 12.7783 5.94072 13.0363L9.27828 17.1589C9.28324 17.1663 9.2896 17.1726 9.297 17.1775C9.30168 17.1728 9.30876 17.1681 9.31572 17.1589L14.9712 9.32614C15.1915 9.05194 15.508 8.89258 15.8407 8.89258H15.8431C16.1759 8.89258 16.4923 9.04966 16.7126 9.32386L20.9281 15.6075V18.5396C20.9233 19.5235 20.1218 20.3251 19.1351 20.3251ZM2.45316 16.3149V18.5369C2.45323 18.7227 2.52708 18.9009 2.65849 19.0323C2.7899 19.1637 2.96812 19.2376 3.15396 19.2377H19.1351C19.3209 19.2376 19.4991 19.1637 19.6305 19.0323C19.7619 18.9009 19.8358 18.7227 19.8359 18.5369V15.9894L15.8618 10.0057C15.8525 9.99394 15.8454 9.98698 15.8384 9.98458C15.8384 9.98926 15.8292 9.99634 15.8198 10.008L10.1668 17.8361C9.94884 18.1103 9.6324 18.2696 9.29952 18.2696H9.29712C8.96664 18.2696 8.6502 18.1125 8.42988 17.8407L5.09712 13.7228C5.09139 13.7153 5.08513 13.7083 5.0784 13.7017C5.07574 13.7046 5.07257 13.7071 5.06904 13.7089L2.45316 16.3149Z"
            fill="#7D7D7D"
          />
          <path
            d="M9.297 18.2719C8.96652 18.2719 8.65008 18.1148 8.42976 17.843L5.097 13.7227C5.09127 13.7153 5.08501 13.7082 5.07828 13.7016C5.07562 13.7045 5.07245 13.707 5.06892 13.7088L1.36572 17.3977V5.46793C1.36572 4.48117 2.16732 3.67969 3.15396 3.67969H19.1351C20.1218 3.67969 20.9233 4.48129 20.9233 5.46793V17.3413L15.8617 10.0054C15.8524 9.99361 15.8452 9.98665 15.8383 9.98425C15.8383 9.98893 15.829 9.99601 15.8196 10.0076L10.1665 17.8357C9.9486 18.1099 9.63216 18.2693 9.29928 18.2693C9.29928 18.2719 9.297 18.2719 9.297 18.2719ZM5.07348 12.6094C5.0922 12.6094 5.11104 12.6094 5.13204 12.6118C5.4438 12.6282 5.73204 12.7805 5.9406 13.0384L9.27816 17.1588C9.28312 17.1662 9.28949 17.1725 9.29688 17.1774C9.30156 17.1727 9.30864 17.168 9.3156 17.1588L14.9711 9.32605C15.1915 9.05185 15.508 8.89249 15.8406 8.89249H15.8431C16.1758 8.89249 16.4923 9.04957 16.7126 9.32377L19.8383 14.2526V5.47033C19.8382 5.28449 19.7643 5.1063 19.6329 4.97489C19.5015 4.84349 19.3233 4.76962 19.1375 4.76953H3.15396C2.96813 4.76962 2.78993 4.84349 2.65853 4.97489C2.52712 5.1063 2.45326 5.28449 2.45316 5.47033V14.7774L4.30008 12.9376C4.51332 12.7242 4.78752 12.6094 5.07348 12.6094Z"
            fill="#7D7D7D"
          />
          <path
            d="M5.81899 10.6805C4.49011 10.6805 3.40723 9.60001 3.40723 8.26873C3.40723 6.93745 4.48999 5.85938 5.81899 5.85938C7.14799 5.85938 8.23075 6.93986 8.23075 8.27114C8.23075 9.60242 7.15027 10.6805 5.81899 10.6805ZM5.81899 6.94693C5.09011 6.94693 4.49707 7.53985 4.49707 8.26885C4.49707 8.99785 5.08999 9.59077 5.81899 9.59077C6.54799 9.59077 7.14091 8.99785 7.14091 8.26885C7.14091 7.53985 6.54787 6.94693 5.81899 6.94693Z"
            fill="#7D7D7D"
          />
          <path
            d="M9.27832 17.161C9.28329 17.1684 9.28965 17.1748 9.29704 17.1797C9.30172 17.1751 9.3088 17.1704 9.31576 17.161L14.9714 9.32825C15.1917 9.05405 15.5081 8.89469 15.8408 8.89469H15.8433C16.1759 8.89469 16.4925 9.05177 16.7128 9.32597L19.8384 14.2549V5.47277C19.8383 5.28694 19.7645 5.10874 19.6331 4.97734C19.5017 4.84593 19.3235 4.77207 19.1376 4.77197H9.39412"
            fill="#CBCBCB"
          />
          <path
            d="M21.0724 22.3623H20.3949V21.3062H21.0724C21.1872 21.3062 21.2971 21.2715 21.3901 21.2055L21.9995 22.0681C21.7285 22.26 21.4045 22.3628 21.0724 22.3623ZM19.4131 22.3623H18.0718V21.3062H19.4131V22.3623ZM16.9705 22.3623H15.6289V21.3062H16.9705V22.3623ZM14.7781 22.3623H13.4365V21.3062H14.7779L14.7781 22.3623ZM12.4553 22.3623H11.1138V21.3062H12.4553V22.3623ZM9.96829 22.2761C9.65088 22.1676 9.37536 21.9625 9.18028 21.6896C8.98521 21.4167 8.88034 21.0896 8.88037 20.7542L9.93649 20.7495V20.7542C9.93645 20.8693 9.97242 20.9816 10.0394 21.0753C10.1063 21.169 10.2009 21.2394 10.3098 21.2767L9.96829 22.2761ZM22.6801 20.446H21.624V19.1044H22.6801V20.446ZM9.93625 19.4081H8.88037V18.0665H9.93625V19.4081ZM22.6801 17.7633H21.624V16.4217H22.6801V17.7633ZM9.93625 16.7254H8.88037V15.3839H9.93625V16.7254ZM22.6801 15.0805H21.624V13.7389H22.6801V15.0805ZM9.93625 14.0423H8.88037V12.701H9.93625V14.0423ZM22.6801 12.3975H21.624V11.0563H22.6801V12.3975ZM9.93625 11.3597H8.88037V10.0184H9.93625V11.3597ZM22.6801 9.71478H21.624V8.37342H22.6801V9.71478ZM9.93625 8.67702H8.88037V7.33554H9.93625V8.67702ZM22.6801 7.03194H21.624V5.69058H22.6801V7.03194ZM9.93625 5.99418H8.88037V4.6527H9.93625V5.99418ZM22.6801 4.34922H21.624V3.00762H22.6801V4.34922ZM9.93625 3.31134H8.88037V3.00546C8.88037 2.48274 9.13585 1.99074 9.56365 1.68978L10.1712 2.55342C10.0987 2.60443 10.0395 2.67212 9.99857 2.75079C9.95766 2.82945 9.93625 2.91679 9.93613 3.00546L9.93625 3.31134ZM21.2521 2.48322C21.1943 2.46328 21.1335 2.45322 21.0724 2.45346H20.0891V1.39746H21.0724C21.2514 1.39746 21.4275 1.42686 21.5955 1.4847L21.2521 2.48322ZM19.1076 2.45346H17.7661V1.39746H19.1076V2.45346ZM16.6647 2.45346H15.3233V1.39746H16.6647V2.45346ZM14.4726 2.45346H13.131V1.39746H14.4724L14.4726 2.45346ZM12.1495 2.45346H10.8082V1.39746H12.1497L12.1495 2.45346Z"
            fill="#7D7D7D"
          />
        </svg>
      </el-button>
    </el-tooltip>

    <el-tooltip content="Zoom in" placement="bottom">
      <el-button class="action" @click="small">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
        >
          <path fill="currentColor" d="M5 13v-2h14v2z" />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip content="Zoom out" placement="bottom">
      <el-button class="action" @click="big">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1"
          />
        </svg>
      </el-button>
    </el-tooltip>
    <el-tooltip content="Reset zoom" placement="bottom">
      <el-button class="action" @click="restore">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.5em"
          height="1.5em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89l.07.14L9 12H6a7 7 0 0 1 7-7a7 7 0 0 1 7 7a7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9a9 9 0 0 0-9-9"
          />
        </svg>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/components/DIYSKU/hooks/select'
import { useDesignerStore } from '@/components/DIYSKU/stores/designerStore'
import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'

const { canvasEditor } = useSelect()
const store = useDesignerStore()

const flipHorizontalFn = () => {
  const currentActiveObject = canvasEditor.getActiveObject()
  if (currentActiveObject) {
    canvasEditor.flipX(currentActiveObject)
  } else {
    ElMessage.warning('Please select an object first.')
  }
}

const flipVerticalFn = () => {
  const currentActiveObject = canvasEditor.getActiveObject()
  if (currentActiveObject) {
    canvasEditor.flipY(currentActiveObject)
  } else {
    ElMessage.warning('Please select an object first.')
  }
}

const small = () => {
  canvasEditor.small()
}

const displayShadow = () => {
  const src = store.getCurrentStage()?.shadowSrc || ''
  if (!src) {
    return false
  }

  return src.includes('http') ? true : false
}
// 图片阴影
const addShadow = ref(false)
const shadow = async () => {
  const shadowImg = store.getCurrentStage().shadowSrc || ''
  if (!shadowImg) {
    return
  }
  addShadow.value = true

  //1. 先添加图片
  canvasEditor.addImage({
    url: shadowImg,
    isRealModel: false,
    complete: (res: any) => {
      //2. 更新缩略图
      store.updateCurrentStageScreenshot({
        canvasEditor: canvasEditor,
        complete: () => {
          //3.激活图片层
          canvasEditor.activateFrontImageLayer()
          addShadow.value = false
        }
      })
    }
  })
}

const big = () => {
  canvasEditor.big()
}
const restore = () => {
  canvasEditor.one()
}

const onSceneSwitch = (data: any) => {}
const onSceneWillSwitch = (data: any) => {}

const setupListeners = () => {
  designEventBus.on(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.on(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}
const clearListeners = () => {
  designEventBus.off(DESIGN_EVENTS.SCENE_WILL_SWITCH, onSceneWillSwitch)
  designEventBus.off(DESIGN_EVENTS.SCENE_DID_SWITCH, onSceneSwitch)
}
const initialization = () => {}

onMounted(() => {
  initialization()
  setupListeners()
})
onUnmounted(() => {
  clearListeners()
})
</script>

<style scoped lang="scss">
.operateUndo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  gap: 10px;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #333333;
    color: #333333;
  }
  .action-disabled {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #b6b6b6;
    color: #b6b6b6;
  }
}
.divider {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
