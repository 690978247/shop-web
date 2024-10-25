// 渲染对象的方法
function renderObject(context, obj, options = { product_color: '' }) {
  if (!obj || !obj.visible) return // 如果对象不存在或不可见，直接返回

  // 绘制背景色
  if (options.product_color) {
    context.fillStyle = options.product_color
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }

  if (obj.type === 'image' && obj.src) {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      // 计算居中位置
      const x = (context.canvas.width - obj.width * obj.scaleX) / 2
      const y = (context.canvas.height - obj.height * obj.scaleY) / 2

      context.drawImage(
        img,
        x, // 居中位置的 x 坐标
        y, // 居中位置的 y 坐标
        obj.width * obj.scaleX,
        obj.height * obj.scaleY
      )
    }
    img.onerror = (error) => {
      console.log('❌ Failed to load image: ', error)
    }
    img.src = obj.src
  } else if (obj.type === 'i-text' && obj.text) {
    const x = (context.canvas.width - obj.width * obj.scaleX) / 2
    const y = (context.canvas.height - obj.height * obj.scaleY) / 2
    const textWidth = obj.width * obj.scaleX

    context.font = `${obj.fontSize}px ${obj.fontFamily}`
    context.textAlign = 'left'
    context.fillStyle = obj.fill

    context.fillText(obj.text, x, y, textWidth) // 调整文本基线的 y 位置
  }
}

// 渲染画布的方法
function renderCanvas(canvas, stage) {
  if (!canvas) {
    console.log('❌ Failed to get canvas ref')
    return
  }
  const context = canvas.getContext('2d')
  if (!context) {
    console.log('❌ Failed to get canvas context 2d')
    return
  }

  context.clearRect(0, 0, canvas.width, canvas.height) // 清空画布

  // 渲染模板
  if (stage.data.overlayImage) {
    renderObject(context, stage.data.overlayImage, {
      product_color: stage.data.product_color
    })
  }

  // 渲染元素
  stage.data.objects.forEach((obj) => {
    renderObject(context, obj)
  })
}

// 保存画布内容的方法
function saveCanvas(canvas) {
  if (canvas) {
    try {
      const imageDataURL = canvas.toDataURL('image/png') // 将 canvas 内容转换为 Base64 编码的 URL

      // 创建一个链接元素
      const link = document.createElement('a')
      link.href = imageDataURL
      link.download = `${generateFileName()}.png` // 设置下载文件的名称

      // 模拟点击链接以触发下载
      link.click()
    } catch (error) {
      console.log('❌ Failed to save canvas image: ', error)
    }
  } else {
    console.log('❌ Canvas not found for side: ')
  }
}

// 生成文件名的方法
function generateFileName() {
  const date = new Date()
  const timestamp = date.getTime()
  return `image_${timestamp}`
}

export { renderObject, renderCanvas, saveCanvas }
