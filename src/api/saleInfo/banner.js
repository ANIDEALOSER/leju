// 使用自己封装的api
import request from '@/api/request'

function banners(data) {
  return request({
    url: '/api/leju/admin/home/banners',
    method: 'get',
    data
  })
}
function bannerSave(data) {
  return request({
    url: '/api/leju/admin/home/bannerSave',
    method: 'post',
    data
  })
}

function bannerDelete(data) {
  return request({
    url: '/api/leju/admin/home/bannerDelete',
    method: 'get',
    data
  })
}

export default {
  banners,
  bannerSave,
  bannerDelete
}
