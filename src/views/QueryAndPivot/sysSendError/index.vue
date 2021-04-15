<template>
  <!--通道错误-->
  <div class="sysSendError">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template v-slot:Other="form">
        <el-button type="primary" size="small" @click="editContent"
          >修改内容</el-button
        >
        <el-button type="primary" size="small" @click="editGateway"
          >修改通道</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column
        prop="loginName"
        label="账户名称"
        show-overflow-tooltip
      />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" width="120" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="errCode" label="错误码" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="err" label="错误描述" show-overflow-tooltip />
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      title="修改内容"
      :visible.sync="content"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <FormItem
        :colSpan="12"
        ref="formItemContent"
        :formConfig="formConfigContent"
        btnTxt="修改内容"
        @submit="submitContent"
        @cancel="cancelContent"
      ></FormItem>
    </el-dialog>
    <el-dialog
      title="修改通道"
      :visible.sync="gateway"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <FormItem
        :colSpan="12"
        ref="formItemGateway"
        :formConfig="formConfigGateway"
        btnTxt="修改通道"
        @submit="submitGateway"
        @cancel="cancelGateway"
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
      content: false,
      gateway: false,
      // 接口地址
      searchAPI: {
        namespace: "sysSendError",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "sendError",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "账户编号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "内容"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "手机号"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          placeholder: "通道编号"
        },
        {
          type: "inputNum",
          label: "错误码",
          key: "errCode",
          placeholder: "错误码"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "CID"
        },
        {
          type: "input",
          label: "错误描述",
          key: "err",
          placeholder: "错误描述"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "特服号"
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"]
        }
      ],
      // 修改内容表单配置
      formConfigContent: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "原内容",
          key: "content",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "原关键字",
          key: "keyWord",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "目标关键字",
          key: "newKeyWord",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      // 修改通道表单配置
      formConfigGateway: [
        {
          type: "input",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "内容",
          key: "content"
        },
        {
          type: "input",
          label: "cid",
          key: "cid"
        },
        {
          type: "input",
          label: "原通道",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "目标通道",
          key: "newGateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "input",
          label: "错误原因",
          key: "err"
        },
        {
          type: "input",
          label: "特服号",
          key: "code"
        },
        {
          type: "date",
          label: "开始时间",
          key: "startTime"
        },
        {
          type: "date",
          label: "结束时间",
          key: "endTime"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //修改内容
    editContent() {
      this.content = true;
      setTimeout(() => {
        this.$refs.formItemContent.resetForm();
      });
    },
    // 修改通道
    editGateway() {
      this.gateway = true;
      setTimeout(() => {
        this.$refs.formItemGateway.resetForm();
      });
    },

    //提交修改内容
    submitContent(form) {
      this.$http.sysSendError.editContent({ ...form }).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg || "修改成功！");
          this.content = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    cancelContent() {
      this.content = false;
    },

    submitGateway(form) {
      // for (let key in form) {
      //   if (key === "startTime") {
      //     form[key] = new Date(form[key]).Format("yyyy-MM-dd hh:mm:ss");
      //   }
      //   if (key === "endTime") {
      //     form[key] = new Date(form[key]).Format("yyyy-MM-dd 23:59:59");
      //   }
      // }
      this.$http.sysSendError.editGateWay({ ...form }).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg || "修改成功！");
          this.gateway = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    cancelGateway() {
      this.gateway = false;
    },

    //countMonth
    _mxFormListData(rows) {
      rows.forEach(item => {
        if (item.submitTime) {
          item.submitTime = new Date(item.submitTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return rows;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSendError {
}
</style>
