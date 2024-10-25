<script setup lang="ts">
defineOptions({
  name: 'BackTopButton'
})
</script>
<template>
  <div class="back-top-button-style-no2rem">
    <el-backtop target=".el-main" :right="20" :bottom="40">
      <div class="upload-button">
        <img src="@/assets/images/ic_back_top.svg" />
      </div>
    </el-backtop>
  </div>
</template>

<style scoped lang="scss">
.back-top-button-style-no2rem {
  :deep(.el-backtop) {
    height: 48px;
    width: 48px;
    background-color: rgba(188, 12, 52);
    padding: 0;
    margin: 0;
  }

  .upload-button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
    min-height: 48px;
    border-radius: 48px;
    background-color: rgba(188, 12, 52);

    img {
      width: 26px;
      height: 26px;
    }
  }
}
</style>
