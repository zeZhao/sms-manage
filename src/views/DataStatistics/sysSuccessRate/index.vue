<template>
  <!--成功率统计-->
  <div class="sysSuccessRate">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="用户编号" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="operator" label="运营商">
        <template slot-scope="scope">
          <span>{{
            scope.row.operaId === "1"
              ? "移动"
              : scope.row.operaId === "2"
              ? "联通"
              : scope.row.operaId === "3"
              ? "电信"
              : scope.row.operaId === "4"
              ? "国际"
              : scope.row.operaId === "0"
              ? "非法"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsType" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.smsType === "1"
              ? "短信"
              : scope.row.smsType === 2
              ? "彩信"
              : scope.row.smsType === 3
              ? "屏信"
              : scope.row.smsType === 4
              ? "语音"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitNum" label="提交数" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column label="成功率">
        <template slot-scope="scope"
          >{{ scope.row.successRate.toFixed(2) }}%</template
        >
      </el-table-column>
    </el-table>
    <!-- <p
      style="color:red"
    >用户总发送条数: {{statistics.sendNum}}&nbsp;&nbsp;用户总成功条数: {{statistics.successNum}}&nbsp;&nbsp;用户总成功率: {{statistics.successRate}}%&nbsp;&nbsp;用户总失败条数: {{statistics.failNum}}&nbsp;&nbsp;用户总失败率: {{statistics.failRate}}%&nbsp;&nbsp;用户总未知条数: {{statistics.unknownNum}}&nbsp;&nbsp;用户总未知率: {{statistics.unknownRate}}%</p>-->
    <!-- <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>-->
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
        namespace: "sysSuccessRate",
        list: "querySendDetail"
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
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "用户编号",
          key: "userId",
          placeholder: "请输入用户编号"
        },
        // {
        //   type: "input",
        //   label: "特服号",
        //   key: "code",
        // },
        {
          type: "inputNum",
          label: "通道",
          key: "gateway"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            { key: "0", value: "非法" },
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" },
            { key: "4", value: "国际" }
          ],
          placeholder: "请选择运营商"
        },
        {
          type: "select",
          label: "类型",
          key: "smsType",
          optionData: [
            { key: "1", value: "短信" }
            // { key: "2", value: "彩信" },
            // { key: "3", value: "屏信" },
            // { key: "4", value: "语音" },
          ],
          placeholder: "请选择类型"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      // console.log(this.searchParam, "--------aaaaa  ProvinceList");
      // if (this.searchParam.province) {
      //   let str = "";
      //   this.ProvinceList.forEach((item) => {
      //     if (item.provinceId === this.searchParam.province) {
      //       str = item.provinceName;
      //     }
      //   });
      //   this.searchParam.provinceName = str;
      // }
      if (rows && rows.length > 0) {
        rows.forEach(item => {
          item.corpId = this.searchParam.corpId;
          item.userId = this.searchParam.userId;
          item.gateway = this.searchParam.gateway;
          item.operator = this.searchParam.operaId;
          item.smsType = this.searchParam.smsType;
          if (!this.searchParam.userId) {
            item.userName = "";
          }
        });
        rows = [Object.assign(rows[0], this.searchParam)];
      }
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
