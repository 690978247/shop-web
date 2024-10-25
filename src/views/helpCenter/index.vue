<template>
  <div class="help_cnter_box">
    <div class="help_banner_img">
      <div class="help_center_word">Help Center</div>
      <div class="how_help_you">How can we help you?</div>
    </div>
    <div class="page">
      <div class="beginner_guide">Beginner's Guide</div>
      <div class="register_account_content">
        <div class="register_account">1. Register an account</div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726111762309_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          2. Log in with your account and password
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726111829079_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          3. Log in to the POD marketplace to select products
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726111871154_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          4. After selecting a product, you can customize design elements such
          as images, text, layers and colors
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726111900610_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          5. After designing and saving the product, you can view your designed
          POD product list
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726111943434_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          6. POD products can be linked to your store and published on Shopify
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726112025178_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          7. Platform users can edit design permissions for end users
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726112079739_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          8. Users can preview the design effects
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726112115087_image.png"
            alt=""
          />
          <img
            src="https://static.hzpdex.com/web/1726112143442_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          9. End users can preview customized product effects in real-time while
          selecting products on the Shopify store
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726112184691_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          10. Dear customer, if you have any questions about the above POD
          custom products, please contact our marketplace customer service. We
          will respond to your inquiries as soon as possible. Thank you.
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1726112215153_image.png"
            alt=""
          />
        </div>
      </div>
      <div class="account_password">
        <div class="register_account">
          11. Dear customer, if you have any questions about the above POD
          custom products, please contactc
          <span @click="clickFaq">the relevant sales personnel.</span> We will
          respond to your inquiries as soon as possible. Thank you.
        </div>
        <div class="register_account_img">
          <img
            src="https://static.hzpdex.com/web/1723429775889_image.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useUser } from '@/store/modules/user'
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
const clickFaq = () => {
  const tk = useUser()?.state?.token
  if (tk) {
    window.open(`${import.meta.env.VITE_UD_BASE_URL}/FAQ?tk=${tk}`)
    return
  }
  window.open(import.meta.env.VITE_UD_BASE_URL)
}
</script>
<style lang="scss" scoped>
.help_cnter_box {
  background: #f7faff;
}

.help_banner_img {
  background: url('https://static.hzpdex.com/web/1725949232902_helpcenter_banner-zeyNpuFr.png')
    no-repeat;
  height: 300px;
  width: 100%;
  background-size: cover;

  .help_center_word {
    text-align: center;
    font-size: 52px;
    font-weight: 600;
    color: #fff;
    padding-top: 82px;
  }

  .how_help_you {
    text-align: center;
    font-size: 52px;
    font-weight: 600;
    color: #fff;
  }
}

.page {
  width: 1470px;
  height: auto;
  background: #ffffff;
  margin-top: 72px;
  border: 1px solid #e3e3e3;
  border-radius: 8px;

  .beginner_guide {
    text-align: center;
    color: #bc0c34;
    font-size: 40px;
    font-weight: 600;
    margin-top: 56px;
  }

  .register_account_content {
    margin-top: 72px;
  }

  .register_account {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    margin-left: 313px;
    width: 844px;

    span {
      color: #bc0c34;
      cursor: pointer;
    }
  }

  .register_account_img {
    text-align: center;

    img {
      width: 844px;
      height: 478px;
      margin-top: 16px;
    }
  }

  .account_password {
    margin-top: 32px;
  }
}
</style>
