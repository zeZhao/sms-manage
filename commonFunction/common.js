//1.引入vue
import Vue from 'vue';
//2.新创建一个vue实例
let v = new Vue();
export default{
  randomNum(){
    // 0-9的随机数
    var arr = [];//容器
    for(var i =0;i<16;i++){//循环七次
      var num = Math.random()*9;//Math.random();每次生成(0-1)之间的数;
      num = parseInt(num,10);
      arr.push(num);
    }
    return arr.join('')
  },
  getTime(){
    //new Date() new一个data对象，当前日期和时间
    //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
    return Date.parse(new Date())/1000
  },

}
