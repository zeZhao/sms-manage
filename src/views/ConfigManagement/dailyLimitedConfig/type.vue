<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      >
        <template slot="Other">
          <p
            style="padding-left: 60px; font-size: 13px; line-height: 1.5; color: #999"
          >
            规则：只要有相关通道的配置数据，该通道加载后则认为当前通道需要限量。配置了该设置的客户进行限量处理，超量后进入到14号通道形成超量的失败状态返回给客户。未进行配置走到当前通道的客户，则不进行限速处理。
            如果想取消当前通道的限速逻辑，需要清理掉该通道的所有限速配置数据。
          </p>
        </template>
      </FormItem>
    </div>
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
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "SmsGatewayUserSendControl",
        list: "queryByPage",
        detele: "deleteSmsGatewayUserSendControl"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {
        userId: ""
      },
      //筛选不加data对象
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
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
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "select",
          label: "通道",
          key: "gateway",
          initDefaultValue: "",
          defaultValue: "",
          optionData: [],
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
          label: "日限量(万)",
          key: "limitCount",
          defaultValue: "",
          maxlength: "5",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (!value) callback(new Error("请输入必填项"));
                if (isNaN(value)) callback(new Error("日限量必须为数值"));
                if ((value + "").indexOf(".") !== -1 || value <= 0)
                  callback(new Error("日限量只能输入正整数"));
                callback();
              }
            }
          ]
        }
      ],
      id: "",
      isChooseUser: false
    };
  },
  computed: {
    renderTitle() {
      const { type } = this.$route.query;
      const str = "日限量配置";
      return type === "create" ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt() {
      const { type } = this.$route.query;
      return type === "create" ? "新增" : "修改";
    }
  },
  mounted() {
    this.getGatewayList();
    const { type, row, ID } = this.$route.query;
    type === "create" ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
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
        for (let i = 0, len = this.formConfig.length; i < len; i++) {
          const { key } = this.formConfig[i];
          if (key === "gateway") {
            this.formConfig[i].optionData = res.data.map(v => {
              return { key: v.gatewayId, value: v.gateway };
            });
            break;
          }
        }
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
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = { ...form };
        this.$http.SmsGatewayUserSendControl.addSmsGatewayUserSendControl(
          params
        ).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.SmsGatewayUserSendControl.updateSmsGatewayUserSendControl(
          params
        ).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    _mxCreate() {
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit(row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
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
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },
    cancel() {
      this.addChannel = false;
      window.history.back();
    }
  }
};
</script>
