<template>
  <div class="container">
    <el-container>
      <el-header>
        <h1>SKU Preview</h1>
        <p>Design ID : {{ props.did }}</p>
        <p>Product name : {{ productInfo?.name }}</p>
        <p>Product id : {{ productInfo?.id }}</p>
      </el-header>
      <el-main>
        <div class="preview-container" v-if="stageData">
          <div class="stage" v-for="(stage, side) in stageData" :key="side">
            <h2 style="margin-bottom: 10px">
              {{ side.charAt(0).toUpperCase() + side.slice(1) }}
            </h2>
            <!-- <div>{{ side }}</div> -->
            <canvas
              :ref="(el) => (canvasRefs[side] = el)"
              :width="stage.data.product_width"
              :height="stage.data.product_height"
              class="canvas"
            />
            <div>
              <el-button class="save-btn" type="primary" @click="save(side)"
                >Save Image</el-button
              >
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watchEffect } from 'vue'
import { renderCanvas, saveCanvas } from '@/views/pod/service/canvasRenderer.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  did: {
    type: String,
    required: true,
    default: ''
  },
  preview: {
    type: Boolean,
    default: false
  }
})

interface ObjectData {
  type: string
  left: number
  top: number
  width: number
  height: number
  fill: string
  opacity: number
  visible: boolean
  scaleX: number
  scaleY: number
  angle: number
  src?: string
  text?: string
  fontSize?: number
  fontFamily?: string
  full_src: string
}

interface Stage {
  data: {
    background: string
    overlayImage: ObjectData
    devicePixelRatio: number
    product_color: string
    product_width: number
    product_height: number
    screenshot: string
    limit_zone: {
      height: number
      width: number
      left: number
      top: number
    }
    objects: (ObjectData | null)[]
  }
  edit_zone: {
    height: number
    width: number
    left: number
    top: number
    radius: string
  }
  image: string
  product_width: number
  product_height: number
  devicePixelRatio: number
  screenshot: string
}

interface StageData {
  front: Stage
  back: Stage
}

const canvasRefs = ref<{ [key: string]: HTMLCanvasElement | null }>({})
const imageURL = ref<{ [key: string]: string | null }>({})
const stageData = ref<StageData | null>(null)
const productInfo = ref(null)
const productURL = ref(
  'https://static.hzpdex.com/web/1717817293546_diysku.json'
)

const loading = ref(false)

const loaddata = async () => {
  if (!productURL.value.toLowerCase().endsWith('.json')) {
    ElMessage.error('请输入JSON格式的配置文件')
    return
  }
  loading.value = true
  stageData.value = null
  productInfo.value = null
  try {
    const response = await fetch(productURL.value)
    const data = await response.json()
    stageData.value = data.stages
    productInfo.value = data
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const save = (side: string) => {
  saveCanvas(canvasRefs.value[side])
}

onMounted(() => {
  loaddata()
  watchEffect(() => {
    if (stageData.value) {
      Object.keys(stageData.value).forEach((side) => {
        imageURL.value[`${side}`] = ''
        const canvas = canvasRefs.value[side]
        const stage = stageData.value[side]
        renderCanvas(canvas, stage)
      })
    }
  })
})
</script>

<style lang="scss" scoped>
.container {
}
.url-input {
  width: 50%;
  margin-bottom: 20px;
}
.preview-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.stage {
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.canvas {
  border: 1px solid #ccc;
}

.save-btn {
  margin-top: 20px;
}
</style>
