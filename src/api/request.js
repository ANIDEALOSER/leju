import axios from 'axios'
import { Message } from 'element-ui'
// 用于处理对提交对象进行序列化
import qs from 'qs'
import router from '@/router'
// create an axios instance
// process.env 指的是当前的运行环境 所对应的 配置文件
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 如果本地有token  携带过去
    var token = window.localStorage.getItem('bufan-token')
    if (token != '' && token != 'undefined') {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // 设置请求头   每次请求回默认携带token
      // 这个key是后台定义的
      config.headers['bufan-token'] = token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 5000 token为空 ；  5001 非法token 或者 过期token
    if (res.tokenCode == 5000 || res.tokenCode == 5001) {
      // 说明非法访问
      console.log('res', res.tokenCode)
      var msg = res.tokenCode == 5000 ? '登陆失败！' : 'token过期！'
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      // 清空token
      // removeToken();
      window.localStorage.removeItem('bufan-userInof')
      window.localStorage.removeItem('bufan-token')
      // 跳转首页
      router.push('/login')
      return Promise.reject()
    }
    // 5002 token再有5分钟过期，此时应该续存token
    // 如果出现了5002  同时回携带返回新的token   refresh_token
    if (res.tokenCode === 5002) {
      // 重新存储 新的token  深藏功与名！
      window.localStorage.setItem('bufan-token', res.refresh_token)
    }
    return res

    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
/**
 * 合并get与post提交
 * @param {} config
 */
function http(config) {
  // 动手脚
  if (config.method.toLowerCase() == 'post') {
    // qs系列化
    // https://www.npmjs.com/package/qs
    //  arrayFormat: 'repeat' 作用:  { a: ['b', 'c'] }  ==> 'a=b&a=c'
    //  allowDots: true  作用: { a: { b: { c: 'd', e: 'f' } } }  ==>  'a.b.c=d&a.b.e=f'
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat', allowDots: true })
  } else {
    config.params = config.data
  }

  return service(config)
}
export default http
