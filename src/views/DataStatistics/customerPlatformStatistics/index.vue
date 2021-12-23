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
      <el-table-column prop="sendSuccNum" label="发送成功总数" />
      <el-table-column prop="countDate" label="统计月份" />
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
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "reports",
        list: "queryMerchSendSuccStatistics"
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
          type: "month",
          label: "统计月份",
          key: "countDate",
          defaultValue: new Date().Format("yyyy-MM")
        }
      ]
    };
  },
  methods: {
    exportData(form) {
      const data = { ...this.pageObj, ...form };
      delete data.total;
      this.$axios
        .post("/report/exportMerchSendSuccStatistics", data)
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    }
  }
};
</script>
