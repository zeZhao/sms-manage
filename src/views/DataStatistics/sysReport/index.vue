<template>
  <!--用户日账单-->
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
      <el-table-column
        prop="userId"
        label="用户编号"
        v-if="searchParam.showUser === '1'"
      />
      <el-table-column
        prop="userName"
        label="用户名"
        v-if="searchParam.showUser === '1'"
      />
      <el-table-column
        prop="gateway"
        label="通道"
        v-if="searchParam.showGateway === '1'"
      />
      <el-table-column
        prop="gatewayName"
        label="通道名称"
        v-if="searchParam.showGateway === '1'"
      />
      <el-table-column
        prop="province"
        label="省份"
        v-if="searchParam.showProvince === '1'"
      />
      <el-table-column
        prop="operaId"
        label="运营商"
        v-if="searchParam.showOpera === '1'"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.operaId === 0
              ? "非法"
              : scope.row.operaId === 1
              ? "移动"
              : scope.row.operaId === 2
              ? "联通"
              : scope.row.operaId === 3
              ? "电信"
              : "国际"
          }}</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="sendNum" label="发送条数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column prop="successRate" label="成功率">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.successRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="failRate" label="失败率">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.failRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="unknownRate" label="未知率">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.unknownRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="percentage" label="占比">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.percentage).toFixed(2) }}%</span>
        </template>
      </el-table-column>
    </el-table>
    <p style="color: red">
      用户总发送条数: {{ statistics.sendNum }}&nbsp;&nbsp;用户总成功条数:
      {{ statistics.successNum }}&nbsp;&nbsp;用户总成功率:
      {{
        Number(statistics.successRate).toFixed(2)
      }}%&nbsp;&nbsp;用户总失败条数:
      {{ statistics.failNum }}&nbsp;&nbsp;用户总失败率:
      {{ Number(statistics.failRate).toFixed(2) }}%&nbsp;&nbsp;用户总未知条数:
      {{ statistics.unknownNum }}&nbsp;&nbsp;用户总未知率:
      {{ Number(statistics.unknownRate).toFixed(2) }}%
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
        namespace: "report",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {
        showProvince: 1,
        showGateway: 1,
        showOpera: 1,
        showUser: 1,
        showCode: 1
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
          label: "用户编号",
          key: "userId",
          placeholder: "请输入用户编号"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "inputNum",
          label: "通道号",
          key: "gateway",
          placeholder: "请输入用户名称"
        },
        {
          type: "inputNum",
          label: "特服号",
          key: "code",
          placeholder: "请输入用户名称"
        },
        {
          type: "select",
          label: "类型",
          key: "smsType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" },
            { key: "3", value: "屏信" },
            { key: "4", value: "语音" }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" },
            { key: "4", value: "国际" }
          ]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: []
        },
        {
          type: "select",
          label: "是否查询省份",
          key: "showProvince",
          defaultValue: "1",
          optionData: [
            { key: "0", value: "不显示" },
            { key: "1", value: "显示" }
          ]
        },
        {
          type: "select",
          label: "是否查询通道",
          key: "showGateway",
          defaultValue: "1",
          optionData: [
            { key: "0", value: "不显示" },
            { key: "1", value: "显示" }
          ]
        },
        {
          type: "select",
          label: "显示运营商",
          key: "showOpera",
          defaultValue: "1",
          optionData: [
            { key: "0", value: "不显示" },
            { key: "1", value: "显示" }
          ]
        },
        {
          type: "select",
          label: "是否显示用户",
          key: "showUser",
          defaultValue: "1",
          optionData: [
            { key: "0", value: "不显示" },
            { key: "1", value: "显示" }
          ]
        },
        {
          type: "select",
          label: "显示特服号",
          key: "showCode",
          defaultValue: "0",
          optionData: [
            { key: "0", value: "不显示" },
            { key: "1", value: "显示" }
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
    this.listSysProvince();
  },
  computed: {},
  methods: {
    /*
     * 获取省份列表
     * */
    listSysProvince() {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    // 获取统计
    queryUserSendDetailAll(data) {
      this.$http.report.queryUserSendDetailAll({ ...data }).then(res => {
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
