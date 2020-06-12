<template>
  <!-- 订单详情页 需要查询3种数据 -->
  <div class="order-detail-main">
    <div class="steps-bar">
      <el-steps :space="300" :active="step" finish-status="success">
        <!-- addTime  订单添加时间
        sendTime  发货时间
        receiveTime  收货时间(客户端)
        bacckTime  用户申请退款时间
        doneTime  订单关闭时间 -->
        <el-step title="未付款" :description="orderBaseInfo.addTime" />
        <el-step title="已付款" :description="orderBaseInfo.payTime" />
        <el-step title="已发货" :description="orderBaseInfo.sendTime" />
        <el-step v-if="orderBaseInfo.orderStatus=='9'" title="申请退货" :description="orderBaseInfo.backTime" />
        <el-step v-else title="已收货" :description="orderBaseInfo.receiveTime" />
        <el-step title="已关闭" :description="orderBaseInfo.doneTime" />
      </el-steps>
    </div>
    <el-card class="card" shadow="never">
      <div slot="header">
        <span>当前订单状态: </span>
        <span v-if="orderBaseInfo.statusend == '0'" style="color: green;">订单处理中...</span>
        <span v-else style="color: red;">订单已关闭</span>
      </div>
      <!-- 基本信息 -->
      <div class="block-title">基本信息:</div>
      <div class="table-layout baseInfo">
        <el-row>
          <el-col v-for="(v,key) in orderBaseInfoCom" :key="key" :span="4">
            <div class="table-cell-head">
              <span>{{ key }}</span>
            </div>
            <div class="table-cell-body">
              <span>{{ v }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 收货人信息 -->
      <div class="block-title">收货人信息:</div>
      <div class="table-layout userInfo">
        <el-row>
          <el-col v-for="(v,key) in userInfoCom" :key="key" :span="6">
            <div class="table-cell-head">
              <span>{{ key }}</span>
            </div>
            <div class="table-cell-body">
              <span>{{ v }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 商品信息 -->
      <div class="block-title">商品信息:</div>
      <div class="product-list-block">
        <el-table class="product-list" :data="orderDetailList" border stripe>
          <el-table-column type="index" :width="50" />
          <el-table-column align="center" prop="gname" label="商品图片" :width="180">
            <template slot-scope="scope">
              <el-image class="cover-img" :src="scope.row.cover_img" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称" :width="380">
            <template slot-scope="scope">
              <p>{{ scope.row.gname }}</p>
              <p>品牌: {{ scope.row.brandName }} | {{ scope.row.brandEname }}</p>
              <p>{{ scope.row.descr }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="价格货号" :width="380">
            <template slot-scope="scope">
              <p>价格: ￥{{ scope.row.price/100 }}</p>
              <p>货号:{{ scope.row.sku_code }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="型号" :width="180">
            <template slot-scope="scope">
              <p>{{ scope.row.color_text }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="是否退货" :width="180">
            <template slot-scope="scope">
              <p v-if="!scope.row.backId">否</p>
              <a v-if="scope.row.backId" style="color:red" href="#">是</a>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="count" label="数量" :width="180" />
          <el-table-column align="center" prop="count" label="小计" :width="180">
            <template slot-scope="scope">
              <p>￥{{ npRound(scope.row.price/100*(scope.row.count)) }}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="price-sum">
          合计:
          <span>￥{{ sumPrice }}</span>
        </div>
      </div>

      <!-- 费用信息 -->
      <div class="block-title">费用信息:</div>
      <div class="table-layout costInfo">
        <el-row>
          <el-col v-for="(v,key) in costInfoCom" :key="key" :span="6">
            <div class="table-cell-head">
              <span>{{ key }}</span>
            </div>
            <div class="table-cell-body">
              <span>{{ v }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 申请退款 -->
      <div class="block-title">其他信息:</div>
      <div class="table-layout costInfo">
        <el-row>
          <el-col :span="6">
            <div class="table-cell-head">
              <span>申请人</span>
            </div>
            <div class="table-cell-body">
              <span>张三</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="table-cell-head">
              <span>退款金额</span>
            </div>
            <div class="table-cell-body">
              <span>200</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="table-cell-head">
              <span>退货商品</span>
            </div>
            <div class="table-cell-body">
              <span>仙女凳</span>
            </div>
          </el-col>
          <!-- 如果申请了退单 可以展示 -->
          <el-col :span="6">
            <div class="table-cell-head">
              <span>申请时间</span>
            </div>
            <div class="table-cell-body">
              <span>20202020202</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <div style="margin:30px auto 60px; text-align: center;">
      <!-- 流程说明 客户端未付款0 ==> 客户端付款1==> 服务端发货2 ==> 客户端收货3 (申请退款9)==> 服务端关闭(statusend:1) -->
      <!-- 如果商家没有发货 当前状态是1  应该显示 已发货按钮
        如果商家发货成功 客户还没有收到货物 商家等待,不能操作
        如果客户确认收货,商家可以关闭订单  -->
      <el-button v-if="step==2" type="primary" @click="sendDone">已发货</el-button>
      <el-button v-if="step==3" disabled type="primary">等待客户收货...</el-button>
      <el-button v-if="step==4" type="primary" @click="closeOrder">关闭订单</el-button>

    </div>
  </div>
</template>

<script>
import orderApi from '@/api/order/index'
import NP from 'number-precision'
export default {
  name: 'OrderDetail',
  components: {},
  data() {
    return {
      orderId: '',
      orderDetailList: [],
      userInfo: {},
      orderBaseInfo: {} // 订单基本信息
    }
  },
  computed: {
    orderBaseInfoCom() {
      const orderStatusObj = {
        '0': '未付款',
        '1': '已付款',
        '2': '已发货',
        '3': '已收货',
        '9': '申请退货'
      }
      return {
        订单编号: this.orderBaseInfo.orderId,
        用户账号: this.orderBaseInfo.username,
        订单金额: this.orderBaseInfo.price,
        订单数量: this.orderBaseInfo.count,
        订单状态: orderStatusObj[this.orderBaseInfo.orderStatus],
        下单时间: this.orderBaseInfo.addTime,
        付款时间: this.orderBaseInfo.payTime,
        发货时间: this.orderBaseInfo.sendTime,
        收货时间: this.orderBaseInfo.receiveTime,
        退单时间: this.orderBaseInfo.backTime,
        结束时间: this.orderBaseInfo.endTime,
        其他: ''
      }
    },
    userInfoCom() {
      return {
        收货人: this.userInfo.username + '(' + this.userInfo.name + ')',
        手机号码: this.userInfo.tel,
        邮政编码: '41000',
        地市: this.userInfo.cityStr,
        详细地址: this.userInfo.cityBak
      }
    },
    // z
    costInfoCom() {
      const sumPrice = this.sumPrice
      return {
        商品合计: '￥' + sumPrice,
        运费: 0,
        订单金额: '￥' + sumPrice,
        实付款: '￥' + sumPrice
      }
    },
    sumPrice() {
      var sumPrice = this.orderDetailList.reduce((a, b) => {
        a += (b.price * b.count) / 100
        a = NP.round(a, 2)
        return a
      }, 0)
      return sumPrice
    },
    step() {
      // 是否订单被关闭 跟statusend 有关
      if (this.orderBaseInfo.statusend == '1') return 4
      // 字符串强转number
      return parseInt(this.orderBaseInfo.orderStatus) + 1
    }

  },
  created() {
    this.orderId = this.$route.params.orderId
    console.log('this.orderId', this.orderId)
    this.getOrderDetial()
    this.getOrderUserInfo()
    // 查询订单基本信息
    this.getOrderBaseInfo()
  },
  mounted() {},
  methods: {
    getOrderDetial() {
      orderApi
        .orderDetail({
          orderId: this.orderId
        })
        .then(res => {
          this.orderDetailList = res.data
        })
    },
    getOrderUserInfo() {
      orderApi
        .orderUserInfo({
          orderId: this.orderId
        })
        .then(res => {
          this.userInfo = res.data
        })
    },
    // 根据orderId查询订单基本信息
    getOrderBaseInfo() {
      orderApi
        .orderList({
          orderId: this.orderId
        })
        .then(res => {
          this.orderBaseInfo = res.data.list[0]
        })
    },
    // 关闭订单,关闭后不能操作该订单
    closeOrder() {
      orderApi.closeOrder({ id: this.orderBaseInfo.orderId })
        .then(res => {
          if (res.code == 'S') {
            // 重新刷新页面
            location.reload()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    sendDone() {
      orderApi.sendDone({
        id: this.orderBaseInfo.orderId
      }).then(res => {
        // 成功后状态变为1
        if (res.code == 'S') {
          // 简单来说重新刷新页面  这个写法不会刷新
          // this.$router.push({name: 'orderDetail',params:{orderId: this.orderBaseInfo.orderId}})
          // console.log('fff')
          window.location.reload()
          // 订单状态 1 已付款 ; 2 已发货; 3: 已收货; 9 申请退款
          // this.orderBaseInfo.orderStatus = 2 ;
        } else {
          // res.msg是返回的错误信息
          this.$message.error(res.msg)
        }
      })
    },
    npRound(n) {
      return NP.round(n, 2)
    }
  }
}
</script>

<style scoped lang="scss">
.order-detail-main {
  .card {
    margin: 30px 100px;
  }
  .steps-bar {
    margin-top: 30px;
    .el-steps {
      justify-content: center;
    }
  }
  .cover-img {
    width: 120px;
    height: auto;
  }
  .block-title {
    margin: 30px;
  }
  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;

    .el-row {
      box-sizing: border-box;
      .table-cell-head {
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        padding: 10px;
        font-size: 14px;
        text-align: center;
        color: #666;
        background-color: #f5f7fa;
      }
      .table-cell-body {
        height: 60px;
        line-height: 60px;
        color: #606266;
        overflow: hidden;
        text-align: center;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
      }
    }
  }

  .product-list-block {
    .price-sum {
      text-align: right;
      font-size: 18px;
      margin: 30px;
      > span {
        color: red;
      }
    }
  }
}
</style>
