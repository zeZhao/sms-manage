<template>
  <!--提交记录-->
  <div class="sendLogFegin">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <el-table-column prop="protType" label="产品类型" />
      <!-- <template slot-scope="scope">
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
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
      <el-table-column prop="definiteTime" label="定时时间" show-overflow-tooltip />
      <el-table-column prop="submitTime" label="提交时间" show-overflow-tooltip />
      <el-table-column prop="pkTotal" label="PKTO TAL" show-overflow-tooltip />
      <el-table-column prop="pkNumber" label="PKNU MBER" show-overflow-tooltip />
      <el-table-column prop="pid" label="PID" show-overflow-tooltip />
    </el-table>
    <p style="color:red">总条数：{{statistics}}</p>
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
        namespace: "sendLogFegin",
        list: "selectSendLogByPage",
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
          label: "CID",
          key: "cid",
          placeholder: "请输入CID",
        },
        {
          type: "date",
          label: "提交日期",
          key: "dayTime",
          placeholder: "审核日期",
        },
        {
          type: "timerange",
          label: "提交时间",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择提交时间",
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
.sendLogFegin {
}
</style>
