<template>
  <div class="print-dialog">
    <el-dialog
      title="Add to print file group"
      v-model="_showDialogVisible"
      class="modalDialog"
      width="45%"
      :before-close="handleClose"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :name="category.id"
        >
          <SKUImageTab
            @enterSearch="enterSearch"
            @addImg="addImg"
            :imgList="imgList[category.id]"
            :tabName="category.id"
          ></SKUImageTab>
          <div class="tab-loading" v-show="loading">
            <el-icon class="is-loading"><Loading /></el-icon>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <template #footer>
        <span class="dialog-footer">
          <span class="selected"> {{ selectedImgs.length }} selected</span>
          <el-button round type="primary" @click="confirmEditImgName">
            Add
          </el-button>
        </span>
      </template> -->
    </el-dialog>
  </div>
</template>
<script setup>
import { OSSUploadType, useJSCore } from 'sm-js-core'
import SKUImageTab from './SKUImageTab.vue'
// import { getCommonImages} from '../api'
import useSelect from '@/components/DIYSKU/hooks/select'

const { canvasEditor, store } = useSelect()
import { queyMaterialImageList, getClassifyList } from '@/api/pod'
// 定义 props
const props = defineProps({
  showDialogVisible: {
    type: Boolean,
    required: true
  }
})

// 定义 emit
const emit = defineEmits(['update:showDialogVisible', 'addSelectedImgs'])

// 定义响应式数据
const categories = ref([])
const selectedImgs = ref([])
const activeName = ref('')
const searchKeyword = ref('')
const imgList = ref({})
const loading = ref(false)
// 计算属性
const _showDialogVisible = computed({
  get: () => {
    if (props.showDialogVisible) {
      getMyImagesFn()
    }
    return props.showDialogVisible
  },
  set: (val) => {
    emit('update:showDialogVisible', val)
  }
})

// 生命周期钩子 - created
onMounted(() => {
  getClassifyListFn()
})

const enterSearch = (name) => {
  getMyImagesFn(name)
}

const handleClose = () => {
  _showDialogVisible.value = false
}
const getClassifyListFn = () => {
  getClassifyList().then((res) => {
    if (res.success) {
      categories.value = res.data?.map((item, index) => {
        if (index === 0) activeName.value = item.id
        imgList.value[item.id] = []
        // this.$set(this.imgList, item.id, []) // 双向绑定，不然无法更新数据
        return { name: item.classifyName, id: item.id }
      })
    }
  })
}
const getMyImagesFn = async (name = '') => {
  try {
    loading.value = true
    const Methods = queyMaterialImageList
    const params = {
      pageNum: 1,
      size: 1000,
      fileName: name,
      classifyId: activeName.value
    }
    await Methods(params).then((res) => {
      if (res.code === 10000 && res.data.records) {
        if (!imgList.value[activeName.value]) {
          imgList.value[activeName.value] = []
        }
        imgList.value[activeName.value] = res.data?.records || []
      }
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    console.log(error)
  }
}
const addImg = (imgInfo) => {
  canvasEditor.addImage({
    url: imgInfo.imageUrl,
    uid: imgInfo.id,
    width: imgInfo.imageWidth,
    height: imgInfo.imageLength,
    isRealModel: false
  })
  setTimeout(async () => {
    handleClose()
    canvasEditor.activateFrontImageLayer()
    store.updateCurrentStageScreenshot({
      canvasEditor: canvasEditor
    })
  }, 250)
}
const confirmEditImgName = () => {
  _showDialogVisible.value = false
  const _deepSelectedImgs = useJSCore().obj.deepClone(selectedImgs.value)
  emit('addSelectedImgs', _deepSelectedImgs)
  selectedImgs.value = []
}
</script>
<style lang="scss" scoped>
@mixin flex_center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
@mixin ellipse {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.print-dialog {
  :deep(.el-dialog) {
    // width: 200px;
    // height: 720px;
    border-radius: 20px;
    padding-bottom: 30px;
    .el-dialog__body {
      height: calc(100% - 130px);
      padding-top: 0px;
    }
  }
}
.modalDialog {
  .tab-loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    position: absolute;
    cursor: not-allowed;
    background: #fff;
    opacity: 0.9;
    top: 0;
    font-size: 36px;
    color: var(--el-color-primary);
  }
  .form-input {
    :deep(.el-input__inner) {
      border-radius: 30px;
      border: 1px solid #e5e5e5;
    }
  }
  .selected {
    font-size: 16px;
    margin-right: 16px;
  }
}
</style>
