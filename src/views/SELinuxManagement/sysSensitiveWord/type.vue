<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"
        @choose="choose" @onChange="onChange" @handleSuccess="handleSuccess" @handleRemove="handleRemove">
      </FormItem>
    </div>
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
          disabled: false,
          rules: [
            {
              required: true,
              trigger: ['blur', 'change'],
              validator: (rule, value, callback) => {
                const arr = value.split(',');
                for (let i = 0; i < arr.length; i++) {
                  if (arr[i] === '') {
                    callback(new Error(`第${i + 1}个敏感词不能为空`));
                    break;
                  }
                  if (arr[i].length < 2 || arr[i].length > 8) {
                    callback(new Error(`第${i + 1}个敏感词长度应在2~8个字符之间`));
                    break;
                  }
                }
                callback();
              }
            }
          ],
          placeholder: "2-8个字符，添加多个敏感词，用英文“,”隔开"
        },
        {
          type: "uploadXlsx",
          key: "mobileFileUrl",
          label: "上传敏感词文件",
          btnTxt: "批量添加",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个敏感词",
          isShow: false,
          accept: ["text/plain", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
          rules: [{ required: true, message: "请上传敏感词文件或者添加敏感词", trigger: ['blur', 'change'] }]
        },
        {
          type: "select",
          label: "敏感词组",
          key: "groupId",
          optionData: [],
          multiple: true,
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          maxlength: "100"
        }
      ],
      wordId: "",
      groupList: []
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '敏感词';
      return type === 'create' ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt () {
      const { type } = this.$route.query;
      return type === 'create' ? '新增' : '修改';
    }
  },
  mounted () {
    this.listSensitiveWordGroup();
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    onChange ({ val, item }) {
      if (item.key === "wordName") {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === "mobileFileUrl");
        arr[i].rules = val ? null : [{ required: true, message: "请上传敏感词文件或者添加敏感词", trigger: ['blur', 'change'] }];
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
    //敏感词组
    async listSensitiveWordGroup () {
      await this.$http.sysSensitiveWordGroup.listSensitiveWordGroup().then(res => {
        const { code, data, msg } = res;
        this._setDefaultValue(this.formConfig, data, "groupId", "groupId", "groupName");
      });
    },
    submit (form) {
      let params = {};
      const { wordName, groupId } = form;
      if (this.formTit == "新增") {
        this.$http.sysSensitiveWord.checkSensitiveWord({ data: { wordName, groupId } }).then(res => {
          //判断敏感词是否存在
          if (res.data === 1) {
            this.$message.error("敏感词存在！");
          } else {
            params = { data: { ...form } };
            this.$http.sysSensitiveWord.addSensitiveWord(params).then(res => {
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
        });
      } else {
        params = { data: { wordId: this.wordId, ...form } };
        this.$http.sysSensitiveWord.updateSensitiveWord(params).then(res => {
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
        if (item.key == "wordName") {
          this.$set(item, "disabled", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit (row) {
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
        if (item.key == "wordName") {
          this.$set(item, "disabled", true);
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