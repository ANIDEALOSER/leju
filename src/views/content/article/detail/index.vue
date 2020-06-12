<template>
  <div class="detail-main">
    <el-card style="margin: 30px;">
      <div slot="header">
        <span>班级信息 -- {{ titleStatus }}</span>
      </div>

      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者">
              <el-input v-model="form.author" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="摘要">
          <el-input v-model="form.desc" type="textarea" />
        </el-form-item>

        <el-form-item label="封面图片">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" size="small" @click="openMat(0)">选择图片</el-button>
            </el-col>
            <el-col :span="12">
              <img style="width:120px;height:40px;object-fit:contain" :src="form.coverImg" alt>
            </el-col>
            <el-col :span="4">
              <el-button v-if="form.coverImg" style="color:red" type="text" @click="removeCover">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="显示文章">
              <el-switch
                v-model="form.canShow"
                active-color="#13ce66"
                inactive-color="#e5e5e5"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否最热">
              <el-switch
                v-model="form.hot"
                active-color="#13ce66"
                inactive-color="#e5e5e5"
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="文章显示封面">
              <el-switch
                v-model="form.coverShow"
                active-color="#13ce66"
                inactive-color="#e5e5e5"
                :active-value="0"
                :inactive-value="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="外联">
              <el-switch
                v-model="form.original"
                active-color="#13ce66"
                inactive-color="#e5e5e5"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
          <el-col v-show="form.original==1" :span="6">
            <el-input v-model="form.originSite" placeholder="网站名称比如:百度" />
          </el-col>
          <el-col v-show="form.original==1" :span="12">
            <el-input v-model="form.originUrl" placeholder="文章url" />
          </el-col>
        </el-row>

        <el-form-item label="切换富文本类型">
          <el-row>
            <el-col :span="6">
              <el-radio-group v-model="form.editor" @change="editorTypeChange">
                <el-radio :label="0">markdown</el-radio>
                <el-radio :label="1">富文本</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="12">
              <span style="color: #E6A23C;margin-left:50px;">
                <i class="el-icon-warning" /> 切换编辑器会清空内容,请谨慎操作.
              </span>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" @click="openMat(1)">插入素材↓↓</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="editor-box">
        <MarkdownEditor v-show="form.editor==0" ref="md" />
        <Tinymac v-show="form.editor==1" ref="tin" v-model="mdContent" />
      </div>
      <div class="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </div>
      <!-- card body -->
    </el-card>

  </div>
</template>
<script>
import articleApi from '@/api/content/article'
import { resetData } from '@/utils/index'
import Tinymac from '@/components/Tinymce'
import MarkdownEditor from '@/components/MarkdownEditor'

export default {
  name: 'ContentDetail',
  components: {
    Tinymac,
    MarkdownEditor
  },
  data() {
    return {
      show: false,
      titleStatus: '新增',
      form: {
        coverImg: '',
        editor: 0, // '0' 富文本 ; '1' markdown
        canShow: 1,
        original: 0
      },
      mdContent: '', // markdown的初始化内容
      rules: {
        title: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {},
  methods: {
    getDetail(id) {
      this.titleStatus = '编辑'
      articleApi
        .detail({
          id
        })
        .then(res => {
          this.form = res.data
          this.$nextTick(() => {
            // 初始化内容
            if (this.form.editor == '1') {
              this.setTin(this.form.content1)
            } else {
              //   this.mdContent = this.form.content1;
              this.setMd(this.form.content1)
            }
          })
        })
    },
    handleClose() {
      resetData(this, 'form')
      // 清空富文本
      this.resetEditor()
      this.$emit('close-detail')
    },

    doSave() {
      // 富文本 0 markdown ; 1 富文本
      if (this.form.editor == 1) {
        // content1 一般是富文本/markdown原文本
        // content2 转码的html
        this.form.content1 = this.form.content2 = this.getTin()
      } else {
        this.form.content1 = this.getMd().val
        this.form.content2 = this.getMd().html
      }
      if (this.form.content1 == '' && this.form.content2 == '') {
        this.$message.warning('文章内容不能为空!')
        return
      }

      this.$refs.form.validate(valid => {
        // 有id为编辑  否则为保存
        articleApi.saveOrUpdate({
          ...this.form
        }).then(res => {
          if (res.code) {
            this.$message.success('保存成功!')
            this.handleClose()
            this.$parent.getArticleList()
          } else {
            this.$message.error('保存失败!')
          }
        })
      })
    },
    removeCover() {
      this.form.cover = ''
    },
    editorTypeChange() {
      this.form.content1 = this.form.content2 = ''
      this.resetEditor()
    },
    getTin() {
      var content = this.$refs.tin.getContent()
      return content
    },
    setTin(v) {
      // 保证script加载完毕
      this.$refs.tin.setContentAsync(v)
    },
    setMd(v) {
      this.$refs.md.setValue(v)
    },
    getMd() {
      var html = this.$refs.md.getHtml()
      var val = this.$refs.md.getValue()
      return {
        html,
        val
      }
    },
    resetEditor() {
      if (this.$refs.md) {
        this.$refs.md.setValue('')
      }
      if (this.$refs.tin) {
        this.$refs.tin.setContent('')
      }
    },
    handleCoverSel(url) {
      console.log(url)
      this.form.coverImg = url
    }
  }
}
</script>
<style lang='scss' scoped>
.detail-main {

  .footer{
    margin-top: 30px;
    text-align: right;
    .el-button{
      margin-left: 30px;
    }
  }
}
</style>
