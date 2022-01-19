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
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="sendNum" label="发送总数" />
      <el-table-column prop="oneLevelCountStr" label="5秒以下" width="90" />
      <el-table-column prop="twoLevelCountStr" label="5-10秒" />
      <el-table-column prop="threeLevelCountStr" label="10-20秒" />
      <el-table-column prop="fourLevelCountStr" label="20-30秒" />
      <el-table-column prop="fiveLevelCountStr" label="30-60秒" />
      <el-table-column prop="sixLevelCountStr" label="60秒以上" />
      <el-table-column prop="countDate" label="时间" width="100" />
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
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "reports",
        list: "queryArrivalDelayStatic"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "input",
          label: "商户名称",
          key: "corpName",
          placeholder: "请输入商户名称"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
          placeholder: "请输入通道名称"
        },
        {
          type: "daterange",
          label: "创建时间",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ]
    };
  },
  methods: {
    exportData(form) {
      const data = { ...this.pageObj, ...form };
      delete data.total;
      this.$axios.post("/report/exportArrivalDelayStatic", data).then(res => {
        if (res.data.code === 200) this.$exportToast();
      });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    }
  }
};
</script>
