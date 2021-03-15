<template>
  <div class="wrap">
    <h3>{{ returnUserAlarmType }}</h3>
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="150px"
      class="form-container"
    >
      <el-form-item label="告警开关：" prop="isOpen">
        <el-radio-group v-model="formData.isOpen">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="报警方式：" prop="alarmModes">
        <el-checkbox-group v-model="formData.alarmModes">
          <el-checkbox :label="1">短信</el-checkbox>
          <el-checkbox :label="2">微信</el-checkbox>
          <el-checkbox :label="4">邮箱</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div v-if="queryUserAlarmType == 1">
        <el-form-item label="待审数量：" prop="waitCheckNum">
          <el-input
            type="number"
            v-model="formData.waitCheckMin"
            placeholder="分钟"
            clearable
            style="width: 30%"
          />
          <el-input
            type="number"
            v-model="formData.waitCheckNum"
            placeholder="待审数量"
            clearable
            style="width: 40%"
          />
          <div class="item-tips">
            {{ formData.waitCheckMin }}分钟内接口发送待审数量大于阀值则告警
          </div>
        </el-form-item>
      </div>
      <div v-if="queryUserAlarmType == 2">
        <el-form-item label="到达成功率：" prop="returnSuccRate">
          <el-input
            type="number"
            v-model="formData.returnSuccMin"
            placeholder="分钟"
            clearable
            style="width: 30%"
          />
          <el-input
            v-model="formData.returnSuccRate"
            placeholder="到达成功率"
            clearable
            style="width: 40%"
          />
          <div class="item-tips">
            {{ formData.returnSuccMin }}分钟内到达成功率小于配置阀值则告警
          </div>
        </el-form-item>
        <el-form-item label="连续触发周期：" prop="returnLimitNum">
          <el-select
            v-model="formData.returnLimitNum"
            placeholder="请选择连续触发周期"
            clearable
            style="width: 100%"
          >
            <el-option :value="1"></el-option>
            <el-option :value="2"></el-option>
            <el-option :value="3"></el-option>
            <el-option :value="4"></el-option>
            <el-option :value="5"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-if="queryUserAlarmType == 3">
        <el-form-item label="余额报警阈值：" prop="balanceNum">
          <el-input
            type="number"
            v-model="formData.balanceNum"
            placeholder="请输入余额报警阈值"
            clearable
            style="width: 50%"
          />
        </el-form-item>
        <el-form-item label="间隔时间：" prop="balanceInterval">
          <el-input
            type="number"
            v-model="formData.balanceInterval"
            placeholder="请输入间隔时间"
            clearable
            style="width: 50%"
          /><span>&nbsp;分钟</span>
        </el-form-item>
      </div>
      <el-form-item label="手机号：" prop="alarmMobile">
        <el-input
          v-model="formData.alarmMobile"
          placeholder="请输入手机号"
          clearable
        />
        <div class="item-tips">多个用英文逗号分隔</div>
      </el-form-item>
      <el-form-item label="邮箱：" prop="alarmEmail">
        <el-input
          v-model="formData.alarmEmail"
          placeholder="请输入邮箱"
          clearable
        />
        <div class="item-tips">多个用英文逗号分隔</div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">确认</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    const checkWaitCheckMinNum = (rule, value, callback) => {
      const min = this.formData.waitCheckMin
      const num = this.formData.waitCheckNum
      if (min && num && min > 0 && num > 0) {
        callback()
      } else if ((min && min <= 0) || (num && num <= 0)) {
        callback(new Error('时间和待审数量皆需大于0'))
      } else {
        callback(new Error('时间和待审数量皆为必填项'))
      }
    }
    const checkReturnSuccMinRate = (rule, value, callback) => {
      const min = this.formData.returnSuccMin
      const num = this.formData.returnSuccRate
      if (min && num && min > 0) {
        callback()
      } else if (min && min <= 0) {
        callback(new Error('时间需大于0'))
      } else {
        callback(new Error('时间和到达成功率皆为必填项'))
      }
    }
    return {
      formData: { alarmModes: [] },
      rules: {
        isOpen: [
          { required: true, message: '请选择告警开关', trigger: 'change' },
        ],
        alarmModes: [
          { required: true, message: '请选择报警方式', trigger: 'change' },
        ],
        waitCheckNum: [
          { required: true, trigger: 'blur', validator: checkWaitCheckMinNum },
        ],
        returnSuccRate: [
          {
            required: true,
            trigger: 'blur',
            validator: checkReturnSuccMinRate,
          },
        ],
        returnLimitNum: [
          { required: true, message: '请选择连续触发周期', trigger: 'change' },
        ],
        balanceNum: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && value > 0) {
                callback()
              } else if (value && value <= 0) {
                callback(new Error('余额报警阈值需大于0'))
              } else {
                callback(new Error('请输入余额报警阈值'))
              }
            },
          },
        ],
        balanceInterval: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && value > 0) {
                callback()
              } else if (value && value <= 0) {
                callback(new Error('间隔时间需大于0'))
              } else {
                callback(new Error('请输入间隔时间'))
              }
            },
          },
        ],
        alarmMobile: [{ required: false, trigger: 'blur', validator: null }],
        alarmEmail: [{ required: false, trigger: 'blur', validator: null }],
      },
    }
  },
  watch: {
    'formData.alarmModes'(cur) {
      if (cur.includes(1)) {
        this.rules.alarmMobile = this.$publicValidators.phone
      } else {
        this.rules.alarmMobile = [
          { required: false, trigger: 'blur', validator: null },
        ]
      }
      if (cur.includes(4)) {
        this.rules.alarmEmail = this.$publicValidators.email
      } else {
        this.rules.alarmEmail = [
          { required: false, trigger: 'blur', validator: null },
        ]
      }
    },
  },
  computed: {
    queryUserAlarmType() {
      return this.$route.query.userAlarmType
    },
    returnUserAlarmType() {
      if (this.queryUserAlarmType == 1) {
        return '发送监控配置'
      } else if (this.queryUserAlarmType == 2) {
        return '到达率监控配置'
      } else if (this.queryUserAlarmType == 3) {
        return '余额监控配置'
      }
    },
  },
  mounted() {
    this.$http.sysAlarmUser
      .queryOneAlarmUserByUserID({ ...this.$route.query })
      .then((res) => {
        if (res.code === 200) {
          const data = { ...this.formData, ...res.data }
          if (!data.alarmModes) {
            data.alarmModes = []
          }
          this.formData = data
        } else {
          this.$message.error(res.msg)
        }
      })
  },
  methods: {
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const data = { ...this.formData, ...this.$route.query }
          this.$http.sysAlarmUser.saveAlarmUser(data).then((res) => {
            if (res.code === 200) {
              this.cancel()
              this.$message.success('配置成功' || res.msg)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    cancel() {
      this.$router.back()
    },
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  padding-left: 300px;
  .form-container {
    width: 50%;
    .item-tips {
      color: #999999;
      font-size: 12px;
      line-height: 17px;
      text-align: right;
      margin-top: 6px;
    }
  }
}
</style>