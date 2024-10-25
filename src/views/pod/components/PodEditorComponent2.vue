<template>
  <div class="container">
    <iframe
      v-if="props.did"
      :src="`http://172.16.1.12:8888/design-editor/?product_base=4&product_cms=69`"
      frameborder="0"
      class="iframe"
    ></iframe>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  did: {
    type: String,
    required: true,
    default: ''
  },
  preview: {
    type: Boolean,
    default: false
  }
})

const getCurrentUrl = () => {
  return window.location.origin
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

.iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
