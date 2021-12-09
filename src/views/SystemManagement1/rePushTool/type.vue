<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <div style="width: 60%; margin: auto">
      <FormItem ref="formItem" :formConfig="formConfig" :footerIsCenter="true" @onChange="onChange" @submit="submit">
        <template slot="Btn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" v-throttle="3000" @click="pushType = 1; $refs.formItem.onSubmit('form')">
            报告推送
          </el-button>
          <el-button type="primary" v-throttle="3000" @click="pushType = 2; $refs.formItem.onSubmit('form')">
            上行推送
          </el-button>
        </template>
      </FormItem>
    </div>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data () {
    return {
      formTit: "新建",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [{
            required: true, trigger: "blur", validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入必填项"));
              if (isNaN(value)) callback(new Error("请输入正确的账户编号"));
              callback();
            }
          }]
        },
        {
          type: "dataTimes",
          label: "选择日期",
          key: "dataTimes",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号码，多个用英文逗号隔开",
          defaultValue: "",
          rules: [{ required: false }]
        }
      ],
      pushType: "" // 1 报告推送 2 上行推送
    };
  },
  computed: {
    renderTitle () {
      const { type } = this.$route.query;
      const str = '重推';
      return type === 'create' ? `新建${str}` : `修改${str}`;
    }
  },
  mounted () {
    const { type, row, ID } = this.$route.query;
    type === 'create' ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  methods: {
    onChange ({ val, item }) {
      if (item.key === "mobile") {
        item.rules = val ? this.$publicValidators.phone : [{ required: false }];
      }
    },
    submit (form) {
      this.$confirm('推送后可在列表进行查看', '确认推送', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认推送
        let params = {};
        if (this.formTit == "新建") {
          params = {
            ...form
          };
          params.pushType = this.pushType;
          params.startTime = params.dataTimes[0];
          params.endTime = params.dataTimes[1];
          this.$http.pushToolTask.add(params).then(res => {
            if (resOk(res)) {
              window.history.back();
              this.$message.success(res.msg || res.data);
              this._mxGetList();
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
          this.$http.sysSignRoute.updateSignRoute(params).then(res => {
            if (resOk(res)) {
              window.history.back();
              this.$message.success(res.msg || res.data);
              this._mxGetList();
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      }).catch(() => { });
    },
    _mxCreate () {
      this.formTit = "新建";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit (row) {
      this.routeId = row.routeId;
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
    },
    cancel () {
      window.history.back();
    }
  }
};
</script>