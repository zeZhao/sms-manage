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
      <el-form v-model="searchData" :inline="true" label-width="120px">
        <el-form-item label="账户编号">
          <el-input v-model="searchData.userId"></el-input>
        </el-form-item>
        <el-form-item label="通道编号">
          <el-input v-model="searchData.gateway"></el-input>
        </el-form-item>
        <el-form-item label="账单类型">
          <el-select v-model="searchData.smsType">
            <el-option key="1" value="1" label="短信" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始账单月">
          <el-date-picker
            value-format="yyyy-MM"
            v-model="searchData.billDate"
            type="month"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束账单月">
          <el-date-picker
            value-format="yyyy-MM"
            v-model="searchData.endDate"
            type="month"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportMonthData('all')"
            >导出</el-button
          >
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
      <el-table-column prop="gateway" label="通道id" />
      <el-table-column prop="smsType" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.smsType === 1">短信</span>
          <span v-if="scope.row.smsType === 2">彩信</span>
          <span v-if="scope.row.smsType === 3">屏信</span>
          <span v-if="scope.row.smsType === 4">语音</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === 0">非法</span>
          <span v-if="scope.row.operaId === 1">移动</span>
          <span v-if="scope.row.operaId === 2">联通</span>
          <span v-if="scope.row.operaId === 3">电信</span>
          <span v-if="scope.row.operaId === 4">国际</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="submitNum" label="提交数" /> -->
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="reportNum" label="返回报告数" />
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

export default {
  mixins: [listMixin],
  data() {
    return {
      searchData: {
        userId: "",
        gateway: "",
        smsType: "",
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
      isParamsNotData: true,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId"
        },
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
        {
          type: "select",
          label: "账单类型",
          key: "smsType",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ]
        },
        {
          type: "month",
          label: "账单月",
          key: "billDate"
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
        params = { ...row };
      } else if (type === "all") {
        params = { ...this.searchData };
      }
      let fileName = `${row ? row.billDate : ""}月账单.xlsx`;

      this.downloadFileByFile("post", "/bill/export/", params, fileName);
      // if()
      // this.$http.sysExportBill.export({ userId }).then((res) => {
      //   let blob = new Blob([res.data], {
      //     type: "application/vnd.ms-excel;charset=utf-8",
      //   });
      // console.log(this.searchData, "---this.searchData ");
      // this.$axios
      //   .post(
      //     "/bill/export/",
      //     { ...params },
      //     {
      //       responseType: "blob",
      //       headers: { token: window.localStorage.getItem("token") }
      //     }
      //   )
      //   .then(res => {
      //     if (res.data.type == "application/octet-stream") {
      //       let blob = new Blob([res.data], {
      //         type: "application/vnd.ms-excel;charset=utf-8"
      //       });
      //       let url = window.URL.createObjectURL(blob);
      //       let aLink = document.createElement("a");
      //       aLink.style.display = "none";
      //       aLink.href = url;
      //       aLink.setAttribute(
      //         "download",
      //         `${row ? row.billDate : ""}月账单.xlsx`
      //       );
      //       document.body.appendChild(aLink);
      //       aLink.click();
      //       document.body.removeChild(aLink);
      //       window.URL.revokeObjectURL(url);
      //     } else {
      //       this.$message.error("没有符合条件的账单");
      //     }
      //   });
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
