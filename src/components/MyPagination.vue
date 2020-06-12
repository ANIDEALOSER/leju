<template>
  <div class="MyPagination-main">
    <el-pagination
      class="pagination"
      :current-page="page.start"
      :page-sizes="page.pageSplit"
      :page-size="page.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },

  methods: {
    handleSizeChange(v) {
      this.$emit('handle-size-change', v)
    },
    handleCurrentChange(v) {
      this.$emit('handle-current-change', v)
    }
  }
}
</script>

<style lang='scss' scoped>
  .MyPagination-main{
    margin: 30px auto;
  }
</style>
