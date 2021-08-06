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
      if (!value) {
        callback(new Error("请输入必填项"));
      } else {
        if (value.indexOf('，') !== -1) callback(new Error("只可以用英文 ',' 分割"));
        const reg = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,8}$/;
        const data = value.split(",");
        for (let i = 0; i < data.length; i++) {
          if (!(reg.test(data[i]))) {
            callback(new Error("输入2-8位，只能输入中文、英文、数字"));
            break;
          }
        }
        callback();
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSignRoute",
        list: "listSignRouteByPage",
        detele: "deleteSignRoute"
      },
      // 列表参数
      namespace: "signRoute",
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
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          placeholder: "请输入签名"
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "特服号"
        //     },
        //     {
        //       key: 2,
        //       value: "账户编号"
        //     },
        //     {
        //       key: 3,
        //       value: "商户编号"
        //     }
        //   ],
        //   placeholder: "请选择类型"
        // },
        {
          type: "inputNum",
          label: "移动通道",
          key: "cm",
          placeholder: "请输入移动通道"
        },
        {
          type: "inputNum",
          label: "联通通道",
          key: "cu",
          placeholder: "请输入联通通道"
        },
        {
          type: "inputNum",
          label: "电信通道",
          key: "ct",
          placeholder: "请输入电信通道"
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
          // change: this.selectUser,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "textarea",
          label: "签名",
          key: "sign",
          placeholder: "可输入多个签名，用英文“,”隔开，每个签名2-8个字符，支持汉字、数字、英文",
          maxlength: "100",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            },
            {
              trigger: ['blur', 'change'],
              validator: validatorSign
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   initDefaultValue: 2,
        //   defaultValue: 2,
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "特服号"
        //     },
        //     {
        //       key: 2,
        //       value: "账户编号"
        //     },
        //     {
        //       key: 3,
        //       value: "商户编号"
        //     }
        //   ]
        // },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ct",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        }
      ],
      routeId: "",
      GatewayList: [], // 通道列表
      isChooseUser: false
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '签名路由';
      return type === 'create' ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt () {
      const { type } = this.$route.query;
      return type === 'create' ? '新增' : '修改';
    }
  },
  mounted () {
    this.gateway("cu", "2", "1");
    this.gateway("ct", "3", "1");
    this.gateway("cm", "1", "1");
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
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    /*
     * 获取通道列表
     * */
    gateway (keys, status, orderStatus) {
      const params = {
        data: {
          status: status,
          orderStatus: orderStatus
        }
      };
      this.$http.sysGatewayGroup.listGatewayAndGroup(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.name);
              item.optionData.push(t);
            });
          }
        });
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
        this.$http.sysSignRoute.addSignRoute(params).then(res => {
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
        this.$http.sysSignRoute.updateSignRoute(params).then(res => {
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
          item.btnDisabled = false;
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
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "userId") {
          item.btnDisabled = true;
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