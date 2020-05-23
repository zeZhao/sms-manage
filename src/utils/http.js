import axios from 'axios';
import Cookies from 'js-cookie'

axios.defaults.timeout = 50000;
axios.defaults.baseURL ='';

//http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.headers = {
      'token': window.localStorage.getItem('token')
    }
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.data.code ==401){
      Cookies.remove('Admin-Token');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
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

export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get('/api'+url,{
      params:params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        this.$message.error('系统异常，请联系管理员');
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.post('/api'+url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        this.$message.error('系统异常，请联系管理员');
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch('/api'+url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        this.$message.error('系统异常，请联系管理员');
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put('/api'+url,data)
      .then(response => {
        resolve(response.data);
      },err => {
        this.$message.error('系统异常，请联系管理员');
      })
  })
}

/**
 * 封装DELETE请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url,params = {}){
  return new Promise((resolve,reject) => {
    axios.delete('/api'+url,{data: params})
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        this.$message.error('系统异常，请联系管理员');
      })
  })
}
