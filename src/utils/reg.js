 class Util {

  /**
   * 判断手机验证是否正确
   * @param {Number} phone
   */
  static isPoneAvailable(phone) {
    var myreg = /^1[3|4|5|6|7|8|9]\d{9}$/;
    if (!myreg.test(phone)) {
      return false;
    } else {
      return true;
    }
  }

 /**
   * 判断账户名称验证是否正确
   * @param {中文} name
   */
  static isNameChinese(name){
      var myreg =  /^[\u4e00-\u9fa5]{2,4}$/
      if (!myreg.test(name)) {
        return false;
      } else {
        return true;
      }
  }

  /**
   * 判断工号验证是否正确
   * @param {Number} userNunber
   */
  static isUserNunber(userNunber) {
    var myreg = /^\d{4,}$/;
    if (!myreg.test(userNunber)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * 判断密码验证是否正确
   * @param {String} password
   */
  static isPassword(password) {
    var myreg = /^(\w){6,20}$/;
    if (!myreg.test(password)) {
      return false;
    } else {
      return true;
    }
  }

    /**
   * 判断输入是否为数字
   * @param {Number} Number
   */
  static isNunber(Number) {
    var myreg = /^\d+(\.\d+)?$/;
    if (!myreg.test(Number)) {
      return false;
    } else {
      return true;
    }
  }


  /**
   * 判断输入是否为数字,字母，汉字，符号
   * @param {Number} Text
   */
  static isText(Text) {
    var myreg = /[\d]|&quot;|&lt;|&gt;|[\（\）\……\~\`\·\|\【\】\》\《\'\!\！\{\}\#\$\￥\%\^\&\*\(\)\[\]\:\;\：\；\\\‘\“\”\’\,\，\.\。\/\、\?\？\_\-\——\=\+]|@|/;
    if (!myreg.test(Text)) {
      return false;
    } else {
      return true;
    }
  }


     /**
   * 判断输入是否为数字,最多输入10位整数,保留小数点后三位
   * @param {Number} Number
   */
  static isNunberThree(Number) {
    var myreg = /^\d{1,10}(\.\d{1,3})?$/;
    if (!myreg.test(Number)) {
      return false;
    } else {
      return true;
    }
  }


 }
 
 export default Util