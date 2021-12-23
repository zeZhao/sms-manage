<template>
  <!--用户月账单-->
  <div class="userDailyBill">
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
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="corpName" label="公司名称" />
      <el-table-column prop="countDateStr" label="月份" />
      <el-table-column prop="saleman" label="销售名称" />
      <el-table-column prop="reductModel" label="计费类型">
        <template slot-scope="scope">
          <span v-if="scope.row.reductModel == 1">预付提交计费</span>
          <span v-if="scope.row.reductModel == 2">预付成功计费</span>
          <span v-if="scope.row.reductModel == 3">后付提交计费</span>
          <span v-if="scope.row.reductModel == 4">后付成功计费</span>
          <span v-if="scope.row.reductModel == '未识别'">未识别</span>
          <!-- <span>
            {{
              scope.row.reductModel == 1
                ? "预付提交计费"
                : scope.row.reductModel == 2
                ? "预付成功计费"
                : scope.row.reductModel == 3
                ? "后付提交计费"
                : "后付成功计费"
            }}
          </span> -->
        </template>
      </el-table-column>
      <el-table-column prop="cardUnit" label="单价(分)" />
      <el-table-column prop="submitCount" label="提交条数" />
      <el-table-column prop="sendCount" label="发送条数" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="failCount" label="失败条数" />
      <el-table-column prop="unknownCount" label="未知条数" />
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
const date = new Date();

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "userMonthlyBill",
        list: "queryList"
      },
      // 列表参数
      namespace: "userMonthlyBill",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
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
          type: "month",
          label: "统计日期",
          key: "startTime",
          clearable: false,
          defaultValue: `${
            date.getMonth() !== 0 ? date.getFullYear() : date.getFullYear() - 1
          }-${
            date.getMonth() < 10
              ? date.getMonth() !== 0
                ? "0" + date.getMonth()
                : 12
              : date.getMonth()
          }`,
          pickerOptions: {
            disabledDate(time) {
              const t = `${date.getFullYear()}-${
                date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1
              }`;
              const other = `${time.getFullYear()}-${
                time.getMonth() + 1 < 10
                  ? "0" + (time.getMonth() + 1)
                  : time.getMonth() + 1
              }`;
              return other >= t;
            }
          }
          // key: ["", "startTime", "endTime"]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 修改搜索参数
    // _formatRequestData(data) {
    //   const { startTime, endTime } = data;
    //   if (startTime) {
    //     data.startTime = new Date(startTime).Format("yyyy-MM-dd");
    //   }
    //   if (endTime) {
    //     data.endTime = new Date(endTime).Format("yyyy-MM-dd");
    //   }
    //   return data;
    // }
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    // _mxFormListData(rows) {
    //   rows.forEach((item) => {
    //     const { cardCount, cardMoney, succCount, foreignPrice } = item;
    //     if (!succCount) {
    //       item.succCount = 0;
    //     }
    //     if (!foreignPrice) {
    //       item.foreignPrice = 0;
    //     }
    //     this.$set(item, "sumReductType", cardCount + succCount);
    //     this.$set(item, "sumCardMoney", cardMoney + foreignPrice);
    //   });
    //   // if()
    //   return rows;
    // },
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
