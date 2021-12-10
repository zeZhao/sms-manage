<template>
  <!--客户通道策略-->
  <div class="sysCustomerChannelStrategy">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="strategyLevel" label="策略类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.strategyLevel === 1
              ? "系统级"
              : scope.row.strategyLevel === 2
              ? "特服号级"
              : scope.row.strategyLevel === 3
              ? "客户级"
              : "商户级"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="cmPassageway" label="移动通道" />
      <el-table-column prop="cuPassageway" label="联通通道" />
      <el-table-column prop="ctPassageway" label="电信通道" />
      <el-table-column prop="modifier" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间" width="135">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('strategyId', scope.row.strategyId)"
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
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
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
    //validatorMaxBatchNum
    const validatorMaxBatchNum = (rule, value, callback) => {
      let regex = new RegExp("^[1-9]d*$");
      if (value === "") {
        callback(new Error("此项不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      }
    };
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
        namespace: "sysCustomerChannelStrategy",
        list: "listStrategyByPage",
        detele: "deleteStrategy"
      },
      //搜索框数据
      searchParam: {
        strategyLevel: "",
        userId: "",
        userName: "",
        cmPassageway: "",
        cuPassageway: ""
      },
      // 列表参数
      namespace: "",
      //搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "策略类型",
          key: "strategyLevel",
          placeholder: "请选择类型",
          optionData: [
            { key: "1", value: "系统级" },
            { key: "2", value: "特服号级" },
            { key: "3", value: "客户级" },
            { key: "4", value: "商户级" }
          ]
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "移动通道编号",
          key: "cmPassageway",
          placeholder: "请输入移动通道编号"
        },
        {
          type: "input",
          label: "联通通道编号",
          key: "cuPassageway",
          placeholder: "请输入联通通道编号"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "通道策略",
          key: "strategyLevel",
          optionData: [
            { key: 1, value: "系统级" },
            { key: 2, value: "特服号级" },
            { key: 3, value: "客户级" },
            { key: 4, value: "商户级" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cmPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "最大单批数",
          key: "cmMaxBatchNum",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: validatorMaxBatchNum, trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cuPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "最大单批数",
          key: "cuMaxBatchNum",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: validatorMaxBatchNum, trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ctPassageway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "最大单批数",
          key: "ctMaxBatchNum",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: validatorMaxBatchNum, trigger: "change" }
          ]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remarks",
          rules: [{ trigger: "blur", validator: validatorRemark }]
        }
      ],
      strategyId: "",
      GatewayList: [], //通道列表
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway("cuPassageway", "2", "1");
    this.gateway("ctPassageway", "3", "1");
    this.gateway("cmPassageway", "1", "1");
  },
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    /*
     * 获取通道列表
     * */
    gateway(keys, status, orderStatus) {
      const params = {
        data: {
          status: status,
          orderStatus: orderStatus
        }
      };
      this.$http.sysGatewayGroup.listGatewayAndGroup(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.name);
              item.optionData.push(t);
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
        this.$http.sysCustomerChannelStrategy.addStrategy(params).then(res => {
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
            strategyId: this.strategyId,
            ...form
          }
        };
        this.$http.sysCustomerChannelStrategy
          .updateStrategy(params)
          .then(res => {
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
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
      });
    },
    edit(row) {
      this.strategyId = row.strategyId;
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
        if (item.key === "userId") {
          item.btnDisabled = true;
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
    /*
     * 表格数据处理
     * */
    _mxFormListData(list) {
      list.forEach(item => {
        item.province &&
          this.ProvinceList.forEach(t => {
            if (item.province == t.provinceId) {
              item.province = t.provinceName;
            }
          });
        this.GatewayList.forEach(t => {
          const { gatewayId, gatewayName } = t;
          if (item.cu == gatewayId) {
            item.cu = gatewayName;
          }
          if (item.cm == gatewayId) {
            item.cm = gatewayName;
          }
          if (item.ct == gatewayId) {
            item.ct = gatewayName;
          }
        });
      });
      return list;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysCustomerChannelStrategy {
}
</style>
