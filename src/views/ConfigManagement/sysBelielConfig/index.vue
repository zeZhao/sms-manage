<template>
  <!--红名单管理-->
  <div class="sysBelielConfig">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="corporateId" label="企业/代理ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="optimizeType" label="优化类型">
        <template slot-scope="scope">
          <span>{{ scope.row.codeType === 1 ? "正常" : "对比库" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gateway" label="优化比例" />
      <el-table-column prop="gateway" label="不优化关键词" />
      <el-table-column label="操作" width="200"
        >1458
        <template slot-scope="scope">
          <el-button @click="edit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('id', scope.row.id)"
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
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
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
        namespace: "corpUserOptimize",
        list: "queryByPage",
        detele: "delete",
      },
      // 列表参数
      namespace: "corpUserOptimize",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corporateId",
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
        },
        {
          type: "input",
          label: "用户特服号",
          key: "code",
        },
        {
          type: "input",
          label: "不优化关键词",
          key: "noOptimizeTemplate",
        },
        {
          type: "select",
          label: "产品类型",
          optionData: [
            { key: "1", value: "正常" },
            { key: "2", value: "对比库" },
          ],
          key: "optimizeType",
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "客户特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
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
              value: "正常",
            },
            {
              key: 2,
              value: "对比库",
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "优化比列",
          key: "optimizePercent",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "textarea",
          label: "不优化关键词",
          key: "noOptimizeTemplate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
      ],
      id: "",
      isChooseUser: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map((t) => {
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
    edit(row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach((item) => {
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

    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form,
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then((res) => {
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
          id: this.id,
          ...form,
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach((item) => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
      });
    },
    cancel() {
      this.addChannel = false;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.sysBelielConfig {
}
</style>
