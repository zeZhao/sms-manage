<template>
  <div>
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @exportData="exportData"
      :add="false"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button type="primary" @click="exportExe" style="margin-left: 15px"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="status" label="状态码" />
      <el-table-column prop="count" label="数量" />
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
import { getDateToString } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "SmsStatusCodeStatistics",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      //默认进入该页面不查询
      notSearch: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId"
        },
        {
          type: "daterange",
          label: "日期",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ]
    };
  },
  methods: {
    exportData(form) {
      this.$http.SmsStatusCodeStatistics.exportSmsStatusCodeStatistics(
        form
      ).then(res => {
        res.code === 200 && this.$exportToast();
      });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    }
  }
};
</script>
