import request from '@/utils/request'

const PATH_PRE = '/goodsapi'

// 商品查询
export function getProductData(data: any) {
  return request({
    url: PATH_PRE + '/goods/search',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}

// recommend 商品查询
export function getRecommendData(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchIndexRecommend',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}

// 爆款接口
export function getHotProductData(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchHot',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}

// 商品详情推荐接口
export function queryRecommandList(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchRecommend',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}

// 商品详情推荐接口
export function queryIndexRecommandList(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchIndexRecommend',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}

export function getProductDetail(
  offerId: any,
  goodsCode: any,
  country: string
) {
  return request({
    url: PATH_PRE + '/goods/searchOne',
    method: 'post',
    data: {
      offerId: offerId,
      goodsCode: goodsCode,
      platform: 2,
      country: country
    }
  })
}

export function getProductDetailPreview(goodsCode: any, country: string) {
  return request({
    url: PATH_PRE + '/goods/preview',
    method: 'post',
    data: {
      goodsCode: goodsCode,
      platform: 2,
      country: country
    }
  })
}

export function calculateShippingCosts(data: any) {
  return request({
    url: PATH_PRE + '/logistics/getTemplateList',
    method: 'post',
    data
  })
}

// export function uploadFile(file: File) {
//   const fileData = new FormData()
//   fileData.append('file', file)
//   return request({
//     url: PATH_PRE + '/oss/uploadFile',
//     method: 'post',
//     data: fileData,
//     timeout: 60000
//   })
// }

export function uploadFileOss() {
  return request({
    url: PATH_PRE + '/oss/sign',
    method: 'get',
    timeout: 60000
  })
}

// 顶部 图片搜索
export function imageSearch(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchByImage',
    method: 'post',
    data: {
      ...data,
      platform: 2
    }
  })
}
