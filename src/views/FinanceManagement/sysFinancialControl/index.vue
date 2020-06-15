<template>
  <!--财务审核-->
  <div class="sysRecharge">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="userId" label="企业ID" />
      <el-table-column prop="userId" label="账号ID" />
      <el-table-column prop="chargeType" label="产品">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.chargeType == 1
            ? "短信"
            : "彩信"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="beforeBalance" label="操作前的条数" />
      <el-table-column prop="cardCount" label="当前操作条数" />
      <el-table-column prop="afterBalance" label="操作后的条数" />
      <el-table-column prop="cardUnit" label="当前操作单价(分)" />
      <el-table-column prop="cardMoney" label="金额(元)" />
      <el-table-column prop="fileUrl" label="付款截图" />
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
      <el-table-column prop="reductModel" label="计费类型">
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
      <el-table-column prop="direction" label="操作类型" />
      <el-table-column prop="isBill" label="账单类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.isBill == 0
            ? "充值记录"
            : scope.row.isBill == 1
            ? "月度帐单"
            : scope.row.isBill == 2
            ? "后付提交计费"
            : scope.row.isBill == 3
            ? "后付提交计费"
            : scope.row.isBill == 4
            ? "后付提交计费"
            : "月度帐单"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="modifier" label="操作账号" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="paymentCompany" label="打款公司名称" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="audit(scope.row)"
            :disabled="scope.row.cardStatus !== 0"
            type="text"
            size="small"
          >审核</el-button>
          <el-button
            @click="reject(scope.row.cardId)"
            :disabled="scope.row.cardStatus !== 0"
            type="text"
            size="small"
          >驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <FormItem
        :colSpan="24"
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
      ></FormItem>
    </el-dialog>
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
        list: "listPrepaidCardByPage",
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
          type: "input",
          label: "账号ID",
          key: "userId",
          placeholder: "请输入账号ID"
        },
        {
          type: "select",
          label: "付款状态",
          key: "paidWay",
          optionData: [
            { key: "0", value: "充值" },
            { key: "1", value: "借款" },
            { key: "2", value: "扣款" },
            { key: "3", value: "还款" }
          ],
          placeholder: "类型"
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
          type: "input",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "daterange",
          label: "按时间查询",
          key: ["", "startTime", "endTime"],
          placeholder: "按时间查询"
        },
        {
          type: "select",
          label: "账单类型",
          key: "isBill",
          optionData: [
            { key: "0", value: "充值记录" },
            { key: "1", value: "月度账单" },
            { key: "2", value: "退款记录" },
            { key: "3", value: "借款记录" },
            { key: "4", value: "补款记录" },
            { key: "5", value: "转移记录" }
          ]
        },
        {
          type: "select",
          label: "操作类型",
          key: "direction",
          optionData: [
            { key: "对公付款", value: "对公付款" },
            { key: "对私付款", value: "对私付款" },
            { key: "无", value: "无" }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "产品类型",
          key: "chargeType",
          optionData: [
            { key: 1, value: "短信" },
            { key: 2, value: "彩信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "计费类型",
          key: "reductModel",
          optionData: [
            { key: 1, value: "用户id计费" },
            { key: 2, value: "企业id计费" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "用户ID",
          key: "userId",
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "当前卡对应的用户名",
          key: "userName",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "金额(元)",
          key: "cardMoney",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "单价(分)",
          key: "cardUnit",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "条数",
          key: "cardCount",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "操作类型",
          key: "direction",
          optionData: [
            { key: 0, value: "充值" },
            { key: 1, value: "借款" },
            { key: 2, value: "扣款" },
            { key: 3, value: "还款" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "到款方式",
          key: "paidWay",
          optionData: [
            { key: "对公付款", value: "对公付款" },
            { key: "对私付款", value: "对私付款" },
            { key: "无", value: "无" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "备注",
          key: "remark"
        },
        {
          type: "input",
          label: "销售员的名字",
          key: "saleMan"
        },
        {
          type: "input",
          label: "实际收款额度",
          key: "factcardMoney",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "余额变动凭证",
          key: "fileUrl",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    audit(row) {
      const { paymentCompany, cardId } = row;
      const h = this.$createElement;
      this.$msgbox({
        title: "审核",
        message: h("div", null, [
          h("p", null, [
            h("span", null, "充值卡ID"),
            h("el-input", {
              props: {
                value: cardId
              }
            })
          ]),
          h("p", null, [
            h("span", null, "付款公司名称"),
            h("el-input", {
              props: {
                value: paymentCompany
              }
            })
          ])
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        const params = {
          data: {
            paymentCompany,
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
    reject(id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "审核",
        message: h("div", null, [
          h("p", null, [
            h("span", null, "充值卡ID"),
            h("el-input", {
              props: {
                value: id
              }
            })
          ])
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        this.$http.sysFinancialControl
          .stopPrepaidCard({ data: { cardId: id } })
          .then(res => {
            if (resOk(res)) {
              this.$message.success("操作成功");
              this._mxGetList();
            }
          });
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
