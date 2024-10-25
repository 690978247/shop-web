// TProductAttrValueVOs 类型定义，表示产品属性值的详细信息
export type TProductAttrValueVOs = {
  skuImageUrl: string // SKU 图片的 URL
  attrValue: string // 属性值
  attrVauleTrans: string // 属性值的翻译
  specValueCode: string
  specCode: string
}

export type TSpecValueInfo = {
  specName: string
  specValue: string
  specValueCode: string
  specCode: string
}

// TProductAttributes 类型定义，表示产品的属性信息
export type TProductAttributes = {
  attributeId: number // 属性的唯一标识符
  attributeName: string // 属性名称
  attributeNameTrans: string // 属性名称的翻译
  attrValueVOs: TProductAttrValueVOs[] // 包含属性值详细信息的数组
}

export type TShippingInfo = {
  length: number // 长
  width: number // 宽
  height: number // 高
  skuId: string // SKU ID
  specId: string // 规格Id
  weight: number //重量
}

// TProductSkuVOs 类型定义，表示产品的 SKU 信息
export type TProductSkuVOs = {
  goodsCode: string // 产品的唯一标识符
  skuId: number // SKU 的唯一标识符
  specId: string // 规格的标识符
  price: string // 价格
  jxhyPrice: string // 价格
  consignPrice: string // 托运价格
  image: string // 图片
  shippingInfo: TShippingInfo // 配送信息
  specValueCodeItem: string[] // 包含属性值详细信息的数组
  specValueInfoList: TSpecValueInfo[] // 包含属性值详细信息的数组
}

export type TProductDetail = {
  productBaseNo: string
  isPodProduct: boolean // 是否是组合产品
  goodsCode: string // 产品ID
  erpGoodsCode: string // 产品ID
  platform: string // 使用平台: 1:WIIO; 2:UD;
  offerId: string // 产品报价的唯一标识符
  categoryId: string[] // 产品所属类别的标识符
  categoryName: string // 类别名称的数值表示
  publishedTime: string //商品发布时间
  description: string // 产品描述
  sizeTable: string // 产品尺寸表
  printInfo: string // 产品印刷信息
  subject: string // 产品主题
  subjectTrans: string // 翻译后主题的数值表示
  mainImage: string // 产品主图
  mainVideo: string // 与产品相关的主视频的URL或标识符
  detailVideo: string // 与产品相关的详细视频的URL或标识符
  images: string[] // 产品图片的URL或标识符数组
  saleInfo: any[]
  minOrderQuantity: number // 产品的最小订购数量
  productAttributes: TProductAttributes[] // 产品属性的占位符（考虑使用具体结构更新类型）
  skuVOs: TProductSkuVOs[] // SKU 变体的占位符（考虑使用具体结构更新类型）
  markCode: string // 产品标记
  goodsSkuList: any[]
  productionCycle: string // 产品生产周期
  minWeight: string // 产品最小重量
  minPrice: string // 产品最小价格
  texture: string // 产品材质
  type: any // 产品类型
  goodsPromotionShow: any // top100产品的推广信息
  pNo: string
  spuNo: string
}

export type TPodInfo = {
  pNo: string
  spuNo: string
  type: number // 产品类型
  minPrice: string // 产品的最低价格
  goodsSkuList: any[]
  goodsPromotionShow: any // top100产品的推广信息
}
