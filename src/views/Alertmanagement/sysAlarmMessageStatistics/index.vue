<template>
  <!--报警信息统计表-->
  <div class="sysAlarmMessageStatistics">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="650"
      style="width: 100%"
    >
      <el-table-column prop="errNum" label="错误码" />
      <el-table-column prop="alarmLevel" label="报警级别">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.alarmLevel === 0
                ? "提醒"
                : scope.row.alarmLevel === 1
                ? "一般"
                : scope.row.alarmLevel === 2
                ? "重要"
                : "严重"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="编号" />
      <el-table-column prop="useModule" label="应用模块" />
      <el-table-column prop="alerType" label="报警类型" />
      <el-table-column prop="count" label="	错误次数" />
      <el-table-column prop="proportion" label="占比" />
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
        list: "listAlarmMessageStatisticsByPage"
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
          type: "inputNum",
          label: "错误码",
          key: "errNum",
          placeholder: "错误码"
        },
        {
          type: "input",
          label: "应用模块",
          key: "useModule",
          placeholder: "请输入应用模块"
        },
        {
          type: "select",
          label: "预警级别",
          key: "alarmLevel",
          placeholder: "请选择预警级别",
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
          type: "input",
          label: "报警类型",
          key: "alerType",
          placeholder: "请输入报警类型"
        },
        {
          type: "daterange",
          label: "时间",
          key: ["", "startTime", "endTime"]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    _formatRequestData(data) {
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("yyyy-MM-dd 00:00:01");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("yyyy-MM-dd 23:59:59");
      }

      console.log(data, "------data");
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysAlarmMessageStatistics {
}
</style>
