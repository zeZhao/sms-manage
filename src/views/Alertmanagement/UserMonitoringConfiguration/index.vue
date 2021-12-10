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
      max-height="500"
      highlight-current-row
      height="650"
      style="width: 100%"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名" />
      <el-table-column prop="sendMonitor" label="发送监控">
        <template slot-scope="scope">
          {{ scope.row.sendMonitor ? scope.row.sendMonitor : "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="arrivalrate" label="到达率监控">
        <template slot-scope="scope">
          {{ scope.row.arrivalrate ? scope.row.arrivalrate : "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="balanceMonitor" label="余额监控">
        <template slot-scope="scope">
          {{ scope.row.balanceMonitor ? scope.row.balanceMonitor : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="330">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row.userId, 1)"
            >发送监控配置</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row.userId, 2)"
            >到达率监控配置</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row.userId, 3)"
            >余额监控配置</el-button
          >
        </template>
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
        namespace: "sysAlarmUser",
        list: "queryAlarmUserByPage"
      },
      // 列表参数
      // namespace: 'sysAlarmUser',
      //删除列表传参所包含的data对象
      isParamsNotData: false,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "input",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "select",
          label: "到达率监控",
          key: "arrivalrate",
          optionData: [
            {
              key: 1,
              value: "开启"
            },
            {
              key: 0,
              value: "关闭"
            }
          ]
        },
        {
          type: "select",
          label: "余额监控",
          key: "balanceMonitor",
          optionData: [
            {
              key: 1,
              value: "开启"
            },
            {
              key: 0,
              value: "关闭"
            }
          ]
        }
      ]
    };
  },
  //从配置页面返回过来重新刷新列表
  activated() {
    this._mxGetList();
  },
  methods: {
    //各个监控配置的处理
    monitoringConfig(userId, userAlarmType) {
      this.$router.push({
        name: "UserMonitoringConfigurationType",
        query: { userId, userAlarmType }
      });
    }
  }
};
</script>
