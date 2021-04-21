<template>
  <!--提交记录-->
  <div class="sendLogFegin">
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
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" show-overflow-tooltip />
      <el-table-column prop="submitType" label="产品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.submitType == 1">web端</span>
          <span v-if="scope.row.submitType == 2">http接口</span>
          <span v-if="scope.row.submitType == 3">cmpp接口</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="特服号" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" show-overflow-tooltip />
      <el-table-column prop="count" label="条数" />
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
      <el-table-column prop="definiteTime" label="定时时间" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.definiteTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pkTotal"
        label="PK TOTAL"
        show-overflow-tooltip
        width="100"
      />
      <el-table-column
        prop="pkNumber"
        label="PK NUMBER"
        show-overflow-tooltip
        width="110"
      />
      <el-table-column prop="pid" label="PID" show-overflow-tooltip />
    </el-table>
    <p style="color: red">总条数：{{ total }}</p>
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
        list: "selectSendLogByPage"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID"
        },
        {
          type: "timerange",
          label: "提交时间",
          key: ["", "startTime", "endTime"]
        },
        {
          type: "date",
          label: "提交日期",
          key: "submitDate",
          placeholder: "提交日期"
        }
      ],
      total: 0
    };
  },
  mounted() {
    this.selectSendLogAllNum(this.searchParam);
  },
  computed: {},
  methods: {
    selectSendLogAllNum(data) {
      let params = {
        data: {
          ...data
        }
      };
      this.$http.sendLogFegin.selectSendLogAllNum(params).then(res => {
        if (res.code === 200) {
          this.total = res.data;
        }
        console.log(res);
      });
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.submitDate) {
        data.submitDate = new Date(data.submitDate).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      this.selectSendLogAllNum(data);
      return data;
    }
  },
  watch: {
    searchParam(val) {
      this.selectSendLogAllNum();
    }
  }
};
</script>

<style lang="scss" scoped>
.sendLogFegin {
}
</style>
