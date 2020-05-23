import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import echarts from 'echarts'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import ThemePicker from '@/components/ThemePicker'

import * as filters from './filters' // global filters

import common from '../commonFunction/common.js'; //自定义公共方法

import {post,fetch,patch,put,del} from './utils/http'
import axios from 'axios'
import qs from 'qs'
import excelexport from './utils/excelexport'
Vue.prototype.$ExportExcel = excelexport
Vue.prototype.$Cookies = Cookies
Vue.prototype.$axios = axios
Vue.prototype.qs = qs;
axios.defaults.baseURL = ''
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//定义全局变量
Vue.prototype.$httpPost=post;
Vue.prototype.$httpGet=fetch;
Vue.prototype.$httpDel=del;
Vue.prototype.$httpPut=put;
// 数据接口
import Api from "./utils/api.js";
Vue.prototype.$http = Api;

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
Vue.prototype.common = common
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
Vue.use(echarts)
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

Date.prototype.format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

