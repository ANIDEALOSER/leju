<template>
  <div class="order-main">
    <el-card class="search-box card" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-input v-model="search.username" size="small" placeholder="用户名/模糊查询" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.status" size="small" clearable placeholder="订单状态">
            <!-- 订单状态 0 未付款; 1 已付款 ;  2 已发货; 3: 已收货; 9 申请退款 -->
            <el-option v-for="(v,key) in orderStatusObj" :key="v" :label="v" :value="key" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.statusend" size="small" clearable placeholder="是否关闭">
            <el-option label="正在进行" value="0" />
            <el-option label="已关闭" value="1" />
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-button type="default" size="mini" @click="doReset">重置</el-button>
          <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
          <el-button style="color:red;" type="primary" size="mini" @click="addOrder">模拟添加订单</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="content box card" shadow="never">
      <el-table v-loading="loading" :data="orderListCom" border stripe>
        <el-table-column type="index" :width="50" />
        <el-table-column align="center" prop="orderId" label="订单编号" :width="200" />
        <el-table-column align="center" prop="addTime" label="添加时间" :width="200" />
        <el-table-column align="center" prop="username" label="用户账号" :width="160" />
        <el-table-column align="center" prop="price" label="订单金额" :width="160" />
        <el-table-column align="center" prop="count" label="订单数量" :width="160" />
        <el-table-column align="center" label="订单状态" :width="160">
          <template slot-scope="scope">
            {{ scope.row.orderStatusText }}: {{ scope.row.orderStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="payType" label="支付类型" :width="160" />

        <el-table-column align="center" prop="statusend" label="是否关闭" :width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.statusend=='1'" style="color: red;">已关闭</span>
            <span v-else style="color: green;">正在进行</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="doneTime" label="完成时间" :width="160" />

        <el-table-column align="center" label="操作" :width="360">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goDetail(scope.row.orderId)">查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>

<script>
import orderApi from '@/api/order/index'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
export default {
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      search: {},
      orderList: [],
      orderStatusObj: {
        '0': '未付款',
        '1': '已付款',
        '2': '已发货',
        '3': '已收货',
        '9': '申请退货'
      }
    }
  },
  computed: {
    orderListCom() {
      var vm = this
      // 对象遍历  修改的是对象本身 隐患:修改了原始数据,可能造成程序在其他地方受影响
      this.orderList.forEach(item => {
        item.orderStatusText = vm.orderStatusObj[item.orderStatus]
      })
      return this.orderList
    }
  },
  created() {
    this.getOrderList()
  },
  mounted() {},
  methods: {
    doReset() {},
    doSearch() {},
    goDetail(orderId) {
      this.$router.push({ name: 'orderDetail', params: { orderId }})
    },
    getOrderList() {
      this.loading = true
      const params = {
        ... this.search,
        start: this.page.start,
        limit: this.page.limt
      }
      orderApi.orderList(params)
        .then(res => {
          this.page.totalCount = res.data.totalRow
          this.orderList = res.data.list
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    // 模拟前台添加订单
    addOrder() {
      // 模拟一个
      var orderObj = {
        userId: 'b6da113f23cf428bbe646b358e76b89c',
        addressId: '8ed081922c6f4e8fafb44227ffeeeaa0', // 当前用户的收货地址
        count: 4,
        freight: 0,
        price: 1280,
        'orderDetail[0]': {
          skuId: '08c2f7c95df24b6799dcf62ef36f3093',
          price: 67,
          count: 1
        },
        'orderDetail[1]': {
          skuId: '0a308399dcdc4a00871a883a53d9a22b',
          price: 110,
          count: 2
        }
      }

      orderApi.addOrders(orderObj)
        .then(res => {
          this.getOrderList()
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getOrderList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getOrderList()
    }
  }
}
</script>

<style scoped lang="scss">
.order-main {
  .card {
    margin: 30px;
  }
  .search-box {
    .el-input {
      width: 200px;
    }
  }
}
</style>
