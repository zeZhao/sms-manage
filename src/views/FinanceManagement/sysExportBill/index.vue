<template>
  <!--导出账单-->
  <div class="sysExportBill">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <h3>多月导出账单</h3>
    <el-row>
      <el-form v-model="searchData" :inline="true" label-width="120px">
        <el-form-item label="用户ID">
          <el-input v-model="searchData.userId"></el-input>
        </el-form-item>
        <el-form-item label="通道ID">
          <el-input v-model="searchData.gateway"></el-input>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="searchData.smsType">
            <el-option key="1" value="短信" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发账单月">
          <el-date-picker v-model="searchData.billDate" type="month"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束账单月">
          <el-date-picker v-model="searchData.endDate" type="month"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportMonthData">导出</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="gateway" label="通道id" />
      <el-table-column prop="smsType" label="类型" />
      <el-table-column prop="userId" label="提交数" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="reportNum" label="返回报告数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column prop="billDate" label="账单月" width="100" />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="exportMonthData(scope.row.userId)" type="text" size="small">导出</el-button>
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

export default {
  mixins: [listMixin],
  data() {
    return {
      searchData: {
        userId: "",
        gateway: "",
        smsType: "",
        billDate: "",
        endDate: "",
      },
      //接口地址
      searchAPI: {
        namespace: "sysExportBill",
        list: "list",
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corpId",
        },
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
        },
        {
          type: "inputNum",
          label: "通道ID",
          key: "gateway",
        },
        {
          type: "select",
          label: "账单类型",
          key: "smsType",
          optionData: [
            {
              key: 1,
              value: "短信",
            },
          ],
        },
        {
          type: "month",
          label: "账单月",
          key: "billDate",
        },
      ],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //导出
    exportMonthData(userId) {
      this.$http.sysExportBill.export({ userId }).then((res) => {
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        let url = window.URL.createObjectURL(blob);
        console.log(url);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", "月账单.xlsx");
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        window.URL.revokeObjectURL(url);
      });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { billDate } = data;
      if (billDate) {
        data.billDate = new Date(billDate).Format("yyyy-MM-dd");
      }
      return data;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
