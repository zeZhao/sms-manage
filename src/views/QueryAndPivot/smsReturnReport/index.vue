<template>
  <!--返回报告-->
  <div class="smsReturnReport">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <el-table-column prop="code" label="特服号" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" width="110" show-overflow-tooltip/>
      <el-table-column prop="gateway" label="网关" show-overflow-tooltip />
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="error" label="错误描述" />
      <el-table-column prop="returnTime" label="返回报告时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.returnTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveTime" label="手机接收时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="gatewayTaking"
        label="通道耗时:秒"
        show-overflow-tooltip
      />
      <el-table-column
        prop="totalTaking"
        label="总耗时:秒"
        show-overflow-tooltip
      />
      <el-table-column prop="seqId" label="SEQID" show-overflow-tooltip />
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
        list: "selectReturnReportByPage",
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID",
        },
        {
          type: "inputNum",
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
          key: "seqId",
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
          key: "statusType",
          optionData: [
            { key: "1", value: "成功" },
            { key: "2", value: "失败" },
          ],
        },
        {
          type: "date",
          label: "返回日期",
          key: "returnTime",
          placeholder: "返回日期",
        },
        {
          type: "timerange",
          label: "返回状态报告时间",
          key: ["", "startTime", "endTime"],
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
      if (data.returnTime) {
        data.returnTime = new Date(data.returnTime).Format("yyyy-MM-dd");
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
