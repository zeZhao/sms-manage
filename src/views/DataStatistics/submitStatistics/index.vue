<template>
  <!--发送报告统计-->
  <div class="sendReportStatistics">
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
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="accountType" label="用户类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.smsType === 1
              ? "行业"
              : scope.row.smsType === 2
              ? "营销"
              : scope.row.smsType === 3
              ? "vip"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId == 0">非法</span>
          <span v-else-if="scope.row.operaId == 1">移动</span>
          <span v-else-if="scope.row.operaId == 2">联通</span>
          <span v-else-if="scope.row.operaId == 3">电信</span>
          <span v-else-if="scope.row.operaId == 4">国际</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="smsType" label="类型">
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
      <el-table-column prop="submitNum" label="提交条数" />
      <el-table-column prop="sendNum" label="占比">
        <template slot-scope="scope">
          <span
            >{{
              ((scope.row.submitNum / statistics.total) * 100).toFixed(2)
            }}%</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="countDate" label="统计日期" />
    </el-table>
    <p style="color: red">
      总条数: {{ statistics.total }}&nbsp;&nbsp;行业总条数:
      {{ statistics.industryNum }}
      <!-- 
        &nbsp;&nbsp;营销总条数:
        {{ statistics.marketingNum }}
        &nbsp;&nbsp;Vip条数:
        {{ statistics.vipNum }}&nbsp;&nbsp; 
      -->
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
        namespace: "submitStatistics",
        list: "submitStatistics"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {
        showDate: 1,
        showCode: 1,
        showGateway: 1
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
        // {
        //   type: "inputNum",
        //   label: "通道",
        //   key: "gateway",
        // },
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
              key: "0",
              value: "非法"
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
            }
            // {
            //   key: 2,
            //   value: "营销"
            // },
            // {
            //   key: 3,
            //   value: "vip"
            // }
          ]
        },
        // {
        //   type: "select",
        //   label: "是否显示日期",
        //   key: "showDate",
        //   optionData: [
        //     { key: "0", value: "否" },
        //     { key: "1", value: "是" },
        //   ],
        // },
        // {
        //   type: "select",
        //   label: "显示特服号",
        //   key: "showCode",
        //   optionData: [
        //     { key: "0", value: "否" },
        //     { key: "1", value: "是" },
        //   ],
        // },
        // {
        //   type: "select",
        //   label: "是否显示通道",
        //   key: "showGateway",
        //   optionData: [
        //     { key: "0", value: "否" },
        //     { key: "1", value: "是" },
        //   ],
        // },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"]
        }
      ],
      statistics: {},
      isParamsNotData: false
    };
  },
  mounted() {
    this.saleSubmitStatistics();
  },
  computed: {},
  methods: {
    // 获取统计
    saleSubmitStatistics(searchParam) {
      this.$http.submitStatistics
        .submitStatisticsTotal({ ...searchParam })
        .then(res => {
          if (resOk(res)) {
            this.statistics = res.data;
          }
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

      this.saleSubmitStatistics(data);
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
