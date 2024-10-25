<template>
  <div class="line"></div>
  <div class="header">
    <div class="header-wrap">
      <div class="header-lf">
        <div class="logo">
          <a :href="showBanner ? '/' : ''" class="icon" target="_self">
            <img src="https://static.hzpdex.com/web/logo-header.png" alt="" />
          </a>
        </div>
        <div class="platform" @click="openPlatform" v-if="showBanner">
          <el-image :src="ecommerceImg" class="ecommerce-img"></el-image>
          <span>{{ $t('yourEcommercePlatform') }}</span>
          <el-icon>
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="header-rt">
        <!--  <FanYi /> -->
        <!-- 后端接口不支持多语言，暂时拿掉 -->
        <!-- <div>
          <el-dropdown trigger="click" @command="changeLanguage">
            <div class="el-dropdown-link">
              <img class="country-icon" :src="currentLang.img" alt="" />
              / USD
              <el-icon class="el-icon--right">
                <CaretBottom />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="lang in langList"
                  :style="
                    currentLang.img === lang.img
                      ? { background: '#ecf5ff', color: '#3F6AFF' }
                      : ''
                  "
                  :command="lang"
                  :key="lang.name"
                >
                  <img class="country-icon" :src="lang.img" alt="" />
                  <span>{{ lang.name }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div> -->
        <div class="hover-text" style="cursor: pointer" @click="clickHome">
          Home
        </div>
        <div class="hover-text" style="cursor: pointer" @click="clickWiio">
          {{ $t('myud') }}
        </div>
        <div
          class="hover-text"
          style="cursor: pointer"
          @click="clickHelpcenter"
          v-if="isPod"
        >
          Help Center
        </div>
        <!-- 未登录 -->
        <div v-if="!isLogin" class="sign-in-wrapper">
          <img
            class="logo"
            src="https://static.hzpdex.com/web/1722240630054_Group 26.svg"
            alt=""
          />
          <div class="sign-in" @click="showLoginDialog">
            {{ $t('signin') }}
          </div>
          or
          <div @click="showRegisterDialog" class="register-btn">
            {{ $t('register') }}
          </div>
        </div>
        <!-- 已登录 -->
        <template v-else>
          <!-- <div @click="showLoginDialog">Sign In</div> -->
          <el-dropdown trigger="click" @command="handelCommand">
            <div class="el-dropdown-link">
              <span>{{ userInfo.name }}</span>
              <el-icon class="el-icon--right">
                <CaretBottom />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in dropList"
                  :key="item.value"
                  :command="item"
                >
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>
    </div>
    <login-dialog
      v-model:visible="handleDialogLogin"
      @goRegisterEmit="onRegisterClick"
    />
    <!-- 注册 -->
    <register-dialog
      v-model:visible="handleDialogRegister"
      @onSignInClick="onSignInClick"
    />
    <!-- 平台 -->
    <platformdialog v-model:visible="handleDialogPlatform" />
  </div>
</template>
<script setup lang="ts">
// import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { GlobalStore } from '@/store/modules/global'
import router from '@/router/router'
import LoginDialog from './components/logindialog.vue'
import RegisterDialog from './components/registerdialog.vue'
import Platformdialog from './components/platformdialog.vue'
import { addBuryingLog, getTotalCount } from '@/api/user'
import enImg from '@/assets/images/en.png'
import brImg from '@/assets/images/br.png'
import esImg from '@/assets/images/es.png'
import zhImg from '@/assets/images/zh.png'
import { useUser } from '@/store/modules/user'
import {
  loginEventBus,
  ProductCollections,
  registerEventBus
} from '@/utils/common.ts'
import ecommerceImg from '@/assets/images/home/ecommerce.svg'
// 分类多语言
import BR from '@/language/category/br.json'
import EN from '@/language/category/en.json'
import ES from '@/language/category/es.json'
import ZH from '@/language/category/zh.json'
/* import FanYi from '@/components/Fanyi.vue' */

const handleDialogLogin = ref(false)
const handleDialogRegister = ref(false)
const handleDialogPlatform = ref(false)

const globalStore = GlobalStore()
const { language } = storeToRefs(globalStore)
const { locale } = useI18n()
const $t: any = inject('$t')

// const searchRef = ref(null)
const searchValue = ref('')
const searchCategoryId = ref('')
const searchCategoryIds = ref([])
const langList = ref([
  {
    img: enImg,
    name: 'en'
  },
  {
    img: brImg,
    name: 'br'
  },
  {
    img: esImg,
    name: 'es'
  },
  {
    img: zhImg,
    name: 'zh'
  }
])
const currentLang = ref({
  img: '',
  name: ''
})
const showCate = ref(false)

const showBanner = ref(true)
const product = ref<any>({})

const route = useRoute()

// const ref1 = ref<ButtonInstance>()

const clickHelpcenter = () => {
  window.open('/helpcenter/index', '_blank')
  // router.push('/helpcenter/index')
}

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
      initialConfiguration()
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

// watch(
//   () => headerStore.valueChange,
//   () => {
//     // initSearchValue()
//     // searchValue.value = localStorage.getItem('searchValue') ?? ''
//   }
// )

// 处理 分类
watch(
  () => route.name,
  (value) => {
    if (
      route.path.includes('SPUP') ||
      value === 'podIndex' ||
      value === 'podlist' ||
      value === 'helpCenter'
    ) {
      // pod pages
      showBanner.value = false
    } else if (value !== 'Home') {
      showCate.value = true
    } else {
      showCate.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 图片上传清除输入框数据
watch(
  () => route.query.imageId,
  (value) => {
    if (value) {
      searchValue.value = ''
    }
  }
)

// 上传组件
/* const imgLoading = ref(false)
const uploadImg = async (options: any) => {
  imgLoading.value = true
  const now = new Date()
  const timestamp = now.getTime() // 获取当前时间戳，单位是毫秒
  const filename = `file_${timestamp}.jpg`

  const newFile = new File([options.file], filename, {
    type: 'image/jpeg'
  })
  uploadFile(newFile)
    .then((res: any) => {
      if (res.success) {
        const imageId = res.data
        imgLoading.value = false
        router.push({
          path: '/searchdetail/index',
          query: {
            imageId
          }
        })
      }
    })
    .catch(() => {
      ElMessage.error($t('uploadFail'))
      imgLoading.value = false
    })
} */

// const imgLoading = ref(false)

// const uploadImg = async (options: any) => {
//   imgLoading.value = true
//   try {
//     const { url } = await useJSCore().oss.upload(options.file, {
//       uploadType: OSSUploadType.SEARCH,
//       datePath: false,
//       compressOptions: {
//         maxSizeMB: 4,
//         maxWidthOrHeight: 2000
//       }
//     })
//     if (route.name === 'SearchDetail') {
//       router.replace({
//         name: 'SearchDetail',
//         query: {
//           imageId: url
//         }
//       })
//     } else {
//       router.push({
//         name: 'SearchDetail',
//         query: {
//           imageId: url
//         }
//       })
//     }
//     imgLoading.value = false
//   } catch (error) {
//     ElMessage.error($t('uploadFail'))
//     imgLoading.value = false
//   }
// }

const getLanguage = () => {
  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', language.value)
  }
  const lang = localStorage.getItem('language')
  currentLang.value = langList.value.find((f) => f.name === lang)
}

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

// 下拉数据
const dropList: Array<{ label: string; value: string }> = [
  {
    label: $t('logout'),
    value: 'logout'
  }
]

const isPod = ref(false)
const initialConfiguration = () => {
  const route = useRoute()
  isPod.value = false
  if (route?.name === 'podIndex') {
    isPod.value = true
  }
  if (route?.name === 'ProductDetailIndexV2') {
    // 推荐列表
    const goodsCode = (route.params.gid as string) || ''

    if (goodsCode.startsWith('SPUP')) {
      isPod.value = true
    } else {
      isPod.value = false
    }
  }
}

const registerEventListener = () => {
  handleDialogRegister.value = true
}

const handleBasePoint = async () => {
  // 第一次登录
  getTotalCount().then((res: any) => {
    if (res.success && res?.resData === 0) {
      handleDialogPlatform.value = true
      addBuryingLog()
    }
  })
}

onMounted(() => {
  initialConfiguration()
  initSearchValue()
  getLanguage()
  registerEventBus.on(registerEventListener)
  const userInfo = localStorage.getItem('userInfo') ?? ''
  if (userInfo) {
    handleBasePoint()
  }
})
onBeforeUnmount(() => {
  registerEventBus.off(registerEventListener)
})

// const loginEventListener = () => {
//   useUser().logout()
//   showLoginDialog()
// }

const changeLanguage = (data: any) => {
  currentLang.value = data
  globalStore.setLanguage(data.name)
  locale.value = data.name
  localStorage.setItem('language', data.name)
}

const handelCommand = (item: { label: string; value: string }) => {
  if (item.value === 'logout') {
    useUser().logout(true)
    // 退出登录需要把names 页面中的d和pid参数清空
    const names = ['Home', 'ProductDetailIndexV2']
    const routeName = router.currentRoute.value.name as string
    if (names.includes(routeName)) {
      const url = new URL(location.href)
      const params = new URLSearchParams(url.search)
      //下面2两个参数是d和pid,是用于数据统计的
      params.delete('d')
      params.delete('pid')
      const newUrl =
        url.origin +
        url.pathname +
        (params.toString() ? '?' + params.toString() : '')
      location.href = newUrl
    } else {
      location.reload()
    }
  }
}

// 显示和关闭弹窗的方法
const showLoginDialog = () => {
  handleDialogLogin.value = true
}

const showRegisterDialog = () => {
  handleDialogRegister.value = true
}

const openPlatform = () => {
  if (useUser().state.isLoggedIn) {
    handleDialogPlatform.value = true
  } else {
    loginEventBus.emit()
  }
}

watch(
  () => handleDialogRegister.value,
  (value) => {
    useUser().setRegisterOpen(value)
  }
)

const clickLogo = () => {
  window.open('/', '_blank')
}

const clickHome = () => {
  window.open('https://usadrop.com/', '_blank')
}

const clickWiio = () => {
  const tk = useUser()?.state?.token
  if (tk) {
    window.open(`${import.meta.env.VITE_UD_BASE_URL}/Orders?tk=${tk}`)
    return
  }
  window.open(import.meta.env.VITE_UD_BASE_URL)
}

const onRegisterClick = () => {
  handleDialogLogin.value = false
  showRegisterDialog()
}
const onSignInClick = () => {
  handleDialogRegister.value = false
  showLoginDialog()
}

// const sourcingBtn = () => {
//   const tk = useUser()?.state?.token
//   if (isLogin.value) {
//     if (tk) {
//       window.open(
//         `${import.meta.env.VITE_UD_BASE_URL}/Sourcing?tk=${tk}&from=2`
//       )
//       return
//     }
//   } else {
//     // 如果未登录，则执行其他操作或提示用户登录
//     showLoginDialog()
//   }
// }

/* 分类数据 */
const leftItems = ref([])

watch(
  () => globalStore.language,
  (value) => {
    if (value === 'pt') {
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
// }
</script>

<style lang="scss" scoped>
.line {
  background: linear-gradient(90.01deg, #ffa3c1 0%, #69b7ff 100%);
  height: 14px;
}

.header {
  width: 100%;
  height: 78px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  color: #000;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0px 1px 8px 0px #0000001a;
  box-sizing: border-box;
  position: relative;
  background-color: #f7faff;

  :deep(.search-input.el-input) {
    .el-input__wrapper {
      box-shadow: 1px 0px 0px 1px
        var(--el-input-border-color, var(--el-border-color)) inset;
      border-top-left-radius: 50px;
      border-bottom-left-radius: 50px;
    }

    .el-input-group__append {
      padding: 0;
      background-color: white;
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
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
        font-size: 24px;
      }
    }

    .append-search {
      border-top-right-radius: 50px;
      border-bottom-right-radius: 50px;
      background-color: #bc0c34;
      color: #fff;

      .search-icon {
        font-size: 24px;
      }
    }
  }
}

.header-wrap {
  width: 1560px;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-lf {
  display: flex;
  align-items: center;
  flex: 1;

  .logo {
    width: 220px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .icon {
      display: flex;
      align-items: center;
    }

    img {
      cursor: pointer;
      width: 104px;
      height: 78px;
    }
  }

  .platform {
    width: 250px;
    height: 42px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    padding: 0 14px;
    box-sizing: border-box;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ccc;
    color: #6d6d6d;

    .ecommerce-img {
      width: 28px;
      height: 28px;
    }
  }

  .cate {
    width: 80px;
    height: 44px;
    border-radius: 53px;
    color: #bc0c34;
    background: #ffeef2;
    display: flex;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0 15px;
    margin-right: 20px;
    position: relative;

    > img {
      width: 25px;
      height: 25px;
    }

    .cate-drop {
      position: absolute;
      z-index: 10;
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

  .search {
    margin-left: 0 20px;
    max-width: 880px;
    min-width: 800px;
  }
}

.header-rt {
  display: flex;
  align-items: center;
  font-size: 14px;

  > div {
    margin-left: 12px;
    padding: 10px 8px;
  }

  .sign-in-wrapper {
    width: 208px;
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 8px 12px;
    border-radius: 4px;
    justify-content: space-evenly;

    .logo {
      width: 28px;
      height: 28px;
      // margin-right: 12px;
    }
  }

  .sign-in {
    color: #bc0c34;
    cursor: pointer;
  }

  .register-btn {
    cursor: pointer;
  }
}

.sourcing-btn {
  height: 42px;
  margin-left: 14px;
  color: #15104b;
  font-size: 14px;
  border-radius: 50px;
}

.country-icon {
  width: 24px;
  height: 18px;
  margin-right: 5px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  color: #000;

  .dropdown-item {
    border: 1px solid red;
  }
}

.event-btn {
  min-width: 200px;
}
</style>
