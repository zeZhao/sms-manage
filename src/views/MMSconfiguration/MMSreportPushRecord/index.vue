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
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="mmsId" label="模板编号" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="returnStatus" label="报告状态" />
      <el-table-column prop="pushId" label="推送ID" />
      <el-table-column prop="pushTime" label="推送时间" width="135">
        <template slot-scope="scope">
          {{ scope.row.pushTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="pushStatus" label="推送状态">
        <template slot-scope="scope">
          {{ scope.row.pushStatus === 1 ? 'success' : 'fail' }}
        </template>
      </el-table-column>
      <el-table-column prop="pushNum" label="重复次数" />
      <el-table-column prop="seqId" label="SEQID" />
      <el-table-column prop="gatewayId" label="通道" />
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
import { getDateToString } from '@/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: 'mmsPushLog',
        list: 'queryByPage'
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
          key: 'gatewayId'
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
          key: 'returnStatus'
        },
        {
          type: 'inputNum',
          label: '推送ID',
          key: 'pushId'
        },
        {
          type: 'select',
          label: '推送状态',
          key: 'pushStatus',
          optionData: [
            { key: 1, value: 'success' },
            { key: 2, value: 'fail' }
          ]
        },
        {
          type: 'date',
          label: '推送日期',
          key: 'pushTime',
          defaultValue: getDateToString()
        }
      ]
    };
  },
  methods: {
    _formatRequestData(data) {
      for(let i in data) {
        if (data[i] === "") {
          data[i] = null;
        }
      }
      return data;
    }
  }
};
</script>