<template>
  <!--零点余额-->
  <div class="userBalanceDaily">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="商户/账户编号" />
      <el-table-column
        prop="userName"
        label="商户/账户名称"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.userName">{{ scope.row.userName }}</span>
          <span v-else>未命名</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsBalance" label="短信余额" />
      <el-table-column prop="debt" label="借款">
        <template slot-scope="scope">
          <span v-if="scope.row.debt">{{ scope.row.debt }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价">
        <template slot-scope="scope">
          <span v-if="scope.row.unitPrice">{{ scope.row.unitPrice }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType === 1 ? "为账户计费" : "商户id计费"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="计费方式">
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
      <el-table-column prop="sysName" label="操作人" />
      <el-table-column prop="insertTime" label="统计时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.insertTime | timeFormat }}</span>
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
        namespace: "userBalanceDaily",
        list: "listBalanceDailyByPage"
      },
      // 列表参数
      namespace: "balanceDaily",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户/账户编号",
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
          type: "select",
          label: "类型",
          key: "reductType",
          defaultValue: 2,
          optionData: [
            {
              key: 1,
              value: "用户"
            },
            {
              key: 2,
              value: "商户"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "daterange",
          label: "按统计时间查询",
          key: ["", "startTime", "endTime"]
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
.userBalanceDaily {
}
</style>
