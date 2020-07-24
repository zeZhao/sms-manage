<template>
  <!--返回报告-->
  <div class="smsReturnReport">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <el-table-column prop="code" label="特服号" show-overflow-tooltip />
      <el-table-column prop="content" label="编号" show-overflow-tooltip />
      <el-table-column prop="mobile" label="状态" width="150" />
      <el-table-column prop="gateway" label="错误描述" />
      <el-table-column prop="operaId" label="返回报告时间" />
      <el-table-column prop="definiteTime" label="手机接收时间" show-overflow-tooltip />
      <el-table-column prop="submitTime" label="通道耗时:秒" show-overflow-tooltip />
      <el-table-column prop="pkTotal" label="总耗时:秒" show-overflow-tooltip />
      <el-table-column prop="seqid" label="SEQID" show-overflow-tooltip />
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
          key: "status",
          placeholder: "请输入状态",
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID",
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: "", value: "不限" },
            { key: "1", value: "成功" },
            { key: "0", value: "失败" },
          ],
        },
        {
          type: "date",
          label: "返回日期",
          key: "dayTime",
          placeholder: "返回日期",
        },
        {
          type: "timerange",
          label: "返回状态报告时间",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择返回状态报告时间",
        },
        // {
        //   type: "select",
        //   label: "省份",
        //   key: "province",
        //   placeholder: "请选择省份",
        //   optionData: [],
        // },
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
.smsReturnReport {
}
</style>
