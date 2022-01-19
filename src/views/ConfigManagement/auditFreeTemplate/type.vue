<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @getFormData="getFormData"
      >
        <div slot="Other">
          <el-button
            style="float: left; margin-left: 60%"
            size="small"
            @click="handleCheckTemplate"
            >内容检测
          </el-button>
        </div>
      </FormItem>
    </div>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancel"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      isPage: true,
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "smsCheckTemplate",
        // list: "listCheckTemplateByPage",
        // detele: "deleteCheckTemplate",
        add: "addCheckTemplate",
        edit: "updateTemplate"
      },
      // 列表参数
      namespace: "checkTemplate",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "特服号",
          key: "code"
        },
        {
          type: "input",
          label: "模板信息",
          key: "template"
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
          // change: this.selectUser,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          initDefaultValue: "2",
          defaultValue: "2",
          optionData: [
            // {
            //   key: "1",
            //   value: "特服号"
            // },
            {
              key: "2",
              value: "账户编号"
            },
            {
              key: "3",
              value: "商户编号"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "匹配类型",
          key: "matchType",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "正常发送"
            },
            {
              key: 2,
              value: "拦截"
            }
          ],
          rules: [
            { required: true, message: "请选择必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "是否公用",
          key: "isShared",
          initDefaultValue: 0,
          defaultValue: 0,
          optionData: [
            {
              key: 0,
              value: "不公用"
            },
            {
              key: 1,
              value: "公用"
            }
          ],
          rules: [
            { required: true, message: "请选择必填项", trigger: "change" }
          ]
        },
        {
          type: "textarea",
          label: "模板信息",
          key: "template",
          maxlength: 300,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "审核内容",
          key: "content",
          maxlength: 300
        }
      ],
      isChooseUser: false
    };
  },
  computed: {
    renderTitle() {
      const { type } = this.$route.query;
      const str = "免审核模板";
      return type === "create" ? `新增${str}` : `修改${str}`;
    }
  },
  mounted() {
    const { type, row, ID } = this.$route.query;
    type === "create" ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    handleCheckTemplate() {
      this.$refs.formItem.renderFormData();
    },
    getFormData(formData) {
      const { template, content } = formData;
      if (!template) {
        this.$message.warning("模板信息不能为空");
        return;
      }
      if (!content) {
        this.$message.warning("审核内容不能为空");
        return;
      }
      this.$http.smsCheckTemplate
        .checkTemplate({ template, content })
        .then(res => {
          if (res.code === 200) {
            res.data
              ? this.$message.success("模板匹配成功")
              : this.$message.error("模板匹配失败");
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig[0].btnDisabled = false;
    },
    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
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
    //显示选择用户弹窗
    choose() {
      this.isChooseUser = true;
    },
    //关闭选择用户弹窗
    cancel(val) {
      this.isChooseUser = val;
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      data.status = 4;
      return data;
    }
  }
};
</script>
