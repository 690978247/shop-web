import JSZip from 'jszip'

/**
 * @description 将商品的图片和视频打包下载
 * @param imageUrls
 * @param videoUrls
 */
export function downloadResourceByZip({
  fileName,
  imageUrls,
  videoUrls
}: {
  fileName: string
  imageUrls: string[]
  videoUrls?: string[]
}) {
  const zip = new JSZip()
  const fetchResult = new Promise(
    (resolve: (value: any) => void, reject: (error: Error) => void) => {
      // 添加图片到 zip 文件
      imageUrls.forEach((url, index) => {
        fetch(url)
          .then((response) => response.blob())
          .then((blob) => {
            zip.file(`${fileName}_image_${index + 1}.jpg`, blob)
            checkVideoDownload()
          })
          .catch((error) => {
            reject(error)
          })
      })

      function checkVideoDownload() {
        // 添加视频到 zip 文件
        videoUrls.forEach((url, index) => {
          fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
              zip.file(`${fileName}_video_${index + 1}.mp4`, blob)
              resolve(true)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
    }
  )

  fetchResult
    .then(() => checkAndDownload())
    .catch((error) => {
      console.error(error)
      ElMessage.error('download error')
    })

  function checkAndDownload() {
    // 检查是否所有文件都已经添加到 zip 中
    if (imageUrls.length + videoUrls.length === Object.keys(zip.files).length) {
      // 所有文件都已添加，现在可以生成并下载 zip 文件
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => {
          const url = URL.createObjectURL(content)
          const link = document.createElement('a')
          link.href = url
          link.download = `${fileName}.zip` // 设置下载文件名
          link.style.display = 'none'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
        .catch((error) => console.error('Error generating zip file:', error))
    }
  }
}
