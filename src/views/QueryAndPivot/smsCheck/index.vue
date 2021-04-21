<template>
  <!--审核查询-->
  <div class="smsCheck">
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
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column
        prop="loginName"
        label="账户名称"
        show-overflow-tooltip
      />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="counter" label="手机个数" show-overflow-tooltip />
      <el-table-column prop="cmCount" label="移动" />
      <el-table-column prop="cuCount" label="联通" />
      <el-table-column prop="ctCount" label="电信" />
      <el-table-column prop="checkStatus" label="审核状态">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.checkStatus === "0"
                ? "待审"
                : scope.row.checkStatus === "1"
                ? "正在审核"
                : scope.row.checkStatus === "2"
                ? "审核通过"
                : scope.row.checkStatus === "3"
                ? "拒绝"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="checker" label="审核根源" width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.source == '1'">没有配置免审</span>
          <span v-if="scope.row.source == '2'">敏感词</span>
          <span v-if="scope.row.source == '3'">模板不匹配</span>
          <span v-if="scope.row.source == '5'">数量超标</span>
          <span v-if="scope.row.source == '6'">组合redis出错</span>
          <span v-if="scope.row.source == '7'">组合超时</span>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column prop="combined" label="是否处理"
        ><template slot-scope="scope">
          <span v-if="scope.row.handleStatus == 0">未处理</span>
          <span v-if="scope.row.handleStatus == 1">已处理</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="审核人" />
      <el-table-column prop="submitTime" label="提交时间" min-width="170">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="checkDate" label="审核时间" min-width="170">
        <template slot-scope="scope">{{
          scope.row.checkDate | timeFormat
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
        namespace: "smsCheck",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "smsCheck",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "审核状态",
          key: "checkStatus",
          optionData: [
            // {
            //   key: "0",
            //   value: "待审"
            // },
            {
              key: "1",
              value: "正在审核"
            },
            {
              key: "2",
              value: "审核通过"
            },
            {
              key: "3",
              value: "拒绝"
            }
          ],
          placeholder: "审核状态"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
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
          type: "date",
          label: "审核日期",
          key: "checkDate",
          placeholder: "审核日期"
        },
        {
          type: "date",
          label: "提交日期",
          key: "startTime"
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
        data.startTime = new Date(data.startTime).Format("yyyy-MM-dd");
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
.smsCheck {
}
</style>
