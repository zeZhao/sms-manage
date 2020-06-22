<template>
  <!--企业月账单-->
  <div class="sysPrepaidCard">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="corporateName" label="企业名称" />
      <el-table-column prop="cardCount" label="条数" />
      <el-table-column prop="debt" label="金额(元)" />
      <el-table-column prop="succCount" label="直连条数" />
      <el-table-column prop="foreignPrice" label="直连金额(元)" />
      <el-table-column prop="reductType" label="总条数" />
      <el-table-column prop="cardMoney" label="总金额(元)" />
      <el-table-column prop="chargeType" label="类型">
        <template slot-scope="scope">
          <span> {{ scope.row.chargeType === 1 ? "短信" : "彩信" }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="200">
        <template slot-scope="">
          <el-button type="text" size="small">导出平台账单</el-button>
          <el-button type="text" size="small">导出直连账单</el-button>
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
        namespace: "sysPrepaidCard",
        list: "listCorporateBillByPage"
      },
      // 列表参数
      namespace: "prepaidCard",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "select",
          label: "类型",
          key: "chargeType",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "month",
          label: "月份",
          key: "remark"
        },
        {
          type: "select",
          key: "isBill",
          label: "帐单类型",
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "月度帐单"
            }
          ]
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
.sysPrepaidCard {
}
</style>
