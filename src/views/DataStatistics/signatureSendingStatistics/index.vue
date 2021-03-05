<template>
  <!--返回报告统计-->
  <div class="userDailyBill">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template slot="Other">
        <el-button type="primary" @click="exportExe()" style="margin-left: 15px"
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
      <el-table-column prop="corpId" label="账户编号" />
      <el-table-column prop="userId" label="账户名称" />
      <el-table-column prop="userName" label="签名" />
      <el-table-column prop="userName" label="销售姓名" />
      <el-table-column prop="userName" label="省份" />
      <el-table-column prop="userName" label="发送条数" />
      <el-table-column prop="userName" label="成功数" />
      <el-table-column prop="userName" label="失败数" />
      <el-table-column prop="userName" label="未知数" />
      <el-table-column prop="userName" label="成功率" />
    </el-table>
    <p style="color: red">
      发送条数: {{ statistics.returnNum }}&nbsp;&nbsp;成功数:
      {{ statistics.successNum }}&nbsp;&nbsp;失败数:
      {{ statistics.failNum }}&nbsp;&nbsp;到达失败总数:
      {{ statistics.failNum }}&nbsp;&nbsp;未知数:
      {{ statistics.failNum }}
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
        namespace: 'returnReportStatistics',
        list: 'returnReportStatistics',
      },
      // 列表参数
      namespace: '',
      isParamsNotData: true,
      //搜索框数据
      searchParam: {
        // showDate: "1",
        // showCode: "1",
        // showGateway: "1",
      },
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
          key: 'userName',
          placeholder: '请输入商户名称',
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
          key: 'userName',
          placeholder: '请输入账户名称',
        },
        {
          type: 'input',
          label: '销售经理',
          key: 'userName',
          placeholder: '请输入销售经理',
        },
        {
          type: 'input',
          label: '签名',
          key: 'userName',
          placeholder: '请输入签名',
        },
        {
          type: 'select',
          label: '所属类型',
          key: 'showDate',
          defaultValue: '',
          optionData: [
            { key: '0', value: '类型1' },
            { key: '1', value: '类型2' },
          ],
        },
        {
          type: 'select',
          label: '通道',
          key: 'showGateway',
          defaultValue: '',
          optionData: [
            { key: '0', value: '通道1' },
            { key: '1', value: '通道2' },
          ],
        },
        {
          type: 'daterange',
          label: '提交时间',
          key: ['', 'countDate', 'endDate'],
        },
      ],
      statistics: {},
    }
  },
  mounted() {
    this.queryUserSendDetailAll()
  },
  computed: {},
  methods: {
    // 获取统计
    queryUserSendDetailAll(searchParam) {
      this.$http.returnReportStatistics
        .returnReportTotal({ ...searchParam })
        .then((res) => {
          this.statistics = Object.assign({}, res.data)
        })
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { countDate, endDate } = data
      if (countDate) {
        data.countDate = new Date(countDate).Format('yyyy-MM-dd')
      }
      if (endDate) {
        data.endDate = new Date(endDate).Format('yyyy-MM-dd')
      }
      this.queryUserSendDetailAll(data)
      console.log(this.searchParam, 'searchParam')
      return data
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      rows.forEach((item) => {
        const { sendNum } = item
        let proportion = parseInt((sendNum / this.statistics.sendNum) * 100)
        // if (!succCount) {
        //   item.succCount = 0;
        // }
        // if (!foreignPrice) {
        //   item.foreignPrice = 0;
        // }
        this.$set(item, 'proportion', `${proportion}%`)
      })

      // if()
      return rows
    },

    //导出
    exportExe() {},
  },
  watch: {},
}
</script>

<style lang="scss" scoped>
</style>