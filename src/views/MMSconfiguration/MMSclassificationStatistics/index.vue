<template>
  <div>
    <Search ref="Search" :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @exportData="exportData"
      @forms="forms" :add="false">
      <template slot="Other">
        <el-button type="primary" @click="exportExe" style="margin-left: 15px">导出</el-button>
      </template>
    </Search>

    <el-table v-show="formData.status === 1" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="saleMan" label="通道名称" />
      <el-table-column prop="count" label="通道占比" />
      <el-table-column prop="sucCount" label="发送数" />
      <el-table-column prop="failCount" label="成功数" />
      <el-table-column prop="unCount" label="失败数" />
      <el-table-column prop="unCount" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRate(scope.row.sucCount, scope.row.count) }}
        </template>
      </el-table-column>
      <el-table-column prop="countDate" label="统计日期" min-width="150" />
    </el-table>
    <el-table v-show="formData.status === 2" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="saleMan" label="运营商" />
      <el-table-column prop="count" label="运营商占比" />
      <el-table-column prop="sucCount" label="发送数" />
      <el-table-column prop="failCount" label="成功数" />
      <el-table-column prop="unCount" label="失败数" />
      <el-table-column prop="unCount" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRate(scope.row.sucCount, scope.row.count) }}
        </template>
      </el-table-column>
      <el-table-column prop="countDate" label="统计日期" min-width="150" />
    </el-table>
    <el-table v-show="formData.status === 3" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="saleMan" label="省份名称" />
      <el-table-column prop="count" label="省份占比" />
      <el-table-column prop="sucCount" label="发送数" />
      <el-table-column prop="failCount" label="成功数" />
      <el-table-column prop="unCount" label="失败数" />
      <el-table-column prop="unCount" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRate(scope.row.sucCount, scope.row.count) }}
        </template>
      </el-table-column>
    </el-table>

    <p style="color: red">
      <span v-if="formData.startTime">
        {{formData.startTime}}日
      </span>
      <span v-if="formData.endTime">
        <span v-if="formData.startTime">至 </span>{{formData.endTime}}日
      </span>
      发送数: {{ tabBottomData.countAll || 0 }}&nbsp;&nbsp; 成功数:{{
        tabBottomData.sucCountAll || 0
      }}&nbsp;&nbsp; 失败数:{{ tabBottomData.failCountAll || 0 }}&nbsp;&nbsp;
      未知数:{{ tabBottomData.unCountAll || 0 }}
    </p>

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
        namespace: 'mmsClassificationStatistic',
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
          type: 'daterange',
          label: '统计日期',
          key: ['', 'createStartTime', 'createEndTime']
        },
        {
          type: 'select',
          label: '统计类型',
          key: 'statisticType',
          clearable: false,
          optionData: [
            { key: 2, value: '通道统计' },
            { key: 1, value: '运营商统计' },
            { key: 3, value: '省份统计' }
          ],
          defaultValue: 1,
          isSpecial: true
        },
        {
          type: 'select',
          label: '通道',
          key: 'status1',
          optionData: []
        }
      ],
      tabBottomData: {},
      formData: {},
      //省份数组
      provinceArr: []
    };
  },
  watch: {
    'formData.status' (cur) {
      let data;
      switch (cur) {
        case 1:
          data = {
            type: 'select',
            label: '通道',
            key: 'status1',
            optionData: []
          }
          break;
        case 2:
          data = {
            type: 'select',
            label: '运营商',
            key: 'status2',
            optionData: [
              { key: 1, value: '移动' },
              { key: 2, value: '联通' },
              { key: 3, value: '电信' }
            ]
          }
          break;
        case 3:
          data = {
            type: 'select',
            label: '省份',
            key: 'status3',
            optionData: this.provinceArr
          }
          break;
      }
      this.searchFormConfig[this.searchFormConfig.length - 1] = data;
    },
    listData (cur) {
      if (cur.length) this.tabBottomData = cur[0];
    }
  },
  mounted () {
    //获取省份
    this.listProvince();
  },
  activated () {
    //从其他页面进来 默认统计类型为通道统计
    this.formData.status = 1;
  },
  methods: {
    forms (form) {
      this.formData = form;
    },
    listProvince () {
      this.$http.listSysProvince({ data: { provinceName: '' } }).then(res => {
        let arr = [];
        if (res.data.length) {
          arr = res.data.map((v) => { return { key: v.provinceName, value: v.provinceName } });
        }
        this.provinceArr = arr;
      });
    },
    renderSuccessRate (a, b) {
      return ((a / b) * 100).toFixed(2) + '%';
    },
    exportExe () {
      this.$refs.Search.handleExport();
    },
    exportData (form) {
      this.$http.mmsReportStatistic.exportReportStatistic(form).then((res) => {
        if (res.code === 200) this.$exportToast();
      });
    }
  }
};
</script>