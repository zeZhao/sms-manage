<template>
  <!--用户月账单-->
  <div class="sysUserPrepaidCard">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="cardNum" label="卡号" show-overflow-tooltip />
      <el-table-column prop="userId" label="账号ID" />
      <el-table-column prop="reductType" label="计费类型" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.reductType === 1 ? "用户id计费" : "企业id计费" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="计费方式" width="110">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.reductModel == "1"
            ? "预付提交计费"
            : scope.row.reductModel == "2"
            ? "预付成功计费"
            : scope.row.reductModel == "3"
            ? "后付提交计费"
            : "后付成功计费"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="cardCount" label="条数" />
      <el-table-column prop="cardMoney" label="金额(元)" />
      <el-table-column prop="factcardMoney" label="实际收款金额" />
      <el-table-column prop="paidWay" label="付款状态">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.paidWay == 0
            ? "已付款"
            : scope.row.paidWay == 1
            ? "欠款"
            : scope.row.paidWay == 2
            ? "扣款"
            : "还款"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="chargeType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeType === 1 ? "短信" : "彩信" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createTime" label="创建时间" width="150">
        <template slot-scope="scope">{{scope.row.createTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope>
          <el-button type="text" size="small" @click="detail">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      title="明细"
      :visible.sync="isDetail"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <div>
        <ul>
          <li>
            <span>移动金额：</span>
            <span>{{detailList.cm}}</span>
          </li>
          <li>
            <span>联通金额：</span>
            <span>{{detailList.cm}}</span>
          </li>
          <li>
            <span>电信金额：</span>
            <span>{{detailList.cm}}</span>
          </li>
          <li>
            <span>未知号码金额：</span>
            <span>{{detailList.cm}}</span>
          </li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      isDetail: false,
      detailList: {},
      //接口地址
      searchAPI: {
        namespace: "sysUserPrepaidCard",
        list: "listPrepaidCardByPage"
      },
      // 列表参数
      namespace: "prepaidCard",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "账号ID",
          key: "userId",
          placeholder: "请输入账号ID"
        },
        {
          type: "select",
          label: "类型",
          key: "chargeType",
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "短信"
            }
            // {
            //   key: 2,
            //   value: "彩信"
            // }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "month",
          label: "月份",
          key: "queryMonth"
        },
        {
          type: "select",
          key: "paidWay",
          label: "付款状态",
          optionData: [
            {
              key: 0,
              value: "已付款"
            },
            {
              key: 1,
              value: "欠款"
            },
            {
              key: 2,
              value: "扣款"
            },
            {
              key: 3,
              value: "还款"
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    detail() {},
    // 修改搜索参数
    _formatRequestData(data) {
      const { queryMonth } = data;
      if (queryMonth) {
        data.queryMonth = new Date(queryMonth).Format("yyyy-MM");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysUserPrepaidCard {
}
</style>
