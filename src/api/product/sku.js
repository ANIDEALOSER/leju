import request from '@/api/request'

function skuList(data) {
  return request({
    url: '/api/leju/admin/productSku/skuList', // 相对路径
    method: 'get',
    data
  })
}
function saveOrUpdate(data) {
  return request({
    url: '/api/leju/admin/productSku/saveOrUpdate', // 相对路径
    method: 'post',
    data
  })
}


export default {
  skuList,
  saveOrUpdate
}
