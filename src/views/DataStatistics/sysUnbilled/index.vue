<template>
  <!--用户日账单-->
  <div class="userDailyBill">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
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
      <el-table-column prop="exemptReviewType" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.exemptReviewType === 0
              ? "需要审核"
              : scope.row.exemptReviewType === 1
              ? "特服号"
              : scope.row.exemptReviewType === 2
              ? "账户编号"
              : scope.row.exemptReviewType === 3
              ? "商户编号"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cmPassageway" label="移动通道" />
      <el-table-column prop="cuPassageway" label="联通通道" />
      <el-table-column prop="ctPassageway" label="电信通道" />
      <el-table-column prop="smsType" label="免审类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.smsType === 1
              ? "短信"
              : scope.row.smsType === 2
              ? "彩信"
              : scope.row.smsType === 3
              ? "屏信"
              : scope.row.smsType === 4
              ? "语音"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendCount" label="发送量" />
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="_mxDeleteItem('exemptId',scope.row.exemptId)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>-->
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
        namespace: "sysUnbilled",
        list: "queryNoSendByPage",
        detele: "deleteExemptReviewManage"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {},
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
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          optionData: [
            // { key: "0", value: "需要审核" },
            { key: "1", value: "特服号" },
            { key: "2", value: "账户编号" }
            // { key: "3", value: "商户编号" },
          ],
          placeholder: "请选择类型"
        },

        {
          type: "select",
          label: "发送情况",
          key: "sendStatus",
          optionData: [
            { key: "", value: "不限制" },
            { key: "1", value: "未发" }
          ],
          placeholder: "请选择发送情况"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            // { key: "0", value: "非法" },
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" },
            { key: "4", value: "国际" }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "daterange",
          label: "统计周期",
          key: ["", "countDate", "endDate"]
        }
      ],
      statistics: {}
    };
  },
  mounted() {},
  computed: {},
  methods: {
    // 删除
    _delete(row) {},

    // 修改搜索参数
    _formatRequestData(data) {
      const { countDate, endDate } = data;
      if (countDate) {
        data.countDate = new Date(countDate).Format("yyyy-MM-dd");
      }
      if (endDate) {
        data.endDate = new Date(endDate).Format("yyyy-MM-dd");
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
