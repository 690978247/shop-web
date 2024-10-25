import request from '@/utils/request'
const PATH_PRE = '/podapi'
/* 分类 */
export function getCategory() {
  return request(PATH_PRE + '/goods/getCategoryTree ', {
    method: 'post'
  })
}
//获取全部模板产品
export function getAllPodProduct(data: any) {
  return request(PATH_PRE + '/goods/pageSearch', {
    method: 'post',
    data
  })
}
//获取全部模板产品
export function getAllPodProduct2(data: any) {
  return request(PATH_PRE + '/goods/pageSearchCdn', {
    method: 'post',
    data
  })
}
//收藏
export function addMyFav(data: any) {
  return request(PATH_PRE + '/myFavourite/add', {
    method: 'post',
    data
  })
}
// 取消搜藏
export function cancelMyFav(data: any) {
  return request(PATH_PRE + '/myFavourite/cancel', {
    method: 'post',
    data
  })
}
// 获取我的收藏的模板列表
export function getMyFavList(data: any) {
  return request(PATH_PRE + '/myFavourite/page', {
    method: 'post',
    data
  })
}

// 获取pod产品详情
export function getPODProductDetail(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchOne',
    method: 'post',
    data: {
      ...data,
      platform: 2 //ud=2, wiio=1
    }
  })
}

// 获取 pod 推荐列表
export function getPODRecommend(data: any) {
  return request({
    url: PATH_PRE + '/goods/searchRecommend',
    method: 'post',
    data: {
      ...data,
      platform: 2 //ud=2, wiio=1
    }
  })
}

//查询pod设计
export function queryPODDesign(
  designNo: any,
  productBaseNo: string,
  spuNo: string
) {
  return request({
    url: PATH_PRE + '/shopDesign/getDesign',
    method: 'post',
    data: {
      designNo: designNo,
      productBaseNo: productBaseNo,
      spuNo: spuNo
    }
  })
}

//保存pod设计
export function savePODDesign(data: any) {
  return request({
    url: PATH_PRE + '/shopDesign/saveDesign',
    method: 'post',
    data: data
  })
}

//queyMaterialImageList
export function queyMaterialImageList(data: any) {
  return request({
    url: PATH_PRE + '/material/image/list/common',
    method: 'post',
    data: data
  })
}

///factory/getDesign
export function getFactoryDesign(designNo: string) {
  return request({
    url: PATH_PRE + '/factory/getDesign',
    method: 'post',
    data: {
      designNo: designNo
    }
  })
}

///公共素材
export const getClassifyList = () =>
  request({
    method: 'post',
    url: PATH_PRE + '/material/image/classify/list'
  })
