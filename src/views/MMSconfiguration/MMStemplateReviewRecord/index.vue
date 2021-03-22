<template>
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="mmsId" label="上游模板编号" />
      <el-table-column prop="mmsId" label="模板编号" />
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="title" label="彩信标题" />
      <el-table-column prop="title" label="签名" />
      <el-table-column prop="title" label="提交类型" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          {{ renderOperaId(scope.row.operaId) }}
        </template>
      </el-table-column>
      <el-table-column prop="province" label="通道编号" />
      <el-table-column prop="status" label="审核状态" />
      <el-table-column prop="submitTime" label="提交时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.submitTime | timeFormat }}
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';
export default {
  mixins: [listMixin],
  data () {
    return {
      //接口地址
      searchAPI: {
        namespace: 'mmsSendReturnReport',
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
          label: '模板编号',
          key: 'corpId'
        },
        {
          type: 'inputNum',
          label: '商户编号',
          key: 'corpId'
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId'
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'userName'
        },
        {
          type: 'select',
          label: '运营商',
          key: 'operaId',
          optionData: [
            { key: 0, value: '三网' },
            { key: 1, value: '移动' },
            { key: 2, value: '联通' },
            { key: 3, value: '电信' },
            { key: 4, value: '移动、联通' },
            { key: 5, value: '移动、电信' },
            { key: 6, value: '联通、电信' }
          ]
        },
        {
          type: 'input',
          label: '彩信标题',
          key: 'title'
        },
        {
          type: 'input',
          label: '签名',
          key: 'mobile'
        },
        {
          type: 'select',
          label: '审核状态',
          key: 'province',
          optionData: [
            { key: 1, value: '审核通过' },
            { key: 2, value: '审核驳回' },
            { key: 3, value: '已删除' }
          ]
        },
        {
          type: 'daterange',
          label: '提交时间',
          key: ['', 'startSubmitTime', 'endSubmitTime']
        }
      ]
    }
  },
  methods: {
    renderOperaId (v) {
      if (v === 0) {
        return '非法';
      } else if (v === 1) {
        return '移动';
      } else if (v === 2) {
        return '联通';
      } else if (v === 3) {
        return '电信';
      } else if (v === 4) {
        return '国际';
      } else if (v) {
        return v;
      } else {
        return '-';
      }
    }
  }
};
</script>