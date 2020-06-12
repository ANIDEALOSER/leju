import request from '@/api/request'
// import config from '@/api/config'

function baseInfo(data) {
  return request({
    url: '/api/leju/admin/dashboard/baseInfo', // 相对路径
    method: 'get',
    data
  })
}

export default {
  baseInfo
}
