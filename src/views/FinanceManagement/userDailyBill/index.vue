<template>
  <!--用户日账单-->
  <div class="userDailyBill">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      ref="Search"
      @exportData="exportData"
    >
      <template slot="Other">
        <el-button
          type="primary"
          size="small"
          @click="$refs.Search.handleExport()"
          >导出</el-button
        >
      </template></Search
    >
    <el-table
      :data="listData"
      max-height="500"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="countDate" label="日期" width="150">
        <template slot-scope="scope">{{
          scope.row.countDate | Format
        }}</template>
      </el-table-column>
      <el-table-column prop="submitCount" label="提交条数" />
      <el-table-column prop="sendCount" label="发送条数" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="failCount" label="失败条数" />
      <el-table-column prop="submitUnknownCount" label="未知条数" />
      <el-table-column prop="succRate" label="成功率" />
      <el-table-column prop="failRate" label="失败率" />
      <el-table-column prop="unknownRate" label="未知率" />
    </el-table>
    <p style="color: red" v-if="statistics">
      总提交数(条):{{ statistics.submitCountAll }} &nbsp;&nbsp;总发送条数(条):{{
        statistics.sendCountAll
      }}&nbsp;&nbsp; 总成功数(条):{{ statistics.succCountAll }}&nbsp;&nbsp;
      总失败数(条):{{ statistics.failCountAll }}&nbsp;&nbsp; 总未知数(条):{{
        statistics.unknownCountAll
      }}
    </p>
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
        namespace: "userDailyBill",
        list: "queryUserDailyBill"
      },
      // 列表参数
      namespace: "userMonthlyBill",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "startTime", "endTime"]
        }
      ],
      statistics: {}
    };
  },
  mounted() {
    this.queryUserDailyBillNum();
  },
  computed: {},
  methods: {
    exportData(form) {
      this.$axios
        .post("/userDailyBill/exportUserDailyBill", {
          data: { userMonthlyBill: { ...form }, pageNumber: 1, pageSize: 10 }
        })
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
    queryUserDailyBillNum() {
      this.$http.userDailyBill
        .queryUserDailyBillNum({
          data: {
            pageNumber: 1,
            pageSize: 10,
            userMonthlyBill: { ...this.searchParam }
          }
        })
        .then(res => {
          this.statistics = Object.assign({}, res.data);
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
      this.queryUserDailyBillNum(data);
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
