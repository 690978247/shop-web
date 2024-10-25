<template>
  <div class="dialog">
    <el-dialog
      :model-value="props.visible"
      class="myDialog"
      top="14vh"
      width="35%"
      :title="$t('fillInYourPlatformDetails')"
      @close="handleClose"
    >
      <div class="bg">
        <el-image :src="platformImg"></el-image>
      </div>
      <div class="form">
        <el-form
          size="large"
          :model="formData"
          ref="formRef"
          class="form-content"
        >
          <el-form-item label="" class="option" prop="Account">
            <el-select
              v-model="formData.MainPlatform"
              :placeholder="$t('yourEcommercePlatform')"
              clearable
            >
              <el-option
                v-for="opt in platformOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="" class="option" prop="Email">
            <el-select
              v-model="formData.MainCategoryId"
              :placeholder="$t('productCategory')"
              clearable
            >
              <el-option
                v-for="opt in cateItems"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <div class="footer">
        <el-button
          color="#BC0C34"
          size="large"
          class="footer-search"
          @click="handleConfirm"
        >
          {{ $t('search') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import platformImg from '@/assets/images/home/platform.svg'
import { GlobalStore } from '@/store/modules/global'
import { useUser } from '@/store/modules/user'
import { savePlatformCategory, getMemberVo } from '@/api/user/index'
// 分类多语言
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'

// 定义 props 接收来自父组件的值
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:visible'])
const globalStore = GlobalStore()

const formData = ref({
  MainPlatform: '',
  MainCategory: '',
  MainCategoryId: ''
})

const platformOptions = [
  {
    label: 'Shopify',
    value: 'Shopify'
  },
  {
    label: 'Amazon',
    value: 'Amazon'
  },
  {
    label: 'WooCommerce',
    value: 'WooCommerce'
  },
  {
    label: 'TikTok',
    value: 'TikTok'
  },
  {
    label: 'Others',
    value: 'Others'
  }
]

const cateItems = ref([])

const getMemberInfo = () => {
  getMemberVo().then((res) => {
    formData.value.MainPlatform = res.data.MainPlatform || ''
    formData.value.MainCategoryId =
      res.data.MainCategoryCids?.split(',')[0] || ''
  })
}

watch(
  () => props.visible,
  (open) => {
    if (open) {
      getMemberInfo()
      useUser().clearTimer()
    } else {
      const userInfo = localStorage.getItem('userInfo') ?? ''
      // 未登录时 开启注册弹窗
      if (!userInfo) {
        useUser().startRegisterTimer()
      }
    }
  }
)

watch(
  () => globalStore.language,
  (value) => {
    // if (value === 'br') {
    //   cateItems.value = BR.list.map((item) => ({
    //     label: item.name,
    //     value: item.categoryID,
    //     children: item.children || []
    //   }))
    // }
    // if (value === 'es') {
    //   cateItems.value = ES.list.map((item) => ({
    //     label: item.name,
    //     value: item.categoryID,
    //     children: item.children || []
    //   }))
    // }
    // if (value === 'zh') {
    //   cateItems.value = ZH.list.map((item) => ({
    //     label: item.name,
    //     value: item.categoryID,
    //     children: item.children || []
    //   }))
    // }
    // if (value === 'en') {
    //   cateItems.value = EN.list.map((item) => ({
    //     label: item.name,
    //     value: item.categoryID,
    //     children: item.children || []
    //   }))
    // }

    // 写法优化
    const languageMap = { br: BR, es: ES, zh: ZH, en: EN } as any
    cateItems.value =
      languageMap[value]?.list.map((item: any) => ({
        label: item.name,
        value: item.categoryID,
        children: item.children || []
      })) || []
  },
  {
    immediate: true,
    deep: true
  }
)

const cateIds = ref([])
watch(
  () => formData.value.MainCategoryId,
  (id) => {
    cateIds.value = []
    const itemObj = cateItems.value.find((f) => f.value === id) || ''
    if (!itemObj) return
    cateIds.value = [itemObj.value]
    formData.value.MainCategory = itemObj?.label || ''
    itemObj?.children.forEach((child: any) => {
      cateIds.value.push(child.categoryID)
    })
  }
)

const handleClose = () => {
  formData.value = {
    MainPlatform: '',
    MainCategory: '',
    MainCategoryId: ''
  }
  emits('update:visible', false)
}

const handleConfirm = () => {
  const postData = {
    MainPlatform: formData.value.MainPlatform || '',
    MainCategory: formData.value.MainCategory,
    MainCategoryCids: cateIds.value.join(',')
  }
  savePlatformCategory(postData).then((res: any) => {
    if (res.success) {
      ElMessage.success('Save Success!')
      handleClose()
    }
  })
}
</script>

<style lang="scss" scoped>
.dialog {
  :deep(.myDialog) {
    border-radius: 24px !important;
    .el-dialog__header {
      border-bottom: none;
      padding-bottom: 0;
      padding-top: 0;
      height: 80px;
      font-weight: bold;
      display: flex;
      padding: 0 40px;
      align-items: center;
    }
    .el-dialog__title {
      font-size: 28px;
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        top: 10px;
        right: 10px;
        color: #e61e25;
      }
    }
  }
}

.bg {
  width: 100%;
  height: 230px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  padding: 0 40px;
  margin-top: 30px;
}

.footer {
  display: flex;
  padding: 0 40px 50px 40px;
  margin-top: 30px;
  .footer-search {
    width: 100%;
  }
}
</style>
