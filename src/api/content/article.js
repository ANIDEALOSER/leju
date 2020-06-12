// 使用自己封装的api
import request from '@/api/request'

function list(data) {
  return request({
    url: '/api/leju/admin/article/list',
    method: 'get',
    data
  })
}
function saveOrUpdate(data) {
  return request({
    url: '/api/leju/admin/article/saveOrUpdate',
    method: 'post',
    data
  })
}

function del(data) {
  return request({
    url: '/api/leju/admin/article/del',
    method: 'get',
    data
  })
}
function detail(data) {
  return request({
    url: '/api/leju/admin/article/detail',
    method: 'get',
    data
  })
}

export default {
  list,
  saveOrUpdate,
  del,
  detail
}
