<template>
  <div>
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
      <el-table-column prop="errNum" label="商户编号" />
      <el-table-column prop="errNum" label="账户编号" />
      <el-table-column prop="errNum" label="账户名" />
      <el-table-column prop="alarmLevel" label="到达率监控">
        <template slot-scope="scope">
          {{ scope.row.alarmLevel === '0' ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column prop="alarmLevel" label="余额监控">
        <template slot-scope="scope">
          {{ scope.row.alarmLevel === '0' ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="330" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row, '1')"
            >发送监控配置</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row, '2')"
            >到达率监控配置</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="monitoringConfig(scope.row, '3')"
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
import listMixin from '@/mixin/listMixin'
export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: 'sysAlarmMessage',
        list: 'listAlarmMessageStatisticsByPage',
      },
      // 列表参数
      namespace: 'alarmMessage',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'input',
          label: '商户编号',
          key: 'num',
        },
        {
          type: 'input',
          label: '账户编号',
          key: 'num1',
        },
        {
          type: 'select',
          label: '到达率监控',
          key: 'alarmLevel',
          optionData: [
            {
              key: '0',
              value: '开启',
            },
            {
              key: '1',
              value: '关闭',
            },
          ],
        },
        {
          type: 'select',
          label: '余额监控',
          key: 'alarmLevel1',
          optionData: [
            {
              key: '0',
              value: '开启',
            },
            {
              key: '1',
              value: '关闭',
            },
          ],
        },
      ],
    }
  },
  methods: {
    //各个监控配置的处理
    monitoringConfig(row, type) {
      this.$router.push({
        name: 'UserMonitoringConfigurationType',
        query: { type },
      })
    },
  },
}
</script>