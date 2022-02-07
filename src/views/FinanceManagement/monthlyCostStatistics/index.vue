<template>
  <div>
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @exportData="exportData"
      :add="false"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button
          type="primary"
          @click="handleModifyPrice"
          style="margin-left: 15px"
          >调价</el-button
        >
        <el-button type="primary" @click="exportExe" style="margin-left: 15px"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="createDate" label="日期" />
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="cardUnit" label="客户单价(分)" />
      <el-table-column prop="reductModel" label="计费方式">
        <template slot-scope="scope">
          {{ renderReductModel(scope.row.reductModel) }}
        </template>
      </el-table-column>
      <el-table-column prop="isDirectUser" label="客户类型">
        <template slot-scope="scope">
          {{ renderIsDirectUser(scope.row.isDirectUser) }}
        </template>
      </el-table-column>
      <el-table-column prop="saleMan" label="销售" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="gateway" label="通道号" />
      <el-table-column prop="supplierName" label="供应商名称" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="unitPrice" label="通道单价(分)" />
      <el-table-column label="商户消耗金额(元)">
        <template slot-scope="scope">
          {{ renderConsume(scope.row.cardUnit, scope.row.succCount, 0.01) }}
        </template>
      </el-table-column>
      <el-table-column label="通道成本(元)">
        <template slot-scope="scope">
          {{ renderConsume(scope.row.unitPrice, scope.row.succCount, 0.01) }}
        </template>
      </el-table-column>
      <el-table-column prop="stProfit" label="利润(元)" />
    </el-table>
    <p style="color: red; font-size: 12px">
      总消耗条数:{{ obj.succcAll || 0 }}&nbsp;&nbsp;总收入款(元):{{
        obj.shouRuAll || 0
      }}&nbsp;&nbsp;总成本款(元):{{
        obj.chengBenAll || 0
      }}&nbsp;&nbsp;总利润(元):{{ obj.profitAll || 0 }}
    </p>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      title="历史数据调价"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        btnTxt="确定"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
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
import listMixin from '@/mixin/listMixin';

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: 'smsProfit',
        list: 'queryByPage'
      },
      // 列表参数
      namespace: 'smsProfit',
      //搜索框数据
      // searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '商户编号',
          key: 'corpId'
        },
        {
          type: 'input',
          label: '商户名称',
          key: 'corpName'
        },
        {
          type: 'inputNum',
          label: '账户编号',
          key: 'userId'
        },
        {
          type: 'input',
          label: '账户名称',
          key: 'userName'
        },
        {
          type: 'inputNum',
          label: '通道编号',
          key: 'gateway'
        },
        {
          type: 'input',
          label: '通道名称',
          key: 'gatewayName'
        },
        {
          type: 'input',
          label: '销售',
          key: 'saleMan'
        },
        {
          type: 'daterange',
          label: '日期',
          key: ['', 'startTime', 'endTime'],
          defaultValue: [
            '',
            new Date().Format('yyyy-MM-dd'),
            new Date().Format('yyyy-MM-dd')
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: 'select',
          label: '选择类型',
          key: 'type',
          optionData: [
            {
              key: '1',
              value: '账户价格调整'
            },
            {
              key: '2',
              value: '通道价格调整'
            }
          ],
          rules: [{ required: true, message: '请选择类型', trigger: 'change' }]
        },
        {
          type: 'input',
          label: '账户编号',
          key: 'userId',
          btnTxt: '选择用户',
          btnDisabled: false,
          disabled: true,
          defaultValue: '',
          isShow: true,
          rules: [
            {
              required: true,
              message: '请选择账户',
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: 'select',
          label: '通道编号',
          key: 'type2',
          optionData: [
            {
              key: '1',
              value: '1通道'
            },
            {
              key: '2',
              value: '2通道'
            }
          ],
          isShow: true,
          rules: [{ required: true, message: '请选择通道', trigger: 'change' }]
        },
        {
          type: 'dates',
          label: '选择时间',
          key: 'type1',
          disabledDate: {
            disabledDate(time) {
              return time.getTime() >= Date.now();
            }
          },
          rules: [{ required: true, message: '请选择时间', trigger: 'change' }]
        },
        {
          type: 'input',
          label: '单价',
          key: 'content',
          specialSymbols: '分',
          rules: [
            {
              required: true,
              message: '请调整单价',
              trigger: ['blur', 'change']
            }
          ]
        }
      ],
      obj: {},
      isChooseUser: false
    };
  },
  methods: {
    // 调价
    handleModifyPrice() {
      this.addChannel = true;
      this.formConfig.forEach((item) => {
        const { key } = item;
        if (key === 'userId' || key === 'type2') {
          this.$set(item, 'isShow', true);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    selectChange({ val, item }) {
      if (item.label === '选择类型') {
        if (val === '1') {
          this.formConfig[1].isShow = false;
          this.formConfig[2].isShow = true;
        } else if (val === '2') {
          this.formConfig[2].isShow = false;
          this.formConfig[1].isShow = true;
        } else {
          this.formConfig[1].isShow = this.formConfig[2].isShow = true;
        }
      }
    },
    // 选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map((t) => {
        if (t.key === 'userId') {
          t.defaultValue = data.userId;
        }
      });
    },
    exportData(form) {
      this.$axios
        .post('/smsProfit/exportSmsProfit', { data: { smsProfit: form } })
        .then((res) => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    renderConsume(a, b, c) {
      const num = 10000;
      return (
        ((a * num) / num) *
        ((b * num) / num) *
        ((c * num) / num)
      ).toFixed(3);
    },
    renderReductModel(item) {
      if (item == '1') {
        return '预付提交计费';
      } else if (item == '2') {
        return '预付成功计费';
      } else if (item == '3') {
        return '后付提交计费';
      } else if (item == '4') {
        return '后付成功计费';
      } else {
        return '-';
      }
    },
    renderIsDirectUser(item) {
      if (item == '1') {
        return '直客';
      } else if (item == '2') {
        return '渠道';
      } else {
        return '-';
      }
    },
    // 格式化表格数据且初始化数据
    _mxFormListData(data) {
      const params = { data: { smsProfit: this.searchParam } };
      this.$http.smsProfit.queryAll(params).then((res) => {
        res.code === 200 ? (this.obj = res.data) : this.$message.error(res.msg);
      });
      data.forEach((item) => {
        if (item.createDate) {
          item.createDate = new Date(item.createDate).Format('yyyy-MM-dd');
        }
      });
      return data;
    }
  }
};
</script>