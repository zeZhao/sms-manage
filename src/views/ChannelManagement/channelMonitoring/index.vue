<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>

    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="gateway" label="通道编号"
        ><template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.gateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="monitorTime" label="监控日期" width="135">
        <template slot-scope="scope">{{
          scope.row.monitorTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column
        prop="linkStatus"
        label="链接状态(0正常)其他失败"
        width="160"
      />
      <el-table-column prop="current_SendSpeed" label="	发送速度" />
      <el-table-column prop="max_SendSpeed" label="最大发送速度" />
      <el-table-column prop="current_ReportSpeed" label="报告接收速度" />
      <el-table-column
        prop="max_ReportSpeed"
        label="最大报告接收速度"
        width="150"
      />
      <el-table-column prop="today_Submit_Count" label="提交个数" />
      <el-table-column prop="today_Submit_SuccCount" label="提交成功个数" />
      <el-table-column prop="today_Submit_FailCount" label="提交失败个数" />
      <el-table-column prop="today_Submit_TimeoutCount" label="提交超时个数" />
      <el-table-column prop="today_report_Count" label="回执报告个数" />
      <el-table-column prop="today_mo_Count" label="上行个数" />
      <el-table-column prop="today_overstock_batch" label="通道积压批次" />
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
export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "smsGatewayMonitor",
        list: "listGatewayMonitorByPage"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        },
        {
          type: "select",
          label: "链接状态",
          key: "linkStatus",
          defaultValue: "",
          optionData: [
            { key: "", value: "全部" },
            { key: "0", value: "正常" },
            { key: "1", value: "异常" }
          ]
        }
      ]
    };
  }
};
</script>
