import request from '@/api/request'

function seriesList(data) {
  return request({
    url: '/api/leju/admin/series/list', // 相对路径
    method: 'get',
    data
  })
}

export default {
  seriesList
}
