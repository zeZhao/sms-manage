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
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="submitCount" label="提交数" />
      <el-table-column prop="sendCount" label="发送数" />
      <el-table-column prop="succCount" label="成功数" />
      <el-table-column prop="failCount" label="失败数" />
      <el-table-column prop="sendUnknownCount" label="未知数" />
      <el-table-column prop="sendSuccPercen" label="成功率">
        <template slot-scope="{row}">{{ row.sendSuccPercen ? parseFloat(row.sendSuccPercen).toFixed(2) : '-' }}</template>
      </el-table-column>
    </el-table>
    <p style="color: red">
      提交数: {{ tabBottomData.submitCount || 0 }}&nbsp;&nbsp; 发送数:{{
        tabBottomData.sendCount || 0
      }}&nbsp;&nbsp; 成功数:{{ tabBottomData.succCount || 0 }}&nbsp;&nbsp;
      失败数:{{ tabBottomData.failCount || 0 }}&nbsp;&nbsp; 未知数:{{
        tabBottomData.sendUnknownCount || 0
      }}&nbsp;&nbsp; 成功率:
      {{
        tabBottomData.sendSuccPercen && tabBottomData.sendSuccPercen !== 'NaN' ? (parseFloat(tabBottomData.sendSuccPercen).toFixed(2) || 0) : 0
      }}
    </p>
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
        namespace: 'reports',
        list: 'querySignSendStatic',
        tabBottomDataUrl: 'querySignSendTotal',
      },
      // 列表参数
      namespace: '',
      // isParamsNotData: true,
      isParamsNotData: false,
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
          key: 'corpName',
          placeholder: '请输入商户名称',
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId',
          placeholder: '请输入账户编号',
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'userName',
          placeholder: '请输入账户名称',
        },
        {
          type: 'input',
          label: '签名',
          key: 'sign',
          placeholder: '请输入签名',
        },
        {
          type: 'select',
          label: '所属类型',
          key: 'accountType',
          defaultValue: '',
          optionData: [
            { key: 1, value: '行业客户' },
            { key: 2, value: '营销客户' },
            { key: 3, value: 'vip客户' },
          ],
        },
        {
          type: 'daterange',
          label: '提交时间',
          key: ['', 'startTime', 'endTime'],
        },
      ],
      //请求表格下方展示数据的接口凭证
      tabBottomData: {},
    }
  },
  methods: {
    exportData(form) {
      const data = { ...this.pageObj, ...form }
      delete data.total
      this.$axios.post('/report/exportSignSendTotal', data).then((res) => {
        if (res.data.code === 200) this.$exportToast()
      })
    },
    exportExe() {
      this.$refs.Search.handleExport()
    },
  },
}
</script>