<template>
  <!--短连接查询-->
  <div class="smsShortUrl">
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
      <el-table-column prop="userId" label="客户ID" />
      <el-table-column prop="activityName" label="活动名称" />
      <el-table-column prop="content" label="短信内容" show-overflow-tooltip />
      <el-table-column
        prop="activityUrl"
        label="活动链接"
        show-overflow-tooltip
      />
      <el-table-column prop="messageNum" label="短信条数" />
      <el-table-column prop="clickTimes" label="活动访问次数" />
      <el-table-column prop="createTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="defineTime" label="定时时间" width="150">
        <template slot-scope="scope">{{
          scope.row.defineTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" />
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
        namespace: "smsShortUrl",
        list: "queryByPage",
      },
      // 列表参数
      namespace: "shortUrl",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "inputNum",
          label: "任务ID",
          key: "taskId",
          placeholder: "请输入任务ID",
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容",
        },
        {
          type: "daterange",
          label: "时间",
          key: ["", "startTime", "endTime"],
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
.smsShortUrl {
}
</style>
