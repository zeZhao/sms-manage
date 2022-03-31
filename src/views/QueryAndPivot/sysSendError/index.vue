<template>
  <!--通道错误-->
  <div class="sysSendError">
    <Search
      :searchFormConfig="searchFormConfig"
      :isOther="true"
      @search="_mxDoSearch"
      :add="false"
    >
      <template v-slot:Other="form">
        <el-button type="primary" size="small" @click="editContent"
          >修改内容</el-button
        >
        <el-button type="primary" size="small" @click="editGateway"
          >修改通道</el-button
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
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="loginName" label="账户名称" width="120" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" width="310" />
      <el-table-column prop="mobile" label="手机号" width="100" />
      <el-table-column prop="gateway" label="通道"
        ><template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.gateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="errCode" label="错误码" />
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="err" label="错误描述" />
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      title="修改内容"
      :visible.sync="content"
      :close-on-click-modal="false"
      style="margin: 0 auto"
      width="80%"
    >
      <FormItem
        :colSpan="12"
        ref="formItemContent"
        :formConfig="formConfigContent"
        btnTxt="确定"
        @choose="choose"
        @submit="submitContent"
        @cancel="cancelContent"
      ></FormItem>
    </el-dialog>
    <el-dialog
      title="修改通道"
      :visible.sync="gateway"
      :close-on-click-modal="false"
      style="margin: 0 auto"
      width="80%"
    >
      <FormItem
        :colSpan="12"
        ref="formItemGateway"
        :formConfig="formConfigGateway"
        btnTxt="确定"
        @choose="choose"
        @submit="submitGateway"
        @cancel="cancelGateway"
        :confirmDisabled="confirmDisabled"
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
    return {
      content: false,
      gateway: false,
      // 接口地址
      searchAPI: {
        namespace: "sysSendError",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "sendError",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "账户编号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "内容"
        },
        {
          type: "inputNum",
          label: "手机号",
          key: "mobile",
          placeholder: "手机号"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "通道编号"
        },
        {
          type: "input",
          label: "错误码",
          key: "errCode",
          placeholder: "错误码"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "CID"
        },
        {
          type: "input",
          label: "错误描述",
          key: "err",
          placeholder: "错误描述"
        },
        {
          type: "inputNum",
          label: "特服号",
          key: "code",
          placeholder: "特服号"
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"]
        }
      ],
      // 修改内容表单配置
      formConfigContent: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: ["blur", "change"] }]
        },
        {
          type: "input",
          label: "原内容",
          key: "content",
          defaultValue: "",
          maxlength: "2000",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "原关键字",
          key: "keyWord",
          defaultValue: "",
          maxlength: "2000",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "目标关键字",
          key: "newKeyWord",
          defaultValue: "",
          maxlength: "2000",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      // 修改通道表单配置
      formConfigGateway: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: ""
        },
        {
          type: "input",
          label: "内容",
          key: "content"
        },
        {
          type: "inputNum",
          label: "CID",
          key: "cid"
        },
        {
          type: "select",
          label: "原通道",
          key: "gateway",
          optionData: [],
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "错误码",
          key: "errCode",
          disabled: true
        },
        {
          type: "input",
          label: "错误原因",
          key: "err",
          disabled: true
        },
        {
          type: "inputNum",
          label: "手机号",
          key: "mobile",
          rules: [
            { required: false, trigger: "blur" },
            {
              pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
              message: "手机号格式错误",
              trigger: "change"
            }
          ]
        },
        {
          type: "inputNum",
          label: "特服号",
          key: "code"
        },
        {
          type: "date",
          label: "开始时间",
          key: "startTime"
        },
        {
          type: "date",
          label: "结束时间",
          key: "endTime"
        },
        {
          type: "divider",
          colSpan: 24
        },
        {
          type: "select",
          label: "目标通道",
          key: "newGateway",
          optionData: [],
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      isChooseUser: false,
      confirmDisabled: false
    };
  },
  activated() {
    this._mxGetList();
    this.getGatewayListAll();
    this.getGatewayList();
  },
  computed: {
    gatewayVal() {
      const idx = this.formConfigGateway.findIndex(v => v.key === "gateway");
      return this.formConfigGateway[idx].defaultValue;
    }
  },
  watch: {
    gatewayVal(val) {
      this.formConfigGateway.forEach(item => {
        const { key } = item;
        if (key === "errCode" || key === "err") {
          this.$set(item, "disabled", !val);
        }
      })
    }
  },
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      if (this.content) {
        this.formConfigContent.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.defaultValue = data.userId;
          }
        });
      } else if (this.gateway) {
        this.formConfigGateway.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.defaultValue = data.userId;
          }
        });
      }
    },
    getGatewayListAll() {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGatewayAll(params).then(res => {
        this.formConfigGateway.forEach(item => {
          const { key } = item;
          if (key === "gateway") {
            item.optionData = res.data.map(v => {
              return { key: v.gatewayId, value: v.gateway + "_" + v.gatewayName };
            });
          }
        })
      });
    },
    getGatewayList() {
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
        this.formConfigGateway.forEach(item => {
          const { key } = item;
          if (key === "newGateway") {
            item.optionData = res.data.map(v => {
              return { key: v.gatewayId, value: v.gateway + "_" + v.gatewayName };
            });
          }
        })
      });
    },
    //修改内容
    editContent() {
      this.content = true;
      setTimeout(() => {
        this.$refs.formItemContent.resetForm();
      });
    },
    // 修改通道
    editGateway() {
      this.confirmDisabled = false;
      this.gateway = true;
      setTimeout(() => {
        this.$refs.formItemGateway.resetForm();
      });
    },
    //提交修改内容
    submitContent(form) {
      this.$http.sysSendError.editContent({ ...form }).then(res => {
        if (resOk(res)) {
          this.$message.success(res.data || res.msg);
          this._mxGetList();
          this.content = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    cancelContent() {
      this.content = false;
    },
    submitGateway(form) {
      // for (let key in form) {
      //   if (key === "startTime") {
      //     form[key] = new Date(form[key]).Format("yyyy-MM-dd hh:mm:ss");
      //   }
      //   if (key === "endTime") {
      //     form[key] = new Date(form[key]).Format("yyyy-MM-dd 23:59:59");
      //   }
      // }
      setTimeout(() => {
        this.confirmDisabled = true;
      });
      this.$http.sysSendError.editGateWay({ ...form }).then(res => {
        if (resOk(res)) {
          this.$message.success(res.data || res.msg);
          this._mxGetList();
          this.gateway = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
        this.confirmDisabled = false;
      }).catch(err => {
        this.confirmDisabled = false;
      });
    },
    cancelGateway() {
      this.gateway = false;
    },
    _mxFormListData(rows) {
      rows.forEach(item => {
        if (item.submitTime) {
          item.submitTime = new Date(item.submitTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return rows;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      return formData;
    }
  }
};
</script>