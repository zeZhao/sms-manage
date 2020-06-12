<template>
  <!--收入信息-->
  <div class="sysCompanyIncome">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="650"
      style="width: 100%;"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column prop="count" label="条数" />
      <el-table-column prop="receivableMoeny" label="应收款(元)" />
      <el-table-column prop="factMoney" label="	实收款(元)	" />
      <el-table-column prop="poorMoeny" label="欠收款(元)" />
      <el-table-column prop="countDate" label="账单月" />
    </el-table>
    <p style="color:red" v-if="this.statistics">
      提交数:{{ this.statistics.count }} &nbsp;&nbsp;应收款:{{
        this.statistics.receivable_moeny
      }}&nbsp;&nbsp; 实收款:{{ this.statistics.fact_money }}&nbsp;&nbsp;
      欠收款:{{ this.statistics.poor_moeny }}
    </p>
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
        ref="formItem"
        :colSpan="12"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @selectChange="selectChange"
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
        namespace: "sysCompanyIncome",
        list: "listCompanyIncomeByPage",
        detele: "deleteCompanyIncome"
      },
      // 列表参数
      namespace: "companyIncome",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "month",
          label: "账单月",
          key: "countDate",
          placeholder: "请选择账单月"
        },
        {
          type: "select",
          label: "是否出明细",
          key: "isDetail",
          placeholder: "请选择明细",
          optionData: [
            {
              key: 1,
              value: "否"
            },
            {
              key: 2,
              value: "是"
            }
          ]
        },
        {
          type: "select",
          label: "排序类型",
          key: "sortType",
          placeholder: "请选择查询类型",
          optionData: [
            {
              key: 0,
              value: "条数"
            },
            {
              key: 1,
              value: "应收款"
            },
            {
              key: 2,
              value: "实收款"
            },
            {
              key: 3,
              value: "欠收款"
            }
          ]
        },
        {
          type: "select",
          label: "排序方式",
          key: "sort",
          placeholder: "请选择排序方式",
          optionData: [
            {
              key: 0,
              value: "正序"
            },
            {
              key: 1,
              value: "倒序"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "信息类型",
          key: "smsType",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "收入类型",
          key: "incomeType",
          optionData: [
            {
              key: 1,
              value: "预收"
            },
            {
              key: 2,
              value: "平台月度"
            },
            {
              key: 3,
              value: "直连月度"
            },
            {
              key: 4,
              value: "返佣"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "用户ID",
          key: "userId",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道码号",
          key: "gateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "码号运营商",
          key: "operaId",
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "公司名称",
          key: "companyName",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "付款单位",
          key: "payCompany",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "条数",
          key: "count",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "单价(分)",
          key: "price",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "应收款",
          key: "receivableMoeny",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "实收款",
          key: "factMoney",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "欠收款",
          key: "poorMoeny",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "回款状态",
          key: "paymentStatus",
          optionData: [
            {
              key: 1,
              value: "已收"
            },
            {
              key: 2,
              value: "欠款"
            },
            {
              key: 3,
              value: "欠收"
            },
            {
              key: 4,
              value: "坏账"
            },
            {
              key: 5,
              value: "其他"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "是否对公",
          key: "toPublic",
          optionData: [
            {
              key: "1",
              value: "对公"
            },
            {
              key: "2",
              value: "对私"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "对私收款人",
          key: "privateName",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否开票",
          key: "isBilling",
          optionData: [
            {
              key: "1",
              value: "未开"
            },
            {
              key: "2",
              value: "已开"
            }
          ],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "month",
          label: "账单月",
          key: "countDate",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "date",
          label: "入账日期",
          key: "posttingDate",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark"
        }
      ],
      income_id: ""
    };
  },
  mounted() {
    this.queryMainInfo();
  },
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "userId") {
        item.optionData.map(t => {
          if (t.userId == val) {
            obj = t;
          }
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.defaultValue = obj.userId;
          }
          if (key === "corporateId") {
            t.defaultValue = obj.corpId;
          }
        });
      }
    },
    /*
     * 获取用户企业列表
     * */
    queryMainInfo() {
      this.$http.queryMainInfo().then(res => {
        res.data.map(item => {
          this.$set(item, "key", item.userId);
          this.$set(item, "value", item.userName);
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.optionData = res.data;
          }
        });
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }

          // userId:"5826",
          // corpId:"3",
        };
        this.$http.sysCompanyIncome.addCompanyIncome(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          data: {
            income_id: this.income_id,
            ...form
          }
        };
        this.$http.sysCompanyIncome.updateCompanyIncome(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.income_id = row.income_id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
      });
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysCompanyIncome {
}
</style>
