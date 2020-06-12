export default {
  data() {
    return {
      page: {
        pageSplit: [10, 20, 30],
        start: 1, // 当前页
        limit: 10, // 每页大小
        totalCount: 0, // 总数
        totalPage: 0 // 总页数

      }
    }
  },
  methods: {
    _resetPage(res) {
      if (res) {
        this.page.start = res.pageNumber
        this.page.limit = res.pageSize
        this.page.totalCount = res.totalRow
      } else {
        resetData(this, 'page')
      }
    }

  }
}
