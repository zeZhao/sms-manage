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
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        callback();
        // callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysProvinceRoute",
        list: "listProvinceRouteByPage",
        detele: "deleteProvinceRoute"
      },
      // 列表参数
      namespace: "provinceRoute",
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
          type: "select",
          label: "省份",
          key: "province",
          placeholder: "请选择省份",
          optionData: []
        },
        {
          type: "inputNum",
          label: "移动通道",
          key: "cm"
        },
        {
          type: "inputNum",
          label: "联通通道",
          key: "cu"
        },
        {
          type: "inputNum",
          label: "电信通道",
          key: "ct"
        },
        // {
        //   type: "select",
        //   label: "运营商",
        //   key: "operator",
        //   placeholder: "请选择运营商",
        //   optionData: [
        //     { key: "1", value: "移动" },
        //     { key: "2", value: "联通" },
        //     { key: "3", value: "电信" }
        //   ]
        // },
        // {
        //   type: "select",
        //   label: "通道号",
        //   key: "route",
        //   optionData: []
        // },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   placeholder: "请选择类型",
        //   optionData: [
        //     { key: "1", value: "特服号" },
        //     { key: "2", value: "账户编号" },
        //     { key: "3", value: "商户编号" }
        //   ]
        // }
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
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }],
          placeholder: "选择账户后自动识别"
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   optionData: [
        //     { key: 1, value: "特服号" },
        //     { key: 2, value: "账户编号" },
        //     { key: 3, value: "商户编号" }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ct",
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        },
        // {
        //   type: "textarea",
        //   label: "备注信息",
        //   key: "remark",
        //   maxlength: 300,
        //   rules: [{ trigger: ['blur', 'change'], validator: validatorRemark }]
        // }
      ],
      routeId: "",
      ProvinceList: [], //省列表
      GatewayList: [], //通道列表
      isChooseUser: false,
      isOpen: false,
      title: "批量修改通道",
      isOpen1: false,
      title1: "批量添加分省路由"
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '分省路由';
      return type === 'create' ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt () {
      const { type } = this.$route.query;
      return type === 'create' ? '新增' : '修改';
    }
  },
  mounted () {
    this.gateways();
    this.gateway("cu", "2", "1");
    this.gateway("ct", "3", "1");
    this.gateway("cm", "1", "1");
    this.listSysProvince();
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    //提交批量添加
    batchSubmit1 () {
      this.isOpen1 = false;
      this._mxGetList();
    },
    //关闭弹窗
    cancelBatch1 () {
      this.isOpen1 = false;
    },
    //批量添加
    batchAddition () {
      this.isOpen1 = true;
    },

    //提交批量修改
    batchSubmit (form) {
      this.$axios.post('/sysProvinceRoute/updateBatchProvinceRoutes', form).then(res => {
        if (res.data.code === 200) {
          this.isOpen = false;
          this.$message.success("修改成功");
          this._mxGetList();
        } else {
          this.$message.error(res.data.data || res.data.msg);
        }
      })
    },
    //关闭弹窗
    cancelBatch () {
      this.isOpen = false;
    },
    //批量修改
    batchModification () {
      this.isOpen = true;
    },
    //导出
    exportData (data) {
      this.$axios.post('/sysProvinceRoute/exportProvinceRoute', { data }).then(res => {
        if (res.data.code === 200) this.$exportToast();
      })
    },
    exportExe () {
      this.$refs.Search.handleExport();
    },
    gateways () {
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
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "route") {
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
      });
    },
    /*
     * 获取省份列表
     * */
    listSysProvince () {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this.ProvinceList = res.data;
        res.data.forEach(item => {
          if (item.provinceId === 0) {
            item.provinceId = "0";
          }
        });
        res.data.shift();
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "province",
          "provinceId",
          "provinceName"
        );
        //province
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "province",
          "provinceId",
          "provinceName"
        );
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
        this.$http.sysProvinceRoute.addProvinceRoute(params).then(res => {
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
        this.$http.sysProvinceRoute.updateProvinceRoute(params).then(res => {
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
      this.formConfig.forEach(item => {
        if (item.key === 'userId') {
          this.$set(item, "btnDisabled", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit (row) {
      this.routeId = row.routeId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            if (row[key] === 0) {
              this.$set(item, "defaultValue", "0");
            } else if (row[key] === "-") {
              this.$set(item, "defaultValue", "");
            } else {
              this.$set(item, "defaultValue", row[key]);
            }
          }
        }
        if (item.key === 'userId') {
          this.$set(item, "btnDisabled", true);
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
    /*
     * 表格数据处理
     * */
    _mxFormListData (list) {
      list.forEach(item => {
        item.province &&
          this.ProvinceList.forEach(t => {
            if (item.province == t.provinceId) {
              this.$set(item, "provinceName", t.provinceName);
              // item.province = t.provinceName;
            }
          });
      });
      return list;
    }
  }
};
</script>