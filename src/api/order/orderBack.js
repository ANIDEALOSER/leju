import request from '@/api/request'

function orderList(data) {
  return request({
    url: '/api/leju/admin/orderBack/list', // 相对路径
    method: 'get',
    data
  })
}

function orderDetail(data) {
  return request({
    url: '/api/leju/admin/orderBack/detail', // 相对路径
    method: 'get',
    data
  })
}
function rejectBack(data) {
  return request({
    url: '/api/leju/admin/orderBack/rejectBack', // 相对路径
    method: 'post',
    data
  })
}
function agreeBack(data) {
  return request({
    url: '/api/leju/admin/orderBack/agreeBack', // 相对路径
    method: 'post',
    data
  })
}
function backDone(data) {
  return request({
    url: '/api/leju/admin/orderBack/backDone',
    method: 'post',
    data
  })
}
export default {
  orderList,
  orderDetail,
  rejectBack,
  agreeBack,
  backDone
}
