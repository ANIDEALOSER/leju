// 引入封装好的axios
import request from '@/api/request'

// 获取用户列表
function roleList(data) {
  return request({
    url: '/admin/sys/role/list',
    method: 'get',
    data
  })
}
/**
 * 保存角色和权限
 * @param {} data
 */
function saveRole(data) {
  return request({
    url: '/admin/sys/role/save',
    method: 'post',
    data
  })
}

function updateRole(data) {
  return request({
    url: '/admin/sys/role/update',
    method: 'post',
    data
  })
}

function getMenuByRole(data) {
  return request({
    url: '/admin/sys/role/getMenuByRole',
    method: 'get',
    data
  })
}

function getRoleDetail(data) {
  return request({
    url: '/admin/sys/role/detail',
    method: 'get',
    data
  })
}

function delRole(data) {
  return request({
    url: '/admin/sys/role/del',
    method: 'get',
    data
  })
}

export default {
  roleList,
  saveRole,
  getMenuByRole,
  updateRole,
  getRoleDetail,
  delRole
}
