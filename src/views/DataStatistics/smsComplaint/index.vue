<template>
  <!--投诉统计-->
  <div class="sendReportStatistics">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template slot="Other">
        <el-button type="primary" @click="statistic">投诉统计</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userid" label="账户编号" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="code" label="通道码号" />
      <el-table-column prop="count" label="投诉条数" />
      <el-table-column prop="total" label="发送条数" />
      <el-table-column prop="userName" label="投诉占比(百万级)" />
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>

    <el-dialog title="投诉统计" :visible.sync="dialogVisible" width="80%">
      <el-date-picker
        v-model="statisticsDate"
        type="date"
        forma="yyyy-MM-dd"
        placeholder="选择日期"
      ></el-date-picker>
      <el-button type="primary" @click="query">查询</el-button>
      <template>
        <el-table max-height="500" :data="tableData" style="width: 100%; margin-top: 20px">
          <!-- <el-table-column :prop="processMode" label="处理方式"></el-table-column>
          <el-table-column label="投诉类型" align="center">
            <el-table-column prop="securityCode" label="验证码"></el-table-column>
            <el-table-column prop="validCode" label="有效验证码"></el-table-column>
            <el-table-column prop="affiliate" label="会员营销"></el-table-column>
            <el-table-column prop="marketing" label="非会员营销"></el-table-column>
            <el-table-column prop="inform" label="行业通知"></el-table-column>
            <el-table-column prop="trafficking" label="黄赌毒"></el-table-column>
            <el-table-column prop="SMSFraud" label="短信欺诈"></el-table-column>
            <el-table-column prop="fishing" label="钓鱼"></el-table-column>
            <el-table-column prop="rest" label="其他"></el-table-column>
          </el-table-column>-->
          <el-table-column prop="0" label="处理方式"></el-table-column>
          <el-table-column label="投诉类型" align="center">
            <el-table-column prop="1" label="验证码"></el-table-column>
            <el-table-column prop="2" label="有效验证码"></el-table-column>
            <el-table-column prop="3" label="会员营销"></el-table-column>
            <el-table-column prop="4" label="非会员营销"></el-table-column>
            <el-table-column prop="5" label="行业通知"></el-table-column>
            <el-table-column prop="6" label="黄赌毒"></el-table-column>
            <el-table-column prop="7" label="短信欺诈"></el-table-column>
            <el-table-column prop="8" label="钓鱼"></el-table-column>
            <el-table-column prop="9" label="其他"></el-table-column>
          </el-table-column>
        </el-table>
        <p style="color: red">
          当天投诉总数:{{ count }}；处理个数：0；审核通过个数：0
        </p>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      dialogVisible: false,
      statisticsDate: "",
      //接口地址
      searchAPI: {
        namespace: "sysComplaint",
        list: "queryStatisticByPage"
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
          label: "账户编号",
          key: "userid",
          placeholder: "请输入账户编号"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        },
        {
          type: "input",
          label: "通道码号",
          key: "code"
        },
        {
          type: "daterange",
          label: "投诉日期",
          key: ["", "startdate", "enddate"]
        }
      ],
      statistics: {},
      tableData: [],
      count: 0,
      // 投诉类型
      complaintType: ["有效投诉", "全量投诉", "已核减", "未下发", "总数"],
      statisticsData: {
        processMode: "",
        securityCode: "",
        validCode: "",
        affiliate: "",
        marketing: "",
        inform: "",
        trafficking: "",
        SMSFraud: "",
        fishing: "",
        rest: ""
      }
    };
  },
  mounted() {
    this.queryUserSendDetailAll();
  },
  computed: {},
  methods: {
    //投诉统计
    statistic() {
      this.dialogVisible = true;
      this.statisticsDate = "";
      this.count = 0;
    },
    // 统计查询
    query() {
      this.tableData = [];
      this.statisticsDate = new Date(this.statisticsDate).Format("yyyy-MM-dd");
      this.$http.sysComplaint
        .TypeStatistic({ createdate: this.statisticsDate })
        .then(res => {
          const {
            qltsList,
            wxfList,
            yhjList,
            yxtsList,
            zsList,
            count
          } = res.data;
          this.count = count;
          //投诉统计数据处理
          let arr = [];
          res.data.qltsList.unshift("有效投诉");
          res.data.wxfList.unshift("全量投诉");
          res.data.yhjList.unshift("已核减");
          res.data.yxtsList.unshift("未下发");
          res.data.zsList.unshift("总数");
          this.tableData.push({ ...res.data.qltsList });
          this.tableData.push({ ...res.data.wxfList });
          this.tableData.push({ ...res.data.yhjList });
          this.tableData.push({ ...res.data.yxtsList });
          this.tableData.push({ ...res.data.zsList });
          console.log(this.tableData);
        });
    },
    // 获取统计
    queryUserSendDetailAll() {
      this.$http.sendReportStatistics.sendReportTotal({}).then(res => {
        this.statistics = Object.assign({}, res.data);
        console.log(this.statistics);
      });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { startdate, enddate } = data;
      if (startdate) {
        data.startdate = new Date(startdate).Format("yyyy-MM-dd");
      }
      if (enddate) {
        data.enddate = new Date(enddate).Format("yyyy-MM-dd");
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
