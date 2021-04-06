<template>
  <div>
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @exportData="exportData"
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
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="saleMan" label="销售员" />
      <el-table-column prop="count" label="发送数" />
      <el-table-column prop="sucCount" label="成功数" />
      <el-table-column prop="failCount" label="失败数" />
      <el-table-column prop="unCount" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRate(scope.row.sucCount, scope.row.count) }}
        </template>
      </el-table-column>
      <el-table-column prop="countDate" label="统计日期" min-width="150" />
    </el-table>
    <p style="color: red">
      发送数: {{ tabBottomData.countAll || 0 }}&nbsp;&nbsp; 成功数:{{
        tabBottomData.sucCountAll || 0
      }}&nbsp;&nbsp; 失败数:{{ tabBottomData.failCountAll || 0 }}&nbsp;&nbsp;
      未知数:{{ tabBottomData.unCountAll || 0 }}
    </p>
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
      //接口地址
      searchAPI: {
        namespace: 'mmsReportStatistic',
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
          label: '商户编号',
          key: 'corpId'
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpName'
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
          type: 'input',
          label: '销售员',
          key: 'saleMan'
        },
        {
          type: 'daterange',
          label: '统计日期',
          key: ['', 'startTime', 'endTime']
          // defaultValue: ['', this.initDate(), this.initDate()]
        }
      ],
      tabBottomData: {}
    };
  },
  watch: {
    listData(cur) {
      if (cur.length) this.tabBottomData = cur[0];
    }
  },
  methods: {
    //今日日期的初始化以及时间不满足补0
    initDate() {
      const date = new Date().toLocaleDateString().split('/');
      const renderDate = date.map((v) => (v < 10 ? '0' + v : v));
      return renderDate.join('-');
    },
    renderSuccessRate(a, b) {
      return ((a / b) * 100).toFixed(2) + '%';
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    exportData(form) {
      this.$http.mmsReportStatistic.exportReportStatistic(form).then((res) => {
        if (res.code === 200) this.$exportToast();
      });
    }
  }
};
</script>