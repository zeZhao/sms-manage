<template>
  <!--用户通道统计-->
  <div class="userChannelStatistics">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" show-overflow-tooltip />
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="longCode" label="通道长号码" />
      <el-table-column prop="smsType" label="通道类型">
        <template slot-scope="scope">
          <span>{{ scope.row.smsType == 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="succcount" label="成功条数" />
      <el-table-column prop="share" label="占比" />
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
        namespace: "userChannelStatistics",
        list: "queryList",
      },
      // 列表参数
      namespace: "userChannelStatistics",
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
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称",
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId",
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
        },
        {
          type: "select",
          label: "通道类型",
          key: "reductType",
          optionData: [
            {
              key: 1,
              value: "短信",
            },
          ],
          placeholder: "请选择通道类型",
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "startTime", "endTime"],
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
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("yyyy-MM-dd");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("yyyy-MM-dd");
      }
      return data;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
