<template>
  <!--报警信息-->
  <div class="sysAlarmMessage">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table :data="listData" border highlight-current-row style="width: 100%">
      <el-table-column prop="num" label="账户/通道编号" />
      <el-table-column prop="errNum" label="错误码" />
      <el-table-column prop="serverNum" label="服务器编号	" />
      <el-table-column prop="count" label="	错误次数" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="useModule" label="应用模块" />
      <el-table-column prop="alarmLevel" label="报警级别">
        <template slot-scope="scope">
          <span>{{
            scope.row.alarmLevel === 0
              ? "提醒"
              : scope.row.alarmLevel === 1
              ? "一般"
              : scope.row.alarmLevel === 2
              ? "重要"
              : "严重"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="occurTime" label="发生时间" width="135">
        <template slot-scope="scope">{{
          scope.row.occurTime | timeFormat
        }}</template>
      </el-table-column>
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
        namespace: "sysAlarmMessage",
        list: "listAlarmMessageByPage"
      },
      // 列表参数
      namespace: "alarmMessage",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "编号",
          key: "num",
          placeholder: "请输入编号"
        },
        {
          type: "input",
          label: "服务器编号",
          key: "serverNum",
          placeholder: "请输入服务器编号"
        },
        {
          type: "input",
          label: "应用模块",
          key: "useModule",
          placeholder: "请输入应用模块"
        },
        {
          type: "select",
          label: "报警级别",
          key: "alarmLevel",
          placeholder: "请选择报警级别",
          optionData: [
            {
              key: 0,
              value: "提醒"
            },
            {
              key: 1,
              value: "一般"
            },
            {
              key: 2,
              value: "重要"
            },
            {
              key: 3,
              value: "严重"
            }
          ]
        },
        {
          type: "inputNum",
          label: "错误码",
          key: "errNum"
        },
        {
          type: "date",
          label: "发生时间",
          key: "occurTime"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
>>> .el-input__suffix {
  height: 90% !important;
}
</style>
