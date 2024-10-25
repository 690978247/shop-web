import { fabric } from 'fabric'
import axios from 'axios'
import JSZip from 'jszip'
import { safeGet } from '@/components/DIYSKU/service/SafeGet'

import { useClipboard, useFileDialog, useBase64 } from '@vueuse/core'
/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader['result']> {
  return useBase64(file).promise.value
}

/**
 * @description: 选择文件
 * @param {Object} options accept = '', capture = '', multiple = false
 * @return {Promise}
 */
export function selectFiles(options: {
  accept?: string
  capture?: string
  multiple?: boolean
}): Promise<FileList | null> {
  return new Promise((resolve) => {
    const { onChange, open } = useFileDialog(options)
    onChange((files) => {
      resolve(files)
    })
    open()
  })
}

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function insertImgFile(str: string) {
  return new Promise((resolve) => {
    const imgEl = document.createElement('img')
    imgEl.src = str
    // 插入页面
    document.body.appendChild(imgEl)
    imgEl.onload = () => {
      resolve(imgEl)
    }
  })
}

/**
 * Copying text to the clipboard
 * @param source Copy source
 * @param options Copy options
 * @returns Promise that resolves when the text is copied successfully, or rejects when the copy fails.
 */
export const clipboardText = async (
  source: string,
  options?: Parameters<typeof useClipboard>[0]
) => {
  try {
    await useClipboard({ source, ...options }).copy()
    ElMessage.success('copy success')
  } catch (error) {
    ElMessage.error('copy fail')

    throw error
  }
}

export function getCurrentTimestamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}${month}-${day}_${hours}-${minutes}-${seconds}`
}

export function downFile(
  fileStr: string,
  fileType: string,
  fileName: string = null
) {
  // 创建 Blob 对象
  const blob = new Blob([fileStr], { type: `application/${fileType}` })

  // 创建 URL 对象
  const url = URL.createObjectURL(blob)

  // 创建 <a> 元素
  const anchorEl = document.createElement('a')
  anchorEl.href = url

  // 检查 fileName 是否有值，如果没有则使用默认的时间戳命名
  const name =
    fileName && fileName.length > 0
      ? `${fileName}.${fileType}`
      : `${getCurrentTimestamp()}.${fileType}`

  anchorEl.download = name
  document.body.appendChild(anchorEl) // required for Firefox
  anchorEl.click()

  // 释放 URL 对象
  URL.revokeObjectURL(url)

  // 移除 <a> 元素
  anchorEl.remove()

  // const anchorEl = document.createElement('a')
  // anchorEl.href = fileStr
  // // 检查 fileName 是否有值，如果没有则使用默认的时间戳命名
  // const name =
  //   fileName && fileName.length > 0
  //     ? `${fileName}.${fileType}`
  //     : `${getCurrentTimestamp()}.${fileType}`

  // anchorEl.download = name
  // document.body.appendChild(anchorEl) // required for firefox
  // anchorEl.click()
  // anchorEl.remove()
}

export function drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined
) {
  if (angle === undefined) return
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(angle)
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize)
  ctx.restore()
}

export function shiftAngle(start: fabric.Point, end: fabric.Point) {
  const startX = start.x
  const startY = start.y
  const x2 = end.x - startX
  const y2 = end.y - startY
  const r = Math.sqrt(x2 * x2 + y2 * y2)
  let angle = (Math.atan2(y2, x2) / Math.PI) * 180
  angle = ~~(((angle + 7.5) % 360) / 15) * 15

  const cosx = r * Math.cos((angle * Math.PI) / 180)
  const sinx = r * Math.sin((angle * Math.PI) / 180)

  return {
    x: cosx + startX,
    y: sinx + startY
  }
}

/**
 * 类型工具
 */
export const isImage = (thing: unknown): thing is fabric.Image => {
  return thing instanceof fabric.Image
}

export const isGroup = (thing: unknown): thing is fabric.Group => {
  return thing instanceof fabric.Group
}

export const isIText = (thing: unknown): thing is fabric.IText => {
  return thing instanceof fabric.IText
}

export const isActiveSelection = (
  thing: unknown
): thing is fabric.ActiveSelection => {
  return thing instanceof fabric.ActiveSelection
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsDataURL(blob)
  })
}

export function base64ToBlob(base64Data: string) {
  if (!base64Data) {
    return null
  }
  const dataArr = base64Data.split(',')
  const imageType = dataArr[0].match(/:(.*?);/)[1]
  const textData = window.atob(dataArr[1])
  const arrayBuffer = new ArrayBuffer(textData.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i)
  }
  return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)]
}

// 生成随机字符串
export function generateRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }

  return result
}

// 生成图层唯一ID
export const generateObjectID = () => {
  return 'object_' + generateRandomString(5)
}

//显示数据预处理,转成画布能显示的数据
export const convertStage = (
  stage: any,
  stageKey: string = '',
  isPreview: boolean = false
) => {
  let index = 0
  //设置截图效果,用于缩略图
  let screenshot = ''
  //赋值stageKey到stageName,方便后续处理
  stage.stageName = stageKey

  for (const object of stage.objects) {
    //设置图片跨域,避免图片无法显示
    object.crossOrigin = 'anonymous'
    if (index === 0 && object.type === 'rect') {
      //背景层,一定要使用workspace作为id,图层缩放使用
      object.id = 'workspace'
      object.layerType = 'base'
      //如果不设置白色,导出图片将是透明
      // object.fill = 'white'
    } else if (index === 1 && object.type === 'image') {
      //产品模板
      object.id = 'product'
      object.layerType = 'base'
      //默认截图
      screenshot = object.src
    } else if (index === 2) {
      //编辑区
      object.id = 'edit_zone'
      object.layerType = 'base'
      if (isPreview) {
        object.visible = false
      }
    } else {
      //用户添加的图层
      const id = safeGet.string(object, 'id', '')
      if (!id) {
        object.id = generateObjectID()
      }
      object.layerType = 'custom'
    }
    index += 1
  }

  //设置效果图
  if (!stage.screenshot) {
    stage.screenshot = screenshot
  }
  return stage
}

// 转换产品信息
export const convertProductInfo = (data: any, isPreview: boolean = false) => {
  for (const stageKey in data.stages) {
    let stage = data.stages[stageKey]
    stage = convertStage(stage, stageKey, isPreview)
  }
  //console.log('🟫[Utils]convertProductInfo data:', data)
  return data
}

export const exportImgsZip = async (imgs: any, fileName: string) => {
  const zip = new JSZip()

  for (const item of imgs) {
    const fileName = item.url?.split('/').pop()
    const { data } = await axios({
      method: 'get',
      url: item.url,
      responseType: 'blob'
    })

    zip.file(item.name + '-' + fileName, data)
  }

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    const url = window.URL.createObjectURL(content)

    downloadFile(url, fileName || 'images')
  })

  function downloadFile(url: string, name: string) {
    const a = document.createElement('a')

    a.href = url
    a.download = name
    a.click()
  }
}

export const parseAndSortStages = (stages: any) => {
  if (typeof stages === 'object') {
    return stages
  }
  if (typeof stages === 'string') {
    return JSON.parse(stages)
  }
  return stages
  if (stages === null || typeof stages !== 'object') {
    return null
  }
  const stageEntries = Object.entries(stages)

  // 检查是否所有的stage都有index
  const allHaveIndex = stageEntries.every(([, stage]) =>
    Object.prototype.hasOwnProperty.call(stage, 'index')
  )

  if (!allHaveIndex) {
    // 如果有任意一个stage没有index，返回原始stages
    return stages
  }
  // 将 stages 转换为数组并按 index 排序
  const sortedStages = Object.keys(stages)
    .map((key) => ({
      name: key,
      ...stages[key]
    }))
    .sort((a, b) => a.index - b.index)

  // 将排序后的数组重新转换为对象
  return sortedStages.reduce((acc, stage) => {
    acc[stage.name] = {
      ...stage,
      index: stage.index,
      objects: stage.objects,
      version: stage.version,
      shadowSrc: stage.shadowSrc,
      colorConfig: stage.colorConfig
    }
    return acc
  }, {})
}

export default {
  parseAndSortStages,
  getImgStr,
  downFile,
  selectFiles,
  insertImgFile,
  clipboardText,
  drawImg,
  isImage,
  isGroup,
  isIText,
  isActiveSelection,
  blobToBase64,
  base64ToBlob,
  generateRandomString,
  generateObjectID,
  convertStage,
  convertProductInfo,
  getCurrentTimestamp
}
