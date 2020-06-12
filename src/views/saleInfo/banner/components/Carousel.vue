<template>
  <div class="carousel-main">
    <el-card class="card">
      <div slot="header" class="header">
        <span>
          {{ title }}: 共
          <font style="color:#E6A23C">{{ bannerList.length }}</font> 张
        </span>
        <div class="btns">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="goAdd">新增</el-button>
          <el-button type="success" size="mini" icon="el-icon-edit" circle @click="goEdit" />
          <el-popconfirm
            :value="pop_show"
            confirm-button-text="删了"
            cancel-button-text="不了O(∩_∩)O..."
            icon="el-icon-info"
            icon-color="red"
            title="确定删除这张图片吗？"
            @onConfirm="delImg"
          >
            <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete" circle />
          </el-popconfirm>
        </div>
      </div>
      <!-- card body -->
      <el-carousel type="card" height="200px" :autoplay="false" trigger="click" @change="handleChange">
        <el-carousel-item v-for="item in bannerList" :key="item.id">
          <img class="swiper-img" :src="item.img_url">
        </el-carousel-item>
      </el-carousel>
      <el-row v-if="info">
        <el-col :span="20">
          <p class="link">
            <a :href="info.link" target="_blank">
              超链接:
              <font style="color: #409EFF;text-decoration: underline">{{ info.link }}</font>
            </a>
          </p>
        </el-col>

        <el-col :span="6">
          <span>
            当前页: 第
            <font style="color: red;">{{ activeIndex+1 }}</font> 张
          </span>
        </el-col>
        <el-col :span="6">
          <el-popover
            placement="top-start"
            title="标题"
            width="200"
            trigger="hover"
            content="倒序,数字越大越靠前!"
          >
            <span slot="reference">
              排序: {{ info.sort }}
              <svg-icon icon-class="icon-tip" style="color: #409eff" class-name="custom-class" />
            </span>
          </el-popover>
        </el-col>
        <el-col :span="6">
          <span>显示: {{ info.is_show==1?'是':'否' }}</span>
        </el-col>
        <el-col :span="6">
          <span>新窗口打开: {{ info.blank==1?'是':'否' }}</span>
        </el-col>
        <br>
      </el-row>
    </el-card>

    <el-dialog class="dialog" :title="title" :visible.sync="show" width="50%" @close="handleClose">
      <el-form ref="form" class="form" :model="form" label-width="80px">
        <div>
          <el-upload
            v-show="!tempImg.ossUrl"
            :on-success="handleSucc"
            :headers="headers"
            class="upload-demo"
            drag
            :action="uploadUrl"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过5M</div>
          </el-upload>
          <el-image v-show="tempImg.ossUrl" class="image" :src="tempImg.ossUrl" />
          <el-button v-show="tempImg.ossUrl" type="text" style="color: red;" @click="removeImg">删除</el-button>
        </div>
        <el-row style="margin-top: 50px;">
          <el-col :span="14">
            <el-form-item label="超链接">
              <el-input v-model="form.link" placeholder />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="类型">
              <span>{{ title }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="1" :max="999" label />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="是否显示">
              <el-switch v-model="form.is_show" :active-value="1" :inactive-value="0" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="新窗口打开:">
              <el-switch
                v-model="form.blank"
                active-text="是"
                inactive-text="否"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button @click=" handleClose">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bannerApi from '@/api/saleInfo/banner.js'
export default {
  props: {
    type: {
      type: Number,
      required: true
    },
    bannerList: {
      type: Array,
      default() {
        return []
      }
    },
    uploadUrl: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      activeIndex: 0,
      visible: false,
      form: {
        is_show: 1,
        sort: 1
      },
      show: false,
      tempImg: {},
      pop_show: false,
      headers: {
        'bufan-token': localStorage.getItem('admin-token')
      }
    }
  },
  computed: {
    info() {
      console.log('this.activeIndex', this.activeIndex)
      return this.bannerList[this.activeIndex]
    },
    title() {
      var title = ''
      switch (this.type) {
        case 0:
          title = '首页轮播'
          break
        case 1:
          title = 'h5轮播'
          break
        case 2:
          title = 'ui轮播'
          break
        default:
          title = '首页轮播'
          break
      }

      return title
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleChange(index) {
      this.activeIndex = index
    },
    goAdd() {
      this.form.type = this.type
      this.show = true
    },
    handleClose() {
      this.show = false
      this.tempImg = {}
    },
    async doSave() {
      var params = {
        ...this.form,
        img_url: this.tempImg.ossUrl
      }
      var rs = await bannerApi.saveOrUpdate(params)
      if (rs.code == 'S') {
        this.$message.success('保存成功!')
        this.handleClose()
        this.$emit('refresh')
      } else {
        this.$message.error('保存失败!')
      }
    },
    handleSucc(response, file, fileList) {
      this.tempImg = response.data
    },
    async removeImg() {
      await bannerApi.removeFile({
        key: this.tempImg.key,
        path: this.tempImg.path
      })
      this.tempImg = {}
    },
    goEdit() {
      this.form = JSON.parse(JSON.stringify(this.bannerList[this.activeIndex]))
      this.tempImg.ossUrl = this.form.imgurl
      this.show = true
    },

    delImg() {
      bannerApi
        .bannerDelete({
          id: this.bannerList[this.activeIndex].id
        })
        .then(res => {
          if (res.code == 'S') {
            this.$message.success('删除成功!')
            this.$emit('refresh')
          } else {
            this.$message.error('保存失败!')
          }
        })
    }
  }
}
</script>

<style scoped lang="scss">
.carousel-main {
  .swiper-img {
    width: 400px;
    height: 180px;
  }
  .card {
    margin: 30px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .dialog {
    .form {
      text-align: center;
    }
    .image {
      width: 360px;
      height: 180px;
    }
  }
  ::v-deep .el-form-item__content {
    text-align: left;
  }
}
</style>
