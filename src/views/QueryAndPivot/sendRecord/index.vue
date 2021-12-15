<template>
  <!--发送记录-->
  <div class="sendRecord">
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
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.operaId === 1
                ? "移动"
                : scope.row.operaId === 2
                ? "联通"
                : scope.row.operaId === 3
                ? "电信"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="hasSend" label="发送状态">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.hasSend === "0"
                ? "未发"
                : scope.row.hasSend === "1"
                ? "已发送"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createIime" label="创建时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.createIime | timeFormat }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="proType" label="产品类型">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.proType === 1
                ? "web端"
                : scope.row.proType === 2
                ? "http接口"
                : scope.row.proType === 3
                ? "cmpp接口"
                : scope.row.proType === 7
                ? "音频接口"
                : ""
            }}
          </span>
        </template>
      </el-table-column> -->
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
        namespace: "sendRecord",
        list: "selectSendBackByPage"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //默认进入该页面不查询
      notSearch: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
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
          type: "inputNum",
          label: "通道",
          key: "gateway"
        },
        {
          type: "date",
          label: "创建日期",
          key: "createTime"
        },
        {
          type: "timerange",
          label: "创建时间",
          key: ["", "startTime", "endTime"]
        }
      ],
      total: 0
    };
  },
  mounted() {
    // this.selectSendBackAllNum(this.searchParam);
  },
  computed: {},
  methods: {
    selectSendBackAllNum(data) {
      let params = {
        data: {
          ...data
        }
      };
      this.$http.sendRecord.selectSendBackAllNum(params).then(res => {
        if (res.code === 200) {
          this.total = res.data;
        }
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
      if (data.createTime) {
        data.createTime = new Date(data.createTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      this.selectSendBackAllNum(data);
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
