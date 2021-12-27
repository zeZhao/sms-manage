<template>
  <div class="smsTestSendTask">
    <h3>通道发送(通道测试)</h3>
    <FormItem
      ref="formItem"
      :formConfig="formConfig"
      :btnTxt="formTit"
      :isCancel="false"
      @submit="submit"
      @cancel="cancel"
      @choose="choose"
    >
      <template slot="Other">
        <el-button style="margin-left: 8px" size="small" @click="resetForm"
          >重置</el-button
        >
      </template>
    </FormItem>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
// import listMixin from "@/mixin/listMixin";
export default {
  //   mixins: [listMixin],
  components: {},
  data() {
    return {
      isChooseUser: false,
      formTit: "确认发送",
      formConfig: [
        {
          type: "input",
          label: "商户/账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
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
          label: "账户名称",
          key: "userName",
          disabled: true,
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
          label: "特服号",
          // disabled: true,
          key: "code",
          maxlength: "20",
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
          label: "移动通道",
          key: "gatewayCm",
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
          type: "select",
          label: "联通通道",
          key: "gatewayCu",
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
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "gatewayCt",
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
          label: "手机号",
          key: "mobile",
          placeholder: '请输入手机号，多手机号请用","分割',
          rules: this.$publicValidators.phone,
          mobileTips: true
        },
        {
          type: "textarea",
          label: "短信内容",
          key: "content",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          contentTips: true
        }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    //显示选择用户弹窗
    choose() {
      this.isChooseUser = true;
    },
    //关闭选择用户弹窗
    cancelUser(val) {
      this.isChooseUser = val;
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "userName") {
          t.defaultValue = data.userName;
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
      const params = {
        data: {
          ...form
        }
      };
      this.$http.smsTestSendTask.send(params).then(res => {
        if (resOk(res)) {
          this.$message.success(res.data || res.msg);
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    resetForm() {
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    cancel() {}
  },
  created() {},
  mounted() {
    this.gateway("gatewayCu", "2", "1");
    this.gateway("gatewayCt", "3", "1");
    this.gateway("gatewayCm", "1", "1");
  }
};
</script>
<style lang="scss" scoped>
.smsTestSendTask {
  width: 650px;
  margin: 0 auto;
  /deep/.FormItem .submitBtn {
    float: left;
    margin-left: 80px;
  }
  //   backgroundf;
}
</style>
