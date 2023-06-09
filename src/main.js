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

import * as filters from './filters' // global filters

import common from '../commonFunction/common.js'; //自定义公共方法
import managePlugin from "./utils/managePlugin"

import {
  post,
  fetch,
  patch,
  put,
  del
} from './utils/http'
import axios from 'axios'
import qs from 'qs'
import excelexport from './utils/excelexport'
import publicValidators from './utils/publicValidators' //多个手机号和邮箱的用逗号隔开的校验（公共）

Vue.prototype.$publicValidators = publicValidators
Vue.prototype.$ExportExcel = excelexport
Vue.prototype.$Cookies = Cookies
Vue.prototype.$axios = axios
Vue.prototype.qs = qs;
Vue.prototype.configFilePath = process.env.VUE_APP_HOST_URL

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//定义全局变量
Vue.prototype.$httpPost = post;
Vue.prototype.$httpGet = fetch;
Vue.prototype.$httpDel = del;
Vue.prototype.$httpPut = put;

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
Vue.use(managePlugin)
Vue.use(echarts)

//全局修改弹窗遮罩层不插入至 body 元素上
Element.Dialog.props.modalAppendToBody.default = false;
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
