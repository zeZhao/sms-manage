<template>
  <!--敏感词-->
  <div class="sysSensitiveWord">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="wordName" label="敏感词" />
      <el-table-column prop="groupId" label="级别" />
      <el-table-column prop="groupName" label="敏感词组" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('wordId',scope.row.wordId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

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
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "敏感词",
          key: "wordName",
          placeholder: "请输入敏感词"
        },
        {
          type: "select",
          label: "敏感词组",
          key: "groupId",
          placeholder: "请选择敏感词组",
          optionData: []
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "敏感词",
          key: "wordName",
          maxlength: 50,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "敏感词组",
          key: "groupId",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark"
        }
      ],
      wordId: "",
      sysSensitiveWordGroup: []
    };
  },
  created() {
    this.listSensitiveWordGroup();
  },
  mounted() {},
  computed: {},
  methods: {
    //敏感词组
    async listSensitiveWordGroup() {
      await this.$http.sysSensitiveWordGroup
        .listSensitiveWordGroup({})
        .then(res => {
          const { code, data, msg } = res;
          this.sysSensitiveWordGroup = data;
          this._setDefaultValue(
            this.formConfig,
            data,
            "groupId",
            "groupId",
            "groupName"
          );
          this._setDefaultValue(
            this.searchFormConfig,
            data,
            "groupId",
            "groupId",
            "groupName"
          );
        });
    },
    submit(form) {
      let params = {};
      const { wordName, groupId } = form;
      this.$http.sysSensitiveWord
        .checkSensitiveWord({ data: { wordName, groupId } })
        .then(res => {
          //判断敏感词是否存在
          if (res.data === 1) {
            this.$message.error("敏感词存在！");
          } else {
            if (this.formTit == "新增") {
              params = {
                data: {
                  ...form
                }
              };
              this.$http.sysSensitiveWord.addSensitiveWord(params).then(res => {
                if (resOk(res)) {
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
                  wordId: this.wordId,
                  ...form
                }
              };
              this.$http.sysSensitiveWord
                .updateSensitiveWord(params)
                .then(res => {
                  if (resOk(res)) {
                    this.$message.success(res.msg || res.data);
                    this._mxGetList();
                    this.addChannel = false;
                  } else {
                    this.$message.error(res.data || res.msg);
                  }
                });
            }
          }
        });
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.wordId = row.wordId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
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
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSensitiveWord {
}
</style>
