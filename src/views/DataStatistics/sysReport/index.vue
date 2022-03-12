<template>
  <!--用户日账单-->
  <div class="userDailyBill">
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
      <el-table-column
        prop="userId"
        label="账户编号"
        v-if="searchParam.showUser === '1'"
        key="userId"
      />
      <el-table-column
        prop="userName"
        label="账户名称"
        v-if="searchParam.showUser === '1'"
        key="userName"
        width="120"
      />
      <el-table-column
        prop="gateway"
        label="通道"
        v-if="searchParam.showGateway === '1'"
        key="gateway"
      />
      <el-table-column
        prop="gatewayName"
        label="通道名称"
        v-if="searchParam.showGateway === '1'"
        key="gatewayName"
      />
      <el-table-column
        prop="province"
        label="省份"
        v-if="searchParam.showProvince === '1'"
        key="province"
      />
      <el-table-column
        prop="operaId"
        label="运营商"
        v-if="searchParam.showOpera === '1'"
        key="operaId"
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
        key="code"
      />
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
      <el-table-column prop="sendNum" label="发送条数" key="sendNum" />
      <el-table-column prop="successNum" label="成功数" key="successNum" />
      <el-table-column prop="failNum" label="失败数" key="failNum" />
      <el-table-column prop="unknownNum" label="未知数" key="unknownNum" />
      <el-table-column prop="successRate" label="成功率" key="successRate">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.successRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="failRate" label="失败率" key="failRate">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.failRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="unknownRate" label="未知率" key="unknownRate">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.unknownRate).toFixed(2) }}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="percentage" label="占比" key="percentage" />
    </el-table>
    <p style="color: red;font-size: 12px;">
      总发送条数: {{ statistics.sendNum || 0 }}&nbsp;&nbsp;总成功条数:
      {{ statistics.successNum || 0 }}&nbsp;&nbsp;总成功率:
      {{
        statistics.successRate !== undefined
          ? Number(statistics.successRate).toFixed(2) + "%"
          : "0"
      }}&nbsp;&nbsp;总失败条数:
      {{ statistics.failNum || 0 }}&nbsp;&nbsp;总失败率:
      {{
        statistics.failRate !== undefined
          ? Number(statistics.failRate).toFixed(2) + "%"
          : "0"
      }}&nbsp;&nbsp;总未知条数:
      {{ statistics.unknownNum || 0 }}&nbsp;&nbsp;总未知率:
      {{
        statistics.unknownRate !== undefined
          ? Number(statistics.unknownRate).toFixed(2) + "%"
          : "0"
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
import { getDateToString } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
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
        {
          type: "inputNum",
          label: "通道号",
          key: "gateway"
        },
        {
          type: "inputNum",
          label: "特服号",
          key: "code"
        },
        {
          type: "select",
          label: "类型",
          key: "smsType",
          optionData: [
            { key: "1", value: "短信" }
            // { key: "2", value: "彩信" },
            // { key: "3", value: "屏信" },
            // { key: "4", value: "语音" }
          ]
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
          key: ["", "countDate", "endDate"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ],
      statistics: {},
      isParamsNotData: false
    };
  },
  activated() {
    this.listSysProvince();
  },
  methods: {
    exportData(form) {
      this.$axios
        .get("/report/exportUserSendDetail", {
          params: form
        })
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
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
                key: t.provinceName,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    // 获取统计
    async queryUserSendDetailAll(data) {
      const res = await this.$http.report.queryUserSendDetailAll({ ...data });
      this.statistics = res.data;
    },
    // 修改搜索参数
    async _formatRequestData(data) {
      await this.queryUserSendDetailAll(data);
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
      rows.forEach(item => {
        const { sendNum } = item;
        this.$set(item, "percentage", `${((sendNum / this.statistics.sendNum) * 100).toFixed(2)}%`);
      })
      return rows;
    }
  }
};
</script>