<template>
  <!--用户余额-->
  <div class="mmsUserGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :isOther="true"
    >
      <template v-slot:Other="form">
        <el-button type="primary" @click="exported(form)" size="small"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="smsBalance" label="短信余额(条)" />
      <el-table-column prop="debt" label="短信借款(条)" />
      <el-table-column prop="unitPrice" label="短信单价(分)" />
      <el-table-column prop="mmsBalance" label="彩信余额(条)" />
      <el-table-column prop="mmsDebt" label="彩信借款(条)" />
      <el-table-column prop="mmsCardUnit" label="彩信单价(分)" />
      <el-table-column prop="saleMan" label="销售" />
      <!-- <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType === 1 ? "账户计费" : "商户id计费"
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="operaName" label="操作人" />
      <el-table-column label="操作时间" width="135">
        <template slot-scope="scope">{{
          scope.row.operDate | timeFormat
        }}</template>
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
      //接口地址
      searchAPI: {
        namespace: "corpUserBalance",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "userBalance",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        }
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "selectType",
        //   defaultValue: 0,
        //   optionData: [
        //     {
        //       key: 0,
        //       value: "账户"
        //     }
        //   ],
        //   placeholder: "请选择类型"
        // }
      ]
    };
  },
  mounted() {},
  activated() {
    this._mxGetList();
  },
  computed: {},
  methods: {
    /**
     * 调整筛选条件提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      data.selectType = 0;
      return data;
    },
    exported(form) {
      this.$http.corpUserBalance.export({ ...form.form }).then(res => {
        if (res.code === 200) {
          this.$message.success("提交下载成功，请前往下载中心下载文件。");
        }
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
