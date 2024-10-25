<template>
  <div class="skeleton">
    <el-skeleton animated>
      <template #template>
        <div class="skeleton-box">
          <el-skeleton-item class="line-lf" variant="p" />
          <el-skeleton-item class="line-rt" variant="p" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.skeleton {
  width: 100%;
  height: 106px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 32px;
  padding: 0 47px 0 24px;
  box-sizing: border-box;
}
.skeleton-box {
  height: 40px;
  display: flex;
  justify-content: space-between;

  .line-lf {
    width: 300px;
    height: 100%;
  }

  .line-rt {
    width: 160px;
    height: 100%;
  }
}
</style>
