<template>
  <div style="font-size: 16px">Analytics :Sales Volume</div>
  <div ref="chartRef" id="lineChart"></div>
</template>

<script lang="ts" setup>
import { ref, defineOptions, inject } from 'vue'
import echarts from '@/utils/echarts'
import { TProductDetail } from '../../model/model'
import dayjs from 'dayjs'

const chartRef = ref()

defineOptions({
  name: 'ProductChart'
})

const productData: Ref<TProductDetail> = inject('productData')

const drawChart = () => {
  const myChart = echarts.init(chartRef.value)
  const goodsSaleTendencyList: any[] =
    productData.value?.goodsPromotionShow?.goodsSaleTendencyList
  if (!goodsSaleTendencyList) {
    return
  }

  const option = {
    tooltip: {
      show: true
    },
    grid: {
      bottom: 20,
      top: 30,
      left: 30
    },
    xAxis: {
      type: 'category',
      data: goodsSaleTendencyList.map((item) =>
        dayjs(item.date).format('MM-DD')
      ),
      axisLabel: {
        color: '#999'
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        lineStyle: {
          width: 1,
          color: '#BC0C34'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#999'
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        lineStyle: {
          width: 1,
          color: '#BC0C34'
        }
      }
    },
    series: [
      {
        data: goodsSaleTendencyList.map((item) => item.data),
        type: 'line',
        symbolSize: 10,
        // 设置渐变色
        lineStyle: {
          width: 5,
          type: 'solid', // 线条类型，可选为 'solid', 'dashed', 'dotted'
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#800300' }, // 渐变色起始颜色
            { offset: 1, color: '#FE3B44' } // 渐变色结束颜色
          ])
        },
        itemStyle: {
          color: '#781311'
        },
        markPoint: {
          data: [
            {
              type: 'max',
              symbol:
                'image://https://static.hzpdex.com/web/1721726409875_箭头.png',
              symbolOffset: [0, 36],
              tooltip: {
                show: false
              }
            }
          ]
        }
      }
    ],
    dataZoom: [
      {
        type: 'inside'
      }
    ]
  }
  myChart.setOption(option)

  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

onMounted(() => {
  drawChart()
})
</script>

<style scoped lang="scss">
#lineChart {
  width: 100%;
  height: 160px;
}
</style>
