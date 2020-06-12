// 引入封装好的axios
import request from '@/api/request'

// 获取用户列表
function userList(data) {
  return request({
    url: '/admin/sys/user/list',
    method: 'get',
    data
  })
}

function saveUser(data) {
  return request({
    url: '/admin/sys/user/save',
    method: 'post',
    data
  })
}
function updateUser(data) {
  return request({
    url: '/admin/sys/user/update',
    method: 'post',
    data
  })
}

// 获取用户角色id集合
function getRoleIdsByUser(data) {
  return request({
    url: '/admin/sys/user/getRoleIdsByUser',
    method: 'get',
    data
  })
}

function saveUserRole(data) {
  return request({
    url: '/admin/sys/user/saveUserRole',
    method: 'post',
    data
  })
}
function roleUpdate(data) {
  return request({
    url: '/admin/sys/user/roleUpdate',
    method: 'post',
    data
  })
}

function delUser(data) {
  return request({
    url: '/admin/sys/user/del',
    method: 'get',
    data
  })
}

export default {
  userList,
  saveUser,
  updateUser,
  getRoleIdsByUser,
  saveUserRole,
  roleUpdate,
  delUser
}
