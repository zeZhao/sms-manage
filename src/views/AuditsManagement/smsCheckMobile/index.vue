<template>
  <!--审核号码-->
  <div class="mmsUserGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="mobile" label="手机号码">
        <template slot-scope="{row}">
          <span>{{ row.mobile.slice(0, 11) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="号码类型">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.type == 1
                ? "移动"
                : scope.row.type == 2
                ? "联通"
                : scope.row.type == 3
                ? "电信"
                : "其他"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="手机号的个数" />
      <el-table-column prop="status" label="处理状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">未处理</span>
          <span v-if="scope.row.status === '1'">已处理</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="unitPrice" label="分区字段" /> -->
      <el-table-column prop="createTime" label="提交日期" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
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
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "smsCheckMobile",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "checkMobile",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "CID",
          key: "cid",
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
          label: "提交日期",
          key: "createTime",
          placeholder: "请选择提交日期",
          defaultValue: new Date().Format("yyyy-MM-dd")
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
.mmsUserGateway {
}
</style>
