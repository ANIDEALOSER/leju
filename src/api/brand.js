import request from '@/api/request'

function brandList(data) {
  return request({
    url: '/api/leju/admin/brand/list', // 相对路径
    method: 'get',
    data
  })
}

function brandListAll(data) {
  return request({
    url: '/api/leju/admin/brand/listAll', // 相对路径
    method: 'get',
    data
  })
}

function saveOrUpdate(data) {
  return request({
    url: '/api/leju/admin/brand/saveOrUpdate', // 相对路径
    method: 'post',
    data
  })
}

function del(data) {
  return request({
    url: '/api/leju/admin/brand/del', // 相对路径
    method: 'get',
    data
  })
}
export default {
  brandList,
  brandListAll,
  saveOrUpdate,
  del
}
