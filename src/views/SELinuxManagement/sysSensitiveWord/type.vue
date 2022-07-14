<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
        @inpChange="inpChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
      >
      </FormItem>
    </div>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
const checkwordName = [
  {
    required: true,
    trigger: ["blur", "change"],
    validator: (rule, value, callback) => {
      if (!value) callback(new Error(`请输入必填项`));
      const arr = value.split(",");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
          callback(new Error(`第${i + 1}个敏感词不能为空`));
          break;
        }
      }
      callback();
    }
  }
];
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSensitiveWord",
        list: "listSensitiveWordByPage",
        detele: "deleteSensitiveWord"
      },
      // 列表参数
      namespace: "sensitiveWord",
      //搜索框数据
      searchParam: {},
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "敏感词",
          key: "wordName",
          maxlength: 100,
          defaultValue: "",
          rules: checkwordName,
          placeholder: "添加多个敏感词，用英文“,”隔开"
        },
        {
          type: "uploadXlsx",
          key: "keywordFile",
          label: "上传敏感词文件",
          btnTxt: "批量添加",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个敏感词",
          isShow: false,
          accept: [
            "text/plain",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ],
          rules: [
            {
              required: true,
              message: "请上传敏感词文件或者添加敏感词",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "敏感词组",
          key: "groupIds",
          optionData: [],
          defaultValue: "",
          multiple: true,
          isShow: false,
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          defaultValue: "",
          maxlength: "100"
        }
      ],
      wordId: "",
      groupList: []
    };
  },
  computed: {
    renderTitle() {
      const { type } = this.$route.query;
      const str = "敏感词";
      return type === "create" ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt() {
      const { type } = this.$route.query;
      return type === "create" ? "新增" : "修改";
    },
    activeIndex() {
      return this.$route.query.activeIndex;
    }
  },
  mounted() {
    const { type, row, ID } = this.$route.query;
    if (type === "create") {
      this.listSensitiveWordGroup(); //请求敏感词组
      this._mxCreate();
    } else {
      this._mxEdit(JSON.parse(row), ID);
    }
  },
  methods: {
    inpChange({ val, item }) {
      if (item.key === "wordName") {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === "keywordFile");
        arr[i].rules = val
          ? null
          : [
              {
                required: true,
                message: "请上传敏感词文件或者添加敏感词",
                trigger: ["blur", "change"]
              }
            ];
        !arr[i].rules && this.$refs.formItem.clearValidateMore(["keywordFile"]);
      }
    },
    handleSuccess({ response, file, fileList, item }) {
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
        arr[i].defaultValue = file.raw;

        const delRuleIdx = arr.findIndex(v => v.key === "wordName");
        arr[delRuleIdx].rules = null;
        this.$refs.formItem.clearValidateMore(["wordName", "keywordFile"]);
      }
    },
    handleRemove({ file, fileList }) {
      const arr = this.formConfig;
      const i = arr.findIndex(v => v.key === "keywordFile");
      arr[i].defaultValue = "";
      arr[i].defaultFileList = [];

      const addRuleIdx = arr.findIndex(v => v.key === "wordName");
      arr[addRuleIdx].rules = checkwordName;
    },
    //敏感词组
    async listSensitiveWordGroup() {
      await this.$http.sysSensitiveWordGroup
        .listSensitiveWordGroup()
        .then(res => {
          if (res.code === 200) {
            this._setDefaultValue(
              this.formConfig,
              res.data,
              "groupIds",
              "groupId",
              "groupName"
            );
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    submit(form) {
      let params = {};
      // const { wordName, groupIds } = form;
      if (this.formTit == "新增") {
        // this.$http.sysSensitiveWord.checkSensitiveWord({ data: { wordName, groupIds } }).then(res => {
        // 判断敏感词是否存在
        // if (res.data === 1) {
        //   this.$message.error("敏感词已存在！");
        // } else {
        // params = { data: { ...form } };
        params = new FormData();
        for (let i in form) {
          params.append(i, form[i]);
        }
        this.$http.sysSensitiveWord.importKeywordModel(params).then(res => {
          if (resOk(res)) {
            this.$alert(res.data, "添加记录", {
              showClose: false,
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push({
                  path: "/sysSensitiveWord/index",
                  query: {
                    activeIndex: this.activeIndex
                  }
                });
                // window.history.back();
                this.$message.success("添加成功");
              }
            });
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
        // }
        // });
      } else {
        params = { data: { wordId: this.wordId, ...form } };
        this.$http.sysSensitiveWord.updateSensitiveWord(params).then(res => {
          if (resOk(res)) {
            this.$router.push({
              path: "/sysSensitiveWord/index",
              query: {
                activeIndex: this.activeIndex
              }
            });
            // window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "keywordFile") {
          this.$set(item, "isShow", false);
        }
        if (item.key === "groupIds") {
          this.$set(item, "isShow", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit(row) {
      this.wordId = row.wordId;
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
        if (item.key === "keywordFile") {
          this.$set(item, "isShow", true);
        }
        if (item.key === "groupIds") {
          this.$set(item, "isShow", true);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
      window.history.back();
    }
  }
};
</script>
