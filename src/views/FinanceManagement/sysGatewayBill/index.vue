<template>
  <!--通道月账单-->
  <div class="sysGatewayBill">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
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
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('bId', scope.row.bId)" type="text" size="small">删除</el-button>
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
        ref="formItem"
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
        namespace: "smsGatewayBill",
        list: "listGatewayBillByPage",
        detele: "deleteGatewayBill"
      },
      // 列表参数
      namespace: "gatewayBill",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
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
          label: "通道编号",
          key: "gateway",
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "成功数",
          key: "succCount",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "成功率",
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
          type: "month",
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
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      bId: "",
      GatewayList: [], //通道列表
      ProvinceList: [] //通道列表
    };
  },
  mounted() {
    this.gateway();
    this.listSysProvince();
  },
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "gateway") {
        item.optionData.map(t => {
          console.log(t);
          if (t.key == val) {
            obj = t;
          }
        });
        console.log(obj, "11111111231211111");
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
              let obj = {
                key: t.gatewayId,
                value: t.gatewayName
              };
              item.optionData.push(obj);
            });
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
        };
        this.$http.sysGatewayBill.addGatewayBill(params).then(res => {
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
            bId: this.bId,
            ...form
          }
        };
        this.$http.sysGatewayBill.updateGatewayBill(params).then(res => {
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
      this.bId = row.bId;
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
.sysGatewayBill {
}
</style>
