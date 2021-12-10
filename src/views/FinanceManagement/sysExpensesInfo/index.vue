<template>
  <!--支出信息-->
  <div class="sysExpensesInfo">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="no" label="下单编号" />
      <el-table-column prop="corporateName" label="所属公司" />
      <el-table-column prop="orderMonth" label="下单月" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.orderMonth | FormatMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="theMonth" label="所属月" width="95">
        <template slot-scope="scope">
          <span>{{ scope.row.theMonth | FormatMonth }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dates" label="日期" width="95" />
      <el-table-column prop="summary" label="摘要" />
      <el-table-column prop="collectionCompany" label="收款单位" />
      <el-table-column prop="lender" label="付款金额" />
      <el-table-column prop="ticketsPlusNotes" label="是否回票" />
      <el-table-column prop="ticketNumber" label="票号" />
      <el-table-column prop="billingType" label="开票类型" />
      <el-table-column prop="isPay" label="是否已付款">
        <template slot-scope="scope">
          <span>{{ scope.row.isPay === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('expensesInfoId', scope.row.id)"
            type="text"
            size="small"
            >删除</el-button
          >
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
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
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
      // 接口地址
      searchAPI: {
        namespace: "sysExpensesInfo",
        list: "listExpensesInfoByPage",
        detele: "deleteExpensesInfo",
        add: "addExpensesInfo",
        edit: "updateExpensesInfo"
      },
      // 列表参数
      namespace: "expensesInfo",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "收款单位",
          key: "collectionCompany",
          placeholder: "请输入收款单位"
        },
        {
          type: "inputNum",
          label: "票号",
          key: "ticketNumber",
          placeholder: "请输入票号"
        },
        {
          type: "select",
          label: "是否回票",
          key: "ticketsPlusNotes",
          optionData: [
            {
              key: "已回",
              value: "已回"
            },
            {
              key: "未回",
              value: "未回"
            }
          ]
        },
        {
          type: "select",
          label: "是否已付款",
          key: "isPay",
          optionData: [
            {
              key: "1",
              value: "是"
            },
            {
              key: "2",
              value: "否"
            }
          ]
        },
        {
          type: "input",
          label: "金额",
          key: "lender",
          placeholder: "请输入金额"
        },
        {
          type: "month",
          label: "下单月",
          key: "orderMonthS",
          placeholder: "请选择下单月"
        },
        {
          type: "month",
          label: "所属月",
          key: "theMonthS",
          placeholder: "请选择所属月"
        },
        {
          type: "input",
          label: "下单编号",
          key: "no",
          placeholder: "请输入下单编号"
        },
        {
          type: "select",
          label: "所属公司",
          key: "corporateName",
          optionData: [
            {
              key: "聚通达",
              value: "聚通达"
            }
          ]
        },
        {
          type: "daterange",
          label: "日期",
          key: ["", "startTime", "endTime"]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "下单编号",
          key: "no",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "账单所属公司",
          key: "corporateName",
          // optionData: [
          //   {
          //     key: "聚通达",
          //     value: "聚通达"
          //   }
          // ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "month",
          label: "下单月",
          key: "orderMonth",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "month",
          label: "所属月",
          key: "theMonth",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "date",
          label: "日期",
          key: "dates",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },

        {
          type: "textarea",
          label: "摘要",
          key: "summary",
          defaultValue: "",
          maxlength: "300",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "收付款单位",
          key: "collectionCompany",
          defaultValue: "",
          maxlength: "30",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "付款金额",
          key: "lender",
          maxlength: 9,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "是否回票",
          key: "ticketsPlusNotes",
          optionData: [
            {
              key: "已回",
              value: "已回"
            },
            {
              key: "未回",
              value: "未回"
            }
          ],
          // change: this.selectUser,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "票号",
          isShow: false,
          maxlength: "30",
          key: "ticketNumber",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "是否已支付",
          key: "isPay",
          optionData: [
            {
              key: 1,
              value: "是"
            },
            {
              key: 2,
              value: "否"
            }
          ],
          // change: this.selectUser,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remarks",
          maxlength: "300",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "开票类型",
          key: "billingType",
          maxlength: "30",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};

      if (item.key === "ticketsPlusNotes") {
        this.$nextTick(() => {
          if (item.defaultValue === "未回") {
            this._setDisplayShow(this.formConfig, "ticketNumber", true);
          } else {
            this._setDisplayShow(this.formConfig, "ticketNumber", false);
          }
        });
      }
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "ticketsPlusNotes") {
          //计费方式切换为：预付成功计费时，返还类型显示
          this.$nextTick(() => {
            if (item.defaultValue === "未回") {
              this._setDisplayShow(this.formConfig, "ticketNumber", true);
            } else {
              this._setDisplayShow(this.formConfig, "ticketNumber", false);
            }
          });
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    // 表格列表数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.orderMonth) {
          item.orderMonth = new Date(item.orderMonth).Format("yyyy-MM-dd");
        }
        if (item.theMonth) {
          item.theMonth = new Date(item.theMonth).Format("yyyy-MM-dd");
        }
        if (item.dates) {
          item.dates = new Date(item.dates).Format("yyyy-MM-dd");
        }
      });
      return data;
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { theMonthS, orderMonthS } = data;
      if (theMonthS) {
        data.theMonthS = new Date(theMonthS).Format("yyyy-MM");
      }
      if (orderMonthS) {
        data.orderMonthS = new Date(orderMonthS).Format("yyyy-MM");
      }
      return data;
    },
    //countMonth
    _mxArrangeSubmitData(formData) {
      if (formData.orderMonth) {
        formData.orderMonth = new Date(formData.orderMonth).Format(
          "yyyy-MM-01"
        );
      }
      if (formData.theMonth) {
        formData.theMonth = new Date(formData.theMonth).Format("yyyy-MM-01");
      }
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
>>> .el-input__suffix {
  height: 90% !important;
}
.sysExpensesInfo {
}
</style>
