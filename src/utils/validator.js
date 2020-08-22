/* 

    表单常用正则

*/
// 手机号码验证
export const phone = (rule, value, callback) => {
  let regex = new RegExp("^1[3456789]\d{9}$");
  if (value === "") {
    callback(new Error("此项不能为空"));
  } else {
    if (!regex.test(value)) {
      callback(new Error("手机号码有误，请重填"));
    } else {
      callback();
    }
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
