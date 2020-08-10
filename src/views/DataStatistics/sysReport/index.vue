<template>
  <!--用户日账单-->
  <div class="userDailyBill">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="smsType" label="类型">
        <template slot-scope="scope">
          <span>{{scope.row.smsType === 1?'短信':(scope.row.smsType === 2?'彩信':(scope.row.smsType === 2?'屏信':'语音'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendNum" label="发送条数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column prop="successRate" label="成功率" />
      <el-table-column prop="failRate" label="失败率" />
      <el-table-column prop="unknownRate" label="未知率" />
      <el-table-column label="占比">
        <template slot-scope="scope">
          <span>{{statistics.sendNum/scope.row.sendNum}}</span>
        </template>
      </el-table-column>
    </el-table>
    <p
      style="color:red"
    >用户总发送条数: {{statistics.sendNum}}&nbsp;&nbsp;用户总成功条数: {{statistics.successNum}}&nbsp;&nbsp;用户总成功率: {{statistics.successRate}}%&nbsp;&nbsp;用户总失败条数: {{statistics.failNum}}&nbsp;&nbsp;用户总失败率: {{statistics.failRate}}%&nbsp;&nbsp;用户总未知条数: {{statistics.unknownNum}}&nbsp;&nbsp;用户总未知率: {{statistics.unknownRate}}%</p>
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
        namespace: "report",
        list: "queryByPage",
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID",
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称",
        },
        {
          type: "select",
          label: "类型",
          key: "smsType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" },
            { key: "3", value: "屏信" },
            { key: "4", value: "语音" },
          ],
          placeholder: "请选择类型",
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"],
        },
      ],
      statistics: {},
    };
  },
  mounted() {
    this.queryUserSendDetailAll();
  },
  computed: {},
  methods: {
    // 获取统计
    queryUserSendDetailAll() {
      this.$http.report.queryUserSendDetailAll({}).then((res) => {
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
      return data;
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      rows.forEach((item) => {
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
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
