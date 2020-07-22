<template>
  <!--通道重发配置-->
  <div class="sysSendLimit">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="status" label="不重发状态" />
      <el-table-column prop="destGateway" label="重发目标通道" />
      <el-table-column prop="modifyTime" label="修改时间">
        <template slot-scope="scope">{{scope.row.modifyTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('resendId',scope.row.resendId)"
            type="text"
            size="small"
          >删除</el-button>
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
        namespace: "sysResendConfig",
        list: "listResendConfigByPage",
        detele: "deleteResendConfig"
      },
      // 列表参数
      namespace: "resendConfig",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名",
          key: "userName",
          placeholder: "请输入用户名"
        },
        {
          type: "input",
          label: "通道",
          key: "gateway",
          placeholder: "请输入通道"
        },
        {
          type: "input",
          label: "不重发状态",
          key: "status",
          placeholder: "请输入不重发状态"
        },
        {
          type: "input",
          label: "重发目标通道",
          key: "destGateway",
          placeholder: "请输入重发目标通道"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "通道",
          key: "gateway",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "不重发的状态",
          key: "status",
          optionData: [
            {
              key: "未知",
              value: "未知"
            },
            {
              key: "DELIVERD",
              value: "DELIVERD"
            },
            {
              key: "UNDELIVERD",
              value: "UNDELIVERD"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "重发目标通道",
          key: "destGateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      resendId: ""
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysResendConfig.addResendConfig(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          }
        });
      } else {
        params = {
          data: {
            resendId: this.resendId,
            ...form
          }
        };
        this.$http.sysResendConfig.updateResendConfig(params).then(res => {
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
    },
    edit(row) {
      this.resendId = row.resendId;
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
.sysSendLimit {
}
</style>
