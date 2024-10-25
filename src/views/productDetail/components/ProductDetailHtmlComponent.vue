<template>
  <div class="product-detail">
    <div class="describe">
      <Editor
        :init="{
          content_style: `
            html, body {
              margin: 0 !important; /* 确保 html 和 body 的 margin 为 0 */
            }
            * {
            font-family: SourceSans3 !important; /* 确保全文使用Arial字体 */
            color: black !important; /* 字体颜色为黑色 */
            font-size: 14px !important; /* 字号为12号 */
            font-weight: normal !important; /* 字体不加粗 */
            line-height: 1 !important; /* 行高为1 */
            
          }
          img {
            float: left;
            max-width: 100%;
            height: auto;
          } /* 解决图片缩放问题 */
    `, // 设置样式
          plugins: 'lists link image table code help wordcount autoresize ',
          toolbar: false, // 隐藏工具栏
          menubar: false, // 隐藏菜单栏
          statusbar: false, // 隐藏状态栏
          editable_root: false, //设置editable_root为false将 TinyMCE 根设置为不可编辑（实际上是只读）
          autoresize_bottom_margin: 0,
          // autoresize_on_init: true,
          autoresize_overflow_padding: 0,
          autoresize_min_height: 100, // 设置一个最小高度
          autoresize_max_height: 5000, // 设定一个足够大的最大高度以容纳内容
          selector: 'textarea',
          auto_update_plugin: false,
          auto_update_core: false,
          base_url: 'https://static.hzpdex.com/web/tinymce/js/tinymce/',
          setup: function (editor: any) {
            editor.on('init', function () {
              var editorContainer = editor.getContainer()
              editorContainer.style.borderColor = 'white'
              editorContainer.style.borderWidth = '0px'
              editorContainer.style.borderStyle = 'solid'
            })
            editor.on('click', handleEditorClick)
          }
        }"
        v-model="sanitizedHtml"
      />
    </div>
  </div>
  <ImagePreviewDialog
    v-model:visible="showPreviewDialog"
    :preview-src-list="previewImageList"
    :initial-index="currentPreviewIndex"
  />
</template>

<script lang="ts" setup>
import { onMounted, PropType, ref } from 'vue'
import { TProductDetail } from '@/views/productDetail/model/model'
import ImagePreviewDialog from '@/components/ImagePreview/index.vue'
import Editor from '@tinymce/tinymce-vue'

// 示例数据，实际开发中应该通过props传入
const props = defineProps({
  productData: {
    type: Object as PropType<TProductDetail>,
    required: true
  },
  htmlContent: {
    type: String as PropType<string>,
    required: false
  }
})

const sanitizedHtml = ref('')
const showPreviewDialog = ref(false)
const previewImageList = ref([])
const currentPreviewIndex = ref(0)

onMounted(() => {
  sanitizedHtml.value = formatHtml(props.htmlContent)
})

const fixHtml = (html: any) => {
  // 创建一个临时的DOM元素来解析HTML内容
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html // 使用函数参数

  //这里主要兼容,有些div宽度790px,管理平台不好处理,
  const divs = tempDiv.querySelectorAll('div')
  divs.forEach((div) => {
    replaceNodeAttributeWidth(div, 'width')
    replaceNodeAttributeWidth(div, 'max-width')
  })

  // 查找所有的<img>元素并更新它们的`src`属性为`data-mce-src`的值（如果存在）
  const images = tempDiv.querySelectorAll('img')
  images.forEach((img) => {
    const dataMceSrc = img.getAttribute('data-mce-src')
    if (dataMceSrc) {
      img.src = dataMceSrc
      img.removeAttribute('data-mce-src') // Optionally remove the attribute if not needed anymore
    } else {
      const imgSrc = img.getAttribute('src')
      if (imgSrc?.includes('src')) {
        const srcMatch = imgSrc.match(/src="([^"]+)"/)
        if (srcMatch && srcMatch[1]) {
          img.src = srcMatch[1]
        }
      }
    }

    replaceNodeAttributeWidth(img, 'width')
    replaceNodeAttributeWidth(img, 'max-width')
  })
  return tempDiv.innerHTML
}

/**
 * 删除元素大于500px的宽度/最大宽度样式
 * @param node
 * @param attribute
 */
const replaceNodeAttributeWidth = (node: any, attribute: string) => {
  const style = node.getAttribute('style')
  const replaceRegex = new RegExp(`${attribute}:\\s*(\\d+(?:\\.\\d+)?)px;`)

  const match = replaceRegex.exec(style)
  if (match && match[1]) {
    const width = parseInt(match[1], 10)

    // 如果宽度大于 500px，则移除 width 样式
    if (width > 500) {
      const newStyle = style.replace(replaceRegex, '')
      node.setAttribute('style', newStyle)
    }
  }
}

const handleEditorClick = (e) => {
  const element = e.target
  if (element.nodeName === 'IMG') {
    const imageSrc = element.getAttribute('src')
    if (imageSrc) {
      currentPreviewIndex.value = previewImageList.value.indexOf(imageSrc)
      if (currentPreviewIndex.value === -1) {
        currentPreviewIndex.value = 0
      }
      showPreviewDialog.value = true
    }
  }
}

const formatHtml = (html: string) => {
  const htmlContent = fixHtml(html)
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  previewImageList.value = []

  // Deactivate all links and adjust their style.
  adjustElements(tempDiv, 'a', (element: any) => {
    element.href = 'javascript:void(0)'
    element.target = '_self'
    element.style.pointerEvents = 'none'
  })

  // Set all images to full width.
  adjustElements(tempDiv, 'img', (element) => {
    // element.style.width = '100%'
    element.style.cursor = 'pointer'
    element.removeAttribute('width')
    element.removeAttribute('height')

    const imageSrc = element.getAttribute('src')
    if (imageSrc) {
      previewImageList.value.push(imageSrc)
    }
  })

  return tempDiv.innerHTML
}

/**
 * Adjusts HTML elements by applying a function to each element found by tag name.
 * @param {HTMLElement} parentElement - The parent element containing the target elements.
 * @param {string} tagName - The tag name of elements to adjust.
 * @param {(element: HTMLElement) => void} adjustFunc - The function to apply to each element.
 */
function adjustElements(
  parentElement: HTMLElement,
  tagName: string,
  adjustFunc: (element: HTMLElement) => void
): void {
  const elements = parentElement.getElementsByTagName(tagName)
  const elementsArray = Array.from(elements)
  elementsArray.forEach(adjustFunc)
}
</script>

<style lang="scss" scoped>
.product-detail {
  background-color: white;
  font-family: Arial, sans-serif;
  padding-left: 0px;
  padding-right: 0px;
  margin: 0;

  .title {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 10px;
  }

  .sub-title {
    font-size: 18px;
    font-weight: 600;
    line-height: 34.2px;
  }

  .text {
    font-size: 18px;
    font-weight: 400;
    line-height: 34.2px;
  }

  .describe {
    overflow: visible; /* 允许内容根据需要扩展 */
  }

  .divider {
    margin-top: 10px;
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
