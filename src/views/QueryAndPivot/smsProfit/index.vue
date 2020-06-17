<template>
  <!--用户利润查询-->
  <div class="sysTimeTasklist">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corporateId" label="日期" />
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="公司全称" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="客户全称" />
      <el-table-column prop="code" label="客户单价(分)" />
      <el-table-column prop="content" label="计费方式" />
      <el-table-column prop="mobile" label="客户类型" />
      <el-table-column prop="gateway" label="销售" />
      <el-table-column prop="gateway" label="消耗条数" />
      <el-table-column prop="gateway" label="通道号" />
      <el-table-column prop="gateway" label="通道名称" />
      <el-table-column prop="gateway" label="通道单价(分)" />
      <el-table-column prop="gateway" label="商户消耗金额(元)" />
      <el-table-column prop="operaid" label="通道成本(元)" />
      <el-table-column prop="operaid" label="利润(元)" />
      <el-table-column prop="operaid" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.hasSend === 1
            ? "移动"
            : scope.row.hasSend === 2
            ? "联通"
            : "电信"
            }}
          </span>
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

export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "smsProfit",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "smsProfit",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "input",
          label: "企业名称",
          key: "corpName",
          placeholder: "请输入企业名称"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          placeholder: "通道编号"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
          placeholder: "通道名称"
        },
        {
          type: "input",
          label: "销售",
          key: "saleMan",
          placeholder: "请输入销售"
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "startTime", "endTime"],
          placeholder: "统计日期"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysTimeTasklist {
}
</style>
