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
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="companyName" label="公司名称" />
      <el-table-column prop="count" label="条数" />
      <el-table-column prop="receivableMoney" label="应收款(元)" />
      <el-table-column prop="factMoney" label="	实收款(元)	" />
      <el-table-column prop="poorMoney" label="欠收款(元)" />
      <el-table-column prop="countDateS" label="账单月">
        <!-- <template slot-scope="scope">{{
          scope.row.countDate | FormatMonth
        }}</template> -->
      </el-table-column>
    </el-table>
    <p style="color: red" v-if="this.statistics">
      提交数:{{ this.statistics.count }} &nbsp;&nbsp;应收款:{{
        this.statistics.receivableMoney
      }}&nbsp;&nbsp; 实收款:{{ this.statistics.factMoney }}&nbsp;&nbsp;
      欠收款:{{ this.statistics.poorMoney }}
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
      top="45px"
    >
      <FormItem
        ref="formItem"
        :colSpan="12"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
        @selectChange="selectChange"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        callback();
        // callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
        } else {
          callback();
        }
      }
    };
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
          type: "inputNum",
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
          type: "select",
          label: "通道码号",
          key: "gateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
          optionData: []
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "公司名称",
          key: "companyName",
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "付款单位",
          key: "payCompany",
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "条数",
          key: "count",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "单价(分)",
          key: "price",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "应收款",
          key: "receivableMoney",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "实收款",
          key: "factMoney",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "欠收款",
          key: "poorMoney",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            }
          ]
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "对私收款人",
          isShow: false,
          key: "privateName",
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "month",
          label: "账单月",
          key: "countDate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "入账日期",
          key: "posttingDate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark",
          maxlength: "300",
          rules: [{ trigger: "blur", validator: validatorRemark }]
        }
      ],
      income_id: "",
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};

      if (item.key === "toPublic") {
        this.$nextTick(() => {
          if (item.defaultValue === "1") {
            this._setDisplayShow(this.formConfig, "privateName", true);
          } else {
            this._setDisplayShow(this.formConfig, "privateName", false);
          }
        });
      }
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
      });
    },
    submit(form) {
      let params = {};
      form = this._mxArrangeSubmitData(form);
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
            this.$message.error(res.data || res.msg);
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
            this.$message.error(res.data || res.msg);
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
    gateway() {
      const params = {
        data: {
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;

          if (key === "gateway") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gateway);
              this.$set(t, "value", t.gatewayName);
              item.optionData.push(t);
            });
          }
        });
      });
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
        if (item.key === "toPublic") {
          //计费方式切换为：预付成功计费时，返还类型显示
          this.$nextTick(() => {
            if (item.defaultValue === "1") {
              this._setDisplayShow(this.formConfig, "privateName", true);
            } else {
              this._setDisplayShow(this.formConfig, "privateName", false);
            }
          });
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    /**
     * 调整筛选条件提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      const { countDate } = data;
      if (countDate) {
        data.countDate = `${countDate}-01`;
      }
      return data;
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _mxArrangeSubmitData(data) {
      const { countDate } = data;
      if (countDate) {
        data.countDate = `${countDate}-01`;
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysCompanyIncome {
}
</style>
