<template>
  <!--发送跨天列表查询-->
  <div class="sendAcrossDays">
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
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <!-- <el-table-column prop="longCode" label="通道码号" /> -->
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>{{
            scope.row.operaId === 0
              ? "三网"
              : scope.row.operaId === 1
              ? "移动"
              : scope.row.operaId === 2
              ? "联通"
              : "电信"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="150">
        <template slot-scope="scope">{{
          scope.row.sendTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
      <el-table-column prop="seqId" label="SEQ编号" />
      <!-- <el-table-column prop="reductModel" label="计费类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.reductModel == 1
            ? "预付提交计费"
            : scope.row.reductModel == 2
            ? "预付成功计费"
            : scope.row.reductModel == 3
            ? "后付提交计费"
            : "后付成功计费"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="submitCount" label="提交条数" />
      <el-table-column prop="sendCount" label="发送条数" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="succCount" label="单价(分)" />
      <el-table-column prop="failCount" label="失败条数" />
      <el-table-column prop="unknownCount" label="未知条数" />-->
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
        namespace: "sendAcrossDays",
        list: "queryList"
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
          key: "corporateId"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "内容",
          key: "content"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway"
        },
        {
          type: "datetime",
          label: "提交时间",
          key: ["", "startTime", "endTime"]
        }
        // {
        //   type: "date",
        //   label: "结束日期",
        //   key: "endTime"
        // }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // 修改搜索参数
    _formatRequestData(data) {
      const { startTime, endTime } = data;
      if (startTime) {
        data.startTime = new Date(startTime).Format("yyyy-MM-dd");
      }
      if (endTime) {
        data.endTime = new Date(endTime).Format("yyyy-MM-dd");
      }

      return data;
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      rows.forEach(item => {
        const { cardCount, cardMoney, succCount, foreignPrice } = item;
        if (!succCount) {
          item.succCount = 0;
        }
        if (!foreignPrice) {
          item.foreignPrice = 0;
        }
        this.$set(item, "sumReductType", cardCount + succCount);
        this.$set(item, "sumCardMoney", cardMoney + foreignPrice);
      });

      // if()
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
