import request from '@/api/request'

function productList(data) {
  return request({
    url: '/api/leju/admin/product/list', // 相对路径
    method: 'get',
    data
  })
}
function saveOrUpdate(data) {
  return request({
    url: '/api/leju/admin/product/saveOrUpdate', // 相对路径
    method: 'post',
    data
  })
}

function addOrders(data) {
  return request({
    url: '/api/leju/front/order/addOrders',
    method: 'post',
    data
  })
}
function switchCode(data) {
  return request({
    url: '/api/leju/admin/product/switchCode',
    method: 'post',
    data
  })
}
function detail(data) {
  return request({
    url: '/api/leju/admin/product/detail',
    method: 'get',
    data
  })
}
export default {
  productList,
  saveOrUpdate,
  addOrders,
  switchCode,
  detail
}
