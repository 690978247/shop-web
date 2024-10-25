import { fabric } from 'fabric'
import Editor from '@/components/DIYSKU/service/Editor'
import { selectFiles } from '@/components/DIYSKU/service/utils'
// import psdToJson from '../utils/psd'
// import Psd from '@webtoon/psd'
// type IEditor = Editor

// class PsdPlugin implements IPluginTempl {
//   static pluginName = 'PsdPlugin'
//   static apis = ['insertPSD']
//   constructor(
//     public canvas: fabric.Canvas,
//     public editor: IEditor
//   ) {}

//   insertPSD() {
//     return new Promise((resolve, reject) => {
//       selectFiles({ accept: '.psd' })
//         .then((files) => {
//           if (files && files.length > 0) {
//             const file = files[0]
//             const reader = new FileReader()
//             reader.readAsText(file, 'UTF-8')
//             reader.onload = async () => {
//               const result = await file.arrayBuffer()
//               // 解析PSD文件
//               const psdFile = Psd.parse(result as ArrayBuffer)
//               console.log(psdFile, '11111')
//               const json = await psdToJson(psdFile)
//               // 加载json
//               this.loadJSON(json)
//               resolve('')
//             }
//           }
//         })
//         .catch(reject)
//     })
//   }

//   loadJSON(json: string) {
//     this.editor.loadJSON(json)
//   }
// }

// export default PsdPlugin
