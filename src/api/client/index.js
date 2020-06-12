// 使用自己封装的api
import request from '@/api/request'

function userList(data) {
  return request({
    url: '/api/leju/admin/client/userList',
    method: 'get',
    data
  })
}
function userDetail(data) {
  return request({
    url: '/api/leju/admin/client/userDetail',
    method: 'get',
    data
  })
}
export default {
  userList,
  userDetail
}
