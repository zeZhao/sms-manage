<template>
  <!--敏感词组-->
  <div class="sysSensitiveWordGroup">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData" max-height="500"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="groupId" label="编号" />
      <el-table-column prop="groupName" label="类别名称" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem(
                'groupId',
                scope.row.groupId,
                true,
                false,
                '当前类别下有敏感词信息，请删除此类别下的敏感词后再删除此类别'
              )
            "
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
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
        namespace: "sysSensitiveWordGroup",
        list: "listKeyWordGroupByPage",
        detele: "deleteSensitiveWordGroup"
      },
      // 列表参数
      namespace: "keyWordGroup",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        // {
        //   type: "inputNum",
        //   label: "敏感词组编号",
        //   key: "groupId",

        //   placeholder: "请输入类别编号"
        // },
        {
          type: "input",
          label: "类别名称",
          key: "groupName"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "敏感词组",
          maxlength: 30,
          key: "groupName",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" }, 
            {
              min: 2,
              max: 30,
              trigger: "blur",
              message: '长度在 2 到 30 个字符',
            }]
        }
      ],
      groupId: ""
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submit(form) {
      let params = {};
      const { groupName } = form;
      this.$http.sysSensitiveWordGroup
        .checkSensitiveWordGroup({ data: { groupName, groupId: this.groupId } })
        .then(res => {
          if (res.data === 1) {
            this.$message.error("敏感词类别存在！");
          } else {
            if (this.formTit == "新增") {
              params = {
                data: {
                  ...form
                }
              };
              this.$http.sysSensitiveWordGroup
                .addSensitiveWordGroup(params)
                .then(res => {
                  if (resOk(res)) {
                    this.$message.success(res.msg || res.data);
                    this._mxGetList();
                    this.addChannel = false;
                  } else {
                    this.$message.error(res.msg || res.data);
                  }
                });
            } else {
              params = {
                data: {
                  groupId: this.groupId,
                  ...form
                }
              };
              this.$http.sysSensitiveWordGroup
                .updateSensitiveWordGroup(params)
                .then(res => {
                  if (resOk(res)) {
                    this.$message.success(res.msg || res.data);
                    this._mxGetList();
                    this.addChannel = false;
                  } else {
                    this.$message.error(res.msg || res.data);
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
      this.groupId = row.groupId;
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
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSensitiveWordGroup {
}
</style>
