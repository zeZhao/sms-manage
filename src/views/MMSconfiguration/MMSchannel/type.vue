<template>
  <div>
    <h3>{{ renderTitle }}</h3>
    <div class="container">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        :footerIsCenter="true"
        @submit="submit"
        @cancel="cancel"
      >
        <div v-if="queryType === 'edit'" slot="Other">
          <i
            class="el-icon-lock"
            @click="isOpenDialog"
            style="font-size: 22px;vertical-align: sub;color: #909399;margin-left:5px"
          ></i>
          <el-dialog
            title="登录"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="30%"
            custom-class="loginDialog"
          >
            <el-form
              ref="ruleForm"
              :model="formData"
              :rules="rules"
              label-width="70px"
              style="width: 80%; margin: auto"
            >
              <el-form-item label="手机号:" prop="account">
                <el-input v-model="formData.account" clearable></el-input>
              </el-form-item>
              <el-form-item label="口令:" prop="pwd">
                <el-input
                  v-model="formData.pwd"
                  clearable
                  maxlength="6"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="notDisabled">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
      </FormItem>
    </div>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import FormItemTitle from "@/components/formItemTitle";
//operator字段所有可能出现情况
const models = [
  { value: 0, arr: [1, 2, 3] },
  { value: 1, arr: [1] },
  { value: 2, arr: [2] },
  { value: 3, arr: [3] },
  { value: 4, arr: [1, 2] },
  { value: 5, arr: [1, 3] },
  { value: 6, arr: [2, 3] }
];
export default {
  components: { FormItemTitle },
  data() {
    return {
      formTit: "确认",
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "通道名称",
          key: "name",
          defaultValue: "",
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 30,
              message: "长度在 2 到 30 个字符",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "通道公司名称",
          key: "corpName",
          defaultValue: "",
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 30,
              message: "长度在 2 到 30 个字符",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "通道单价(分)",
          key: "price",
          defaultValue: "",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (value === "" || value === undefined || value === null) {
                  callback(new Error("请输入必填项"));
                } else {
                  if (isNaN(value)) {
                    callback(new Error("通道单价必须为数值"));
                  } else if (value <= 0) {
                    callback(new Error("通道单价必须大于0"));
                  } else if (!/^\d{1,4}(\.\d{1,2})?$/.test(value)) {
                    callback(
                      new Error("通道单价可输入1~4位数值，最多可保留两位小数")
                    );
                  } else {
                    callback();
                  }
                }
              }
            }
          ]
        },
        {
          type: "checkbox",
          label: "支持运营商",
          key: "operator",
          defaultValue: [],
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
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "映射路由",
          key: "routeMap",
          defaultValue: "",
          disabled: this.isDisabled(),
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "radio",
          label: "是否可用",
          key: "status",
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "可用"
            },
            {
              key: 0,
              value: "不可用"
            }
          ],
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          defaultValue: "",
          maxlength: 300,
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
          label: "对接参数",
          key: "parameter",
          defaultValue: "",
          disabled: this.isDisabled(),
          lock: true,
          rules: [
            // {
            //   required: true,
            //   message: "请输入必填项",
            //   trigger: ["blur", "change"]
            // }
          ]
        }
      ],
      dialogVisible: false,
      formData: {},
      rules: {
        account: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: ["blur", "change"]
          }
        ],
        pwd: [
          {
            required: true,
            message: "口令不能为空",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  computed: {
    queryType() {
      return this.$route.query.type;
    },
    renderTitle() {
      const viewTitle = "彩信通道管理/";
      return this.queryType === "add" ? `${viewTitle}新增` : `${viewTitle}修改`;
    }
  },
  mounted() {
    if (this.queryType === "edit") {
      const { gatewayId } = this.$route.query;
      this.$http.mmsGateway.detailMmsGateway({ gatewayId }).then(res => {
        if (res.code === 200) {
          //回显接口内容
          const idx = models.findIndex(v => res.data.operator === v.value);
          res.data.operator = models[idx].arr;
          this.formConfig.forEach(item => {
            item.defaultValue = res.data[item.key];
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  methods: {
    isDisabled() {
      return this.$route.query.type === "edit" ? true : false;
    },
    isOpenDialog() {
      this.dialogVisible = true;
      this.formData.account = "";
      this.formData.pwd = "";
    },
    notDisabled() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const { gatewayId } = this.$route.query;
          this.formData.type = 2;
          this.formData.soleId = Number(gatewayId);

          this.$http.mmsGateway.viewLogin(this.formData).then(res => {
            if (res.code === 200) {
              this.formConfig[4].disabled = false;
              this.formConfig[7].disabled = false;
              this.formConfig[7].defaultValue = res.data;
              this.dialogVisible = false;
              this.$message.success("验证成功");
            } else {
              this.$message.error(res.data);
            }
          });
        }
      });
    },
    submit(data) {
      const result = deepClone(data);
      result.price = +result.price;
      result.operator = this.returnOperator(result.operator);
      const flag =
        this.queryType === "add" ? "addMmsGateway" : "updateMmsGateway";
      if (flag === "updateMmsGateway") {
        result.gatewayId = this.$route.query.gatewayId;
      }
      this.$http.mmsGateway[`${flag}`]({ data: result }).then(res => {
        if (res.code === 200) {
          this.cancel();
          const msg = flag === "addMmsGateway" ? "添加成功" : "修改成功";
          this.$message.success(msg);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //格式化operator字段
    returnOperator(arg) {
      //数组排序然后进行比较找到返回相对应的value
      const data = arg.sort((a, b) => a - b);
      const idx = models.findIndex(
        v => JSON.stringify(data) === JSON.stringify(v.arr)
      );
      return models[idx].value;
    },
    cancel() {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 80%;
  margin: auto;
}
</style>
