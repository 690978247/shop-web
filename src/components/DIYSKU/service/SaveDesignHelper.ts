import { generateImageWithStageData } from '@/components/DIYSKU/service/SkuGenerateImageHelper'
import { convertStage } from '@/components/DIYSKU/service/utils'
import lodash from 'lodash'
// 保存设计数据的主函数
export async function saveDesign(
  data: any,
  loadingText: (text: string) => void,
  callback?: (success: boolean) => void
) {
  const { store, canvasEditor } = data

  try {
    store.updateCurrentStageScreenshot({
      canvasEditor: canvasEditor,
      complete: async () => {
        saveCurrentStage(store, canvasEditor)
        await processScenes(store.sceneList, loadingText)
        callback && callback(true)
      }
    })
  } catch (error) {
    console.error('[saveDesign] Error:', error)
    callback && callback(false)
  }
}

// 保存当前的 stage 数据
function saveCurrentStage(store: any, canvasEditor: any) {
  //当前stage
  const currentStageName = store.getCurrentStageName()
  //当前设计
  const currentStage = canvasEditor.canvasToJSON(false)
  //当前scene所有设计信息
  const stages = JSON.parse(JSON.stringify(store.productInfo.stages))
  //格式转换
  const stage = convertStage(currentStage, currentStageName, false)
  ////保留原始截图信息
  const screenshot = stages[currentStageName].screenshot
  stage.screenshot = screenshot

  stages[currentStageName] = {
    ...stages[currentStageName],
    ...stage
  }

  const currentScene = store.sceneList[store.currentSceneIndex]

  currentScene.designInfo = {
    stages: stages
  }
}

// 处理场景列表
async function processScenes(
  sceneList: any[],
  loadingText: (text: string) => void
) {
  for (let index = 0; index < sceneList.length; index++) {
    const scene = sceneList[index]
    const name = `Scene ${index + 1} of ${sceneList.length}`
    await saveStageWithScene(scene, name, loadingText)
  }
}

// 保存带有场景的 stage 数据
async function saveStageWithScene(
  scene: any,
  name: string,
  loadingTextCallBack?: (text: string) => void
) {
  let designInfo = null
  if (typeof scene.designInfo === 'string') {
    designInfo = JSON.parse(scene.designInfo)
  } else {
    designInfo = scene.designInfo
  }

  const stages = designInfo.stages
  const stageKeys = Object.keys(stages)

  let completedStages = 0
  const totalStages = stageKeys.length

  const updateLoadingText = (completed: number) => {
    const text = `Loading ${name}: ${completed} out of ${totalStages} stages completed.`
    loadingTextCallBack && loadingTextCallBack(text)
  }

  updateLoadingText(completedStages)

  const stagePromises = stageKeys.map(async (stageKey) => {
    try {
      const stage = stages[stageKey]
      try {
        console.log('准备开始处理stage.screenshot:', stage.screenshot)
        if (
          lodash.isEmpty(stage.screenshot) ||
          !stage.screenshot.startsWith('http')
        ) {
          stage.screenshot = await generateImageWithStageData(stage, true)
          console.log('==>上传完成,赋值后:', stage.screenshot)
        } else {
          console.log('==>✅ 已经上传过截图')
        }
        console.log('✅准备开始处理stage.screenshot:', stage.screenshot)
      } catch (error) {
        console.error(`Error processing stage ${stageKey}:`, error)
      }
      completedStages++
      updateLoadingText(completedStages)
    } catch (error) {
      console.error(`Error processing stage ${stageKey}:`, error)
      completedStages++
      updateLoadingText(completedStages)
    }
  })

  await Promise.allSettled(stagePromises)

  setTimeout(async () => {
    if (!checkSceneScreenshot(scene)) {
      saveStageWithScene(scene, name, loadingTextCallBack)
    }
  }, 250)
}

function checkSceneScreenshot(scene: any) {
  const designInfo = scene.designInfo
  const stages = designInfo.stages
  const stageKeys = Object.keys(stages)
  stageKeys.map(async (stageKey) => {
    const stage = stages[stageKey]
    console.log('检查 stage.screenshot:', stage.screenshot)
    if (
      lodash.isEmpty(stage.screenshot) ||
      !stage.screenshot.startsWith('http')
    ) {
      return false
    }
  })
  return true
}
// 检查 stage 的截图是否有效
function checkStagesScreenshot(stages: any) {
  for (const stageKey in stages) {
    const stage = stages[stageKey]
    console.log('检查 stage.screenshot:', stage.screenshot)
    if (!stage.screenshot?.includes('http')) {
      console.log(
        `❌checkStagesScreenshot stageKey=${stageKey}, url=${stage.screenshot}`
      )
      return false
    }
    console.log(`✅check stageKey=${stageKey}, url=${stage.screenshot}`)
  }
  console.log('✅checkStagesScreenshot')
  return true
}
