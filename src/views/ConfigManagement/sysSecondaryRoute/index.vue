<template>
  <!--二次路由-->
  <div class="sysSecondaryRoute">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="客户特服号" />
      <el-table-column prop="gwcode" label="网关特服号" />
      <el-table-column prop="gateway" label="网关编号" />
      <el-table-column prop="sign" label="客户签名" />
      <el-table-column prop="remark" label="备注信息" />
      <el-table-column prop="createby" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('routeId', scope.row.routeId)"
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
    const validatorSign = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/;
      if (value == "") {
        callback(new Error("客户签名不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入2-8个字符，只能输入中文、英文、数字"));
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
    const validatorCode = (rule, value, callback) => {
      let regex = /^[0-9]*$/;
      if (value) {
        console.log(Number(value).constructor);
        if (!regex.test(Number(value)) || value.toString().length !== 4) {
          callback(new Error("特服号仅支持4位数字"));
        } else {
          callback();
        }
        // callback(new Error("备注信息不能为空"));
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSecondaryRoute",
        list: "listSecondaryRouteByPage",
        detele: "deleteInterfaceSign"
      },
      // 列表参数
      namespace: "secondaryRoute",
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
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "inputNum",
          label: "网关编号",
          key: "gateway",
          placeholder: "请输入网关编号"
        },
        {
          type: "input",
          label: "用户签名",
          key: "sign",
          placeholder: "请输入用户签名"
        },
        {
          type: "inputNum",
          label: "客户特服号",
          key: "code",
          placeholder: "请输入客户特服号"
        },
        {
          type: "inputNum",
          label: "网关特服号",
          key: "gwcode",
          placeholder: "请输入网关特服号"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          btnDisabled: false,
          // change: this.selectUser,
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
          type: "input",
          label: "客户特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户名称",
          disabled: true,
          key: "userName",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "网关编号",
          key: "gateway",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "网关特服号",
          key: "gwcode",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "change", validator: validatorCode }
          ]
        },

        {
          type: "input",
          label: "客户签名",
          key: "sign",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorSign }
          ]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark",
          maxlength: "300",
          rules: [{ trigger: "blur", validator: validatorRemark }]
        }
      ],
      routeId: "",
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    sum(num1, num2) {
      if (num2 > 100) {
      }
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
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
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
        if (key === "code") {
          t.defaultValue = data.code;
        }
        if (key === "userName") {
          t.defaultValue = data.userName;
        }
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
        this.$http.sysSecondaryRoute.addSecondaryRoute(params).then(res => {
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
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSecondaryRoute.updateSecondaryRoute(params).then(res => {
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
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
    },
    edit(row) {
      this.routeId = row.routeId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
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
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
