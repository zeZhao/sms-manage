<template>
  <!--待发-->
  <div class="smsSendTask">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template slot="Other">
        <el-button type="primary" @click="edit">批量修改网关</el-button>
        <el-button type="primary" @click="ViewTheSummaryBtn"
          >查看汇总</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="loginName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="hasSend" label="发送状态">
        <template slot-scope="scope">
          <span v-if="scope.row.hasSend === '0'">未发</span>
          <span v-if="scope.row.hasSend === '1'">已发送</span>
        </template>
      </el-table-column>
      <el-table-column prop="definiteTime" label="定时时间" width="150">
        <template slot-scope="scope">{{
          scope.row.definiteTime | timeFormat
        }}</template>
      </el-table-column>
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
    <el-dialog title="查看汇总" :visible.sync="ViewTheSummary" width="50%">
      <el-table :data="SummaryData" highlight-current-row>
        <el-table-column prop="gateway" label="网关" />
        <el-table-column prop="stockNum" label="积压批次数量" />
        <el-table-column prop="counter" label="积压条数" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ViewTheSummary = false">取 消</el-button>
        <el-button type="primary" @click="ViewTheSummary = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog title="批量修改网关" :visible.sync="editGateway" width="50%">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        btnTxt="修改"
        @submit="submitGateway"
        @cancel="_mxCancel"
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
      editGateway: false,
      ViewTheSummary: false,
      SummaryData: [],
      //接口地址
      searchAPI: {
        namespace: "smsSendTask",
        list: "queryByPage",
      },
      // 列表参数
      namespace: "sendTask",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID",
        },
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "用户名称",
          key: "loginName",
          placeholder: "请输入用户名称",
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容",
        },
        {
          type: "input",
          label: "CID",
          key: "cId",
          placeholder: "请输入CID",
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号",
        },
        {
          type: "inputNum",
          label: "网关",
          key: "gateway",
          placeholder: "请输入网关",
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号",
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"],
        },
      ],
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "处理条数",
          key: "batchCount",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "原网关",
          key: "gateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "目标网关",
          key: "newGateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "date",
          label: "日期",
          key: "submitDate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "time",
          label: "开始时间",
          key: "startTime",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "time",
          label: "结束时间",
          key: "endTime",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "是否处理长短信",
          initDefaultValue: "1",
          defaultValue: "1",
          optionData: [
            {
              key: "1",
              value: "是",
            },
            {
              key: "0",
              value: "否",
            },
          ],
          key: "udhi",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
        },
      ],
    };
  },
  mounted() {
    this.queryGatewayStockNum();
  },
  computed: {},
  methods: {
    ViewTheSummaryBtn() {
      this.ViewTheSummary = true;
      this.queryGatewayStockNum();
    },
    // 批量修改网关
    edit() {
      this.editGateway = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    queryGatewayStockNum() {
      this.$http.smsSendTask.queryGatewayStockNum().then((res) => {
        this.SummaryData = res.data;
      });
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      if (formData.submitDate) {
        formData.submitDate = new Date(formData.submitDate).Format(
          "yyyy-MM-dd"
        );
      }
      if (formData.startTime) {
        formData.startTime = new Date(formData.startTime).Format("hh:mm:ss");
      }
      if (formData.endTime) {
        formData.endTime = new Date(formData.endTime).Format("hh:mm:ss");
      }
      return formData;
    },
    submitGateway(form) {
      form = this._mxArrangeSubmitData(form);
      const params = {
        data: {
          sendTask: {
            ...form,
          },
        },
      };
      this.$http.smsSendTask.batchModify(params).then((res) => {
        if (resOk(res)) {
          this.$message.success(res.msg || res.data);
          this._mxGetList();
          this.editGateway = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    _mxCancel() {
      this.editGateway = false;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.smsSendTask {
}
</style>
