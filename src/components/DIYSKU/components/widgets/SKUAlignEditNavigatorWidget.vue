<template>
  <div class="operateUndo">
    <el-tooltip content="Position" placement="top">
      <el-dropdown @command="handleCommand">
        <el-button
          :class="enableAlign ? 'action' : 'action-disable'"
          @click.stop
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="m4 16.01l.01-.011M4 20.01l.01-.011M4 8.01l.01-.011M4 4.01l.01-.011M4 12.01l.01-.011m7.99.011l.01-.011M8 20.01l.01-.011m3.99.011l.01-.011m3.99.011l.01-.011m3.99.011l.01-.011M20 16.01l.01-.011M20 12.01l.01-.011M20 8.01l.01-.011M20 4.01l.01-.011M16 4.01l.01-.011M12 4.01l.01-.011M8 4.01l.01-.011"
            />
          </svg>
        </el-button>
        <template v-slot:dropdown>
          <el-dropdown-menu v-if="enableAlign">
            <el-dropdown-item command="Center" class="item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M11 22v-8.5H3v-3h8V2h2v8.5h8v3h-8V22z"
                />
              </svg>
              Center
            </el-dropdown-item>
            <el-dropdown-item command="alignLeft">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M2 22V2h2v20zm4-5v-3h10v3zm0-7V7h16v3z"
                />
              </svg>
              Left
            </el-dropdown-item>
            <el-dropdown-item command="CenterX">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M11 22v-5H6v-3h5v-4H3V7h8V2h2v5h8v3h-8v4h5v3h-5v5z"
                />
              </svg>
              CenterX
            </el-dropdown-item>
            <el-dropdown-item command="alignRight">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M20 22V2h2v20zM8 17v-3h10v3zm-6-7V7h16v3z"
                />
              </svg>
              Right
            </el-dropdown-item>
            <el-dropdown-item command="alignTop">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M2 4V2h20v2zm5 6V7h10v3zm0 6v-3h10v3z"
                />
              </svg>
              Top
            </el-dropdown-item>
            <el-dropdown-item command="CenterY">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M7 21v-8H2v-2h5V3h3v8h4V6h3v5h5v2h-5v5h-3v-5h-4v8z"
                />
              </svg>
              CenterY
            </el-dropdown-item>
            <el-dropdown-item command="alignBottom">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                style="margin-right: 10px"
              >
                <path
                  fill="currentColor"
                  d="M3 22q-.425 0-.712-.288T2 21t.288-.712T3 20h18q.425 0 .713.288T22 21t-.288.713T21 22zm5-11q-.425 0-.712-.288T7 10V9q0-.425.288-.712T8 8h8q.425 0 .713.288T17 9v1q0 .425-.288.713T16 11zm0 6q-.425 0-.712-.288T7 16v-1q0-.425.288-.712T8 14h8q.425 0 .713.288T17 15v1q0 .425-.288.713T16 17z"
                />
              </svg>
              Bottom
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown></el-tooltip
    >
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/components/DIYSKU/hooks/select'
const { canvasEditor, mixinState } = useSelect()
const enableAlign = ref(false)

const handleCommand = (command: string) => {
  switch (command) {
    case 'Center':
      canvasEditor.position('center')
      break
    case 'alignLeft':
      canvasEditor.position('alignLeft')
      break
    case 'CenterX':
      canvasEditor.position('centerH')
      break
    case 'alignRight':
      canvasEditor.position('alignRight')
      break
    case 'alignTop':
      canvasEditor.position('alignTop')
      break
    case 'CenterY':
      canvasEditor.position('centerV')
      break
    case 'alignBottom':
      canvasEditor.position('alignBottom')
      break
    default:
      break
  }
}

const updateInfo = () => {
  const currentActiveObject = canvasEditor.getActiveObject()
  if (currentActiveObject) {
    enableAlign.value = true
  } else {
    enableAlign.value = false
  }
}
watch(
  () => mixinState.mSelectOneType,
  (val) => {
    updateInfo()
  }
)
</script>

<style scoped lang="scss">
.operateUndo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  gap: 10px;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #333333;
    color: #333333;
  }
  .action-disable {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 36px;
    width: 36px;
    border: 1px solid #b6b6b6;
    color: #b6b6b6;
  }
}
</style>
