<template>
  <!--发送报告统计-->
  <div class="sendReportStatistics">
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
      <el-table-column prop="corpId" label="商户编号" key="corpId" />
      <el-table-column prop="userId" label="账户编号" key="userId" />
      <el-table-column prop="userName" label="账户名称" key="userName" />
      <el-table-column
        prop="code"
        label="特服号"
        v-if="searchParam.showCode === '1'"
        key="code"
      />
      <el-table-column prop="accountType" label="用户类型" key="accountType">
        <template slot-scope="scope">
          <span>{{
            scope.row.accountType === 1
              ? "行业"
              : scope.row.accountType === 2
              ? "营销"
              : scope.row.accountType === 3
              ? "vip"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsType" label="类型" key="smsType">
        <template slot-scope="scope">
          <span>{{
            scope.row.smsType === 1
              ? "短信"
              : scope.row.smsType === 2
              ? "彩信"
              : scope.row.smsType === 3
              ? "屏信"
              : "语音"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gateway"
        label="通道"
        v-if="searchParam.showGateway === '1'"
        key="gateway"
      />
      <el-table-column prop="sendNum" label="条数" key="sendNum" />
      <el-table-column
        prop="countDate"
        label="统计日期"
        v-if="searchParam.showDate === '1'"
        key="countDate"
      />
    </el-table>
    <p style="color: red;font-size: 12px;">
      总条数: {{ statistics.total || 0 }}&nbsp;&nbsp;行业总条数:
      {{ statistics.industryNum || 0 }}
      <!-- &nbsp;&nbsp;营销总条数:
      {{ statistics.marketingNum }}
      &nbsp;&nbsp;Vip条数:
      {{ statistics.vipNum }}&nbsp;&nbsp; -->
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
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "sendReportStatistics",
        list: "sendReportStatistics"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {
        // showDate: 1,
        // showCode: 1,
        // showGateway: 1,
      },
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
          type: "inputNum",
          label: "通道",
          key: "gateway"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            },
            {
              key: 4,
              value: "国际"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "用户类型",
          key: "accountType",
          optionData: [
            {
              key: 1,
              value: "行业"
            },
            {
              key: 2,
              value: "营销"
            },
            {
              key: 3,
              value: "vip"
            }
          ]
        },
        {
          type: "select",
          label: "是否显示日期",
          key: "showDate",
          defaultValue: "1",
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "select",
          label: "显示特服号",
          key: "showCode",
          defaultValue: "0",
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "select",
          label: "是否显示通道",
          key: "showGateway",
          defaultValue: "0",
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"],
          defaultValue: ["", new Date(), new Date()]
        }
      ],
      statistics: {},
      isParamsNotData: false
    };
  },
  mounted() {
    // this.queryUserSendDetailAll(this.searchParam);
  },
  computed: {},
  methods: {
    // 获取统计
    queryUserSendDetailAll(searchParam) {
      this.$http.sendReportStatistics.sendReportTotal(searchParam).then(res => {
        this.statistics = Object.assign({}, res.data);
        console.log(this.statistics);
      });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { countDate, endDate } = data;
      if (countDate) {
        data.countDate = new Date(countDate).Format("yyyy-MM-dd");
      }
      if (endDate) {
        data.endDate = new Date(endDate).Format("yyyy-MM-dd");
      }
      this.queryUserSendDetailAll(data);
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
        const { sendNum } = item;
        let proportion = parseInt((sendNum / this.statistics.sendNum) * 100);
        // if (!succCount) {
        //   item.succCount = 0;
        // }
        // if (!foreignPrice) {
        //   item.foreignPrice = 0;
        // }
        this.$set(item, "proportion", `${proportion}%`);
      });

      // if()
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
