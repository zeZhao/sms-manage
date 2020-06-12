<template>
  <!--待发-->
  <div class="smsSendTask">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="loginName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="hasSend" label="发送状态">
        <template slot-scope="scope">
          <span>{{ scope.row.hasSend === 0 ? "未发" : "已发送" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="definiteTime" label="定时时间" />
      <el-table-column prop="submitTime" label="提交时间" />
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
        namespace: "smsSendTask",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "sendTask",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "loginName",
          placeholder: "请输入用户名称"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "CID",
          key: "cId",
          placeholder: "请输入CID"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "input",
          label: "网关",
          key: "gateway",
          placeholder: "请输入网关"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择提交时间"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsSendTask {
}
</style>
