<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"
        @choose="choose" @onChange="onChange"></FormItem>
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
      // let regex = new RegExp("^([0]|[1-9][0-9]*)$");
      // if (value === "") {
      //   callback(new Error("此项不能为空"));
      // } else {
      //   if (!regex.test(value)) {
      //     callback(new Error("请输入不超过100的数字"));
      //   } else {
      //     if (value > 100 || value < 0) {
      //       callback(new Error("请输入不超过100的数字"));
      //     } else {
      //       callback();
      //     }
      //   }
      // }
      if (!value && value !== 0) {
        callback(new Error('请输入必填项'));
      } else {
        if (value == 100) {
          callback();
        }
        const reg = new RegExp("^([1-9]|[1-9][0-9])$");
        reg.test(value) ? callback() : callback(new Error("请输入大于0且不超过100的整数"));
      }
    };
    const validatorTemplate = (rule, value, callback) => {
      if (value) {
        let firstStr = value.substring(0, 1);
        let lastStr = value.substring(value.length, value.length - 1);
        if (firstStr === "," || lastStr === ",") {
          callback(new Error('不能以“,”为开头或者结尾'));
        } else {
          callback();
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
        namespace: "corpUserOptimize",
        list: "queryByPage",
        detele: "delete"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId"
        },
        {
          type: "input",
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
          label: "特服号",
          key: "code"
        },
        {
          type: "input",
          label: "不优化词",
          key: "noOptimizeTemplate"
        },
        {
          type: "input",
          label: "优化词",
          key: "optimizeTemplate"
        },
        {
          type: "select",
          label: "优化类型",
          optionData: [
            { key: "1", value: "正常" },
            { key: "2", value: "对比库" }
          ],
          key: "optimizeType"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
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
          type: "select",
          label: "优化类型",
          // initDefaultValue: 1,
          // defaultValue: 1,
          key: "optimizeType",
          optionData: [
            {
              key: 1,
              value: "正常"
            },
            {
              key: 2,
              value: "对比库"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "优化比例",
          key: "optimizePercent",
          specialSymbols: "%",
          rules: [
            {
              required: true,
              validator: validatorSign,
              trigger: "blur"
            }
          ]
        },
        {
          type: "textarea",
          label: "不优化关键词",
          key: "noOptimizeTemplate",
          maxlength: 200,
          placeholder: "请输入模板内容，多条内容请用英文“,”隔开",
          rules: [
            // { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "change",
              validator: validatorTemplate
            }
          ]
        },
        {
          type: "textarea",
          label: "优化关键词",
          key: "optimizeTemplate",
          maxlength: 200,
          placeholder: "请输入模板内容，多条内容请用英文“,”隔开",
          rules: [
            // { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "change",
              validator: validatorTemplate
            }
          ]
        },
        {
          type: "time",
          label: "开始时间",
          key: "startTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "time",
          label: "结束时间",
          key: "endTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: "",
      isChooseUser: false,
      isParamsNotData: false
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '优化比例配置';
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
    onChange ({ val, item }) {
      let time;
      if (item.key === "startTime") {
        time = { selectableRange: val ? `${val} - 23:59:59` : '' };
        this.formConfig[this.formConfig.length - 1].pickerOptions = time;
      } else if (item.key === "endTime") {
        time = { selectableRange: val ? `00:00:00 - ${val}` : '' };
        this.formConfig[this.formConfig.length - 2].pickerOptions = time;
      }
    },
    /**
     * 删除列表中项目
     * @param id
     * @private
     */
    _mxDeleteItem (key, id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, "您确定要删除此项吗？")
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        const params = {};
        params[key] = id.toString();
        const { namespace, detele } = this.searchAPI;
        this.$http[namespace][detele](params).then(res => {
          if (resOk(res)) {
            this.$message.info("删除成功！");
            this._mxGetList();
          } else {
            this.$message.info("删除失败！");
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
    edit (row) {
      this.id = row.id;
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
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },

    submit (form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then(res => {
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
          id: this.id,
          ...form
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then(res => {
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
    create () {
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
    cancel () {
      this.addChannel = false;
      window.history.back();
    }
  }
};
</script>