<template>
  <div class="drag-wrapper" ref="el" :style="style" @drag.stop>
    <div class="gtranslate_wrapper" @drag.stop></div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@vueuse/core'

defineOptions({ name: 'GTranslate' })

const el = ref<HTMLElement | null>(null)

// `style` will be a helper computed for `left: ?px; top: ?px;`
const width = window.innerWidth
const posX = width - 170
const posY = 30
const { style } = useDraggable(el, {
  initialValue: { x: posX, y: posY }
})

// Set up gtranslateSettings
window.gtranslateSettings = {
  default_language: 'en',
  languages: ['en', 'nl', 'de'],
  wrapper_selector: '.gtranslate_wrapper',
  switcher_horizontal_position: 'right',
  switcher_vertical_position: 'top',
  float_switcher_open_direction: 'bottom'
}
const script = document.createElement('script')
script.src = 'https://cdn.gtranslate.net/widgets/latest/float.js'
script.defer = true
document.head.appendChild(script)
</script>
<style lang="scss">
.drag-wrapper {
  position: fixed;
  z-index: 99999999;
  cursor: all-scroll;
  padding: 10px 15px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0 5px 15px;
  border-radius: 8px;
}

#gt_float_wrapper {
  position: inherit !important;
  .gt_float_switcher img {
    pointer-events: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
  .gt_float_switcher {
    box-shadow: none;
  }
  .gt_float_switcher .gt-selected .gt-current-lang {
    padding: 0 5px;
    min-width: 100px;
    display: flex;
    justify-content: space-around;
  }
  .gt_float_switcher .gt_options a {
    margin-top: 5px;
    &:first-child {
      margin-top: 10px;
    }
  }
}
.notranslate {
  translate: no;
}
</style>
<style lang="scss" scoped></style>
