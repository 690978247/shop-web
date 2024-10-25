<template>
  <div class="container">
    <div
      id="LumiseDesign"
      data-site="https://lumise.com"
      data-processing="true"
      data-msg="Initializing.."
    >
      <div id="lumise-navigations" data-navigation="">
        <!-- 模拟 $lumise->display('nav') -->
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">Navigation One</el-menu-item>
          <el-menu-item index="2">Navigation Two</el-menu-item>
        </el-menu>
      </div>
      <div id="lumise-workspace">
        <!-- 模拟 $lumise->display('left') -->
        <div class="left-sidebar">
          <p>Left Sidebar Content</p>
        </div>
        <div id="lumise-top-tools" data-navigation="" data-view="standard">
          <!-- 模拟 $lumise->display('tool') -->
          <el-button type="primary">Top Tool</el-button>
        </div>
        <div id="lumise-main">
          <div id="lumise-no-product">
            <!-- 模拟产品选择 -->
            <p>Please select a product to start designing</p>
            <el-button type="primary" icon="el-icon-plus"
              >Select product</el-button
            >
          </div>
        </div>
        <div id="nav-bottom-left">
          <div data-nav="colors" id="lumise-count-colors" title="Count colors">
            <i>0+</i>
          </div>
        </div>
        <div id="lumise-zoom-wrp">
          <i class="el-icon-minus" data-zoom="out"></i>
          <span>Scroll to zoom</span>
          <input
            type="range"
            id="lumise-zoom"
            data-value="100%"
            min="50"
            max="250"
            value="100"
          />
          <i class="el-icon-plus" data-zoom="in"></i>
        </div>
        <div id="lumise-zoom-thumbn">
          <span></span>
        </div>
        <div id="lumise-stage-nav">
          <ul></ul>
        </div>
        <div id="lumise-notices"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeIndex = ref('1')
const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#LumiseDesign {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#lumise-navigations {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 10px 0;
}

#lumise-workspace {
  width: 100%;
  display: flex;
}

.left-sidebar {
  width: 20%;
  padding: 20px;
  background-color: #eef;
}

#lumise-top-tools {
  width: 100%;
  padding: 10px;
  background-color: #ccc;
  display: flex;
  justify-content: center;
}

#lumise-main {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}

#lumise-no-product {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#nav-bottom-left {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

#lumise-zoom-wrp {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center;
}

#lumise-zoom-thumbn {
  position: absolute;
  bottom: 50px;
  right: 10px;
}

#lumise-stage-nav {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>
