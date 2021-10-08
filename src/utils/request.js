import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken,
  removeToken
} from '@/utils/auth'
import router from '@/router'

let service = null

if (process.env.NODE_ENV === "production") {
  let baseUrl = ''
  switch (process.env.VUE_APP_TITLE) {
    case "development":
      baseUrl = process.env.VUE_APP_BASE_API
      break
    case "production":
      baseUrl = process.env.VUE_APP_BASE_API
      break
  }
  service = axios.create({
    baseURL: baseUrl,
    timeout: 5000
  })
} else {
  service = axios.create({
    baseURL: '/api/api',
    timeout: 5000
  })
}
// create an axios instance


// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
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
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data

    if (res.code == 401) {
      Cookies.remove('Admin-Token');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      window.location.reload()
    } else if (res.code === 406) {
      Message({
        message: res.msg,
        type: 'error',
      })
      router.push("/")
      window.location.reload()
    } else if (res.code === 999) {
      Message({
        message: '用户信息已失效，请重新登录',
        type: 'error',
      })
      removeToken()
      window.location.reload()
    } else {
      return res
    }

    // // if the custom code is not 20000, it is judged as an error.
    // if (res.code !== 200) {
    //   Message({
    //     message: res.data || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //   // // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //   //   // to re-login
    //   //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //   //     confirmButtonText: 'Re-Login',
    //   //     cancelButtonText: 'Cancel',
    //   //     type: 'warning'
    //   //   }).then(() => {
    //   //     store.dispatch('user/resetToken').then(() => {
    //   //       location.reload()
    //   //     })
    //   //   })
    //   // }
    // }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '连接异常',
      // message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    removeToken()
    setTimeout(() => {
      location.reload();
    }, 1500);
    return Promise.reject(error)
  }
)

export default service
