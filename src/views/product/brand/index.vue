<template>
  <div class="brand-main">
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
        <el-button type="primary" @click="goAdd">新增</el-button>

      </div>
      <el-row :gutter="20">
        <el-col v-for="item in brandList" :key="item.id" :span="6">
          <el-card>
            <div slot="header">
              <span><!-- card title --></span>
            </div>
            <img class="brand-img" :src="item.coverImg" alt="">
          </el-card>

        </el-col>
      </el-row>

      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
    <el-dialog
      class="dialog"
      title=""
      :visible.sync="dialog"
      width="30%"
      @close="handleClose"
    >
      <el-form ref="brand" :model="brand" label-width="80px">
        <el-form-item label="品牌名称">
          <el-input v-model="brand.cname" placeholder="中文名称" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="brand.ename" placeholder="english name" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-upload
            ref="upload"
            :action="uploadUrl"
            :on-success="handleUploadSucc"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

        </el-form-item>
        <el-form-item label="">
          <img class="coverImg" :src="brand.coverImg" alt="">
          <el-button type="text" style="color: red" @click="doRemoveImg">删除</el-button>

        </el-form-item>
        <el-form-item label="品牌描述">
          <el-input v-model="brand.descr" type="textarea" />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
import brandApi from '@/api/brand'
import { resetData } from '@/utils/index'
import materialApi from '@/api/content/material'
import _ from 'lodash'
const settingFile = require('@/settings')
export default {
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      dialog: false,
      uploadUrl: settingFile.host + '/api/leju/admin/material/uploadImg',
      search: {

      },
      brandList: [],
      brand: {
        coverImg: ''
      },
      tempFile: {}
    }
  },
  computed: {

  },
  created() {
    this.getBrandList()
  },
  mounted() {

  },
  methods: {
    getBrandList() {
      let params = {
        ... this.search,
        start: this.page.start,
        limit: this.page.limit
      }
      params = _.pickBy(params, item => item)
      brandApi.brandList(
        params
      )
        .then(res => {
          this.page.totalCount = res.data.totalRow
          this.brandList = res.data.list
        })
    },
    goAdd() {
      this.dialog = true
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getBrandList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getBrandList()
    },
    doSearch() {
      resetData(this, 'page')
      this.getBrandList()
    },
    handleClose() {
      resetData(this, 'brand')
      this.dialog = false
    },
    doSave() {
      brandApi.saveOrUpdate(
        this.brand
      ).then(res => {
        if (res.code == 'S') {
          this.$message.success('保存成功!')
          this.handleClose()
          this.getBrandList()
        } else {
          this.$message.error('保存失败!')
        }
      })
    },
    handleUploadSucc(response, file, fileList) {
      // 保存file临时变量 方便移除
      this.tempFile = response
      this.brand.coverImg = response.ossUrl
      this.$refs.upload.clearFiles()
    },
    doRemoveImg() {
      materialApi.removeFile({
        fileName: this.tempFile.fileName,
        filePath: this.tempFile.filePath
      }).then(res => {
        this.brand.coverImg = ''
      })
    }

  }
}
</script>

<style scoped lang="scss">
    .brand-main{
      .card{
        margin: 30px;
      }
      .search-box {
        .el-input {
          width: 200px;
        }
      }
      .container {
        .brand-img{
          width: 100%;
          height: 300px;
        }
      }
      .dialog{
        .coverImg{
          width: 200px;

        }
      }
    }
</style>
