<template>
  <!--返回报告-->
  <div class="smsReturnReport">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :isOther="true"
      :notSearch="notSearch"
      @exportData="_mxExportData"
    >
      <template v-slot:Other="form">
        <el-button type="primary" size="small" @click="exported(form)"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" width="120" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="100"
        v-if="searchParam.showDecrypt === 1"
      />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="error" label="错误描述" />
      <el-table-column prop="returnTime" label="返回报告时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.returnTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveTime" label="手机接收时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gatewayTaking" label="通道耗时:秒" />
      <el-table-column prop="totalTaking" label="总耗时:秒" />
      <el-table-column prop="seqId" label="SEQID" width="155" />
      <el-table-column prop="cid" label="CID" width="155" />
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "smsReturnReport",
        list: "selectReturnReportByPage"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //默认进入该页面不查询
      notSearch: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "SEQID",
          key: "seqId"
        },
        {
          type: "input",
          label: "状态",
          key: "status",
          placeholder: "请输入状态"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID"
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          placeholder: "请输入签名"
        },
        {
          type: "select",
          label: "状态",
          key: "statusType",
          optionData: [{ key: "1", value: "成功" }, { key: "2", value: "失败" }]
        },
        {
          type: "select",
          label: "显示内容",
          key: "showDecrypt",
          defaultValue: -1,
          optionData: [
            {
              key: 1,
              value: "显示"
            },
            {
              key: -1,
              value: "不显示"
            }
          ]
        },
        {
          type: "date",
          label: "返回日期",
          key: "returnTime",
          placeholder: "返回日期",
          defaultValue: new Date()
        },
        {
          type: "timerange",
          label: "返回报告时间",
          key: ["", "startTime", "endTime"],
          defaultValue: [
            "",
            new Date(2021, 12, 16, 0, 0, 0),
            new Date(2021, 12, 16, 23, 59, 59)
          ]
        }

        // {
        //   type: "select",
        //   label: "省份",
        //   key: "province",
        //   placeholder: "请选择省份",
        //   optionData: [],
        // },
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    exported(form) {
      let data = this._formatRequestData(form.form);
      this.$http.smsReturnReport
        .asyncExportDecrypt({ data: { ...data } })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("提交下载成功，请前往下载中心下载文件。");
          } else {
            this.$message.error(res.data);
          }
        });
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.returnTime) {
        data.returnTime = new Date(data.returnTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsReturnReport {
}
</style>
