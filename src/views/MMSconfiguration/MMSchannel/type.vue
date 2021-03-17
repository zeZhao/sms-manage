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
          <el-button
            type="warning"
            size="small"
            style="margin-left: 150px"
            @click="isOpenDialog"
            >修改验证</el-button
          >
          <el-dialog
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            center
          >
            <el-form
              ref="ruleForm"
              :model="formData"
              :rules="rules"
              label-width="70px"
              style="width: 80%; margin: auto"
            >
              <el-form-item label="账号：" prop="name">
                <el-input v-model="formData.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="name">
                <el-input
                  v-model="formData.name"
                  clearable
                  show-password
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
import { deepClone } from '@/utils';
export default {
  data() {
    return {
      formTit: '确认',
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: '通道名称',
          key: 'name',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
        },
        {
          type: 'input',
          label: '通道公司名称',
          key: 'corpName',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
        },
        {
          type: 'input',
          label: '通道单价(分)',
          key: 'price',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
        },
        {
          type: 'checkbox',
          label: '支持运营商',
          key: 'operator',
          defaultValue: [],
          optionData: [
            {
              key: 1,
              value: '移动'
            },
            {
              key: 2,
              value: '联通'
            },
            {
              key: 3,
              value: '电信'
            }
          ],
          rules: [{ required: true, message: '请选择必选项', trigger: 'blur' }]
        },
        {
          type: 'input',
          label: '映射路由',
          key: 'routeMap',
          disabled: this.isDisabled(),
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
        },
        {
          type: 'radio',
          label: '是否可用',
          key: 'status',
          defaultValue: '',
          optionData: [
            {
              key: 1,
              value: '可用'
            },
            {
              key: 0,
              value: '不可用'
            }
          ],
          rules: [{ required: true, message: '请选择必选项', trigger: 'blur' }]
        },
        {
          type: 'textarea',
          label: '对接参数',
          key: 'parameter',
          disabled: this.isDisabled(),
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
        },
        {
          type: 'textarea',
          label: '备注',
          key: 'remark'
        }
      ],
      dialogVisible: false,
      formData: {},
      rules: {
        name: [{ required: true, message: '请输入必填项', trigger: 'blur' }]
      }
    };
  },
  computed: {
    queryType() {
      return this.$route.query.type;
    },
    renderTitle() {
      const viewTitle = '彩信通道管理/';
      return this.queryType === 'add' ? `${viewTitle}新增` : `${viewTitle}修改`;
    }
  },
  mounted() {
    if (this.queryType === 'edit') {
      const data = { gatewayId: this.$route.query.gatewayId };
      this.$http.mmsGateway.detailMmsGateway(data).then((res) => {
        if (res.code === 200) {
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  methods: {
    isDisabled() {
      return this.$route.query.type === 'edit' ? true : false;
    },
    isOpenDialog() {
      this.$confirm(
        '账号默认为登录的账号，输入登录密码通过后禁用框变为输入框',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.dialogVisible = true;
        })
        .catch(() => {});
    },
    notDisabled() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          alert('submit!');
          this.formConfig[4].disabled = false;
          this.formConfig[6].disabled = false;
          this.dialogVisible = false;
        }
      });
    },
    submit(data) {
      const result = deepClone(data);
      result.operator = this.returnOperator(result.operator);
      console.log(result.operator);
      return;
      this.$http.mmsGateway.addMmsGateway(result).then((res) => {
        if (res.code === 200) {
          this.cancel();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //格式化operator字段
    returnOperator(arr) {
      const obj = {};
      const str = arr.reduce((pre, cur) => pre + cur + ',', '');
      return str.substring(0, str.length - 1);
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