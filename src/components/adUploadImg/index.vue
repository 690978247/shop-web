<template>
  <div class="ad-upload">
    <el-upload
      action="/api/Upload/UploadFile"
      :headers="{ Authorization: 'Bearer ' + token }"
      v-bind="{ ...$attrs }"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog top="6vh" v-model="dialogVisible" append-to-body>
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, useAttrs, watch } from 'vue'
import type { UploadProps } from 'element-plus'
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// const attrs: any = useAttrs()
const emit = defineEmits(['uploadSuccess'])
const token = localStorage.getItem('token') ?? ''

// watch(
//   attrs['file-list'],
//   (value) => {
//     if (attrs['list-type'] === 'picture-card' && attrs.limit) {
//       const addBtn: any = document.querySelector(
//         '.ad-upload .el-upload.el-upload--picture-card'
//       )
//       if (value.length >= attrs.limit) {
//         addBtn.style.display = 'none'
//       } else {
//         addBtn.style.display = 'inline-flex'
//       }
//     }
//   },
//   { deep: true }
// )

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
</script>
