<template>
  <!--用户余额-->
  <div class="mmsUserGateway">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="企业/用户ID" />
      <el-table-column prop="userName" label="企业/用户名称" show-overflow-tooltip />
      <el-table-column prop="smsBalance" label="短信余额" />
      <!-- <el-table-column prop="mmsBalance" label="彩信余额" /> -->
      <el-table-column prop="debt" label="借款" />
      <el-table-column prop="unitPrice" label="单价" />
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{ scope.row.reductType === 1 ? '为用户id计费':'企业id计费' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oper" label="操作人" />
      <el-table-column label="操作时间" width="155">
        <template slot-scope="scope">{{(scope.row.pcreateTime?scope.row.pcreateTime:scope.row.operDate) | timeFormat}}</template>
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
        list: "queryByPage",
      },
      // 列表参数
      namespace: "userBalance",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业/用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称",
        },
        {
          type: "select",
          label: "类型",
          key: "selectType",
          defaultValue: 1,
          optionData: [
            {
              key: 0,
              value: "用户",
            },
            {
              key: 1,
              value: "企业",
            },
          ],
          placeholder: "请选择类型",
        },
      ],
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
