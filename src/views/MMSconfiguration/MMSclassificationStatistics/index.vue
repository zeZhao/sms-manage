<template>
  <div>
    <Search ref="Search" :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @exportData="exportData"
      @forms="forms" :add="false" @isChooseTime="searchedGetTimes">
      <template slot="Other">
        <el-button type="primary" @click="exportExe" style="margin-left: 15px">导出</el-button>
      </template>
    </Search>

    <el-table v-show="formData.statisticType === 2" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="gatewayRatio" label="通道占比" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRatio(scope.row.successRatio) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="统计日期" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime ? scope.row.createTime : '-' }}
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="formData.statisticType === 1" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          {{ renderOperaId(scope.row.operaId) }}
        </template>
      </el-table-column>
      <el-table-column prop="operatorRatio" label="运营商占比" min-width="100" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRatio(scope.row.successRatio) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="统计日期" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime ? scope.row.createTime : '-' }}
        </template>
      </el-table-column>
    </el-table>
    <el-table v-show="formData.statisticType === 3" :data="listData" highlight-current-row v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="province" label="省份名称" />
      <el-table-column prop="provinceRatio" label="省份占比" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column label="成功率">
        <template slot-scope="scope">
          {{ renderSuccessRatio(scope.row.successRatio) }}
        </template>
      </el-table-column>
    </el-table>

    <p style="color: red">
      <span v-if="isChooseTimeData.createStartTime || isChooseTimeData.createEndTime">
        <span v-if="isChooseTimeData.createStartTime">
          {{isChooseTimeData.createStartTime}}日
        </span>
        <span v-if="isChooseTimeData.createEndTime">
          <span v-if="isChooseTimeData.createStartTime">至 </span>{{isChooseTimeData.createEndTime}}日
        </span>
      </span>
      发送数: {{ tabBottomData.sendNum || 0 }}&nbsp;&nbsp; 成功数:{{
        tabBottomData.successNum || 0
      }}&nbsp;&nbsp; 失败数:{{ tabBottomData.failNum || 0 }}&nbsp;&nbsp;
      未知数:{{ tabBottomData.unknownNum || 0 }}
    </p>

    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';
import { deepClone } from "@/utils";
const operaIdArr = [
  { key: 1, value: '移动' },
  { key: 2, value: '联通' },
  { key: 3, value: '电信' },
  { key: 4, value: '国际' }
];
export default {
  mixins: [listMixin],
  data () {
    return {
      //接口地址
      searchAPI: {
        namespace: 'mmsClassificationStatistic',
        list: 'listByPage',
        tabBottomDataUrl: 'showStatistic'
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
          defaultValue: 2,
          isSpecial: true
        },
        {
          type: 'select',
          label: '通道',
          key: 'gatewayId',
          optionData: [
            { key: 1, value: '通道1' },
            { key: 2, value: '通道2' },
            { key: 3, value: '通道3' }
          ]
        }
      ],
      tabBottomData: {},
      formData: {},
      //省份数组
      provinceArr: [],
      //对象为引用类型 需要深度clone //搜索的时候重新获取一下
      isChooseTimeData: {}
    };
  },
  watch: {
    'formData.statisticType' (cur) {
      if (cur) {
        this.searchParam['statisticType'] = cur;
        this._mxGetList(); //重新请求数据
      }
      let data;
      switch (cur) {
        case 2:
          data = {
            type: 'select',
            label: '通道',
            key: 'gatewayId',
            optionData: [
              { key: 1, value: '通道1' },
              { key: 2, value: '通道2' },
              { key: 3, value: '通道3' }
            ]
          }
          this.formData.operaId = '';
          this.formData.province = '';
          break;
        case 1:
          data = {
            type: 'select',
            label: '运营商',
            key: 'operaId',
            optionData: operaIdArr
          }
          this.formData.gatewayId = '';
          this.formData.province = '';
          break;
        case 3:
          data = {
            type: 'select',
            label: '省份',
            key: 'province',
            optionData: this.provinceArr
          }
          this.formData.gatewayId = '';
          this.formData.operaId = '';
          break;
      }
      this.searchFormConfig[this.searchFormConfig.length - 1] = data;
    }
  },
  mounted () {
    //获取省份
    this.listProvince();
  },
  activated () {
    //从其他页面进来 默认统计类型为通道统计
    this.formData.statisticType = 2;
  },
  methods: {
    searchedGetTimes (form) {
      if (form.createStartTime || form.createEndTime) this.isChooseTimeData = deepClone(form);
    },
    forms (form) { this.formData = form },
    listProvince () {
      this.$http.listSysProvince({ data: { provinceName: '' } }).then(res => {
        let arr = [];
        if (res.data.length) {
          arr = res.data.map((v) => { return { key: v.provinceName, value: v.provinceName } });
        }
        this.provinceArr = arr;
      });
    },
    renderOperaId (x) {
      const idx = operaIdArr.findIndex(v => x === v.key);
      return idx !== -1 ? operaIdArr[idx].value : '-';
    },
    renderSuccessRatio (x) {
      return x ? (x * 100) + '%' : '-';
    },
    exportExe () {
      this.$refs.Search.handleExport();
    },
    exportData (form) {
      this.$http.mmsClassificationStatistic.exportData(form).then((res) => {
        if (res.code === 200) this.$exportToast();
      });
    }
  }
};
</script>