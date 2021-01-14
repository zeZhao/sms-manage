<template>
  <!--定时-->
  <div class="sysTimeTasklist">
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
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="mobile" label="手机号" width="120" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="operaid" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaid === 0">非法</span>
          <span v-else-if="scope.row.operaid === 1">移动</span>
          <span v-else-if="scope.row.operaid === 2">联通</span>
          <span v-else-if="scope.row.operaid === 3">电信</span>
          <span v-else-if="scope.row.operaid === 4">国际</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="status" label="状态(是否发送)" width="150">
        <template slot-scope="scope">
          <span>{{
            scope.row.status === 0
              ? "未发"
              : scope.row.status === 1
              ? "已发"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="definiteTime" label="定时时间" width="150">
        <template slot-scope="scope">{{
          scope.row.definiteTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
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
        namespace: "sysTimeTasklist",
        list: "listTimeTasklistByPage"
      },
      // 列表参数
      namespace: "sysTimeTasklist",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
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
          type: "inputNum",
          label: "网关",
          key: "gateway",
          placeholder: "请输入网关"
        },
        // {
        //   type: "input",
        //   label: "特服号",
        //   key: "code",
        //   placeholder: "请输入特服号"
        // },

        {
          type: "select",
          label: "是否发送",
          key: "status",
          optionData: [
            {
              key: "0",
              value: "未发送"
            },
            {
              key: "1",
              value: "已发送"
            }
          ],
          placeholder: "是否发送"
        },
        {
          type: "daterange",
          label: "定时时间",
          key: ["", "startTime", "endTime"]
        }
      ]
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
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("yyyy-MM-dd 00:00:00");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("yyyy-MM-dd 23:59:59");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysTimeTasklist {
}
</style>
