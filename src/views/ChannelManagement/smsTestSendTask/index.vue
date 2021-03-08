<template>
  <div class="smsTestSendTask">
    <h3>通道发送(通道测试)</h3>
    <FormItem
      ref="formItem"
      :formConfig="formConfig"
      :btnTxt="formTit"
      @submit="submit"
      @cancel="cancel"
      @choose="choose"
    >
      <template slot="Other">
        <el-button
          style="float: right;margin-left: 15px"
          type="primary"
          @click="resetForm"
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
          label: "商户/用户计费",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户名",
          key: "userName",
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
          key: "gatewayCm",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "联通通道",
          key: "gatewayCu",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "gatewayCt",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "手机号",
          key: "mobile",
          placeholder: '请输入手机号，多手机号请用","分割',
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "短信内容",
          key: "content",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
  //   backgroundf;
}
</style>
