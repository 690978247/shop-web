/* eslint-disable no-console */
import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import { safeGet } from '@/components/DIYSKU/service/SafeGet'
import basesku from '@/components/DIYSKU/resource/basesku.json'
import designMockList from '@/components/DIYSKU/resource/designlist.json'
import designScenes from '@/components/DIYSKU/resource/designScenes.json'
import {
  convertProductInfo,
  convertStage,
  parseAndSortStages
} from '@/components/DIYSKU/service/utils'
import {
  queryPODDesign,
  queyMaterialImageList,
  savePODDesign,
  getFactoryDesign
} from '@/api/pod'

import designEventBus from '@/components/DIYSKU/service/DesignEventBus'
import { DESIGN_EVENTS } from '@/components/DIYSKU/service/DesignEvents'
import { debug } from 'console'

// 定义一个名为 'designer' 的 Pinia store
export const useDesignerStore = defineStore('designer', () => {
  const isDevMode = false // 是否是开发模式
  // 初始化状态
  const dataQueryInfo = ref({ did: '', pNo: '', spuNo: '', preview: false })
  const isRealModel = ref(false) // 是否是正片叠底
  const sceneList = ref([]) // 场景列表

  const productInfo = ref(null) // 存储产品信息

  const loading = ref(false) // 初始化状态
  const currentStageIndex = ref(0) // 当前步骤索引
  const currentSceneIndex = ref(0) // 当前场景索引

  const thumbanilImageList = ref([]) // 缩略图图片列表

  const currentAdderName = ref('') // 当前添加器索引

  const imageResourceRecords = ref([]) // 图片资源记录
  const imageResourceRecordsIndex = ref(1) // 图片资源记录索引
  const imageResourceRecordsHasMore = ref(true) // 图片资源记录是否还有更多
  const loadingInstance = ref(null) // 加载实例

  const generateProductInfo = (designInfoJSONStr: any) => {
    const designInfo = JSON.parse(designInfoJSONStr)

    if (designInfo.stages) {
      designInfo.stages = parseAndSortStages(designInfo.stages)
      return designInfo
    }

    //如果是模板进来,是没有设计信息,自行补充
    const stages = parseAndSortStages(designInfo)
    const info = {
      designNo: dataQueryInfo.value.did,
      spuNo: dataQueryInfo.value.spuNo,
      productBaseNo: dataQueryInfo.value.pNo,
      stages: stages
    }
    return info
  }

  const queryDesignerData = async (isFactory?: boolean) => {
    const Methods = isFactory ? getFactoryDesign : queryPODDesign
    return Methods(
      dataQueryInfo.value.did,
      dataQueryInfo.value.pNo,
      dataQueryInfo.value.spuNo
    )
      .then((result) => {
        const { data } = result
        if (!data) {
          ElMessage.error('Design info is empty')
          onDesignInfoLoaded(false)
          return
        }
        const { designInfo } = data

        if (designInfo) {
          try {
            const scenes = JSON.parse(designInfo)?.scenes
            if (scenes === undefined) {
              if (!isFactory) {
                ElMessage.error('Design info is Error')
                onDesignInfoLoaded(false)
              } else {
                //预览展示
                const info = generateProductInfo(designInfo)
                productInfo.value = convertProductInfo(info, true)
                updateThumbanilImageList() //绘制右侧图层
                onDesignInfoLoaded()
              }
              loading.value = false
              return
            }
            // 加载场景列表
            sceneList.value = scenes

            const firstObject = sceneList.value[0]
            const firstObjectJSON = firstObject.designInfo

            productInfo.value = convertProductInfo(firstObjectJSON)
            productInfo.value.stages = parseAndSortStages(
              productInfo.value.stages
            )

            updateThumbanilImageList()
            loading.value = false
            onDesignInfoLoaded()
          } catch (error) {
            ElMessage.error('DesignInfo is Error')
          }
        } else {
          ElMessage.error('Product info is empty')
        }
      })
      .catch((error) => {
        onDesignInfoLoaded(false)
        ElMessage.error(error.message)
        console.log('🟦[designerStore]❌productInfo query error:', error)
      })
      .finally(() => {
        loading.value = false // 最终设置加载状态为false
      })
  }
  const queryMaterialImageFirstList = async () => {
    imageResourceRecordsIndex.value = 1
    imageResourceRecordsHasMore.value = true
    imageResourceRecords.value = []
    return queyMaterialImageList({
      pageNum: imageResourceRecordsIndex.value,
      size: 10
    })
      .then((result) => {
        const { data } = result
        const { records, pages } = data
        if (records) {
          imageResourceRecords.value = records
          if (pages <= imageResourceRecordsIndex.value) {
            imageResourceRecordsHasMore.value = false
          }
        } else {
          ElMessage.error('Material image list is empty')
        }
      })
      .catch((error) => {
        ElMessage.error(error.message)
        console.log('🟦[designerStore]❌productInfo query error:', error)
        if (error.response.status === 401) {
          // location.href = '/'
        }
      })
      .finally(() => {})
  }

  const queryMaterialImageNextList = async () => {
    if (imageResourceRecordsHasMore.value === false) {
      return
    }
    imageResourceRecordsIndex.value = imageResourceRecordsIndex.value + 1

    const result = await queyMaterialImageList({
      pageNum: imageResourceRecordsIndex.value,
      size: 10
    })

    const { data } = result
    const { records, pages } = data
    imageResourceRecords.value.push(...records)
    if (pages <= imageResourceRecordsIndex.value) {
      imageResourceRecordsHasMore.value = false
    }
    return result
  }

  const saveProductInfo = async (scenes: any = <any>[]) => {
    //如果是模板进来,是没有设计信息,自行补充
    //scenes[0].designInfo.stages['测试'].screenshot
    //提供每个切片的效果图
    const effactImageList: any = []
    scenes.forEach((scene: any) => {
      const designInfo = scene.designInfo
      const stages = designInfo.stages
      const stageKeys = Object.keys(stages)
      stageKeys.map(async (stageKey) => {
        const stage = stages[stageKey]
        if (
          stage !== null &&
          stage.screenshot !== undefined &&
          stage.screenshot !== null &&
          stage.screenshot.startsWith('http')
        ) {
          effactImageList.push(stage.screenshot)
        }
      })
    })

    const designInfo = {
      designNo: dataQueryInfo.value.did,
      spuNo: dataQueryInfo.value.spuNo,
      productBaseNo: dataQueryInfo.value.pNo,
      scenes: scenes
    }

    const params = {
      designNo: dataQueryInfo.value.did,
      spuNo: dataQueryInfo.value.spuNo,
      productBaseNo: dataQueryInfo.value.pNo,
      designInfo: JSON.stringify(designInfo),
      effactImageList: effactImageList,
      platform: 2 //2=ud, 1=wiio
    }

    const result = await savePODDesign(params).then((responseData) => {
      const { data } = responseData
      const { result, designNo } = data
      if (result) {
        dataQueryInfo.value.did = designNo
        const currentUrl = window.location.href

        if (!currentUrl.includes('did=')) {
          const separator = currentUrl.indexOf('?') !== -1 ? '&' : '?'
          const newUrl =
            currentUrl + separator + 'did=' + encodeURIComponent(designNo)
          history.replaceState(null, '', newUrl)
        }

        ElMessage.success('Save success')
      } else {
        ElMessage.error('Save failed')
      }
    })
    return result
  }
  // 定义一个异步函数来加载数据
  const loaddata = async (dataInfo: any) => {
    dataQueryInfo.value = dataInfo
    if (!dataQueryInfo.value) {
      ElMessage.error('Request error, please try again')
      return
    }
    loading.value = true
    productInfo.value = null

    await reloadPageInfo()
  }
  const loadDataFac = async (dataInfo: any) => {
    dataQueryInfo.value = dataInfo
    if (!dataQueryInfo.value) {
      ElMessage.error('Request error, please try again')
      return
    }
    loading.value = true
    productInfo.value = null
    await queryDesignerData(true)
  }
  const onDesignInfoLoaded = async (success: boolean = true) => {
    if (success) {
      await queryMaterialImageFirstList()
    }

    designEventBus.emit(DESIGN_EVENTS.DATA_LOADED, { success: success })
  }
  const reloadPageInfo = async () => {
    if (isDevMode) {
      const mockData: any = designMockList
      mockData.body.designInfo = JSON.stringify(designScenes)

      const body = mockData['body']

      if (body !== null) {
        sceneList.value = JSON.parse(body.designInfo).scenes
        const firstObject = sceneList.value[0]
        const firstObjectJSON = firstObject.designInfo
        productInfo.value = convertProductInfo(firstObjectJSON)
        console.log('🟦[designerStore] 加载mock数据:', productInfo.value)
        productInfo.value.stages = parseAndSortStages(productInfo.value.stages)
        updateThumbanilImageList()
        loading.value = false
        onDesignInfoLoaded()
      } else {
        sceneList.value = body.designInfo.scenes
        const firstObject = sceneList.value[0]
        const firstObjectJSON = JSON.parse(firstObject.designInfo)

        productInfo.value = convertProductInfo(firstObjectJSON)
        console.log('🟦[designerStore] 加载mock数据:', productInfo.value)
        productInfo.value.stages = parseAndSortStages(productInfo.value.stages)
        updateThumbanilImageList()
        loading.value = false
        onDesignInfoLoaded()
      }

      return
    }
    await queryDesignerData()

    // saveProductInfo()
  }

  const updateThumbanilImageList = () => {
    thumbanilImageList.value = getThumbnailImageItems()
  }
  // 获取缩略图图片
  const getThumbnailImageItems = () => {
    if (!productInfo.value) {
      return []
    }

    const imageObjects = []

    for (const stageKey in productInfo.value.stages) {
      const stage = productInfo.value.stages[stageKey]
      const screenshot = safeGet.string(stage, 'screenshot', '')

      if (screenshot.length > 0) {
        //如果有效果图
        imageObjects.push({
          src: screenshot,
          type: '',
          name: stageKey
        })
      } else {
        //如果没有效果图
        if (typeof stage === 'object' && stage !== null && stage.objects) {
          for (const object of stage.objects) {
            const type = safeGet.string(object, 'type', '')
            const src = safeGet.string(object, 'src', '')

            if (type === 'image' && src) {
              imageObjects.push({
                src: screenshot.length > 0 ? screenshot : src,
                type: type,
                name: stageKey
              })
              break
            }
          }
        }
      }
    }

    return imageObjects
  }

  //更新效果图
  const updateCurrentStageScreenshot = async (data: any) => {
    const { canvasEditor, useOss = false, complete } = data
    const currentStageName = getCurrentStageName()

    //保存当前的stage数据
    const currentStage = canvasEditor.canvasToJSON(false)
    const stage = convertStage(currentStage, currentStageName, false)
    const objectList = canvasEditor.getObjectList()
    if (objectList.length === stage.objects.length) {
      let index = 0
      for (const object of stage.objects) {
        if (objectList[index].id !== undefined) {
          object.id = objectList[index].id
        }
        index++
      }
    }
    //生成截图
    canvasEditor.generateImageWithStageData(
      stage,
      useOss,
      (screenshot: any) => {
        if (screenshot) {
          //更新数据
          stage.screenshot = screenshot
          updateCurrentStage(stage, currentStageName)
        }
        if (complete) {
          complete()
        }
      }
    )
  }
  const getCurrentStageName = () => {
    const stages = productInfo.value.stages
    if (stages === null || stages === undefined) {
      return null
    }
    const stageKeys = Object.keys(stages)
    const currentStageKeyName = stageKeys[currentStageIndex.value]
    return currentStageKeyName
  }
  // 获取当前选中的 stage
  const getCurrentStage = () => {
    if (!productInfo.value) {
      return null
    }
    const stages = productInfo.value.stages

    if (stages === null || stages === undefined) {
      return null
    }
    const stageKeys = Object.keys(stages)
    if (stageKeys.length === 0) {
      return null
    }
    const currentStageKeyName = stageKeys[currentStageIndex.value]
    const currentStage = stages[currentStageKeyName]
    return currentStage
  }

  // 获取当前选中的 stage的设计type
  const getCurrentStageType = () => {
    const currentStage = getCurrentStage()
    const { objects = [] } = currentStage
    if (!objects?.length) {
      return ''
    }
    return objects[2]?.type
  }

  // 保存当前的 stage
  const saveCurrentStage = (data: any) => {
    const { canvasEditor } = data
    const currentStageName = getCurrentStageName()
    const stageJSON = canvasEditor.canvasToJSON()
    updateCurrentStage(stageJSON, currentStageName)
  }

  // 获取当前阴影src
  const getCurrentStateShadowSrc = () => {
    const stage = getCurrentStage()
    return stage.shadowSrc
  }

  // 更新当前的 stage
  const updateCurrentStage = (stage: any, currentStageKeyName: any) => {
    const stages = productInfo.value.stages
    const stageKeys = Object.keys(stages)
    if (stageKeys.length === 0) {
      return
    }
    // const currentStageKeyName = stageKeys[currentStageIndex.value]
    const newStage = convertStage(stage, currentStageKeyName)
    productInfo.value.stages[currentStageKeyName] = {
      ...productInfo.value.stages[currentStageKeyName],
      ...newStage
    }

    updateThumbanilImageList()
  }

  // 保存 JSON 数据
  const saveJSON = (data: any) => {
    const { canvasEditor } = data
    saveCurrentStage(data)
    setTimeout(() => {
      canvasEditor.saveJson(productInfo)
    }, 100)
  }
  // 执行动作
  const doAction = (action: any, data: any) => {
    console.log('💠 doAction:', action, ' data:', data)
    if (action === 'currentStageIndex') {
      //外部处理保存stage, 还要处理缩略图,在这里不方便
      // saveCurrentStage(data)
      const targetIndex = safeGet.number(data, 'index', 0)
      const fromIndex = currentStageIndex.value
      currentStageIndex.value = targetIndex

      designEventBus.emit(DESIGN_EVENTS.STAGE_DID_SWITCH, {
        fromIndex: fromIndex,
        toIndex: targetIndex
      })

      return
    }
    if (action === 'saveCurrentStage') {
      saveCurrentStage(data)
      return
    }
    if (action === 'saveJSON') {
      saveJSON(data)
      return
    }
    console.log('🟦[designerStore]❌doAction not found:', action)
  }

  const showLoading = () => {
    loadingInstance.value = ElLoading.service({})
  }
  const hideLoading = () => {
    if (loadingInstance.value) {
      nextTick(() => {
        loadingInstance.value.close()
      })
    }
  }
  const updateSceneData = (scene: any, data: any) => {
    console.log('🟦[designerStore] 准备更新scene:', scene.designInfo)

    scene.designInfo = JSON.stringify(data)

    console.log('🟦[designerStore] 更新scene ✅', scene.designInfo)
    // const { scene, index } = data
    // sceneList.value[index] = scene
  }
  const updateSceneList = (scene: any) => {
    console.log('🟦[designerStore] updateSceneList:', scene)

    try {
      let object = null
      if (typeof scene.designInfo === 'object') {
        object = scene.designInfo
      } else {
        object = JSON.parse(scene.designInfo)
      }

      productInfo.value = convertProductInfo(object)
      productInfo.value.stages = parseAndSortStages(productInfo.value.stages)
      currentStageIndex.value = 0
      thumbanilImageList.value = []
      updateThumbanilImageList()
      loading.value = false
    } catch (error) {
      console.log(error)
    }
  }
  // 返回状态和操作
  return {
    isRealModel,
    dataQueryInfo, // 查询信息
    productInfo, // 产品信息
    loading, // 加载状态
    currentStageIndex, // 当前步骤索引
    currentSceneIndex,
    thumbanilImageList,
    currentAdderName, // 当前添加器索引
    imageResourceRecords, // 图片资源记录
    imageResourceRecordsHasMore,
    sceneList, // 场景列表
    reloadPageInfo,
    getCurrentStage, // 获取当前选中的stage
    getCurrentStageType, // 获取当前选中stage的设计type
    saveCurrentStage, // 保存当前的 stage
    getCurrentStateShadowSrc, // 获取当前阴影src
    getCurrentStageName, // 获取当前选中的stage的名称
    loaddata, // 初始化数据
    loadDataFac, // 初始化工厂端数据
    getThumbnailImageItems, // 获取缩略图图片
    updateCurrentStageScreenshot, // 更新当前 stage 的截图
    doAction, // 执行动作
    updateCurrentStage, // 更新当前的stage
    queryMaterialImageFirstList,
    queryMaterialImageNextList,
    saveProductInfo, // 保存产品信息
    showLoading,
    hideLoading,
    updateSceneData, // 更新场景数据
    updateSceneList // 更新场景列表
  }
})
