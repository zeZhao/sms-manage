<template>
  <!--实时数据查询-->
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
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="balanceNum" label="结算条数" />
      <el-table-column prop="cardUnitStr" label="单价" />
      <el-table-column prop="balanceAmountStr" label="结算金额" />
      <el-table-column prop="actualAmountStr" label="实付金额" />
      <el-table-column prop="status" label="账单状态">
        <template slot-scope="scope">{{
          scope.row.status === 1 ? '未确认' : '已确认'
        }}</template>
      </el-table-column>
      <el-table-column prop="billTime" label="日期" />
      <el-table-column
        prop="remark"
        label="备注"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status === 1"
            @click="confirmTheBill(scope.row.billId)"
            type="text"
            size="small"
            >确认账单</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            @click="edit(scope.row)"
            type="text"
            size="small"
            >修改</el-button
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
        btnTxt="确认修改"
        @submit="submit"
        @cancel="addChannel = false"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      formTit: '修改客户对账单',
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: 'customerStatement',
        list: 'userBalanceMonthBillList'
      },
      // 搜索框数据
      searchParam: {},
      // 列表参数
      namespace: '',
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '商户编号',
          key: 'corpId',
          placeholder: '请输入商户编号'
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpName',
          placeholder: '请输入商户名称'
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId',
          placeholder: '请输入账户编号'
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'userName',
          placeholder: '请输入账户名称'
        },
        {
          type: 'month',
          label: '日期',
          key: 'billTime',
          placeholder: '请选择日期',
          defaultValue: new Date().Format('yyyy-MM')
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: '商户编号',
          key: 'corpId',
          defaultValue: '',
          disabled: true,
          placeholder: ' '
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpName',
          defaultValue: '',
          disabled: true,
          placeholder: ' '
        },
        {
          type: 'input',
          label: '结算条数',
          key: 'balanceNum',
          defaultValue: '',
          disabled: true,
          placeholder: ' '
        },
        {
          type: 'input',
          label: '单价',
          key: 'cardUnitStr',
          defaultValue: '',
          disabled: true,
          placeholder: ' '
        },
        {
          type: 'input',
          label: '结算金额',
          key: 'balanceAmountStr',
          defaultValue: '',
          disabled: true,
          placeholder: ' '
        },
        {
          type: 'input',
          label: '实付金额',
          key: 'actualAmountStr',
          defaultValue: '',
          rules: [
            {
              required: true,
              message: '请输入实付金额',
              trigger: 'blur'
            }
          ]
        },
        {
          type: 'textarea',
          label: '备注',
          key: 'remark',
          defaultValue: '',
          rules: [
            {
              message: '请输入备注',
              trigger: 'blur'
            }
          ]
        }
      ],
      id: undefined
    };
  },
  methods: {
    //确认账单
    confirmTheBill(billId) {
      this.$confirm('“确认账单”后该记录不能修改, 是否继续?', '确认账单', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.customerStatement
            .updateStatus({ data: { billId, status: 2 } })
            .then((res) => {
              if (resOk(res)) {
                this._mxGetList();
                this.$message.success(res.msg || res.data);
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    //编辑回显
    edit(row) {
      this.id = row.billId;
      this.formConfig.forEach((item) => {
        item.defaultValue = row[item.key];
      });
      this.addChannel = true;
    },
    submit(value) {
      if (value.actualAmountStr && !Number(value.actualAmountStr)) {
        this.$message.error('实付金额必须为数值');
        return;
      }
      this.$http.customerStatement
        .updateMoney({
          data: {
            billId: this.id,
            actualAmountStr: Number(value.actualAmountStr),
            remark: value.remark
          }
        })
        .then((res) => {
          if (resOk(res)) {
            this._mxGetList();
            this.addChannel = false;
            this.$message.success(res.msg || res.data);
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    }
  }
};
</script>
