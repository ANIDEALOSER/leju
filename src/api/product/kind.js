import request from '@/api/request'

function list(data) {
  return request({
    url: '/api/leju/admin/kind/list', // 相对路径
    method: 'get',
    data
  })
}
function saveOrUpdate(data) {
  return request({
    url: '/api/leju/admin/kind/saveOrUpdate', // 相对路径
    method: 'post',
    data
  })
}
function del(data) {
  return request({
    url: '/api/leju/admin/kind/del', // 相对路径
    method: 'get',
    data
  })
}

export default {
  list,
  saveOrUpdate,
  del
}
