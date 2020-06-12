<template>
  <div class="class-main">
    <transition name="fadeInUp">
      <Detail v-show="detailShow" ref="detail" @close-detail="detailShow=false" />
    </transition>

    <transition name="fadeOutUp">
      <div v-show="!detailShow" class="content">
        <el-card class="card" shadow="never">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-input v-model="search.title" size="small" placeholder="文章名称模糊查询" />
            </el-col>
            <el-col :span="4">
              <el-input v-model="search.author" size="small" placeholder="作者" />
            </el-col>
            <el-col :span="6" :offset="8">
              <el-button type="primary" size="small" @click="doSearch">搜索</el-button>
              <el-button type="default" size="small" @click="doReset">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-card class="card" shadow="never">
          <div slot="header">
            <el-button type="primary" @click="goAdd">新增</el-button>
          </div>

          <el-table v-loading="loading" :data="articleListCom" border stripe>
            <el-table-column fixed type="index" label="#" :width="50" />
            <el-table-column label="文章标题" :width="300">
              <template slot-scope="scope">
                <a style="color:rgb(64, 158, 255)" href="#" target="_blank">{{ scope.row.title }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" :width="150" />
            <el-table-column prop="kindTitle" label="文章分类" align="center" :width="300" />
            <el-table-column label="颜色分类" align="center" :width="150">
              <template slot-scope="{row}">
                <span v-if="row.color1" class="item-color-block" :style="{backgroundColor:row.color1}" />
                <span v-if="row.color2" class="item-color-block" :style="{backgroundColor:row.color2}" />
                <span v-if="row.color3" class="item-color-block" :style="{backgroundColor:row.color3}" />
              </template>
            </el-table-column>
            <el-table-column prop="coverImg" label="封面图片" :width="300">
              <template slot-scope="scope">
                <img class="cover-img" :src="scope.row.coverImg" alt>
              </template>
            </el-table-column>
            <el-table-column label="阅读量/赞" :width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.viewCount+' / '+scope.row.zanCount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="addTime" label="更新时间" :width="200" />
            <el-table-column fixed="right" label="操作" :width="300">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="goEdit(scope.row.id)">编辑</el-button>
                <el-button type="default" size="mini" @click="goView(scope.row.id)">查看</el-button>
                <el-button type="danger" size="mini" @click="goDel(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
import articleApi from '@/api/content/article'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
import Detail from './detail'
import { resetData, formatTime } from '@/utils/index'
import _ from 'lodash'
export default {
  name: 'Article',
  components: {
    Pagination,
    Detail
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      dialog: false,
      detailShow: false,
      search: {},
      articleList: []
    }
  },
  computed: {
    articleListCom() {
      return this.articleList.map(item => {
        item.addTime = formatTime(item.addTime)
        return item
      })
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    doSearch() {
      resetData(this, 'page')
      this.getArticleList()
    },
    doReset() {
      resetData(this, 'search')
      this.doSearch()
    },
    getArticleList() {
      this.loading = true
      var params = {
        start: this.page.start,
        limit: this.page.limit,
        ...this.search
      }
      // 过滤无效参数
      params = _.pickBy(params, item => item)
      articleApi.list(params).then(({ data }) => {
        this.loading = false
        this.articleList = data.list
        this._resetPage(data)
      })
    },
    goAdd() {
      // this.$refs.detail.openDialog();
      this.detailShow = true
    },
    goEdit(id) {
      this.detailShow = true
      this.$refs.detail.getDetail(id)
    },
    goView() {},
    goDel(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          articleApi
            .del({
              id
            })
            .then(res => {
              if (res.code) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getArticleList()
              } else {
                this.$message.error('删除失败!')
              }
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    switchHot(row) {
      articleApi
        .changeState({
          id: row.id,
          key: 'hot',
          value: row.hot
        })
        .then(res => {
          if (res.code) {
            this.$message.success('更改状态成功!')
          } else {
            this.$message.error('更改状态失败!')
          }
        })
    },
    // 更新状态
    switchCanShow(row) {
      articleApi
        .changeState({
          id: row.id,
          key: 'canShow',
          value: row.canShow
        })
        .then(res => {
          if (res.code) {
            this.$message.success('更改状态成功!')
          } else {
            this.$message.error('更改状态失败!')
          }
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getArticleList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getArticleList()
    }
  }
}
</script>

<style lang='scss' scoped>
.class-main {
  .card {
    margin: 30px;
    box-sizing: border-box;
  }
  .content {
    .cover-img {
      width: 100px;
      height: 40px;
      object-fit: contain;
    }
  }
  .item-color-block{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}
.fadeInUp-enter-active {
  animation: fadeInUp 0.4s 0.4s both;
}
.fadeInUp-leave-active {
  animation: fadeInUp 0.4s reverse;
}
.fadeOutUp-enter-active {
  animation: fadeInUp 0.4s 0.4s;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes fadeOutUp {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>
