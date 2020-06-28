import Page from "@/components/Page"
import Search from "@/components/searchPanel"
import FormItem from "@/components/FormItem"
import Api from "@/utils/api.js";
import Vue from "vue";

class managePlugin {

  constructor() {

  }

  install(Vue, options) {
    this.installExtendsFunction();

    managePlugin.installComponent(Vue);

    this.installPrototype(Vue);

    this.installFilter(Vue);

    this.installDirective(Vue);

    this.installMixin(Vue);
  }

  /*------------------安装扩展方法------------------*/
  installExtendsFunction() {
    /**
     * 扩展时间对象，增加Format方法
     */
    {
      /*对Date的扩展，将 Date 转化为指定格式的String
       月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
       年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
       例子：
       (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
       (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
       支持时间格式化*/
      Date.prototype.Format = function (fmt) { //author: meizz
        let o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    } {
      /**
       * 金额单位转换：厘转换到元
       * @return {string}
       */
      String.prototype.liToYuan = function (digits = 2) {
        let value = this.toString();
        let number = Number(value)
        if (this === null || this === 'null') {
          value = 0;
        } else if (isNaN(Number(this))) {
          return value;
        }
        if (number < 0) {
          value = Math.abs(value)
          return '-' + (value / 1000).toString().FormatPriceStr();
        } else {
          return (value / 1000).toString().FormatPriceStr();
        }
      }
    }

    {
      /**
       * 格式化金钱
       * @return {string}
       */
      String.prototype.FormatPriceStr = function (digits = 2) {
        if (isNaN(Number(this))) {
          return this.toString();
        }

        try {
          let value = this.toString();
          value = Number(value).toFixed(digits);
          let array = value.split(".");
          let font = array[0].split("");
          font.reverse();
          let newArray = [];
          for (let i in font) {
            if (i % 3 === 0 && i !== 0 && font.length < i + 1) {
              newArray.push(",")
            }
            newArray.push(font[i])
          }
          newArray.reverse();
          return newArray.join("") + "." + array[1];
        } catch (e) {
          return this.toString();
        }
      }
    }

    /**
     * 字符串增加format方法，替换字符串中的#{\d}元素，从0开始
     */
    {
      /**
       * @return {string}
       */
      String.prototype.Format = function (...arr) {
        let value = this.toString();
        arr.forEach((item, index) => {
          value = value.replace(`#{${index}}`, item)
        });
        return value;
      }
    }

    {
      /**
       * 将时间戳转化为指定格式的日期
       * @return {string}
       */
      String.prototype.FormatTimestampToDate = function (format = 'yyyy-MM-dd') {
        if (this !== null) {
          return new Date(parseFloat(this)).Format(format);
        } else {
          return null;
        }
      }
    }

    /**
     * 判断接口返回是否是正确
     */
    {
      window.resOk = function (res = {}) {
        if (res.code === '200' || res.code === 200 || res.data) {
          return true;
        } else {
          return false;
        }
      }
    }

  }

  /*------------------添加vue组件------------------*/
  static installComponent(Vue) {
    Vue.component("Page", Page);
    Vue.component("Search", Search);
    Vue.component("FormItem", FormItem);
  }

  /*------------------添加vue过滤器------------------*/
  installFilter(Vue) {

  }

  /*------------------添加vue实例方法------------------*/
  installPrototype(Vue) {
    Vue.prototype.$http = Api;

    /**
     * 动态设置页面title
     */
    Vue.prototype.$setPageTitle = function (title) {
      if (title) {
        document.title = title;
      }
    };

    /**
     * 下载文件
     * @param url
     * @param fileName
     */
    Vue.prototype.downloadFileByUrl = function (url, fileName = "") {
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('safari') > -1) {

        let link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        if (link.download !== undefined) {
          link.download = fileName;
        }

        if (document.createEvent) {
          let e = document.createEvent('MouseEvents');
          e.initEvent('click', true, true);
          link.dispatchEvent(e);
          return;
        }
        return;
      }
      window.open(url, '_blank');
    };

    /**
     * 获取session中的对象
     * @param key
     */
    Vue.prototype.$getSession = key => {
      let value = window.sessionStorage.getItem(key);

      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error(e, key, value);
        return null;
      }

      return value;
    };

    /**
     * 设置、清空session中的对象
     * @param key
     * @param value
     */
    Vue.prototype.$setSession = (key, value) => {
      if (value === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        if (typeof value === "object") {
          value = JSON.stringify(value)
        }
        window.sessionStorage.setItem(key, value);
      }
    };

    /**
     * 获取storage中的对象
     * @param key
     */
    Vue.prototype.$getStorage = key => {
      let value = window.localStorage.getItem(key);
      try {
        value = JSON.parse(value);
      } catch (e) {
        console.error(e, key, value);
        return null;
      }
      return value;
    };

    /**
     * 设置、清空Storage中的对象
     * @param key
     * @param value
     */
    Vue.prototype.$setStorage = (key, value) => {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        if (typeof value === "object") {
          value = JSON.stringify(value)
        }
        window.localStorage.setItem(key, value);
      }
    };
  }

  /*------------------安装指令方法------------------*/
  installDirective(Vue) {
    Vue.directive('throttle', {
      inserted(el, binding) {
        el.addEventListener('click', () => {
          el.style.pointerEvents = 'none';
          if (!el.disabled) {
            setTimeout(() => {
              el.style.pointerEvents = 'auto';
            }, binding.value || 2000);
          }
        });
      }
    });

  }

  /*------------------安装mixin方法------------------*/
  installMixin(Vue) {

  }
}

export default new managePlugin();
