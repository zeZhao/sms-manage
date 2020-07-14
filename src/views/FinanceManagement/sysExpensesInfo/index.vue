<template>
  <!--支出信息-->
  <div class="sysExpensesInfo">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="no" label="下单编号" show-overflow-tooltip />
      <el-table-column prop="corporateName" label="所属公司" />
      <el-table-column prop="orderMonth" label="下单月" width="95" />
      <el-table-column prop="theMonth" label="所属月" width="95" />
      <el-table-column prop="dates" label="日期" width="95" />
      <el-table-column prop="summary" label="摘要" show-overflow-tooltip />
      <el-table-column prop="collectionCompany" label="收款单位" show-overflow-tooltip />
      <el-table-column prop="lender" label="付款金额" />
      <el-table-column prop="ticketsPlusNotes" label="是否回票" />
      <el-table-column prop="ticketNumber" label="票号" show-overflow-tooltip />
      <el-table-column prop="billingType" label="开票类型" />
      <el-table-column prop="isPay" label="是否已付款">
        <template slot-scope="scope">
          <span>{{ scope.row.isPay === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('expensesInfoId', scope.row.id)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
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
          type: "input",
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
              key: "1",
              value: "已回"
            },
            {
              key: "2",
              value: "未回"
            }
          ],
          placeholder: "请选择是否回票"
        },
        {
          type: "daterange",
          label: "日期",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择日期"
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
          ],
          placeholder: "请选择是否已付款"
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
          ],
          placeholder: "请选择是否已付款"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "编号",
          key: "no",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "账单所属公司",
          key: "corporateName",
          optionData: [
            {
              key: "聚通达",
              value: "聚通达"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "month",
          label: "下单月",
          key: "orderMonth",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "month",
          label: "所属月",
          key: "theMonth",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "日期",
          key: "dates",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "摘要",
          key: "summary",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "收付款单位",
          key: "collectionCompany",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "付款金额",
          key: "lender",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否回票",
          key: "ticketsPlusNotes",
          optionData: [
            {
              key: "是",
              value: "是"
            },
            {
              key: "否",
              value: "否"
            }
          ],
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "票号",
          key: "ticketNumber",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "备注",
          key: "remarks",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "开票类型",
          key: "billingType",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
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
    }
    //countMonth
    // _mxArrangeSubmitData(formData) {
    //   if (formData.countMonth) {
    //     formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
    //   }
    //   return formData;
    // }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysExpensesInfo {
}
</style>
