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
    // const validatorSign = (rule, value, callback) => {
    //   let regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,8}$/;
    //   if (value == "") {
    //     callback(new Error("客户签名不能为空"));
    //   } else {
    //     if (!regex.test(value)) {
    //       callback(new Error("输入2-8个字符，只能输入中文、英文、数字"));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    // const validatorRemark = (rule, value, callback) => {
    //   let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
    //   if (value == "") {
    //     callback();
    //     // callback(new Error("备注信息不能为空"));
    //   } else {
    //     if (!regex.test(value)) {
    //       callback(new Error("支持汉字/数字/字母/标点符号"));
    //     } else {
    //       callback();
    //     }
    //   }
    // };
    const validatorCode = (rule, value, callback) => {
      if (value) {
        if (/^\d{1,12}$/.test(value)) {
          callback();
        } else {
          callback(new Error("通道特服号只能为正整数且最大长度为12位"));
        }
      } else {
        callback();
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSecondaryRoute",
        list: "listSecondaryRouteByPage",
        detele: "deleteInterfaceSign"
      },
      // 列表参数
      namespace: "secondaryRoute",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "账户签名",
          key: "sign"
        },
        {
          type: "inputNum",
          label: "账户特服号",
          key: "code"
        },
        {
          type: "inputNum",
          label: "通道特服号",
          key: "gwcode",
          placeholder: "请输入通道特服号"
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
          defaultValue: "",
          btnDisabled: false,
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "客户特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          isShow: true,
          disabled: true,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "通道编号",
          key: "gateway",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "通道特服号",
          key: "gwcode",
          defaultValue: "",
          maxlength: "12",
          rules: [
            { required: false, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorCode }
          ]
        },

        {
          type: "input",
          label: "账户签名",
          key: "sign",
          defaultValue: "",
          maxlength: "100",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            // { trigger: "blur", validator: validatorSign }
          ]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark",
          maxlength: "300",
          // rules: [{ trigger: "blur", validator: validatorRemark }]
        }
      ],
      routeId: "",
      isChooseUser: false
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '二次路由配置';
      return type === 'create' ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt () {
      const { type } = this.$route.query;
      return type === 'create' ? '新增' : '修改';
    }
  },
  mounted () {
    this.gateway();
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    sum (num1, num2) {
      if (num2 > 100) {
      }
    },
    gateway () {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;

          if (key === "gateway") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    //选择用户选取赋值
    chooseUserData (data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
        if (key === "userName") {
          t.defaultValue = data.userName;
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
        this.$http.sysSecondaryRoute.addSecondaryRoute(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSecondaryRoute.updateSecondaryRoute(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    _mxCreate () {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
    },
    _mxEdit (row) {
      this.routeId = row.routeId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === key && (row[key] === "-" || !row[key])) {
            this.$set(item, "defaultValue", "");
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
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
    },
    //修改表格数据
    _mxFormListData (data) {
      data.forEach(item => {
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    }
  }
};
</script>