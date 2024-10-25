<template>
  <div class="page-container">
    <div>
      <div class="product-top">
        <div class="product-top-images">
          <el-space direction="vertical">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="image" class="images" />
                <el-skeleton-item variant="p" class="thumbnail" />
              </template>
            </el-skeleton>
          </el-space>
        </div>
        <div class="product-top-info">
          <el-skeleton animated>
            <template #template>
              <el-space direction="vertical" alignment="flex-start">
                <el-skeleton-item variant="p" class="title" />
                <el-skeleton-item variant="p" class="sku" />

                <el-skeleton-item variant="p" class="price" />

                <el-skeleton-item variant="p" class="info" />

                <el-skeleton-item variant="p" class="release" />
              </el-space>
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.page-container {
  margin-top: 40px;
}

.product-top {
  display: flex;
  background-color: #f9fafb;
  flex-direction: row;
}

.product-top-images {
  display: flex;
  flex-direction: column;
  margin: 10px 10px 13px 20px;

  .images {
    width: 700px;
    height: 700px;
  }

  .thumbnail {
    width: 700px;
    height: 120px;
    margin-top: 12px;
  }
}

.product-top-info {
  display: flex;
  height: 700px;
  flex: 1;
  margin: 10px 24px 13px 20px;

  .title {
    width: 550px;
    height: 46px;
    margin-bottom: 8px;
  }

  .price {
    width: 520px;
    height: 90px;
    margin-bottom: 8px;
  }

  .sku {
    width: 520px;
    height: 200px;
    margin-bottom: 8px;
  }

  .info {
    width: 520px;
    height: 90px;
    margin-bottom: 8px;
  }

  .release {
    width: 250px;
    height: 46px;
    margin-bottom: 8px;
  }
}
</style>
