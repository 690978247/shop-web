<template>
  <div class="printImagesContent">
    <div class="upload-content">
      <div class="searchBar">
        <el-input
          clearable=""
          v-model="searchKeyword"
          @clear="clearKeyword"
          @keyup.enter="enterSearch"
          placeholder="enter keyword"
          class="form-input input-search"
        ></el-input>
      </div>
      <div class="upload-pic-content">
        <template v-if="imgList?.length">
          <div class="upload-pic-flex">
            <div
              class="print-div"
              v-for="item in imgList"
              :key="item.id"
              @click="addImg(item)"
            >
              <div class="imgsCheck">
                <el-image
                  class="img"
                  :src="item.imageUrl"
                  alt=""
                  lazy
                ></el-image>
              </div>
              <div class="pic-names">
                <div class="name">{{ item.fileName }}</div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty
            description="No results found matching your query"
            :image-size="360"
            :image="emptyImg"
          ></el-empty>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import emptyImg from '@/assets/images/empty_data.svg'
defineOptions({
  name: 'SKUImageTab'
})
// 定义 props
const props = defineProps({
  imgList: {
    type: Array,
    required: true,
    default: () => []
  },
  tabName: {
    type: [String, Number],
    required: true
  }
})

// 定义响应式数据
const searchKeyword = ref('')

// 定义 methods
const emit = defineEmits(['enterSearch', 'customUploadRequest', 'addImg'])

const enterSearch = (e: any) => {
  if (e.keyCode === 13) {
    emit('enterSearch', searchKeyword.value)
  }
}

const clearKeyword = () => {
  emit('enterSearch', '')
}

const customUploadRequest = (file: File) => {
  emit('customUploadRequest', file)
}
const addImg = (item: any) => {
  emit('addImg', item)
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
.printImagesContent {
  .upload-content {
    // padding: 0 60px;
    padding-left: 20px;
    height: calc(100% - 100px);
    overflow: hidden;
    .searchBar {
      margin-bottom: 20px;
      @include flex_center;
      justify-content: flex-end;
      width: 100%;
      padding-inline-start: 0;
      .input-search {
        width: 280px;
        :deep(.el-input__wrapper) {
          border-radius: 26px;
        }
      }
    }
    .upload-pic-content {
      width: 100%;
      overflow-y: hidden;
      height: 480px;
      .upload-pic-flex {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 20px;
        &::-webkit-scrollbar {
          background-color: #dedede;
          width: 4px;
        }
        .print-div {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          .imgsCheck {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: 10px;
            &:hover {
              .showDel {
                display: block;
              }
            }
            .img {
              cursor: pointer;
              width: 100%;
              height: 100%;
              border-radius: 6px;
              border: 1px solid #e5e5e5;
            }
          }

          .pic-names {
            font-size: 15px;
            font-weight: 600;
            color: #333333;
            .name {
              width: 180px;
              @include ellipse;
            }
          }
        }
      }
      .empty-pic {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #666666;
        img {
          width: 360px;
          height: 360px;
          margin-bottom: 48px;
        }
      }
    }
  }
}
</style>
