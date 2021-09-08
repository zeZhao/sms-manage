/* 

    表单常用正则

*/
//手机号码验证1
export const isPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入必填项"));
  }
  /^1[3-9]\d{9}$/.test(value) ? callback() : callback(new Error("手机号码有误，请重填"));
};

// 手机号码验证2
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

// 固定电话座机或者手机号的正则
export const checkFixedPhoneOrPhone = (rule, value, callback) => {
  if (value) {
    const regFixedPhone = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
    const regPhone = /^1[3-9]\d{9}$/;
    if (regFixedPhone.test(value) || regPhone.test(value)) {
      callback();
    } else {
      callback(new Error("请输入正确的手机号码或座机号码"));
    }
  } else {
    callback(new Error("请输入手机号码或座机号码"));
  }
};

// 限制菜单名称
export const limitMenuName = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入必填项'));
  } else {
    if (value.length < 2 || value.length > 8) {
      callback(new Error('菜单名称长度限制为2~8个'));
    } else {
      const reg = /^[\u4e00-\u9fa5]+$/i;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('菜单名称仅支持输入汉字'));
      }
    }
  }
};

// 限制菜单名称
export const limitMenuPath = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入必填项'));
  } else {
    if (value.length > 100) {
      callback(new Error('菜单路径长度限制为100以内'));
    } else {
      const reg = /^[a-zA-Z\/\d]+$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('菜单路径仅支持英文字母、“/”符号以及正整数'));
      }
    }
  }
};

// 限制排序大小
export const limitMenuSort = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入必填项'));
  } else {
    if (value > 100) {
      callback(new Error('排序最大值为100'));
    } else {
      if ((value + '').indexOf('.') !== -1) {
        callback(new Error('排序不可以输入小数'));
      } else {
        callback();
      }
    }
  }
};