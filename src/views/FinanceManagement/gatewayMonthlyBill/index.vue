<template>
  <!--通道月账单-->
  <div class="gatewayMonthlyBill">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
      @exportData="exportData"
    >
      <template slot="Other">
        <el-button
          type="primary"
          size="small"
          @click="$refs.Search.handleExport()"
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
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="countDateStr" label="月份" width="150">
        <template slot-scope="scope">{{
          scope.row.countDateStr | FormatMonth
        }}</template>
      </el-table-column>
      <el-table-column prop="sendCount" label="发送条数" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="cardUnit" label="单价(分)" />
      <el-table-column prop="failCount" label="失败条数" />
      <el-table-column prop="unknownCount" label="未知条数" />
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
        namespace: "gatewayMonthlyBill",
        list: "queryList"
      },
      // 列表参数
      namespace: "gatewayMonthlyBill",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName"
        },
        {
          type: "input",
          label: "供应商名称",
          key: "supplierName"
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // 导出
    exportData(form) {
      this.$axios.post("/gatewayMonthlyBill/exportGatewayMonthlyBill", { data: { gatewayMonthlyBill: { ...form } } }).then(res => {
        if (res.data.code === 200) this.$exportToast();
      });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { startTime, endTime } = data;
      if (startTime) {
        data.startTime = new Date(startTime).Format("yyyy-MM-dd");
      }
      if (endTime) {
        data.endTime = new Date(endTime).Format("yyyy-MM-dd");
      }
      return data;
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      rows.forEach(item => {
        const { cardCount, cardMoney, succCount, foreignPrice } = item;
        if (!succCount) {
          item.succCount = 0;
        }
        if (!foreignPrice) {
          item.foreignPrice = 0;
        }
        this.$set(item, "sumReductType", cardCount + succCount);
        this.$set(item, "sumCardMoney", cardMoney + foreignPrice);
      });

      // if()
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
