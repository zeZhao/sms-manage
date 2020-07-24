<template>
  <!--发送返回报告-->
  <div class="smsTxReturnReport">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <!-- <el-table-column prop="protType" label="产品类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.protType === 0
            ? "待审"
            : scope.row.protType === 1
            ? "正在审核"
            : scope.row.protType === 2
            ? "审核通过"
            : "拒绝"
            }}
          </span>
        </template>
      </el-table-column>-->
      <el-table-column prop="code" label="特服号" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" width="150" />
      <el-table-column prop="gateway" label="省份" />
      <el-table-column prop="operaId" label="运营商" />
      <el-table-column prop="operaId" label="状态" />
      <el-table-column prop="operaId" label="网关" />
      <el-table-column prop="submitTime" label="提交时间" show-overflow-tooltip />
      <el-table-column prop="sendTime" label="发送时间" show-overflow-tooltip />
      <el-table-column prop="pkTotal" label="返回报告时间" show-overflow-tooltip />
      <el-table-column prop="seqid" label="手机接收时间" show-overflow-tooltip />
      <el-table-column prop="seqid" label="通道状态" show-overflow-tooltip />
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
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
        namespace: "smsReturnReport",
        list: "searchSendReturnReport",
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID",
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号",
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容",
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号",
        },
        {
          type: "input",
          label: "网关编号",
          key: "gateway",
          placeholder: "请输入网关编号",
        },
        {
          type: "input",
          label: "SEQID",
          key: "seqid",
          placeholder: "请输入SEQID",
        },
        {
          type: "input",
          label: "状态",
          key: "hasSend",
          placeholder: "请输入状态",
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID",
        },
        {
          type: "date",
          label: "发送日期",
          key: "dayTime",
          placeholder: "发送日期",
        },
        {
          type: "timerange",
          label: "发送时间",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择发送时间",
        },
        {
          type: "select",
          label: "是否有状态",
          key: "status",
          placeholder: "请选择状态",
          optionData: [
            { key: "0", value: "不限" },
            { key: "1", value: "成功" },
            { key: "2", value: "失败" },
            { key: "3", value: "未知" },
          ],
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          placeholder: "请选择省份",
          optionData: [],
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          placeholder: "请选择运营商",
          optionData: [
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" },
          ],
        },
      ],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.dayTime) {
        data.dayTime = new Date(data.dayTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      return data;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
