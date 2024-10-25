<script setup lang="ts">
defineOptions({
  name: 'SKUSaveLoadingWidget'
})
const props = defineProps({
  loadingText: {
    type: String,
    default: 'Saving Design...'
  }
})
const loadingMsg = computed(() => props.loadingText)
</script>
<template>
  <teleport to="body">
    <div class="submit-loading">
      <img src="@/assets/images/pod/loading.svg" alt="" />
      <span>{{ loadingMsg }}</span>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.submit-loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    font-size: 16px;
    color: #fff;
    margin-top: 16px;
  }
}
</style>
