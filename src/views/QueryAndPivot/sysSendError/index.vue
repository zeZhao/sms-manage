<template>
  <!--网关错误-->
  <div class="sysSendError">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false">
      <template slot="Btn">
        <el-button type="primary" @click="_mxDoSearch()" style="margin-left: 15px">查询</el-button>
        <el-button type="primary" @click="editContent">修改内容</el-button>
        <el-button type="primary" @click="editGateway">修改网关</el-button>
      </template>
    </Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="loginName" label="用户名" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="errCode" label="错误码" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="err" label="错误描述" />
      <el-table-column prop="submitTime" label="提交时间" >
        <template slot-scope="scope">{{scope.row.submitTime | timeFormat}}</template>
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
      title="修改网关"
      :visible.sync="gateway"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <FormItem
        :colSpan="12"
        ref="formItemGateway"
        :formConfig="formConfigGateway"
        btnTxt="修改网关"
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
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "用户ID"
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
          label: "网关编号",
          key: "gateway",
          placeholder: "网关编号"
        },
        {
          type: "input",
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
          key: ["", "startTime", "endTime"],
          placeholder: "请选择提交时间"
        }
      ],
      // 修改内容表单配置
      formConfigContent: [
        {
          type: "input",
          label: "用户ID",
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
      // 修改网关表单配置
      formConfigGateway: [
        {
          type: "input",
          label: "用户ID",
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
          label: "原网关",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "目标网关",
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
    // 修改网关
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
      for (let key in form) {
        if (key === "startTime" || key === "endTime") {
          form[key] = new Date(form[key]).Format("yyyy-MM-dd hh:mm:ss");
        }
      }
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
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSendError {
}
</style>
