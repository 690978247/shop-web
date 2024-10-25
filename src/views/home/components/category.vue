<template>
  <div class="wrap-banner-lf">
    <div
      class="lf-item"
      v-for="(item, index) in items"
      @click.stop="searchBannerData($event, item)"
      :key="item.name"
    >
      <img :src="iconList[index]" class="icondealImg" />
      <span>{{ item.name }}</span>
      <div class="item-fill">
        <div class="fill-wrap">
          <div
            class="wrap-child"
            v-for="(child, index) in item.children"
            :key="index"
          >
            <div class="title">
              <el-text line-clamp="1" @click.stop>{{ child.name }}</el-text>
            </div>
            <div class="content">
              <div
                v-for="sub in child.children"
                :key="sub.name"
                @click.stop="searchChildData(sub)"
              >
                {{ sub.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router/router'
import { useThrottleFn } from '@vueuse/core'
import { headerEventBus } from '@/utils/common'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  width: {
    type: String,
    default: '276px'
  },
  height: {
    type: String,
    default: '428px'
  },
  hoverColor: {
    type: String,
    default: '#bc0c34'
  }
})

// const emit = defineEmits(['itemClick'])

const searchBannerData = useThrottleFn((event: any, item: any) => {
  if (event.target.nodeName !== 'SPAN') return
  const ids: any = []
  item.children.forEach((child: any) => {
    ids.push(child.categoryID)
  })
  headerEventBus.emit({
    type: 'category',
    kw: item.name,
    cids: ids.join(',')
  })
  router.push({
    name: 'SearchDetail',
    query: {
      kw: item.name,
      cids: ids.join(',')
    }
  })
}, 300)

const iconList = [
  'http://static.hzpdex.com/web/1715320312459_icon-a-1.svg',
  'http://static.hzpdex.com/web/1715320364566_icon-a-2.svg',
  'http://static.hzpdex.com/web/1715320364612_icon-a-3.svg',
  'http://static.hzpdex.com/web/1715320364118_icon-a-4.svg',
  'http://static.hzpdex.com/web/1715320364166_icon-a-5.svg',
  'http://static.hzpdex.com/web/1715320364209_icon-a-6.svg',
  'http://static.hzpdex.com/web/1715320364246_icon-a-7.svg',
  'http://static.hzpdex.com/web/1715320364285_icon-a-8.svg',
  'http://static.hzpdex.com/web/1715320364331_icon-a-9.svg',
  'http://static.hzpdex.com/web/1715320364376_icon-a-10.svg',
  'http://static.hzpdex.com/web/1715320364429_icon-a-11.svg',
  'http://static.hzpdex.com/web/1715320364512_icon-a-12.svg'
]

const searchChildData = (item: any) => {
  headerEventBus.emit({
    type: 'child-category',
    kw: item.name,
    cid: item.categoryID
  })
  router.push({
    name: 'SearchDetail',
    query: {
      kw: item.name,
      cid: item.categoryID
    }
  })
}
</script>

<style lang="scss" scoped>
.wrap-banner-lf {
  width: v-bind('$props.width');
  height: v-bind('$props.height');
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 14px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  position: relative;

  .lf-item {
    display: flex;
    align-items: center;
    padding-left: 12px;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    cursor: pointer;
    color: #222222;

    span {
      margin-left: 15px;
    }

    &:hover {
      > span,
      > i {
        color: v-bind('$props.hoverColor');
      }

      // .item-child {
      //   display: block;
      // }
      .item-fill {
        display: block;
      }
    }

    > i {
      font-size: 18px;
      margin-right: 8px;
    }

    .icondealImg {
      width: 24px;
      height: 24px;
    }

    // .item-child {
    //   position: absolute;
    //   z-index: 10;
    //   left: 242px;
    //   top: 0;
    //   width: 160px;
    //   padding: 0 16px;
    //   border-radius: 8px;
    //   box-shadow: 0px 2px 4px 0px #00000033;
    //   background-color: #fff;
    //   display: none;
    //   > div {
    //     padding: 5px 0;
    //     &:hover {
    //       color: #bc0c34;
    //     }
    //   }
    // }
    .item-fill {
      position: absolute;
      z-index: 10;
      left: calc(v-bind('$props.width') + 1px);
      top: -21px;
      // width: 924px;
      // width:auto;
      min-height: 500px;
      padding: 0 24px;
      border-radius: 8px;
      box-shadow: 0px 2px 4px 0px #00000033;
      background-color: #fff;
      display: none;
      box-sizing: border-box;
      overflow: auto;
      max-height: 800px;

      .fill-wrap {
        // width: 100%;
        // display: grid;
        display: flex;

        // grid-template-columns: repeat(3, 28%);
        // grid-column-gap: 70px;
        // grid-row-gap: 24px;

        .wrap-child {
          width: 250px;
          min-height: 220px;
          display: flex;
          flex-direction: column;
          margin-right: 70px;

          &:last-child {
            margin-right: 0px;
          }

          .title {
            font-size: 14px;
            padding-top: 20px;
            position: sticky;
            background-color: #fff;
            top: 0;
            font-weight: bold;
            height: 26px;
            border-bottom: 1px solid #bc0c34;
          }

          .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-top: 6px;
            box-sizing: border-box;
            padding-bottom: 20px;
            color: #666666;

            > div {
              word-break: break-word;

              &:hover {
                color: #bc0c34;
              }

              & + div {
                margin-top: 6px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
