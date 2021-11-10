<template>
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false" :notSearch="notSearch">
    </Search>
    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" show-overflow-tooltip />
      <el-table-column prop="corpName" label="商户名称" show-overflow-tooltip />
      <el-table-column prop="userId" label="账户编号" show-overflow-tooltip />
      <el-table-column prop="userName" label="账户名称" show-overflow-tooltip />
      <el-table-column prop="mmsId" label="模板编号" show-overflow-tooltip />
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip />
      <el-table-column prop="title" label="彩信标题" show-overflow-tooltip />
      <el-table-column prop="operaId" label="运营商" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ renderOperaId(scope.row.operaId) }}
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省份" show-overflow-tooltip />
      <el-table-column prop="status" label="发送状态" show-overflow-tooltip />
      <el-table-column prop="submitTime" label="提交时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.submitTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="returnTime" label="返回状态报告时间" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.returnTime | timeFormat }}
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
      //默认进入该页面不查询
      notSearch: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: 'datetime',
          label: '提交时间',
          key: ['', 'startSubmitTime', 'endSubmitTime']
        },
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
          label: 'CID',
          key: 'cid'
        },
        {
          type: 'inputNum',
          label: '模板编号',
          key: 'mmsId'
        },
        {
          type: 'input',
          label: '彩信标题',
          key: 'title'
        },
        {
          type: 'inputNum',
          label: '手机号码',
          key: 'mobile'
        },
        {
          type: 'select',
          label: '运营商',
          key: 'operaId',
          optionData: [
            { key: 0, value: '非法' },
            { key: 1, value: '移动' },
            { key: 2, value: '联通' },
            { key: 3, value: '电信' },
            { key: 4, value: '国际' }
          ]
        },
        {
          type: 'select',
          label: '省份',
          key: 'province',
          optionData: []
        }
      ]
    };
  },
  mounted () {
    this.listProvince();
  },
  methods: {
    /*
     * 获取省份列表
     * */
    listProvince () {
      this.$http.listSysProvince({ data: { provinceName: '' } }).then((res) => {
        this.searchFormConfig[10].optionData = res.data.map((v) => {
          return { key: v.provinceName, value: v.provinceName };
        });
      });
    },
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