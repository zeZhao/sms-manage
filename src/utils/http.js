import axios from 'axios';
import Cookies from 'js-cookie'
import {
  getToken,
  removeToken
} from '@/utils/auth'
import {
  Message
} from 'element-ui'
import router from '@/router'

axios.defaults.timeout = 500000;
// axios.defaults.baseURL = '';
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
  axios.defaults.baseURL = baseUrl
} else {
  axios.defaults.baseURL = '/api/api'
}

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.headers = {
      'token': getToken()
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code == 401) {
      removeToken()
      window.location.reload()
    } else if (response.data.code === 406) {
      Message({
        message: response.data.msg,
        type: 'error',
      })
      router.push("/")
      window.location.reload()
    } else if (response.data.code === 999) {
      Message({
        message: '用户信息已失效，请重新登录',
        type: 'error',
      })
      removeToken()
      window.location.reload()
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}
/**
 * 封装get请求下载文件方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function downLoadGet(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType: 'blob',
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}
/**
 * 封装post请求下载文件
 * @param url
 * @param data
 * @returns {Promise}
 */

export function downLoadPost(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, { responseType: 'blob' })
      .then(response => {
        resolve(response.data);
      }, err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}

/**
 * 封装DELETE请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
      data: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        // Message({
        //   message: '网络异常',
        //   type: 'error',
        // })
      })
  })
}
