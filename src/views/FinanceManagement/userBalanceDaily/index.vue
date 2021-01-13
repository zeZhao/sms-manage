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
      <el-table-column prop="userId" label="企业/用户ID" />
      <el-table-column
        prop="userName"
        label="企业/用户名称"
        show-overflow-tooltip
      />
      <el-table-column prop="smsBalance" label="短信余额" />
      <el-table-column prop="debt" label="借款" />
      <el-table-column prop="unitPrice" label="单价" />
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType === 1 ? "为用户id计费" : "企业id计费"
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
          label: "企业/用户ID",
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
              value: "企业"
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
