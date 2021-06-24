<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"
        @choose="choose" @onChange="onChange" @handleSuccess="handleSuccess" @handleRemove="handleRemove"></FormItem>
    </div>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { isPhone } from "@/utils/validator";
export default {
  mixins: [listMixin],
  data () {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysRedList",
        list: "listRedListByPage",
        detele: "deleteSysRedList"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "inputNum",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "select",
        //   label: "账号类型",
        //   initDefaultValue: 1,
        //   defaultValue: 1,
        //   key: "codeType",
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "用户"
        //     },
        //     {
        //       key: 2,
        //       value: "特服号"
        //     }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "textarea",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          maxlength: "100",
          placeholder: "可输入多个手机号，用英文“,”隔开",
          rules: [
            { required: true, message: "请添加手机号或者上传手机号文件", trigger: "blur" },
            { validator: this.$publicValidators.phone[0]["validator"], trigger: "change" }
          ]
        },
        {
          type: "uploadXlsx",
          key: "mobileFileUrl",
          label: "上传手机号文件",
          isShow: false,
          btnTxt: "批量添加",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个手机号",
          accept: ["text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
          rules: [{ required: true, message: "请上传手机号文件或者添加手机号", trigger: ['blur', 'change'] }]
        },
        // {
        //   type: "select",
        //   label: "优化类型",
        //   initDefaultValue: 2,
        //   defaultValue: 2,
        //   key: "type",
        //   optionData: [
        //     // {
        //     //   key: 1,
        //     //   value: "不优化"
        //     // },
        //     {
        //       key: 2,
        //       value: "特定通道"
        //     }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "通道编号",
          key: "gateway",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        }
      ],
      redId: "",
      isChooseUser: false
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '红名单配置';
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
    onChange ({ val, item }) {
      if (item.key === "mobile") {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === "mobileFileUrl");
        arr[i].rules = val ? null : [{ required: true, message: "请上传手机号文件或者添加手机号", trigger: ['blur', 'change'] }];
        !arr[i].rules && this.$refs.formItem.clearValidateMore(['mobileFileUrl']);
      }
    },
    handleSuccess ({ response, file, fileList, item }) {
      if (response.code !== 200) {
        this.$message.error(response.data || response.msg);
        return;
      }
      const { accept, tip, key } = item;
      const { type } = file.raw;
      if (Array.isArray(accept) && accept.length) {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === key);
        if (accept.indexOf(type) === -1) {
          this.$message.error(tip);
          arr[i].defaultValue = "";
          arr[i].defaultFileList = [];
          return;
        }
        arr[i].defaultValue = response.data;

        const delRuleIdx = arr.findIndex(v => v.key === "mobile");
        arr[delRuleIdx].rules = null;
        this.$refs.formItem.clearValidateMore(['mobile', 'mobileFileUrl']);
      }
    },
    handleRemove ({ file, fileList }) {
      const arr = this.formConfig;
      const i = arr.findIndex(v => v.key === "mobileFileUrl");
      arr[i].defaultValue = "";
      arr[i].defaultFileList = [];

      const addRuleIdx = arr.findIndex(v => v.key === "mobile");
      arr[addRuleIdx].rules = [
        { required: true, message: "请添加手机号或者上传手机号文件", trigger: "blur" },
        { validator: this.$publicValidators.phone[0]["validator"], trigger: "change" }
      ];
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
        // this.searchFormConfig.forEach(item => {
        //   const { key } = item;
        //   if (key === "gateway") {
        //     res.data.forEach(t => {
        //       this.$set(t, "key", t.gatewayId);
        //       this.$set(t, "value", t.gateway);
        //       item.optionData.push(t);
        //     });
        //   }
        // });
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
    _mxEdit (row) {
      this.redId = row.redId;
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
        if (item.key === "mobile") {
          item.rules = [{ required: true, validator: isPhone, trigger: "change" }];
        }
        if (item.key === "mobileFileUrl") {
          item.isShow = true;
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },

    submit (form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysRedList.addSysRedList(params).then(res => {
          if (resOk(res)) {
            this.$alert(res.msg, '添加记录',
              {
                showClose: false,
                confirmButtonText: '确定',
                callback: action => {
                  window.history.back();
                  this.$message.success('添加成功')
                }
              }
            )
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            redId: this.redId,
            ...form
          }
        };
        this.$http.sysRedList.updateSysRedList(params).then(res => {
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
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
        if (item.key === "mobile") {
          item.rules = [
            { required: true, message: "请添加手机号或者上传手机号文件", trigger: "blur" },
            { validator: this.$publicValidators.phone[0]["validator"], trigger: "change" }
          ];
        }
        if (item.key === "mobileFileUrl") {
          item.defaultValue = "";
          item.defaultFileList = [];
          item.isShow = false;
          item.rules = [{ required: true, message: "请上传手机号文件或者添加手机号", trigger: ['blur', 'change'] }];
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
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