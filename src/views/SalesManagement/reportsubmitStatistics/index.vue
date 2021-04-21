<template>
  <!--提交统计-->
  <div class="reportsubmitStatistics">
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
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" show-overflow-tooltip />
      <el-table-column prop="accountType" label="用户类型">
        <template slot-scope="scope">
          <span v-if="scope.row.accountType === 1">行业</span>
          <span v-else>-</span>
          <!-- <span v-if="scope.row.accountType === 2">营销</span>
          <span v-if="scope.row.accountType === 3">vip</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === 1">移动</span>
          <span v-if="scope.row.operaId === 2">联通</span>
          <span v-if="scope.row.operaId === 3">电信</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsType" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.smsType === 1">短信</span>
          <span v-if="scope.row.smsType === 2">彩信</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitNum" label="提交条数" />
      <el-table-column prop="sendNum" label="发送条数" />
      <el-table-column prop="successNum" label="成功条数" />
      <el-table-column prop="failNum" label="失败条数" />
      <el-table-column prop="unknownNum" label="未知条数" />
      <el-table-column prop="percentage" label="提交占比" />
      <el-table-column prop="saleName" label="销售" />
      <el-table-column prop="countDate" label="统计日期" />
    </el-table>
    <p style="color: red">
      总条数: {{ total.total }}；行业条数: {{ total.industryNum }}；营销条数:
      {{ total.marketingNum }} ；Vip条数: {{ total.vipNum }}
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
        namespace: "reportsubmitStatistics",
        list: "saleSubmitStatistics"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
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
        // {
        //   type: "input",
        //   label: "销售名称",
        //   key: "saleActualName",
        // },
        {
          type: "select",
          label: "销售人员",
          key: "saleUserName",
          optionData: [],
          placeholder: "请选择销售人员"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            { key: "0", value: "非法" },
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" }
          ]
        },
        {
          type: "select",
          label: "用户类型",
          key: "accountType",
          optionData: [
            { key: "1", value: "行业" }
            // { key: "2", value: "营销" },
            // { key: "3", value: "VIP" }
          ]
        },
        {
          type: "select",
          label: "分组查询",
          key: "groupBy",
          optionData: [
            { key: "1", value: "日期" },
            { key: "2", value: "商户编号" },
            { key: "3", value: "运营商" },
            { key: "4", value: "用户类型" }
          ]
        },
        {
          type: "select",
          label: "排序方式",
          key: "orderBy",
          optionData: [
            { key: "1", value: "日期" },
            { key: "2", value: "提交数" }
          ]
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"]
        }
      ],
      total: {
        total: 0,
        industryNum: 0,
        marketingNum: 0,
        vipNum: 0
      },
      isParamsNotData: false
    };
  },
  mounted() {
    this.saleSubmitStatistics();
    this.getSaleman();
  },
  computed: {},
  methods: {
    //获取销售员
    getSaleman() {
      this.$http.sysSales.queryAvailableSaleman().then(res => {
        if (resOk(res)) {
          this._setDefaultValue(
            this.searchFormConfig,
            res.data,
            "saleUserName",
            "userName",
            "actualName"
          );
        }
      });
    },
    saleSubmitStatistics() {
      this.$http.reportsubmitStatistics
        .saleSubmitStatisticsTotal({ ...this.searchParam })
        .then(res => {
          if (resOk(res)) {
            this.total = res.data;
          }
        });
    },

    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.countDate) {
        data.countDate = new Date(data.countDate).Format("yyyy-MM-dd");
      }
      if (data.endDate) {
        data.endDate = new Date(data.endDate).Format("yyyy-MM-dd");
      }
      this.saleSubmitStatistics(data);
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
