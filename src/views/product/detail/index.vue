<template>
  <div class="product-detail">
    <div class="steps-bar">
      <el-steps :space="300" :active="step" finish-status="success">
        <el-step title="商品基本信息" />
        <el-step title="添加库存信息" />
        <el-step title="添加关联" />
      </el-steps>
    </div>
    <el-card class="card" box-shadow="never">
      <el-form ref="form" class="form" :model="form" label-width="80px">
        <!-- 第一步开始 -->
        <div v-show="step==1" class="step-1">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品名称">
                <el-input v-model="form.gname" size="small" placeholder />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌">
                <el-select v-model="form.brand_id" size="small" placeholder>
                  <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.cname"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="原产地">
                <el-cascader
                  v-model="selectedCity"
                  size="small"
                  :options="cityOptions"
                  placeholder="原产地"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品编码">
                <el-input v-model="form.pcode" size="small" placeholder="商家自定义" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关键词">
                <el-input v-model="form.keywords" size="small" placeholder="不要用逗号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商品描述">
                <el-input
                  v-model="form.descr"
                  size="small"
                  placeholder="商品描述: 仙女凳是专门为小仙女量身定做的减肥凳,效果奇佳!"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="封面图片">
                <el-upload
                  action="/api/leju/admin/material/uploadImg"
                  :on-success="coverSuccess"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-image class="cover-img" :src="form.cover_img">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="是否上架">
                <el-switch v-model="form.isshow" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否最热">
                <el-switch v-model="form.ishot" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否最新">
                <el-switch v-model="form.isnew" active-value="1" inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item width="100" label="进价">
                <el-input-number v-model="form.price_in" :min="0" />(单位:分)
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="售价">
                <el-input-number v-model="form.price_out" :min="0" />(单位:分)
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="当前价格">
                <el-input-number v-model="form.price_now" :min="0" />(单位:分)
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item width="100" label="重量">
                <el-input-number v-model="form.weight" :min="0" />(单位:克)
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序">
                <el-input-number v-model="form.sort" :min="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单位名称">
                <el-input v-model="form.unit_name" placeholder="比如:个/辆/台..." />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="商品分类">
                <el-checkbox-group v-model="form.kindIds" size="small">
                  <el-checkbox
                    v-for="item in kindList"
                    :key="item.id"
                    :label="item.id"
                  >{{ item.ctitle }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="系列">
                <el-select v-model="form.seriesId" size="small" placeholder>
                  <el-option
                    v-for="item in seriesList"
                    :key="item.id"
                    :label="item.cname"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送货服务">
                <el-checkbox-group v-model="form.service_promise">
                  <!-- 服务: 0 无; 1 送货入户 ; 2 上门安装 ;  3  都选了  -->
                  <el-checkbox :label="0">无</el-checkbox>
                  <el-checkbox :label="1">送货入户</el-checkbox>
                  <el-checkbox :label="2">上门安装</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 第一步结束 -->
        <!-- 第二步开始 -->
        <div v-show="step==2" class="step-2">
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="详情标题">
                <el-input v-model="form.detail_title" size="small" placeholder="仙女凳/减肥凳" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="副标题">
                <el-input
                  v-model="form.detail_desc"
                  size="small"
                  placeholder="仙女凳/减肥凳/红色/绿色/黄色/橘黄色"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="30">
            <el-col :span="8">
              <el-form-item label="轮播图">
                <el-upload action="/api/leju/admin/material/uploadImg" :on-success="detailImgsSuccess">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb,最多4张图片</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <img v-for="m in form.imgs" :key="m" class="detail-img" :src="m">
            </el-col>
          </el-row>

          <el-row :gutter="30">
            <el-col :span="20">
              <el-form-item label="添加sku">
                <span>颜色:</span>
                <el-checkbox-group v-model="colorSel">
                  <el-checkbox v-for="item in colorObjList" :key="item.value" :label="item.text">
                    <span :style="{color:item.value}">{{ item.text }}</span>
                    <span style="font-size:12px;" @click="delColor(item.text)">删除</span>
                  </el-checkbox>
                </el-checkbox-group>

                <el-input
                  v-model="colorObj.text"
                  size="small"
                  style="width:160px"
                  placeholder="颜色描述:比如土豪金"
                />
                <el-input
                  v-model="colorObj.value"
                  size="small"
                  style="width:160px"
                  placeholder="色值:比如#ff0055"
                />
                <el-button size="small" type="primary" @click="addColorObj">创建</el-button>
                <!-- 避免误操作 另起一行 -->
                <div>
                  <el-button
                    v-show="colorObjList"
                    type="small"
                    @click="createSkus"
                  >{{ skuList.lenght>0?'重新生成':'生成' }}</el-button>
                </div>
                <el-table :data="skuList" border stripe>
                  <el-table-column prop="color_text" label="颜色" :width="120" />
                  <el-table-column prop="color" label="色值" :width="120" />
                  <el-table-column label="sku编码" :width="200">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.sku_code" size="mini" placeholder="自定义sku编码" />
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" :width="160">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.price" size="mini" placeholder="价格,单位:分" />
                    </template>
                  </el-table-column>
                  <el-table-column label="库存" :width="160">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.count" size="mini" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" :width="160">
                    <template slot-scope="scope">
                      <el-button
                        style="color:red"
                        size="mini"
                        type="text"
                        @click="removeSku(scope.row.tempId)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
          <div>
            <el-form-item label="商品详情">
              <TinEditor ref="tin" upload-url="http://bufantec.com/api/leju/admin/material/uploadImg" />
            </el-form-item>
          </div>
        </div>
        <!-- 第二步结束 -->

        <!-- 第三步开始 -->
        <div v-show="step==3" class="step-3">
          <el-row :gutter="30">
            <el-col :span="12">
              <el-form-item label="关联商品">
                <el-transfer v-model="linkProducts" :titles="['所有商品','选中商品']" :data="productList" />
              </el-form-item>

            </el-col>

          </el-row>
          <el-form-item label="备注">
            <el-input v-model="form.bak" type="textarea" placeholder="填写备注信息" />

          </el-form-item>

        </div>
        <!-- 第三步结束 -->
        <div class="footer-btns">
          <el-button v-show="step>1" size="small" type="default" @click="preStep">返回上一步</el-button>
          <el-button v-show="step<3" size="small" type="primary" @click="nextStep">{{ nextBtnText }}</el-button>
          <el-button v-show="step==3" size="small" type="primary" @click="doSave">提交保存</el-button>
        </div>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import _ from 'lodash'
import productApi from '@/api/product/index'
import kindApi from '@/api/product/kind'
import brandApi from '@/api/brand'
import seriesApi from '@/api/product/series'
import { regionDataPlus, CodeToText } from 'element-china-area-data'
import TinEditor from '@/components/Tinymce'

export default {
  name: 'ProductDetail',
  components: {
    TinEditor
  },
  data() {
    return {
      step: 1,
      id: '',
      form: {
        isshow: '1',
        kindIds: [],
        service_promise: [],
        cover_img: '',
        imgs: []
      },
      kindList: [],
      brandList: [],
      seriesList: [],
      cityOptions: regionDataPlus,
      selectedCity: [],
      fileList: [],
      colorObjList: [], // 颜色对象
      colorObj: {},
      colorSel: [], // 选中的颜色集合
      skuList: [], // sku集合
      linkProducts: [], // 关联商品
      productList: [] // 商品列表
    }
  },
  computed: {
    nextBtnText() {
      var text = ''
      switch (this.step) {
        case 1:
          text = '下一步,填写库存信息'
          break
        case 2:
          text = '下一步,填写关联商品'
          break
        default:
          break
      }
      return text
    }
  },
  created() {
    this.id = this.$route.params.id
    // 初始化必要信息
    this.getKindList()
    this.getBrandList()
    this.getSeriesList()
    this.getProductList()

    setTimeout(() => {
      this.selectedCity = ['110000', '110100', '110102']
    }, 2000)
    if (this.id) {
      this.getProduct()
    }
  },
  mounted() {},
  methods: {
    getProduct() {
      productApi.detail({
        id: this.id
      }).then(res => {
        // 对于数据格式 需要符合表单
        var rs = res.data
        if (rs.imgs.indexOf(',') != -1) {
          rs.imgs = rs.imgs.split(',')
        }
        if (rs.kindIds.indexOf(',') != -1) {
          rs.kindIds = rs.kindIds.split(',')
        }

        this.form = rs
        // 修改kindIds
        this.skuList = rs.skuList
        // 重置原产地
        // 4101010  判断是第一位还是第二位还是第三位
        const selectCityUse = []
        if (this.form.origin_code != '') {
          // 确定第一位
          const city_1_code = this.form.origin_code.substr(0, 2)
          // 确定 第二位
          const city_2_code = this.form.origin_code.substr(2, 2)
          // 确定第三位
          const city_3_code = this.form.origin_code.substr(4, 2)
          selectCityUse.push(city_1_code + '0000')
          if (city_2_code != '00') {
            selectCityUse.push(city_1_code + city_2_code + '00')
          }
          if (city_3_code != '00') {
            selectCityUse.push(city_1_code + city_2_code + city_3_code)
          }
          this.selectedCity = selectCityUse
          console.log('cityCode', this.selectedCity)
        }
        // 删除res的skuList
        delete rs.skuList
        // 设置关联产品
        if (rs.link1) {
          if (rs.link1.indexOf(',') != 1) {
            this.linkProducts = rs.link1.split(',')
          }
        }

        // 设置富文本
        this.setTin(rs.content)
      })
    },
    getKindList() {
      kindApi.list().then(res => {
        this.kindList = res.data
      })
    },
    getBrandList() {
      brandApi.brandList().then(res => {
        this.brandList = res.data.list
      })
    },
    getSeriesList() {
      seriesApi.seriesList().then(res => {
        this.seriesList = res.data
      })
    },
    getProductList() {
      productApi.productList().then(res => {
        var list = res.data.list
        list.forEach(item => {
          this.productList.push({
            key: item.id,
            label: item.gname
          })
        })
      })
    },
    preStep() {
      this.step--
    },
    nextStep() {
      this.step++
    },
    addColorObj() {
      var colorObjNew = _.clone(this.colorObj)
      this.colorObjList.push(colorObjNew)
      this.colorObj = {}
    },

    delColor(text) {
      this.colorObjList = this.colorObjList.filter(item => item.text != text)
    },
    createSkus() {
      this.skuList = []
      this.colorObjList.forEach(item => {
        this.skuList.push({
          tempId: item.text, // 颜色描述为id
          sku_code: '',
          color_text: item.text,
          color: item.value,
          price: 0,
          count: 0
        })
      })
    },
    removeSku(tempId) {
      this.skuList = this.skuList.filter(item => item.tempId != tempId)
    },
    doSave() {
      // 用于把skuList转换为提交需要的数据格式
      for (var i = 0; i < this.skuList.length; i++) {
        this.form['skuList[' + i + ']'] = this.skuList[i]
      }
      // 设置富文本内容
      this.form.content = this.getTin()
      // link1需要的是逗号隔开的字符串
      this.form.link1 = this.linkProducts.join(',')
      if (!this.form.id) {
        delete this.form.id
      }
      // 处理城市内容
      let origin_city = ''
      let origin_code = ''
      for (let i = this.selectedCity.length - 1; i >= 0; i--) {
        if (this.selectedCity[i] != '') {
          origin_code = this.selectedCity[i]
          break
        }
      }

      if (origin_code != '') {
        origin_city = CodeToText[origin_code]
      }
      this.form.origin_city = origin_city
      this.form.origin_code = origin_code

      productApi.saveOrUpdate(this.form).then(res => {
        if (res.code == 'success') {
          this.$router.push({ name: 'productList' })
        } else {
          this.$message.error('保存失败!')
        }
      })
    },
    doSave2() {
      var p = {
        id: '273c6af605e64c12b29cf71b93f2ba06',
        gname: '仙懒人桌1',
        descr: '懒人桌,效果奇佳!',
        isshow: 1,
        ishot: 0,
        isnew: 0,
        service_promise: 1,
        price_in: 111,
        price_out: 111,
        price_now: 111,
        weight: 111,
        sort: 1,
        brand_id: '2eaaff56e77547948d3b25b9e365d1f3',
        keywords: '懒人桌',
        pcode: '100',
        unit_name: '个',
        seriesId: '1e82187238d8436386ec0a98105125b5',
        detail_title: '懒人桌懒人桌',

        cover_img: 'https://bufan-cloud.oss-cn-beijing.aliyuncs.com/leju_test/20200210214823.png',
        imgs: ['https://bufan-cloud.oss-cn-beijing.aliyuncs.com/leju_test/20200210214842.png', 'https://bufan-cloud.oss-cn-beijing.aliyuncs.com/leju_test/20200210214844.png'],
        link1: '9592654fbbd04b559f681844366dc563',
        kindIds: ['2a76f858f23f49cdabf938c4d54f9edf', '1bfad10d58c241c7b919dbb25b3d2043'],
        'skuList[0]': {
          sku_code: 12,
          color_text: '土豪金',
          color: '#ffaa00',
          price: 88,
          count: 99
        },
        'skuList[1]': {
          sku_code: 13,
          color_text: '大红色',
          color: '#00aa00',
          price: 88,
          count: 99
        }
      }

      productApi.saveOrUpdate(p).then(res => {
        console.log(res)
      })
    },
    // 封面图片上传成功回调
    coverSuccess(response, file, fileList) {
      this.form.cover_img = response.ossUrl
    },
    // 明细轮播上传成功回调
    detailImgsSuccess(response, file, fileList) {
      // 牵涉到数组添加内容 可能导致无法动态响应, 用$focusUpdate更新下.
      this.form.imgs.push(response.ossUrl)
      console.log(this.form.imgs)
    },
    getTin() {
      var rs = this.$refs.tin.getContent()
      return rs
    },
    setTin(v) {
      this.$refs.tin.setContent(v)
    }

  }
}
</script>

<style scoped lang="scss">
.product-detail {
  .card {
    margin: 30px 100px;
  }
  .steps-bar {
    margin-top: 30px;
    .el-steps {
      justify-content: center;
    }
  }
  .form {
    margin: 30px auto;
    .cover-img,
    .detail-img{
        width: 120px;
        height: 120px;
    }
  }
  .footer-btns {
    text-align: center;
  }

}
</style>
