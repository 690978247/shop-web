<template>
  <div class="footer">
    <div class="footer-wrap">
      <div class="wrap">
        <!-- touch -->
        <div class="item-touch">
          <div class="item-title">Get In Touch</div>
          <div class="touch-email">
            <el-image :src="emailImg"></el-image>
            <span>info@usadrop.com</span>
          </div>
          <div class="touch-follow">Follow Us</div>
          <div class="email-group">
            <a
              class="email-icons"
              v-for="(item, index) in icons"
              :href="item.url"
              target="_blank"
              :key="index"
            >
              <el-image
                :src="item.img"
                style="width: 100%; height: 100%"
              ></el-image>
            </a>
          </div>
        </div>
        <!-- service -->
        <div class="wrap-item" v-for="(item, index) in dataList" :key="index">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-content">
            <div v-for="(child, index) in item.list" :key="`child${index}`">
              <a :href="child.url" target="_blank">{{ child.name }}</a>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">
        <div>
          <span>@2024-XSHIPPING LIMITED. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import emailImg from '@/assets/images/home/email.svg'
import { icons } from '@/utils/constants'
const props = defineProps({
  backgroundColor: {
    type: String,
    default: 'transparent'
  }
})

/* service community  links */
const dataList = ref([
  {
    title: 'Service',
    list: [
      {
        name: 'Sourcing',
        url: 'https://usadrop.com/sourcing'
      },
      {
        name: 'Global Warehousing',
        url: 'https://usadrop.com/global-warehousing'
      },
      {
        name: 'Dropshipping Fulfillment',
        url: 'https://usadrop.com/dropshipping-fulfillment'
      },
      {
        name: 'Branding',
        url: 'https://usadrop.com/branding'
      },
      {
        name: '30% Co-Founder',
        url: 'https://co-founder.usadrop.com'
      }
    ]
  },
  {
    title: 'Community',
    list: [
      {
        name: 'USAdrop Products',
        url: '/'
      },
      {
        name: 'Affiliates',
        url: 'https://usadrop.com/affiliates'
      },
      {
        name: 'Blog',
        url: 'https://usadrop.com/blog'
      },
      {
        name: 'Privacy Policy',
        url: 'https://usadrop.com/privacy-policy'
      },
      {
        name: 'Terms And Conditions',
        url: 'https://usadrop.com/terms-and-conditions'
      }
    ]
  },
  {
    title: 'Quick Links',
    list: [
      {
        name: 'Home',
        url: 'https://usadrop.com'
      },
      {
        name: 'About Us',
        url: 'https://usadrop.com/about-us'
      },
      {
        name: 'How It Work',
        url: 'https://usadrop.com/how-it-works'
      }
    ]
  }
])
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  height: 620px;
  box-sizing: border-box;
  background-color: v-bind('props.backgroundColor');
}
.footer-wrap {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/home/footer-bg2.png') no-repeat center center;
  background-size: 100% 100%;
  border-top-left-radius: 60px;
  border-top-right-radius: 60px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  color: #fff;
  .wrap {
    flex: 1;
    display: flex;
    padding: 100px 0 0 180px;
    justify-content: space-around;
    > .item-touch {
      flex: 1.3;
    }
    > .wrap-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      & + .wrap-item {
        margin-left: 20px;
      }
    }

    .item-title {
      font-size: 32px;
      font-weight: 600;
    }

    /* touch */
    .touch-email {
      display: flex;
      align-items: center;
      margin-top: 32px;
      > span {
        margin-left: 24px;
      }
    }

    .touch-follow {
      margin-top: 60px;
      font-size: 24px;
      font-weight: 600;
    }

    .email-group {
      display: flex;
      margin-top: 40px;
      > .email-icons {
        width: 52px;
        height: 52px;
        + .email-icons {
          margin-left: 23px;
        }
      }
    }

    /* service community  links */
    .item-content {
      margin-top: 32px;
      flex: 1;
      font-size: 16px;
      > div {
        cursor: pointer;
        + div {
          margin-top: 16px;
        }
      }
      a {
        color: #d3d5ff;
        text-decoration: none;
        &:hover {
          color: #f47514;
        }
      }
    }
  }
  .copyright {
    height: 75px;
    padding: 0 180px;
    box-sizing: border-box;
    > div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border-top: 6px dashed #4c4c95;
    }
  }
}
</style>
