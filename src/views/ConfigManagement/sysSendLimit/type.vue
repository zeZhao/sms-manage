<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"
        @choose="choose"></FormItem>
    </div>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data () {
    const validatorSign = (rule, value, callback) => {
      if (!value) callback(new Error('请输入必填项'));
      if (!(/^\+?[1-9]\d*$/.test(value))) callback(new Error('请输入大于0的正整数'));
      callback();
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSendLimit",
        list: "listSendLimitByPage",
        detele: "deleteSendLimit"
      },
      // 列表参数
      namespace: "sendLimit",
      //搜索框数据
      searchParam: {
        userId: ""
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          placeholder: "选择账户后自动识别",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "生效对象",
          key: "userType",
          initDefaultValue: 1,
          defaultValue: 1,
          disabled: false,
          optionData: [
            { key: 1, value: '账户编号' },
            { key: 0, value: '商户编号' }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "上限类型",
          key: "limitType",
          initDefaultValue: "",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "相同内容相同手机号"
            },
            {
              key: 2,
              value: "相同手机号"
            },
            {
              key: 3,
              value: "同CID同手机号"
            }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "上限",
          key: "count",
          maxlength: 4,
          defaultValue: "",
          rules: [
            {
              required: true,
              validator: validatorSign,
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "天数",
          key: "timeLimit",
          initDefaultValue: "",
          defaultValue: "",
          optionData: [
            { key: 1, value: 1 },
            { key: 2, value: 2 },
            { key: 3, value: 3 },
            { key: 4, value: 4 },
            { key: 5, value: 5 },
            { key: 6, value: 6 },
            { key: 7, value: 7 }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change"
            }
          ]
        }
      ],
      limitId: "",
      isChooseUser: false
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '发送上限配置';
      return type === 'create' ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt () {
      const { type } = this.$route.query;
      return type === 'create' ? '新增' : '修改';
    }
  },
  mounted () {
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    //选择用户选取赋值
    chooseUserData (data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
      });
    },
    submit (form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysSendLimit.addSendLimit(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            if (res.code === 1099) {
              this.$alert('已为此商户/账户配置了发送上限，请重新选择', '提示', {
                confirmButtonText: '确定',
                callback: action => { }
              });
              return;
            }
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          data: {
            limitId: this.limitId,
            ...form
          }
        };
        this.$http.sysSendLimit.updateSendLimit(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    _mxCreate () {
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
        if (item.key === "userType") {
          this.$set(item, "disabled", false);
          this.$set(item, "initDefaultValue", 1);
          this.$set(item, "defaultValue", 1);
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit (row) {
      this.limitId = row.limitId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
          if (item.key === "userType") {
            this.$set(item, "disabled", true);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel () {
      this.addChannel = false;
      window.history.back();
    }
  }
};
</script>