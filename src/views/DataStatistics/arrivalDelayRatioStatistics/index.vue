<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template slot="Other">
        <el-button type="primary" @click="exportExe" style="margin-left: 15px"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="商户名称" />
      <el-table-column prop="userName" label="通道编号" />
      <el-table-column prop="userName" label="通道名称" />
      <el-table-column prop="submitNum" label="发送总数" />
      <el-table-column prop="countDate" label="5秒以下" />
      <el-table-column prop="countDate" label="5-10秒" />
      <el-table-column prop="countDate" label="10-20秒" />
      <el-table-column prop="countDate" label="20-30秒" />
      <el-table-column prop="countDate" label="30-60秒" />
      <el-table-column prop="countDate" label="60秒以上" />
      <el-table-column prop="countDate" label="时间" />
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
        namespace: 'submitStatistics',
        list: 'submitStatistics',
      },
      // 列表参数
      namespace: '',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '商户编号',
          key: 'corpId',
          placeholder: '请输入商户编号',
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpId',
          placeholder: '请输入商户名称',
        },
        {
          type: 'input',
          label: '通道名称',
          key: 'corpId',
          placeholder: '请输入通道名称',
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'corpId',
          placeholder: '请输入账户编号',
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'corpId',
          placeholder: '请输入账户名称',
        },
        {
          type: 'daterange',
          label: '创建时间',
          key: ['', 'countDate', 'endDate'],
        },
      ],
    }
  },
  mounted() {},
  methods: {
    exportExe() {},
  },
}
</script>