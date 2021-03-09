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
      <el-table-column prop="stProfit" label="发送成功总数" />
      <el-table-column prop="createDate" label="发送时间" />
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
        namespace: 'smsProfit',
        list: 'queryByPage',
      },
      // 列表参数
      namespace: 'smsProfit',
      //搜索框数据
      // searchParam: {},
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
          type: 'date',
          label: '发送时间',
          key: 'time',
        },
      ],
    }
  },
  methods: {
    exportData(form) {
      const flag = {
        responseType: 'blob',
        headers: { token: window.localStorage.getItem('token') },
      }
      this.$axios
        .post('/smsProfit/exportSmsProfit', { data: { smsProfit: form } }, flag)
        .then((res) => {
          const aLink = document.createElement('a')
          aLink.style.display = 'none'
          aLink.setAttribute('download', '月成本统计.xlsx')
          const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          })
          const url = window.URL.createObjectURL(blob)
          aLink.href = url
          document.body.appendChild(aLink)
          aLink.click()
          document.body.removeChild(aLink)
          window.URL.revokeObjectURL(url)
        })
    },
    exportExe() {
      this.$refs.Search.handleExport()
    },
    //格式化表格数据且初始化数据
    _mxFormListData(data) {
      data.forEach((item) => {
        if (item.createDate) {
          item.createDate = new Date(item.createDate).Format('yyyy-MM-dd')
        }
      })
      return data
    },
  },
}
</script>