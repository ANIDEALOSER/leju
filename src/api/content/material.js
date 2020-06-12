// 使用自己封装的api
import request from '@/api/request'

function materialList(data) {
  return request({
    url: '/api/leju/admin/material/list',
    method: 'get',
    data
  })
}

/**
 * 上传服务器和OSS和数据库
 * @param {} data
 */
function uploadAndSaveImg(data) {
  return request({
    url: '/api/leju/admin/material/uploadAndSaveImg',
    method: 'post',
    data
  })
}
/**
 * 上传到OSS(通用)
 * @param {*} data
 */
function uploadImg(data) {
  return request({
    url: '/api/leju/admin/material/uploadImg',
    method: 'post',
    data
  })
}
/**
 * 删除素材
 * @param {} data
 */
function del(data) {
  return request({
    url: '/api/leju/admin/material/del',
    method: 'get',
    data
  })
}
/**
 * 移除素材 用于删除未保存到数据库的么有产生id的素材
 * 所以需要 fileName 和 filePath 两个参数
 * @param {*} data
 */
function removeFile(data) {
  return request({
    url: '/api/leju/admin/material/removeFile',
    method: 'get',
    data
  })
}
export default {
  materialList,
  uploadAndSaveImg,
  uploadImg,
  del,
  removeFile
}
