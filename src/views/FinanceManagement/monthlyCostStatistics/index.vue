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
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="createDate" label="日期" />
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="cardUnit" label="客户单价(分)" />
      <el-table-column prop="reductModel" label="计费方式">
        <template slot-scope="scope">
          {{ renderReductModel(scope.row.reductModel) }}
        </template>
      </el-table-column>
      <el-table-column prop="isDirectUser" label="客户类型">
        <template slot-scope="scope">
          {{ renderIsDirectUser(scope.row.isDirectUser) }}
        </template>
      </el-table-column>
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="succCount" label="消耗条数" />
      <el-table-column prop="gateway" label="通道号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="unitPrice" label="通道单价(分)" />
      <el-table-column label="商户消耗金额(元)">
        <template slot-scope="scope">
          {{ renderConsume(scope.row.cardUnit, scope.row.succCount, 0.01) }}
        </template>
      </el-table-column>
      <!-- cardUnit * succCount * 0.01 -->
      <el-table-column label="通道成本(元)">
        <template slot-scope="scope">
          {{ renderConsume(scope.row.unitPrice, scope.row.succCount, 0.01) }}
        </template>
      </el-table-column>
      <!-- unitPrice * succCount * 0.01 -->
      <el-table-column prop="stProfit" label="利润(元)" />
    </el-table>
    <p style="color: red">
      总消耗条数:{{ obj.succcAll }}&nbsp;&nbsp;总收入款(元):{{
        obj.shouRuAll
      }}&nbsp;&nbsp;总成本款(元):{{ obj.chengBenAll }}&nbsp;&nbsp;总利润(元):{{
        obj.profitAll
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
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "smsProfit",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "smsProfit",
      //搜索框数据
      // searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "input",
          label: "商户名称",
          key: "corpName",
          placeholder: "请输入商户名称"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
          placeholder: "请输入通道名称"
        },
        {
          type: "input",
          label: "销售",
          key: "saleMan",
          placeholder: "请输入销售"
        },
        {
          type: "daterange",
          label: "日期",
          key: ["", "startTime", "endTime"]
        }
      ],
      obj: {}
    };
  },
  methods: {
    exportData(form) {
      this.$axios
        .post("/smsProfit/exportSmsProfit", { data: { smsProfit: form } })
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    renderConsume(a, b, c) {
      const num = 10000;
      return (
        ((a * num) / num) *
        ((b * num) / num) *
        ((c * num) / num)
      ).toFixed(3);
    },
    renderReductModel(item) {
      if (item == "1") {
        return "预付提交计费";
      } else if (item == "2") {
        return "预付成功计费";
      } else if (item == "3") {
        return "后付提交计费";
      } else if (item == "4") {
        return "后付成功计费";
      } else {
        return "";
      }
    },
    renderIsDirectUser(item) {
      if (item == "1") {
        return "直客";
      } else if (item == "2") {
        return "不是直客(代理商)";
      } else {
        return "";
      }
    },
    //格式化表格数据且初始化数据
    _mxFormListData(data) {
      const params = { data: { smsProfit: this.searchParam } };
      this.$http.smsProfit.queryAll(params).then(res => {
        res.code === 200 ? (this.obj = res.data) : this.$message.error(res.msg);
      });
      data.forEach(item => {
        if (item.createDate) {
          item.createDate = new Date(item.createDate).Format("yyyy-MM-dd");
        }
      });
      return data;
    }
  }
};
</script>
