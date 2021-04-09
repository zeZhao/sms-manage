/* 

    表单常用正则

*/
// 手机号码验证
export const phone = (rule, value, callback) => {
  let regex = new RegExp("^(1[3-9][0-9]{9})$");
  if (value) {
    if (!regex.test(value)) {
      callback(new Error("手机号码有误，请重填"));
    } else {
      callback();
    }
  } else {
    callback();
  }

};
// 手机号码与电话验证
export const phoneTell = (rule, value, callback) => {
  let regex = new RegExp("^(1[3-9][0-9]{9})$");
  let regex1 = new RegExp("^\d{3}-\d{8}|\d{4}-\d{7}$");
  if (value) {
    // if (regex.test(value) || regex1.test(value)) {
    //   callback();
    // } else {
    //   callback(new Error("联系号码有误，请重填"));
    // }
    if (value.length == 11) {
      if (!regex.test(value)) {
        callback(new Error("手机号码有误，请重填"));
      } else {
        callback();
      }
    } else if (value.length == 13 && value.indexOf("-") != -1) {
      if (!regex1.test(value)) {
        callback(new Error("联系号码有误，请重填"));
      } else {
        callback();
      }
    } else {
      callback(new Error("请输入正确的格式"));
    }
  } else {
    callback();
  }

};
// 密码验证
export const password = (rule, value, callback) => {
  let regex = new RegExp("^[\d0-9a-zA-Z!@#$%^&*~=+-]{8,16}$");
  if (value) {
    if (!regex.test(value)) {
      callback(new Error("密码为8-16位，数字、字母、英文符号"));
    } else {
      callback();
    }
  } else {
    callback();
  }

};
// 中文、英文、数字字符验证
export const character = (rule, value, callback) => {
  let regex = new RegExp("^[\u4E00-\u9FA5A-Za-z0-9]+$");
  if (value) {
    if (!regex.test(value)) {
      callback(new Error("仅支持中文、英文、数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }

};
// 英文、数字字符验证
export const character1 = (rule, value, callback) => {
  let regex = new RegExp("^[A-Za-z0-9]+$");
  if (value) {
    if (!regex.test(value)) {
      callback(new Error("仅支持英文、数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }

};

// 大于0的正整数
export const positiveInteger = (rule, value, callback) => {
  let regex = new RegExp("^[1-9]\d*$");
  if (value === "") {
    callback(new Error("此项不能为空"));
  } else {
    if (!regex.test(value)) {
      callback(new Error("此项应为正整数"));
    } else {
      callback();
    }
  }
};
