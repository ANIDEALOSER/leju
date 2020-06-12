import request from '@/api/request'

function doLogin(data) {
  return request({
    url: '/admin/login/doLogin', // 相对路径
    method: 'post',
    data
  })
}

export default {
  doLogin
}
