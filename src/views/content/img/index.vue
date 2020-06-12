<template>
  <div class="img-main">
    <el-card class="card container" shadow="never">
      <div slot="header">
        <el-upload
          ref="upload"
          action="/api/leju/admin/material/uploadAndSaveImg"
          :on-success="handleUploadSucc"
        >
          <el-button type="primary" size="small">上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

      </div>
      <el-row :gutter="30">
        <el-col v-for="item in imgs" :key="item.id" class="item" :span="6">
          <el-card class="item-card" shadow="hover">
            <div slot="header" style="text-align:right">
              <el-button type="text" style="color: red" size="mini" @click="doDel(item.id)">删除</el-button>

            </div>
            <img class="item-img" :src="item.ossUrl" alt="">
          </el-card>
        </el-col>
      </el-row>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>

<script>
import materialApi from '@/api/content/material'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
import _ from 'lodash'
const settingFile = require('@/settings')
export default {
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      host: settingFile.host,
      imgs: [],
      page: {
        limit: 12,
        size: [12, 24, 36]
      }
    }
  },
  computed: {

  },
  created() {
    this.getMaterialList()
  },
  mounted() {

  },
  methods: {
    getMaterialList() {
      this.loading = true
      var params = {
        start: this.page.start,
        limit: this.page.limit
      }
      params = _.pickBy(params, item => item)
      materialApi.materialList(params)
        .then(res => {
          this.page.totalCount = res.data.totalRow
          this.imgs = res.data.list
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getMaterialList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getMaterialList()
    },
    doDel(id) {
      this.$confirm('确认删除?')
        .then(() => {
          materialApi.del({
            id
          }).then(res => {
            if (res.code == 'S') {
              this.$message.success('删除成功!')
              this.getMaterialList()
            }
          })
        })
    },
    handleUploadSucc() {
      this.$refs.upload.clearFiles()
      this.getMaterialList()
    }
  }
}
</script>

<style scoped lang="scss">
    .img-main{

      .container{
        box-sizing: border-box;
        margin: 30px;

        .item{
          margin: 30px auto;
          .item-img{
            width: 100%;
            height: 300px;
          }
        }

      }
    }
</style>
