<template>
  <!--导出账单-->
  <div class="sysExportBill">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <h3>按照筛选条件导出多月账单</h3>
    <el-row>
      <el-form v-model="searchData" inline label-width="120px">
        <el-form-item label="账户编号">
          <el-input v-model="searchData.userId" type="number" placeholder="请输入账户编号"></el-input>
        </el-form-item>
        <el-form-item label="通道编号">
          <el-input v-model="searchData.gateway" type="number" placeholder="请输入通道编号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="账单类型">
          <el-select v-model="searchData.smsType" placeholder="请选择账单类型">
            <el-option key="1" value="1" label="短信" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="月份">
          <el-date-picker
            v-model="searchData.nowDate"
            type="monthrange"
            value-format="yyyy-MM"
            range-separator="-"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportMonthData('all')">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="smsType" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.smsType === 1">短信</span>
          <span v-if="scope.row.smsType === 2">彩信</span>
          <span v-if="scope.row.smsType === 3">屏信</span>
          <span v-if="scope.row.smsType === 4">语音</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === 0">非法</span>
          <span v-if="scope.row.operaId === 1">移动</span>
          <span v-if="scope.row.operaId === 2">联通</span>
          <span v-if="scope.row.operaId === 3">电信</span>
          <span v-if="scope.row.operaId === 4">国际</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="submitNum" label="提交数" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="reportNum" label="返回报告数" width="100" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column prop="billDate" label="账单月" width="100" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="exportMonthData('scope', scope.row)"
            type="text"
            size="small"
            >导出</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

function renderMonth(value = new Date()) {
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  return year + "-" + (month < 10 ? "0" + month : month);
}

export default {
  mixins: [listMixin],
  data() {
    return {
      searchData: {
        userId: "",
        gateway: "",
        smsType: "",
        nowDate: [renderMonth(), renderMonth()],
        billDate: "",
        endDate: ""
      },
      //接口地址
      searchAPI: {
        namespace: "sysExportBill",
        list: "list"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        // {
        //   type: "inputNum",
        //   label: "商户编号",
        //   key: "corpId"
        // },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        },
        // {
        //   type: "select",
        //   label: "账单类型",
        //   key: "smsType",
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "短信"
        //     }
        //   ]
        // },
        {
          type: "month",
          label: "账单月",
          key: "billDate",
          clearable: false,
          defaultValue: new Date()
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //导出
    exportMonthData(type, row) {
      let params = {};
      if (type === "scope") {
        const data = { ...row };
        if (!data.endDate || data.endDate === "-") {
          data.endDate = "";
        }
        params = { ...data };
      } else if (type === "all") {
        params = { ...this.searchData };
        params.billDate = params.nowDate[0] || "";
        params.endDate = params.nowDate[1] || "";
        delete params.nowDate;
      }
      const fileName = `${row ? row.billDate : ""}月账单.xlsx`;
      this.downloadFileByFile("post", type === "all" ? "/bill/export/exportUp" : "/bill/export/exportDown", params, fileName);
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { billDate } = data;
      if (billDate) {
        data.billDate = new Date(billDate).Format("yyyy-MM");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
