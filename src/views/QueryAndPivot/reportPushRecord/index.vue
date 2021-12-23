<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search>

    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="mobile" label="手机号" width="100" />
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="status" label="报告状态" />
      <el-table-column prop="pushId" label="推送ID" />
      <el-table-column prop="pushTime" label="推送时间" width="135">
        <template slot-scope="scope">{{
          scope.row.pushTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="pushStatus" label="推送状态" />
      <el-table-column prop="repeatNum" label="重复次数" />
      <el-table-column prop="seqId" label="SEQID" width="155" />
      <el-table-column prop="gateway" label="通道" />
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
        namespace: "smsPushReport",
        list: "listPushReport"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      notSearch: true,
      //搜索框数据
      searchParam: {},
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
          key: "gateway"
        },
        {
          type: "input",
          label: "CID",
          key: "cid"
        },
        {
          type: "inputNum",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "input",
          label: "SEQID",
          key: "seqId"
        },
        {
          type: "input",
          label: "报告状态",
          key: "status"
        },
        {
          type: "inputNum",
          label: "推送ID",
          key: "pushId"
        },
        {
          type: "select",
          label: "报告推送状态",
          key: "pushStatus",
          optionData: [
            {
              key: "success",
              value: "success"
            },
            {
              key: "fail",
              value: "fail"
            }
          ]
        },
        {
          type: "date",
          label: "推送日期",
          key: "pushTimeStr",
          defaultValue: new Date().Format("yyyy-MM-dd")
        }
      ]
    };
  }
};
</script>
