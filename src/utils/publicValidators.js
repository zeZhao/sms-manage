// 手机号码验证(多个用逗号隔开)
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入必填项'));
  } else {
    if (value.indexOf('，') !== -1) callback(new Error('手机号只能用英文逗号分隔'));
    const reg = /^1\d{2}(\*|\d){4}\d{4}$/;
    const arr = value.split(',');
    const idx = arr.findIndex(v => !(reg.test(v)));
    idx === -1 ? callback() : arr[arr.length - 1] === '' && reg.test(arr[arr.length - 2]) ? callback() : callback(new Error(`第${idx + 1}个手机号格式不正确`));
  }
}
// 邮箱验证(多个用逗号隔开)
const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入必填项'));
  } else {
    if (value.indexOf('，') !== -1) callback(new Error('邮箱只能用英文逗号分隔'));
    const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    const arr = value.split(',');
    const idx = arr.findIndex(v => !(reg.test(v)));
    idx === -1 ? callback() : arr[arr.length - 1] === '' && reg.test(arr[arr.length - 2]) ? callback() : callback(new Error(`第${idx + 1}个邮箱格式不正确`));
  }
}

export default {
  phone: [
    // 手机号
    {
      required: true,
      trigger: 'blur',
      validator: validatePhone
    }
  ],
  email: [
    // 邮箱
    {
      required: true,
      trigger: 'blur',
      validator: validateEmail
    }
  ]
}