<template>
  <!-- 号段管理 -->
  <div class="smsAppConfig">
    <p>
      移动号段<el-input
        v-model="form.cm"
        style="width:700px;margin:0 20px"
      ></el-input
      >移动号段正则
      <!-- <el-button type="primary">恢复初始设置</el-button> -->
    </p>
    <p>
      联通号段<el-input
        v-model="form.cu"
        style="width:700px;margin:0 20px"
      ></el-input
      >联通号段正则
      <!-- <el-button type="primary">恢复初始设置</el-button> -->
    </p>
    <p>
      电信号段<el-input
        v-model="form.ct"
        style="width:700px;margin:0 20px"
      ></el-input
      >电信号段正则
      <!-- <el-button type="primary">恢复初始设置</el-button> -->
    </p>
    <div style="width:900px;text-align:left;margin-top:50px">
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        cm: "",
        cu: "",
        ct: ""
      }
    };
  },
  created() {},
  mounted() {
    this.getDefault();
  },
  computed: {},
  methods: {
    getDefault() {
      let form = this.form;
      this.$http.smsAppConfig.getAppConfigList().then(res => {
        res.data.forEach(item => {
          for (let key in form) {
            if (item.name == key) {
              form[key] = item.value;
            }
          }
        });
      });
      this.form = form;
    },
    submit() {
      const { cm, cu, ct } = this.form;
      let params = [
        {
          name: "cm",
          remark: "移动",
          type: 1,
          value: cm
        },
        {
          name: "cu",
          remark: "联通",
          type: 1,
          value: cu
        },
        {
          name: "ct",
          remark: "电信",
          type: 1,
          value: ct
        }
      ];
      this.$http.smsAppConfig.addOrUpdate(params).then(res => {
        if (res.code === 200) {
          this.$message.success("保存成功");
          this.getDefault();
        }
      });
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped></style>
