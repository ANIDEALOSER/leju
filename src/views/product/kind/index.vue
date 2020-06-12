<template>
  <div class="kind-main">
    <el-card class="card container" shadow="never">
      <div slot="header">
        <el-alert
          title="为了方便统一开发,这里的分类不能被添加,删除或修改!"
          type="warning"
        />
        <el-button type="primary" disabled="" @click="goAdd">新增</el-button>

      </div>
      <el-row :gutter="20">
        <el-col v-for="item in kindList" :key="item.id" :span="6">
          <el-card>
            <div slot="header">
              <span>{{ item.ctitle }} - {{ item.etitle }}</span>
            </div>
            <img class="img" :src="item.img" alt="">
          </el-card>

        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
import kindApi from '@/api/product/kind.js'
import { resetData } from '@/utils/index'
import _ from 'lodash'
export default {
  components: {
  },
  data() {
    return {
      search: {

      },
      kindList: []
    }
  },
  computed: {

  },
  created() {
    this.getKindList()
  },
  mounted() {

  },
  methods: {
    getKindList() {
      kindApi.list()
        .then(res => {
          this.kindList = res.data
        })
    },
    goAdd() {

    },
    doSearch() {
      resetData(this, 'page')
      this.getKindList()
    }

  }
}
</script>

<style scoped lang="scss">
    .kind-main{
      .card{
        margin: 30px;
      }
     .img{
       width: 100%;
       height: 300px;
     }

    }
</style>
