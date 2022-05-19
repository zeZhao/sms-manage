<template>
  <!--通道月账单-->
  <div class="sysGatewayBill">
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
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitCount" label="提交条数" />
      <el-table-column prop="succCount" label="成功条数" />
      <el-table-column prop="succRatio" label="成功率" />
      <el-table-column prop="linkMan" label="负责人" />
      <el-table-column prop="countMonth" label="统计时间" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'bid')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('bId', scope.row.bid)"
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
        @inpChange="inpChange"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorSubmit = (rule, value, callback) => {
      let regex = /^[0-9]*$/;
      if (value) {
        if (!regex.test(value)) {
          callback(new Error("仅支持数字"));
        } else {
          callback();
        }
      }
    };
    const validatorSucc = (rule, value, callback) => {
      let regex = /^[0-9]*$/;
      if (value) {
        if (!regex.test(value)) {
          callback(new Error("仅支持数字"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "smsGatewayBill",
        list: "listGatewayBillByPage",
        detele: "deleteGatewayBill",
        add: "addGatewayBill",
        edit: "updateGatewayBill"
      },
      // 列表参数
      namespace: "gatewayBill",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: " 通道名称",
          key: "gatewayName",
          placeholder: "请输入通道名称"
        },
        {
          type: "input",
          label: "负责人",
          key: "linkMan",
          placeholder: "请输入负责人"
        },
        {
          type: "month",
          label: "统计时间",
          key: "countMonth",
          placeholder: "请选择统计时间"
        },
        {
          type: "select",
          label: "类型",
          key: "gatewayType",
          optionData: [
            {
              key: "1",
              value: "短信"
            }
          ],
          placeholder: "请选择类型"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "通道名称",
          key: "gatewayName",
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "gatewayType",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ],
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "提交数",
          key: "submitCount",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "change", validator: validatorSubmit }
          ]
        },
        {
          type: "input",
          label: "成功数",
          key: "succCount",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "change", validator: validatorSucc }
          ]
        },
        {
          type: "input",
          label: "成功率",
          disabled: true,
          key: "succRatio",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "month",
          label: "账单月份",
          key: "countMonth",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "付款方式",
          key: "paidWay",
          optionData: [
            {
              key: 1,
              value: "已付款"
            },
            {
              key: 2,
              value: "欠款"
            },
            {
              key: 3,
              value: "其他"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "联系人",
          key: "linkMan",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "运营商",
          key: "operaid",
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
            },
            {
              key: 4,
              value: "国际"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [] // 通道列表
    };
  },
  mounted() {
    this.gateway();
    this.listSysProvince();
  },
  computed: {},
  methods: {
    // input输入事件
    inpChange(data) {
      const { val, item } = data;

      if (item.key === "succCount") {
        let submitCount = "";
        this.formConfig.forEach(items => {
          if (items.key === "submitCount") {
            submitCount = items.defaultValue;
          }
        });
        if (Number(val) > Number(submitCount)) {
          item.defaultValue = submitCount;
        }
        this.formConfig.forEach(el => {
          // let succNum = null;
          // if (el.key === "succCount") {
          //   succNum = item.defaultValue;
          // }
          if (el.key === "succRatio") {
            el.defaultValue = (
              parseFloat(Number(item.defaultValue) / Number(submitCount)) * 100
            ).toFixed(2);
          }
        });
      }
    },
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "gatewayName") {
        item.optionData.map(t => {
          if (t.key == val) {
            obj = t;
          }
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "gatewayName") {
            t.defaultValue = obj.gatewayName;
          }
          if (key === "gateway") {
            t.defaultValue = obj.gateway;
          }
        });
      }
    },
    /*
     * 获取省份列表
     * */
    listSysProvince() {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this.ProvinceList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    /*
     * 获取通道列表
     * */
    gateway() {
      const params = {
        data: {
          serverStatus: 1,
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
          if (key === "gatewayName") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              // let obj = {
              //   key: t.gatewayId,
              //   value: t.gatewayName
              // };
              item.optionData.push(t);
            });
          }
        });
      });
    },
    //countMonth
    _mxArrangeSubmitData(formData) {
      if (formData.countMonth) {
        formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
      }
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysGatewayBill {
}
</style>
