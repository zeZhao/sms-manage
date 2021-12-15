<template>
  <!--用户利润查询-->
  <div class="sysTimeTasklist">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="createDate" label="日期" width="100" />
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="公司全称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="客户全称" />
      <el-table-column prop="cardUnit" label="客户单价(分)" width="110" />
      <el-table-column prop="reductModel" label="计费方式" width="110">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.reductModel == "1"
                ? "预付提交计费"
                : scope.row.reductModel == "2"
                ? "预付成功计费"
                : scope.row.reductModel == "3"
                ? "后付提交计费"
                : "后付成功计费"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="isDirectUser" label="客户类型">
        <template slot-scope="scope">
          <span>
            {{ scope.row.isDirectUser == "1" ? "直客" : "代理商" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="succCount" label="消耗条数" />
      <el-table-column prop="gateway" label="通道号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="unitPrice" label="通道单价(分)" width="100" />
      <el-table-column prop="succcAll" label="商户消耗金额(元)" width="130" />
      <el-table-column prop="chengBenAll" label="通道成本(元)" width="100" />
      <el-table-column prop="profitAll" label="利润(元)" />
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
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
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
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "商户名称",
          key: "corpName",
          placeholder: "请输入商户名称"
        },
        {
          type: "inputNum",
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
          key: ["", "startTime", "endTime"]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.createDate) {
          item.createDate = new Date(item.createDate).Format("yyyy-MM-dd");
        }
      });
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysTimeTasklist {
}
</style>
