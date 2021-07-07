<template>
  <!--财务审核-->
  <div class="sysRecharge">
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
      <el-table-column
        prop="corporateId"
        label="商户编号"
        show-overflow-tooltip
      />
      <el-table-column
        prop="corpName"
        label="商户名称"
        show-overflow-tooltip
        min-width="110"
      />
      <el-table-column prop="userId" label="账户编号" show-overflow-tooltip />
      <el-table-column
        prop="userName"
        label="账户名称"
        show-overflow-tooltip
        min-width="110"
      />
      <el-table-column prop="chargeType" label="产品" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            {{ scope.row.chargeType == 1 ? "短信" : "彩信" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="beforeBalance"
        label="操作前的条数"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cardCount"
        label="当前操作条数"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="afterBalance"
        label="操作后的条数"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cardUnit"
        label="当前操作单价(分)"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="cardMoney"
        label="金额(元)"
        show-overflow-tooltip
      />
      <el-table-column prop="fileUrl" label="付款截图" show-overflow-tooltip>
        <template slot-scope="scope">
          <a
            v-if="scope.row.fileUrl && scope.row.fileUrl !== '-'"
            style="color: #0964FF"
            :href="`${origin}/${scope.row.fileUrl}`"
            target="_blank"
            >点击查看</a
          >
          <span v-else style="color:#C0C4CC">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="paidWay" label="操作类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.paidWay == 0">充值</span>
          <span v-if="scope.row.paidWay == 1">借款</span>
          <span v-if="scope.row.paidWay == 2">余额-</span>
          <span v-if="scope.row.paidWay == 3">还款</span>
          <span v-if="scope.row.paidWay == 4">清授信</span>
          <span v-if="scope.row.paidWay == 5">账号转移充值</span>
          <span v-if="scope.row.paidWay == 6">余额+</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductType" label="计费类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.reductType == 1">账户计费</span>
          <span v-else-if="scope.row.reductType == 2">商户计费</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="direction"
        label="到款方式"
        show-overflow-tooltip
      />
      <el-table-column prop="isBill" label="账单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.isBill == 0">充值记录</span>
          <span v-if="scope.row.isBill == 1">月度帐单</span>
          <span v-if="scope.row.isBill == 2">退款记录</span>
          <span v-if="scope.row.isBill == 3">借款记录</span>
          <span v-if="scope.row.isBill == 4">还款记录</span>
          <span v-if="scope.row.isBill == 5">转移记录</span>
          <span v-if="scope.row.isBill == 6">清授信记录</span>
          <span v-if="scope.row.isBill == 7">余额+记录</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="paidWay" label="付款状态">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.paidWay == 0
                ? "充值"
                : scope.row.paidWay == 1
                ? "借款"
                : scope.row.paidWay == 2
                ? "扣款"
                : scope.row.paidWay == 3
                ? "还款"
                : ""
            }}
          </span>
        </template>
      </el-table-column> -->

      <el-table-column
        prop="remark"
        label="备注"
        show-overflow-tooltip
        min-width="110"
      />
      <el-table-column
        prop="modifier"
        label="操作账号"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column
        prop="paymentCompany"
        label="打款公司名称"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column prop="cardStatus" label="审核状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.cardStatus == 0">未操作</span>
          <span v-else-if="scope.row.cardStatus == 1">审核通过</span>
          <span v-else-if="scope.row.cardStatus == 3">审核驳回</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="audit(scope.row)"
            :disabled="scope.row.cardStatus !== 0"
            type="text"
            size="small"
            >通过</el-button
          >
          <el-button
            @click="reject(scope.row)"
            :disabled="scope.row.cardStatus !== 0"
            type="text"
            size="small"
            >驳回</el-button
          >
        </template>
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
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysRecharge",
        list: "listPrepaidCardExamineByPage",
        detele: "",
        add: "addPrepaidCard",
        edit: "updatePrepaidCard"
      },
      // 列表参数
      namespace: "prepaidCard",
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
          type: "input",
          label: "商户名称",
          key: "corpName"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "select",
          label: "产品",
          key: "chargeType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" }
          ],
          placeholder: "类型"
        },
        {
          type: "select",
          label: "操作类型",
          key: "paidWay",
          optionData: [
            { key: "0", value: "充值" },
            // { key: "1", value: "借款" },
            // { key: "2", value: "扣款" },
            { key: "3", value: "还款" }
          ],
          placeholder: "类型"
        },
        {
          type: "select",
          label: "账单类型",
          key: "isBill",
          optionData: [
            { key: "0", value: "充值记录" },
            { key: "1", value: "月度账单" },
            // { key: "2", value: "退款记录" },
            // { key: "3", value: "借款记录" },
            { key: "4", value: "还款记录" }
            // { key: "5", value: "转移记录" }
          ]
        },
        {
          type: "select",
          label: "到款方式",
          key: "direction",
          optionData: [
            { key: "对公付款", value: "对公付款" },
            { key: "对私付款", value: "对私付款" },
            { key: "无", value: "无" }
          ]
        },
        {
          type: "daterange",
          label: "创建时间",
          key: ["", "startTime", "endTime"]
        }
      ],
      origin: window.location.origin
    };
  },
  mounted() {},
  computed: {},
  activated() {
    this._mxGetList();
  },
  methods: {
    audit(row) {
      const { corpName, cardId } = row;
      this.$confirm(`是否通过打款公司为“${row.corpName}”的提交记录`, ``, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(action => {
        const params = {
          data: {
            paymentCompany: corpName,
            cardId
          }
        };
        this.$http.sysFinancialControl.useCard(params).then(res => {
          if (resOk(res)) {
            this.$message.success("操作成功");
            this._mxGetList();
          }
        });
      });
    },
    reject(row) {
      const { corpName, cardId } = row;
      this.$confirm(`是否驳回打款公司为“${row.corpName}”的提交记录`, ``, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(action => {
        this.$http.sysFinancialControl
          .stopPrepaidCard({ data: { cardId, paymentCompany: corpName } })
          .then(res => {
            if (resOk(res)) {
              this.$message.success("操作成功");
              this._mxGetList();
            }
          });
      });
    },

    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(row) {
      if (row.endTime) {
        row.endTime = `${row.endTime}`;
      }
      if (row.startTime) {
        row.startTime = `${row.startTime}`;
      }
      return row;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
