<template>
  <div class="order-back-detail">
    <el-card class="card order-back-card" shadow="never">
      <!-- 商品信息 -->
      <div class="product-info">
        <div class="common-title">退货商品</div>

        <el-table :data="product" border stripe>
          <el-table-column align="center" label="商品图片" width="180">
            <template slot-scope="scope">
              <!-- <el-image :src="scope.row.cover_img"></el-image> -->
              <img class="cover-img" :src="scope.row.cover_img" alt>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品描述">
            <template slot-scope="scope">
              <p>{{ scope.row.gname }}</p>
              <p>品牌: {{ scope.row.brandName }}|{{ scope.row.brandEname }}</p>
              <p>{{ scope.row.gdescr }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="价格/货号" width="220">
            <template slot-scope="scope">
              <p>价格: ￥{{ scope.row.sku_price/100||scope.row.p_price/100 }}</p>
              <p>货号: {{ scope.row.sku_code }}</p>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品属性" width="220">
            <template slot-scope="scope">
              <span>{{ scope.row.color_text }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="数量" prop="count" width="120" />
          <el-table-column label="小计" prop="cover_img" width="120">
            <template slot-scope="">
              <span>￥{{ 200 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 订单信息 -->
      <div class="order-info table-layout-orientation">
        <div class="common-title">订单信息</div>
        <el-row>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>退单单号:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.backId }}11</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>当前状态:</span>
            </div>
            <div class="table-cell-body">
              <!-- 进度: 0 等待处理 ; 1 确认退货,等待收货; 2 : 确认收货,已退款 ; 9 : 拒绝退货 -->
              <span>{{ orderInfo.processText }} : {{ orderInfo.process }}</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>订单编号:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.orderId }}</span>
              <router-link
                style="color: #1989fa"
                :to="{name:'orderDetail',params:{orderId:orderInfo.orderId}}"
              >点击查看</router-link>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>申请时间:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.addtime }}</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>用户账号:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.username }}</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>退单理由:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.reason }}</span>
            </div>
          </el-col>
        </el-row>

        <el-row style="margin-top: 30px;">
          <el-col :span="12">
            <div class="table-cell-head">
              <span>联系人:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.sendUser }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>联系电话:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.tel }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>收货地址:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.cityStr }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>邮编:</span>
            </div>
            <div class="table-cell-body">
              <span>410000</span>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="table-cell-head">
              <span>详细地址</span>
            </div>
            <div class="table-cell-body">
              <span>{{ orderInfo.cityBak }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 30px;">
          <el-col :span="12">
            <div class="table-cell-head">
              <span>订单金额:</span>
            </div>
            <div class="table-cell-body">
              <span>￥{{ orderInfo.order_price }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>确认退款金额:</span>
            </div>
            <div class="table-cell-body">
              ￥
              <!-- <el-input v-model="backPrice" :readonly="orderInfo.process=='9'" placeholder=""></el-input> -->

              <el-input-number v-model="order.back_price" readonly style="text-indent:0" size="mini" :min="0" label />
            </div>
          </el-col>
        </el-row>
        <!-- 进度: 0 等待处理 ; 1 确认退货,等待收货; 2 : 确认收货,已退款 ; 9 : 拒绝退货 -->
        <el-row style="margin-top: 30px;">
          <el-col v-if="orderInfo.process=='0'" :span="24">
            <div class="table-cell-head">
              <span>处理备注:</span>
            </div>
            <div class="table-cell-body">
              <el-input v-model="handlebak" size="mini" placeholder="通过/拒绝的处理备注信息" />
            </div>
          </el-col>
          <el-col v-if="order.process=='1'" :span="24">
            <div class="table-cell-head">
              <span>完成备注:</span>
            </div>
            <div class="table-cell-body">
              <el-input v-model="endbak" size="mini" placeholder="收货后关闭订单的备注信息" />
            </div>
          </el-col>
        </el-row>
        <!-- 如果订单已关闭 显示内容 -->
        <div class="common-title">
          处理结果
        </div>
        <el-row style="margin-top: 30px;">
          <el-col :span="12">
            <div class="table-cell-head">
              <span>处理备注:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ order.handlebak }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>处理时间:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ order.handletime }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>处理备注:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ order.endbak }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="table-cell-head">
              <span>处理时间:</span>
            </div>
            <div class="table-cell-body">
              <span>{{ order.endtime }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <div v-if="order.statusend=='0'" class="footer" style="margin: 30px auto; text-align: center;">
        <el-button v-if="order.process=='0'" type="default" @click="rejectBack">拒绝退货</el-button>
        <el-button v-if="order.process=='0'" type="primary" @click="agreeBack">确认退货</el-button>
        <el-button v-if="order.process=='1'" type="primary" @click="backDone">收到退货</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
import orderBackApi from '@/api/order/orderBack'
export default {
  name: 'OrderBackDetail',
  components: {},
  data() {
    return {
      backId: '',
      order: {},
      backPrice: 0,
      handlebak: '',
      endbak: ''
    }
  },
  computed: {
    product() {
      var p = {
        ...this.order.product,
        count: this.order.count
      }

      return [p]
    },
    orderInfo() {
      var processText = ''
      // <!-- 进度: 0 等待处理 ; 1 确认退货,等待收货; 2 : 确认收货,已退款 ; 9 : 拒绝退货 -->
      switch (this.order.process) {
        case '0':
          processText = '等待处理'
          break
        case '1':
          processText = '确认退货,等待收货'
          break
        case '2':
          processText = '确认收货,已退款'
          break
        case '9':
          processText = '拒绝退货'
          break

        default:
          break
      }
      return {
        backId: this.backId,
        process: this.order.process,
        processText: processText,
        orderId: this.order.orderId,
        addtime: this.order.addtime,
        username: this.order.username,
        sendUser: this.order.sendUser,
        reason: this.order.reason,
        tel: this.order.tel,
        bak: this.order.bak,
        cityBak: this.order.cityBak,
        cityStr: this.order.cityStr,
        order_price: this.order.order_price,
        back_price: this.order.back_price
      }
    }
  },
  created() {
    this.backId = this.$route.params.backId
    this.getOrderDetail()
  },
  mounted() {},
  methods: {
    getOrderDetail() {
      orderBackApi
        .orderDetail({
          id: this.backId
        })
        .then(res => {
          this.order = res.data
        })
    },
    // 接受退款
    rejectBack() {
      orderBackApi.rejectBack({
        id: this.backId,
        bak: this.handlebak// 退单历有
      }).then(res => {
        if (res.code == 'success') {
          location.reload()
        } else {
          this.$message.error('发送失败!')
        }
      })
    },
    // 接受退款  之后等待用户发货
    // 接受退款的时候 退单金额应该是已经谈妥了
    agreeBack() {
      orderBackApi.agreeBack({
        id: this.backId,
        bak: this.handlebak,
        back_price: this.backPrice
        // back_price: 0  // 参照文档说明
      }).then(res => {
        if (res.code == 'success') {
          location.reload()
        } else {
          this.$message.error('发送失败!')
        }
      })
    },
    // 收到退货,关闭退货订单
    backDone() {
      orderBackApi.backDone({
        id: this.backId,
        bak: this.handlebak
        // back_price: 0  // 参照文档说明
      }).then(res => {
        if (res.code == 'success') {
          location.reload()
        } else {
          this.$message.error('发送失败!')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.order-back-detail {

    margin-bottom: 60px;
  .order-back-card {
    width: 1200px;
    margin: 0 auto !important;
  }
  .card {
    margin: 30px;
  }
  .cover-img {
    width: 120px;
    height: auto;
  }
  .common-title {
    margin: 30px;
  }
  .table-layout-orientation {
    margin-top: 20px;
    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;

    .el-row {
      box-sizing: border-box;
      .el-col {
        display: flex;
        height: 40px;
        line-height: 40px;
        .table-cell-head {
          border: 1px solid #dcdfe6;
          font-size: 14px;
          width: 200px;
          text-align: left;
          text-indent: 1em;
          color: #666;
          background-color: #f5f7fa;
        }
        .table-cell-body {
          width: calc(100% - 200px);
          color: #606266;
          overflow: hidden;
          text-align: left;
          text-indent: 1em;
          border-top: 1px solid #dcdfe6;
          border-right: 1px solid #dcdfe6;
          border-bottom: 1px solid #dcdfe6;
        }
      }
    }
  }
}
</style>
