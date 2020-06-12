<template>
  <div class="dashboard-main">
    <el-row :gutter="30" class="count-info-row">
      <el-col :span="6">
        <el-card class="count-info-card">
          <div slot="header" style="color: #409eff">
            <svg-icon icon-class="icon-users" />
            <span>用户数量: <font style="color: #333">{{ baseData.userCount }} </font>个</span>
          </div>
          今日新增: {{ baseData.userToday }}
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="count-info-card">
          <div slot="header" style="color: #409eff">
            <svg-icon icon-class="icon-product" />
            <span>产品数量: <font style="color: #333">{{ baseData.productCount }} </font>个</span>
          </div>
          今日新增: {{ baseData.productToday }}
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="count-info-card">
          <div slot="header" style="color: #409eff">
            <svg-icon icon-class="icon-order" />
            <span>订单数量: <font style="color: #333">{{ baseData.orderCount }} </font>个</span>
          </div>
          今日新增: {{ baseData.orderToday }}
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="count-info-card">
          <div slot="header" style="color: #409eff">
            <svg-icon icon-class="icon-order-back" />
            <span>退单数量: <font style="color: #333">{{ baseData.backCount }} </font>个</span>
          </div>
          今日新增: {{ baseData.backToday }}
        </el-card>
      </el-col>
    </el-row>

    <div class="echarts-area">
      <div id="echartOrder" class="echart-orders" />
    </div>
    <el-calendar v-model="value" class="calendar" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dashboardApi from '@/api/dashboard/index'
var echarts = require('echarts')
export default {
  name: 'Dashboard',
  data() {
    return {
      baseData: {
        orderByDay: [],
        value: new Date()
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    this.getBaseInfo()
  },
  mounted() {
    this.echartOrders = echarts.init(document.getElementById('echartOrder'))
  },
  methods: {
    async getBaseInfo() {
      this.baseData = await dashboardApi.baseInfo()
      // console.log(baseInfo)
      this.initEcharts()
    },
    initEcharts() {
      const xData = []
      const yData = []
      for (let i = 0; i < this.baseData.orderByDay.length; i++) {
        xData.push(this.baseData.orderByDay[i].date)
        yData.push(this.baseData.orderByDay[i].count)
      }
      this.echartOrders.setOption({
        color: '#409eff',
        title: {
          text: '订单数量/日期'
        },
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [{
          name: '数量',
          type: 'bar',
          data: yData
        }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-main {
  box-sizing: border-box;
  margin: 60px;
  .count-info-row{
    width: 100%;
    height: 100px;
    .count-info-card{
      height: 100px;
      width: 300px;
    }
  }
  .echart-orders{
    width: 100%;
    height: 400px;
    margin: 30px auto;
  }
}
</style>
