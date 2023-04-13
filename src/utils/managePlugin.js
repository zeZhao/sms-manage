import Page from "@/components/Page"
import Search from "@/components/searchPanel"
import FormItem from "@/components/FormItem"
import ChooseUser from "@/components/ChooseUser"
import BatchAddition from "@/components/BatchAddition"
import BatchModification from "@/components/BatchModification"
import Moment from 'moment';
import Api from "@/utils/api.js";
import { Message } from 'element-ui';
import { isPhone } from "@/utils";

class managePlugin {

  constructor() { }

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
    }

    {
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
        const {
          code
        } = res
        if (code === '200' || code === 200 || res.data) {
          if (code === 500 || code === '500') {
            return false
          }
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
    Vue.component("ChooseUser", ChooseUser);
    Vue.component("BatchAddition", BatchAddition);
    Vue.component("BatchModification", BatchModification);
  }

  /*------------------添加vue过滤器------------------*/
  installFilter(Vue) {
    Vue.filter('timeFormat', function (time) {
      if (time && time !== '-') {
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
      } else {
        return '-';
      }
    })
    Vue.filter('Format', function (time) {
      if (time && time !== '-') {
        return Moment(time).format('YYYY-MM-DD');
      } else {
        return '-';
      }
    })
    Vue.filter('FormatMonth', function (time) {
      if (time && time !== '-') {
        return Moment(time).format('YYYY-MM');
      } else {
        return '-';
      }
    })
  }

  /*------------------添加vue实例方法------------------*/
  installPrototype(Vue) {
    Vue.prototype.$http = Api;

    /* 深拷贝 */
    Vue.prototype.$deepClone = function deepClone(obj) {
      var objClone = Array.isArray(obj) ? [] : {};
      if (obj && typeof obj === "object") {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (obj[key] && typeof obj[key] === "object") {
              objClone[key] = deepClone(obj[key]);
            } else {
              objClone[key] = obj[key];
            }
          }
        }
      }
      return objClone;
    }

    /**
     * 动态设置页面title
     */
    Vue.prototype.$setPageTitle = function (title) {
      if (title) {
        document.title = title;
      }
    };
    /**
     * 根据数据流下载文件
     */
    Vue.prototype.downloadFileByFile = function (method, url, params, fileName) {
      this.$axios
        .post(
          url,
          { ...params },
          {
            responseType: "blob",
            headers: { token: window.localStorage.getItem("token") }
          }
        )
        .then(res => {
          if (["application/octet-stream", "application/vnd.ms-excel"].includes(res.data.type)) {
            let blob = new Blob([res.data], {
              type: "application/vnd.ms-excel;charset=utf-8"
            });
            let url = window.URL.createObjectURL(blob);
            let aLink = document.createElement("a");
            aLink.style.display = "none";
            aLink.href = url;
            aLink.setAttribute(
              "download",
              `${fileName}.xlsx`
            );
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
          } else {
            this.$message.error("下载失败");
          }
        });
    };

    /**
     * 根据连接下载文件
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

    // 全局导出之后到下载中心的提示
    const exportSuccessMsg = '数据生成中，请前往下载中心下载';
    Vue.prototype.$exportToast = () => {
      Message.success(exportSuccessMsg);
    };

    // 手机号正则（包含中间带****格式）
    Vue.prototype.$isPhone = isPhone;
  }

  /*------------------安装指令方法------------------*/
  installDirective(Vue) {
    // 点击间隔
    Vue.directive('throttle', {
      inserted(el, binding) {
        el.addEventListener('click', () => {
          el.style.pointerEvents = 'none';
          el.style.backgroundColor = "rgba(215, 215, 215, 1)"
          el.style.borderColor = "rgba(215, 215, 215, 1)"
          setTimeout(() => {
            el.style.pointerEvents = 'auto';
            el.style.backgroundColor = "#0964FF"
            el.style.borderColor = "#0964FF"
          }, binding.value || 1000);
        });
      }
    });

  }

  /*------------------安装mixin方法------------------*/
  installMixin(Vue) {

  }
}

export default new managePlugin();
