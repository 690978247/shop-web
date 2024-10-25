<template>
  <div class="container">
    <div class="style-container">
      <SKUFontStyleEditorWidget></SKUFontStyleEditorWidget>
    </div>
  </div>
</template>

<script setup lang="ts">
import SKUFontStyleEditorWidget from '@/components/DIYSKU/components/widgets/SKUFontStyleEditorWidget.vue'
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.toolbar {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.text-item {
  width: 90%;
  height: 44px;
  margin: 10px 0;
  padding: 0;
  color: #666666;
  font-size: 500;
}
.style-container {
  width: 100%;
  height: 100%;
  // margin-top: 40%;
  // border: 1px solid #e8e8e8;
}
</style>
