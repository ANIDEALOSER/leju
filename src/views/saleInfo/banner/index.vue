<template>
  <div class="banner-main">
    <el-row>
      <el-col :span="24">
        <Carousel :key="0" :type="0" :banner-list="homeBannerList" :upload-url="uploadUrl" @refresh="getBannerList" />
      </el-col>

    </el-row>

  </div>
</template>

<script>
import bannerApi from '@/api/saleInfo/banner.js'
import Carousel from './components/Carousel.vue'
const settingFile = require('@/settings')
export default {
  name: 'ContentBanner',
  components: {
    Carousel
  },
  data() {
    return {
      uploadUrl: settingFile.host + '/api/leju/admin/material/uploadImg',
      bannerList: []
    }
  },

  computed: {

    homeBannerList() {
      return this.bannerList.filter(item => item.use == 0)
    }
  },
  created() {
    this.getBannerList()
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    async getBannerList() {
      var rs = await bannerApi.banners({
        use: 0
      })
      this.bannerList = rs.data
    }

  }
}
</script>

<style scoped lang="scss">
.banner-main {
    width: 900px;
    margin: 30px auto;
}
</style>
