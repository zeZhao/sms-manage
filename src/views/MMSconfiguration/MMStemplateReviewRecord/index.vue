<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      max-height="500"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="gatewayMmsId" label="上游模板编号" />
      <el-table-column prop="mmsId" label="模板编号" />
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="title" label="彩信标题" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="type" label="提交类型">
        <template slot-scope="scope">
          {{ renderType(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="运营商">
        <template slot-scope="scope">
          {{ renderOperator(scope.row.operator) }}
        </template>
      </el-table-column>
      <el-table-column prop="gatewayId" label="通道编号" />
      <el-table-column prop="checkStatus" label="审核状态">
        <template slot-scope="scope">
          {{ renderCheckStatus(scope.row.checkStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="135">
        <template slot-scope="scope">
          {{ scope.row.submitTime | timeFormat }}
        </template>
      </el-table-column>
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
const operatorArr = [
  { key: 0, value: "三网" },
  { key: 1, value: "移动" },
  { key: 2, value: "联通" },
  { key: 3, value: "电信" },
  { key: 4, value: "移动、联通" },
  { key: 5, value: "移动、电信" },
  { key: 6, value: "联通、电信" }
];
const checkStatusArr = [
  { key: 1, value: "审核通过" },
  { key: 2, value: "审核驳回" },
  { key: 3, value: "已删除" }
];
export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "mmsTemplateCheckRecord",
        list: "listByPage"
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
          label: "模板编号",
          key: "mmsId"
        },
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "select",
          label: "运营商",
          key: "operator",
          optionData: operatorArr
        },
        {
          type: "input",
          label: "彩信标题",
          key: "title"
        },
        {
          type: "input",
          label: "签名",
          key: "sign"
        },
        {
          type: "select",
          label: "审核状态",
          key: "checkStatus",
          optionData: checkStatusArr
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "submitStartTime", "submitEndTime"]
        }
      ]
    };
  },
  methods: {
    renderOperator(v) {
      if (v || v === 0) {
        const idx = operatorArr.findIndex(item => v === item.key);
        return idx !== -1 ? operatorArr[idx].value : "-";
      } else {
        return "-";
      }
    },
    renderCheckStatus(v) {
      if (v || v === 0) {
        const idx = checkStatusArr.findIndex(item => v === item.key);
        return idx !== -1 ? checkStatusArr[idx].value : "-";
      } else {
        return "-";
      }
    },
    renderType(v) {
      if (v === 1) {
        return "平台提交";
      } else if (v === 2) {
        return "接口提交";
      } else {
        return "-";
      }
    }
  }
};
</script>
