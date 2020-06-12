// 引入封装好的axios
import request from '@/api/request'

// 获取用户列表
function menuList(data) {
  return request({
    url: '/admin/sys/menu/list',
    method: 'get',
    data
  })
}
function saveMenu(data) {
  return request({
    url: '/admin/sys/menu/save',
    method: 'post',
    data
  })
}

function updateMenu(data) {
  return request({
    url: '/admin/sys/menu/update',
    method: 'post',
    data
  })
}

function delMenu(data) {
  return request({
    url: '/admin/sys/menu/del',
    method: 'get',
    data
  })
}

function detail(data) {
  return request({
    url: '/admin/sys/menu/detail',
    method: 'get',
    data
  })
}

function initMenus(data) {
  return request({
    url: '/admin/sys/menu/initMenus',
    method: 'post',
    data
  })
}

export default {
  menuList,
  saveMenu,
  updateMenu,
  delMenu,
  detail,
  initMenus
}
