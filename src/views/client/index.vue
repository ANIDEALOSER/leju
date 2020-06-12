<template>
  <div class="client-main">
    <el-card class="card search-box" shadow="never">
      <div slot="header">
        <span>搜索条件</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="search.username" size="small" placeholder="用户名" />

        </el-col>
        <el-col :span="6">
          <el-input v-model="search.tel" size="small" placeholder="电话号码查找" />

        </el-col>
        <el-col :span="4" :offset="8">
          <el-button type="default" size="small">重置</el-button>
          <el-button type="primary" size="small" @click="doSearch">查询</el-button>

        </el-col>

      </el-row>

    </el-card>

    <el-card class="card container" shadow="never">
      <div slot="header">
        <span><!-- card title --></span>
      </div>
      <el-table :data="clientList" border stripe>
        <el-table-column label="#" type="index" :width="50" />
        <el-table-column label="头像" width="160">
          <template slot-scope="scope">
            <img class="avatar" :src="scope.row.avatar" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="160" />
        <el-table-column prop="nickname" label="昵称" width="160" />
        <el-table-column prop="tel" label="电话号码" width="160" />
        <el-table-column prop="email" label="邮箱" width="300" />
        <el-table-column prop="addTime" label="注册时间" width="300" />
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>

  </div>
</template>

<script>
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
import clientApi from '@/api/client/index'
import { resetData } from '@/utils/index'
import _ from 'lodash'
export default {
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      search: {

      },
      clientList: []
    }
  },
  computed: {

  },
  created() {
    this.getClientList()
  },
  mounted() {

  },
  methods: {
    getClientList() {
      let params = {
        ... this.search,
        start: this.page.start,
        limit: this.page.limit
      }
      params = _.pickBy(params, item => item)
      clientApi.userList(
        params
      )
        .then(res => {
          this.page.totalCount = res.data.totalRow
          this.clientList = res.data.list
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getClientList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getClientList()
    },
    doSearch() {
      resetData(this, 'page')
      this.getClientList()
    }

  }
}
</script>

<style scoped lang="scss">
    .client-main{
      .card{
        margin: 30px;
      }
      .search-box {
        .el-input {
          width: 200px;
        }
      }
      .container {
        .avatar{
          width: 100px;
        }
      }
    }
</style>
