<template>
  <div class="sysSendLimit">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="limitType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.limitType == '1'?'同手机号同内容':( scope.row.limitType == '2'?'同手机号':'同CID同手机号')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="发送上限" />
      <el-table-column prop="createName" label="创建人" />
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column prop="modifyName" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间">
        <template slot-scope="scope">{{scope.row.modifyTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('limitId',scope.row.limitId)" type="text" size="small">删除</el-button>
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
        ref="form"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
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
        namespace: "sysSendLimit",
        list: "listSendLimitByPage",
        detele: "deleteSendLimit",
      },
      // 列表参数
      namespace: "sendLimit",
      //搜索框数据
      searchParam: {
        userId: "",
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "change",
            },
          ],
        },
        {
          type: "select",
          label: "上限类型",
          key: "limitType",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "同手机号同内容",
            },
            {
              key: 2,
              value: "同手机号",
            },
            {
              key: 3,
              value: "同CID同手机号",
            },
          ],
        },
        {
          type: "input",
          label: "上限",
          key: "count",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur",
            },
            {
              pattern: /^\+?[1-9]\d*$/,
              message: "请输入大于0的正整数",
              trigger: "blur",
            },
          ],
        },
      ],
      limitId: "",
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
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form,
          },
        };
        this.$http.sysSendLimit.addSendLimit(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          }
        });
      } else {
        params = {
          data: {
            limitId: this.limitId,
            ...form,
          },
        };
        this.$http.sysSendLimit.updateSendLimit(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          }
        });
      }

      this.addChannel = false;
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      // await
      setTimeout(() => {
        this.$refs.form.resetForm();
      }, 0);
      this.formConfig.forEach((item) => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
    },
    edit(row) {
      this.limitId = row.limitId;
      this.formTit = "修改";
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
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
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.sysSendLimit {
}
</style>
