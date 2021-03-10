<template>
  <!--返回报告统计-->
  <div class="userDailyBill">
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
      <el-table-column prop="corpId" label="企业计费" />
      <el-table-column prop="userId" label="用户计费" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column
        prop="code"
        label="特服号"
        v-if="searchParam.showCode === '1'"
      />
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
      <el-table-column
        prop="gateway"
        label="通道"
        v-if="searchParam.showGateway === '1'"
      />
      <el-table-column prop="reportNum" label="返回条数" />
      <!-- <el-table-column prop="reportNum" label="返回条数" /> -->
      <el-table-column prop="successNum" label="成功条数" />
      <el-table-column prop="failNum" label="失败条数" />
      <el-table-column
        prop="countDate"
        label="统计日期"
        v-if="searchParam.showDate === '1'"
      />
    </el-table>
    <p style="color: red">
      总数: {{ statistics.returnNum }}&nbsp;&nbsp;成功数:
      {{ statistics.successNum }}&nbsp;&nbsp;失败数:
      {{ statistics.failNum }}&nbsp;&nbsp;
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
        namespace: "returnReportStatistics",
        list: "returnReportStatistics"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {
        // showDate: "1",
        // showCode: "1",
        // showGateway: "1",
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业计费",
          key: "corpId",
          placeholder: "请输入企业计费"
        },
        {
          type: "inputNum",
          label: "用户计费",
          key: "userId",
          placeholder: "请输入用户计费"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
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
              key: "0",
              value: "全部"
            },
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
              value: "非法"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "是否显示日期",
          key: "showDate",
          defaultValue: "1",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "显示特服号",
          key: "showCode",
          defaultValue: "0",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否显示通道",
          key: "showGateway",
          defaultValue: "0",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"]
        }
      ],
      statistics: {}
    };
  },
  mounted() {
    this.queryUserSendDetailAll();
  },
  computed: {},
  methods: {
    // 获取统计
    queryUserSendDetailAll(searchParam) {
      this.$http.returnReportStatistics
        .returnReportTotal({ ...searchParam })
        .then(res => {
          this.statistics = Object.assign({}, res.data);
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
      console.log(this.searchParam, "searchParam");
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
