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
    }
  },
  mounted () {
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
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