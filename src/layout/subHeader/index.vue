<template>
  <div class="sub-header" v-if="isShow">
    <div class="sub-wrap">
      <div class="sub-left">
        <div class="sub-cate">
          <div
            class="cate"
            @mouseenter="handleMouseEnter"
            @mouseleave="hoverItemClick"
          >
            <div style="display: flex; align-items: center">
              <img
                src="https://static.hzpdex.com/web/1722239903497_Group 25.svg"
                alt=""
              />
              <span style="margin-left: 16px">{{ $t('allcategories') }}</span>
            </div>
            <!-- <img :src="dropImg" class="drop-img" alt="" /> -->
            <ElIcon>
              <ArrowDown />
            </ElIcon>
            <div class="cate-drop" ref="catedropRef">
              <div class="place"></div>
              <div class="wrap">
                <Category :items="leftItems" @itemClick="hoverItemClick" />
              </div>
            </div>
          </div>
        </div>
        <div class="sub-search">
          <el-input
            style="width: 100%; height: 100%"
            :placeholder="
              !product.name
                ? 'Search winning products by keyword'
                : product?.name
            "
            v-model="searchValue"
            ref="searchRef"
            class="search-input"
            @keyup.enter="$event.target.blur()"
            @keypress="onKeyPress"
            size="large"
          >
            <template #append>
              <div class="input-append">
                <div v-if="!imgLoading" class="append-upload">
                  <el-upload
                    :show-file-list="false"
                    class="upload-demo"
                    :http-request="uploadImg"
                    accept="image/*"
                  >
                    <i class="file-icon" :class="`iconfont icon-xiangji`"></i>
                  </el-upload>
                </div>

                <div class="append-upload" v-else>
                  <el-button
                    type="primary"
                    style="width: 90%; height: 90%"
                    :loading="imgLoading"
                  />
                </div>

                <div class="append-search" @click.stop="searchData">
                  <el-icon class="search-icon">
                    <Search />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-input>
        </div>
      </div>

      <div class="sub-right">
        <span class="sub-sourcing" @click="sourcingBtn">{{
          $t('sourcing')
        }}</span>
        <el-divider direction="vertical" class="sub-divider" />
        <span class="sub-upgrade" @click="memberUpgradeConfirm">{{
          $t('Upgrade')
        }}</span>
      </div>
    </div>

    <login-dialog
      v-model:visible="handleDialogLogin"
      @goRegisterEmit="onRegisterClick"
    ></login-dialog>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'
import { uploadFileOss } from '@/api/goods'
import { useUser } from '@/store/modules/user'
import { GlobalStore } from '@/store/modules/global'
import {
  headerEventBus,
  memberUpgradeConfirm,
  ProductCollections
} from '@/utils/common.ts'
import router from '@/router/router'
// import { storeToRefs } from 'pinia'
import LoginDialog from '@/layout/header/components/logindialog.vue'
import Category from '@/views/home/components/category.vue'
// 分类多语言
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'

const product = ref<any>({})
const route = useRoute()
const $t: any = inject('$t')
const globalStore = GlobalStore()
// const { language } = storeToRefs(globalStore)

const isShow = ref(false)
const searchRef = ref(null)
const searchValue = ref('')
const searchCategoryId = ref('')
const searchCategoryIds = ref([])
const initSearchValue = () => {
  // // 有searchCategoryID 则输入框不显示关键词
  // const cateId = localStorage.getItem('searchCategoryID')
  // if (cateId) {
  //   searchValue.value = ''
  // } else {
  //   searchValue.value = localStorage.getItem('searchValue') ?? ''
  // }
  const searchWord = route.query.kw as string
  const productCollection = route.query.pct as string
  searchCategoryId.value = route.query.cid as string
  searchCategoryIds.value = (route.query.cids as string)?.split(',') ?? []
  if (searchCategoryId.value || searchCategoryIds.value.length > 0) {
    searchValue.value = ''
  } else {
    searchValue.value = searchWord
  }
  product.value = {
    name: ProductCollections.find((f) => f.value === productCollection)?.label,
    productCollection: productCollection
  }
}

watch(
  () => route.name,
  (value) => {
    if (value === 'SearchDetail') {
      initSearchValue()
    } else {
      searchValue.value = ''
      product.value = {}
      searchCategoryId.value = ''
      searchCategoryIds.value = []
    }
    // getProduct()
    // initSearchValue()
    // searchValue.value = localStorage.getItem('searchValue') ?? ''
    // headerStore.setValueChange(!headerStore.valueChange)
  },
  {
    deep: true
  }
)

// 获取登录信息
const isLogin = ref(false)
const userInfo = ref({
  EnterpriseCode: '',
  email: '',
  mobile: '',
  mobile_prefix: '',
  name: ''
})

watch(
  () => useUser().state,
  (info) => {
    isLogin.value = info.isLoggedIn
    userInfo.value = info.userInfo
  },
  {
    deep: true,
    immediate: true
  }
)

const searchData = useThrottleFn(() => {
  // 分类为 热销平台时， 输入框内容可以为空 查询
  if (
    (!searchValue.value || searchValue.value?.trim() === '') &&
    !product.value.name
  ) {
    ElMessage({
      message: 'Please enter keywords!',
      grouping: true,
      type: 'warning'
    })
    return
  }
  if (route.name === 'SearchDetail') {
    router.replace({
      name: 'SearchDetail',
      query: {
        kw: searchValue.value,
        pct: product.value.productCollection
        // cid: searchCategoryId.value
      }
    })
  } else {
    router.push({
      name: 'SearchDetail',
      query: {
        kw: searchValue.value,
        pct: product.value.productCollection
        // cid: searchCategoryId.value
      }
    })
  }
  headerEventBus.emit({ type: 'enter', kw: searchValue.value })
}, 300)

const onKeyPress = (event: any) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    searchData()
  }
}

const imgLoading = ref(false)

const uploadImg = async (options: any) => {
  imgLoading.value = true
  const now = new Date()
  const timestamp = now.getTime() // 获取当前时间戳，单位是毫秒
  const filename = `file_${timestamp}.jpg`

  try {
    const ossSignature = await getOSSSignature()
    const formData = new FormData()
    formData.append('name', filename)
    formData.append('OSSAccessKeyId', ossSignature.ossAccessKeyId)
    formData.append('policy', ossSignature.policy)
    formData.append('signature', ossSignature.signature)
    formData.append('success_action_status', '200')
    formData.append('key', ossSignature.dir + filename)
    formData.append('file', options.file)
    const response = await fetch(ossSignature.host, {
      method: 'POST',
      body: formData
    })
    if (response.statusText === 'OK') {
      const imageId = ossSignature.host + ossSignature.dir + filename // 假设成功上传后，返回文件名作为 imageId
      imgLoading.value = false
      if (route.name === 'SearchDetail') {
        router.replace({
          name: 'SearchDetail',
          query: {
            imageId
          }
        })
      } else {
        router.push({
          name: 'SearchDetail',
          query: {
            imageId
          }
        })
      }
    } else {
      throw new Error('Upload failed.')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error($t('uploadFail'))
    imgLoading.value = false
  }
}

// 获取 OSS 签名的函数
const getOSSSignature = async () => {
  try {
    // 从服务器请求获取 ossAccessKeyId
    const { data } = await uploadFileOss()
    const ossAccessKeyId = data.ossAccessKeyId
    const policy = data.policy
    const signature = data.signature

    // 构造 ossSignature 对象
    const ossSignature = {
      ossAccessKeyId: ossAccessKeyId,
      policy: policy,
      signature: signature,
      dir: data.dir,
      host: 'https://static.hzpdex.com/'
    }

    return ossSignature
  } catch (error) {
    throw new Error('Failed to fetch OSS Access Key ID')
  }
}

// 显示和关闭弹窗的方法
const handleDialogLogin = ref(false)
const showLoginDialog = () => {
  handleDialogLogin.value = true
}

const onRegisterClick = () => {
  handleDialogLogin.value = false
  // showRegisterDialog()
}

// watch(
//   () => handleDialogLogin.value,
//   (value) => {
//     useUser().setLoginOpen(value)
//   }
// )

const sourcingBtn = () => {
  const tk = useUser()?.state?.token
  if (isLogin.value) {
    if (tk) {
      window.open(
        `${import.meta.env.VITE_UD_BASE_URL}/Sourcing?tk=${tk}&from=2`
      )
      return
    }
  } else {
    // 如果未登录，则执行其他操作或提示用户登录
    showLoginDialog()
  }
}

// const loginEventListener = () => {
//   useUser().logout()
//   showLoginDialog()
// }

const handleShow = () => {
  if (
    route.path.includes('SPUP') ||
    route.name === 'podIndex' ||
    route.name === 'helpCenter'
  ) {
    isShow.value = false
    return
  }
  isShow.value = true
}

onMounted(() => {
  initSearchValue()
  handleShow()
  // getLanguage()
  // getProduct()
  // loginEventBus.on(loginEventListener)
})

// onBeforeUnmount(() => {
//   loginEventBus.off(loginEventListener)
// })

/* 分类数据 */
const leftItems = ref([])

watch(
  () => globalStore.language,
  (value) => {
    if (value === 'br') {
      leftItems.value = BR.list
    }
    if (value === 'es') {
      leftItems.value = ES.list
    }
    if (value === 'zh') {
      leftItems.value = ZH.list
    }
    if (value === 'en') {
      leftItems.value = EN.list
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const catedropRef = ref(null)
const handleMouseEnter = () => {
  searchRef.value.blur()
  catedropRef.value.style.display = 'block'
}

const hoverItemClick = () => {
  catedropRef.value.style.display = 'none'
}
</script>

<style lang="scss" scoped>
.sub-header {
  height: 76px;
  background-color: #fff;
  display: flex;
  justify-content: center;

  .sub-wrap {
    width: 1560px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sub-left {
    width: calc(100% - 330px - 110px);
    height: 100%;
    box-sizing: border-box;
    margin-right: 110px;
    display: flex;
    align-items: center;

    .sub-cate {
      width: 212px;
      height: 100%;
      margin-right: 100px;
      box-sizing: border-box;
      border-top: 2px solid transparent;
      transition: border-color 0.3s;

      &:hover {
        border-color: red;
      }
    }

    .cate {
      // width: 80px;
      // height: 44px;
      // border-radius: 53px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      box-sizing: border-box;
      // padding: 0 15px;
      margin-right: 20px;
      position: relative;
      font-size: 16px;
      color: #333;

      > img {
        width: 20px;
        height: 16px;
      }

      .cate-drop {
        position: absolute;
        z-index: 100;
        left: 0;
        top: 44px;
        font-size: 14px;
        display: none;
        box-sizing: border-box;
      }

      .wrap {
        background-color: #fff;
        padding: 6px 0;
        box-shadow: 0 1px 4px 1px hsla(0, 1%, 83%, 0.48);
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }

      .place {
        height: 16px;
        background-color: transparent;
      }

      &:hover .drop-img {
        transition: all 0.3s;
        transform: rotate(180deg);
      }

      // &:hover .cate-drop {
      //   display: block;
      // }
    }

    .sub-search {
      flex: 1;
      box-sizing: border-box;

      :deep(.search-input.el-input) {
        .el-input__wrapper {
          height: 52px;
          box-shadow: 1px 0px 0px 1px
            var(--el-input-border-color, var(--el-border-color)) inset;
        }

        .el-input-group__append {
          padding: 0;
          background-color: white;
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }

      .input-append {
        width: 90px;
        height: 100%;
        display: flex;
        box-sizing: border-box;

        .append-upload,
        .append-search {
          width: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .append-upload {
          .file-icon {
            font-size: 20px;
          }
        }

        .append-search {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
          background-color: #bc0c34;
          color: #fff;
          width: 60px;

          .search-icon {
            font-size: 18px;
          }
        }
      }
    }
  }

  .sub-right {
    width: 330px;
    height: 100%;
    box-sizing: border-box;
    background: url('../../assets/images/home/sourcing.png') no-repeat center
      center;
    background-size: 110% 140%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 18px;
    padding-right: 20px;
    color: #fff;

    .sub-sourcing {
      cursor: pointer;
      padding: 20px 5px;
    }

    .sub-upgrade {
      cursor: pointer;
      padding: 20px 5px;
    }

    .sub-divider {
      margin: 0 20px;
      background-color: #fff;
    }
  }
}
</style>
