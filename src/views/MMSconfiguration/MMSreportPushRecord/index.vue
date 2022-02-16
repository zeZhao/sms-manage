<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search>

    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="gatewayMmsId" label="账户编号" />
      <el-table-column prop="mmsId" label="账户名称" />
      <el-table-column prop="corpId" label="手机号" />
      <el-table-column prop="userId" label="模板编号" />
      <el-table-column prop="userName" label="CID" />
      <el-table-column prop="title" label="报告状态" />
      <el-table-column prop="sign" label="推送ID" />
      <el-table-column prop="submitTime" label="推送时间" width="135">
        <template slot-scope="scope">
          {{ scope.row.submitTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="sign" label="推送状态" />
      <el-table-column prop="sign" label="重复次数" />
      <el-table-column prop="sign" label="通道" />
    </el-table>

    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: 'mmsTemplateCheckRecord',
        list: 'listByPage'
      },
      // 列表参数
      namespace: '',
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId'
        },
        {
          type: 'inputNum',
          label: '通道编号',
          key: 'gateway'
        },
        {
          type: 'inputNum',
          label: 'CID',
          key: 'cid'
        },
        {
          type: 'inputNum',
          label: '手机号',
          key: 'mobile'
        },
        {
          type: 'input',
          label: 'SEQID',
          key: 'seqId'
        },
        {
          type: 'input',
          label: '报告状态',
          key: 'userName'
        },
        {
          type: 'inputNum',
          label: '推送ID',
          key: 'seqId1'
        },
        {
          type: 'select',
          label: '推送状态',
          key: 'checkStatus',
          optionData: [
            { key: 1, value: 'success' },
            { key: 2, value: 'fail' }
          ]
        },
        {
          type: 'date',
          label: '推送日期',
          key: 'pushTime',
          defaultValue: new Date()
        }
      ]
    };
  },
  methods: {}
};
</script>