<template>
  <Collapse title="Advantage" :titleStyle="titleStyle">
    <template #content>
      <div class="aliExpress-garantie-container">
        <div class="item" v-for="(item, index) in dataSource" :key="index">
          <img class="icon" :src="item.icon" />
          <span class="desc">
            <span class="bold">{{ item.title }}</span> {{ item.desc }}
          </span>
        </div>
      </div>
    </template>
  </Collapse>
</template>

<script setup lang="ts">
import IconGarantieCustomer from '@/assets/images/product/icon_garantie_customer.svg'
import IconGarantieBussiness from '@/assets/images/product/icon_garantie_business.svg'
import IconGarantieMsg from '@/assets/images/product/icon_garantie_msg.svg'
import IconGarantiePod1 from '@/assets/images/product/icon_garantie_pod1.svg'
import IconGarantiePod2 from '@/assets/images/product/icon_garantie_pod2.svg'
import IconGarantiePod3 from '@/assets/images/product/icon_garantie_pod3.svg'
import IconGarantiePod4 from '@/assets/images/product/icon_garantie_pod4.svg'
import IconGarantiePod5 from '@/assets/images/product/icon_garantie_pod5.svg'
import Collapse from '@/components/Collapse.vue'

const titleStyle = {
  color: '#bc0c34'
}
const props = defineProps({
  isPod: Boolean
})
defineOptions({
  name: 'ProductAdvantage'
})
const dataSource = props.isPod
  ? [
      {
        icon: IconGarantiePod1,
        title: 'Personalized customized products:',
        desc: 'Satisfy the diverse personalized design requirements of you and your customers.'
      },
      {
        icon: IconGarantiePod2,
        title: 'Intelligent customization system:',
        desc: '100% restoration of customized content, eliminating concerns about customization errors.'
      },
      {
        icon: IconGarantiePod3,
        title: 'Professional supply chain cooperation:',
        desc: 'Guarantee the quality,craftsmanship and  customization timeliness of customized products, while offering competitive prices.'
      },
      {
        icon: IconGarantiePod4,
        title: 'Performance commitment:',
        desc: 'The on-time delivery rate is 99.99%, and the overtime compensation mechanism is customized.'
      }
      // {
      //   icon: IconGarantiePod5,
      //   title: 'A Vast Array of Design Materials to Choose From.',
      //   desc: null
      // }
    ]
  : [
      {
        icon: IconGarantieCustomer,
        title: '1 on 1 Sales Agent:',
        desc: 'Personalized support from our expert team in dropshipping.'
      },
      {
        icon: IconGarantieBussiness,
        title: 'Fast Shipping:',
        desc: 'With our efficient fulfillment system , we strive to reach 99.99% delivery rate to shipping your orders to major destinations.'
      },
      {
        icon: IconGarantieMsg,
        title: 'Supply Chain Expertise:',
        desc: 'Benefit from our 10+ years of supply chain experience for various productcategories and lower price.'
      }
    ]
</script>

<style scoped lang="scss">
.aliExpress-garantie-container {
  display: flex;
  flex-direction: column;

  .title {
    font-size: 16px;
    font-weight: 600;
    font-family: 'SourceSans3';
  }

  .item {
    display: flex;
    margin-top: 16px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    .icon {
      width: 24px;
      height: 24px;
    }

    .desc {
      flex: 1;
      font-size: 16px;
      font-weight: 500;
      color: #666;
      padding-left: 8px;
      font-family: 'SourceSans3';

      .bold {
        color: black;
      }
    }
  }
}
</style>
