import { fabric } from 'fabric'
import { OSSUploadType, useJSCore } from 'sm-js-core'

import {
  commonLayerConfig,
  backgroundLayerConfig
} from '@/components/DIYSKU/service/FabricObjectConfig'

function loadJsonToCanvas(fabricCanvas: fabric.Canvas, copyStage: any) {
  return new Promise<void>((resolve, reject) => {
    fabricCanvas.loadFromJSON(
      copyStage,
      () => {
        // 设置每个对象的通用配置
        fabricCanvas.getObjects().forEach((obj: any) => {
          obj.set(commonLayerConfig)
          obj.set(backgroundLayerConfig)
        })
        fabricCanvas.renderAll()
        resolve() // 成功时调用 resolve
      },
      (error: any, options: any) => {
        // console.error('Error loading JSON to canvas:', error)
        // reject(error) // 失败时调用 reject
      }
    )
  })
}
function loadImageWithCORS(image: fabric.Image) {
  return new Promise<void>((resolve, reject) => {
    const src = image.getSrc()
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      image.setElement(img)
      resolve()
    }
    img.onerror = reject
    img.src = src
  })
}
function dataURLToBlob(dataURL: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
      const blob = xhr.response
      resolve(blob)
    }
    xhr.onerror = function () {
      reject(new Error('Failed to convert data URL to blob'))
    }
    xhr.open('GET', dataURL)
    xhr.responseType = 'blob'
    xhr.send()
  })
}

export async function generateImageWithStageData(
  stage: any,
  useOss: boolean = false
): Promise<string> {
  if (!stage || stage.objects.length === 1) {
    console.log('❌[OutputPlugin] stage is null')
    return null
  }
  console.log(
    '🟢[SkuGenerateImageHelper] 1 Preparing to generate an image =>',
    stage.stageName
  )
  const newCanvas = document.createElement('canvas')
  // 设置 Canvas 的尺寸
  newCanvas.width = 400 // 设置宽度
  newCanvas.height = 400 // 设置高度

  const fabricCanvas = new fabric.Canvas(newCanvas, {
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
  })
  console.log('🟢[SkuGenerateImageHelper] 2 copy stage')
  const copyStage = JSON.parse(JSON.stringify(stage))
  // 删除 id 为 'edit_zone' 的对象
  console.log('🟢[SkuGenerateImageHelper] 3 delete edit_zone')
  copyStage.objects = copyStage.objects.filter(
    (item: any) => item.id !== 'edit_zone'
  )
  console.log('🟢[SkuGenerateImageHelper] 4 set commonLayerConfig')
  copyStage.objects.forEach((item: any) => {
    if (item.type === 'image') {
      item.crossOrigin = 'anonymous'
    }
  })
  console.log('🟢[SkuGenerateImageHelper] 5 loadJsonToCanvas')
  await loadJsonToCanvas(fabricCanvas, copyStage)
  // 等待所有图像加载完成
  console.log('🟢[SkuGenerateImageHelper] 6 loadImages')
  await Promise.all(
    fabricCanvas.getObjects().map(async (obj: any) => {
      if (obj instanceof fabric.Image) {
        obj.crossOrigin = 'anonymous' // 设置图像对象的
        await loadImageWithCORS(obj)
      }
    })
  )

  // 设置导出选项
  const option = {
    name: 'New Image',
    format: 'png',
    quality: 4,
    enableRetinaScaling: true,
    multiplier: 5,
    width: 400,
    height: 400,
    left: 0,
    top: 0
  }

  fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0])

  // 导出 Canvas 数据为 Blob 对象
  const dataURL = fabricCanvas.toDataURL(option)
  console.log('🟢[SkuGenerateImageHelper] 7 blob:')
  if (!useOss) {
    console.log('🟢[SkuGenerateImageHelper] 8 ✅ useOss return dataURL')
    return dataURL
  }

  // return dataURL
  const blob = await dataURLToBlob(dataURL)

  // 创建一个 File 对象
  const file = new File([blob], 'screenshot.png', { type: 'image/png' })

  // 上传截图到 OSS
  try {
    console.log('🟢[SkuGenerateImageHelper] 8 upload to oss')
    const { url } = await useJSCore().oss.upload(file, {
      uploadType: OSSUploadType.POD_MATERIAL
    })
    console.log('🟢[SkuGenerateImageHelper] 9 ✅url:', url)
    return url // 返回上传后的 URL
  } catch (error) {
    return null
  }
}

export async function generateOssURLWithBlob(dataURL: string) {
  // return dataURL
  const blob = await dataURLToBlob(dataURL)

  // 创建一个 File 对象
  const file = new File([blob], 'screenshot.png', { type: 'image/png' })

  // 上传截图到 OSS
  try {
    console.log('🟢[SkuGenerateImageHelper] 8 upload to oss')
    const { url } = await useJSCore().oss.upload(file, {
      uploadType: OSSUploadType.POD_MATERIAL
    })
    console.log('🟢[SkuGenerateImageHelper] 9 ✅url:', url)
    return url // 返回上传后的 URL
  } catch (error) {
    return null
  }
}
