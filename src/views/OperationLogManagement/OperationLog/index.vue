<template>
  <div>
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      @exportData="exportData"
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
      v-loading="loading"
    >
      <el-table-column prop="serverType" label="产品类型">
        <template slot-scope="{ row }">{{
          renderServerType(row.serverType)
        }}</template>
      </el-table-column>
      <el-table-column prop="operatorName" label="操作人名称" />
      <el-table-column prop="createTime" label="操作时间" width="135">
        <template slot-scope="{ row }">{{
          row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="requIp" label="请求IP" />
      <el-table-column prop="module" label="操作模块" />
      <el-table-column prop="remark" label="描述信息" />
      <el-table-column prop="requParam" label="请求参数" />
      <el-table-column prop="respParam" label="返回参数" />
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
import { getDateTime } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "operationLog",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "产品类型",
          key: "serverType",
          defaultValue: 1,
          optionData: [
            { key: 1, value: "运营端" },
            { key: 2, value: "商户端" },
            { key: 3, value: "代理商端" }
          ]
        },
        {
          type: "input",
          label: "操作人名称",
          key: "operatorName"
        },
        {
          type: "datetime",
          label: "操作时间",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateTime("start"), getDateTime("end")],
          clearable: false
        }
      ]
    };
  },
  methods: {
    renderServerType(v) {
      switch (v) {
        case 1:
          return "运营端";
        case 2:
          return "商户端";
        case 3:
          return "代理商端";
        default:
          return "-";
      }
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    exportData(form) {
      this.$http.operationLog.exportOperationLog(form).then(res => {
        if (res.code === 200) this.$exportToast();
      });
    }
  }
};
</script>
