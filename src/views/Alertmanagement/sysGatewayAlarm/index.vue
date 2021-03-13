<template>
  <!--通道警报-->
  <div class="mmsUserGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="gateway" label="通道编号" min-width="100" />
      <el-table-column
        prop="submitFail"
        label="是否提交失败报警"
        min-width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.submitFail === 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarmStaus" label="失败状态" min-width="100" />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="115"
        min-width="150"
      />
      <el-table-column
        prop="sucCrate"
        label="低于设置成功率报警"
        min-width="150"
      />
      <el-table-column
        prop="disconnectFail"
        label="连不上网关报警"
        min-width="150"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.disconnectFail === 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="complaintRate"
        label="投诉率报警"
        min-width="100"
      />
      <el-table-column
        prop="daySendAlarm"
        label="日成功量提醒"
        min-width="150"
      />
      <el-table-column prop="createUser" label="创建人" min-width="100" />
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="modifyUser" label="修改人" min-width="100" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="150">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('alarmId', scope.row.alarmId)"
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
        :labelWidth="180"
        :formConfig="formConfig"
        @onChange="onChange"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin'
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: '新增',
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: 'sysGatewayAlarm',
        list: 'listGatewayAlarmByPage',
        detele: 'deleteGatewayAlarm',
      },
      // 列表参数
      namespace: 'gatewayAlarm',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'input',
          label: '通道编号',
          key: 'gateway',
          placeholder: '请输入通道编号',
        },
        {
          type: 'input',
          label: '手机号',
          key: 'mobile',
          placeholder: '请输入手机号',
        },
        {
          type: 'input',
          label: '邮箱',
          key: 'email',
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: '通道编号',
          key: 'gateway',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'select',
          label: '是否提交失败报警',
          key: 'submitFail',
          optionData: [
            {
              key: 0,
              value: '否',
            },
            {
              key: 1,
              value: '是',
            },
          ],
          rules: [{ required: true, message: '请选择必填项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '失败状态',
          key: 'alarmStaus',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '低于设定的成功率报警',
          key: 'sucCrate',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'select',
          label: '连不上通道报警',
          key: 'disconnectFail',
          optionData: [
            {
              key: 0,
              value: '否',
            },
            {
              key: 1,
              value: '是',
            },
          ],
          rules: [{ required: true, message: '请选择必填项', trigger: 'blur' }],
        },
        // {
        //   type: 'input',
        //   label: '投诉率报警',
        //   key: 'complaintRate',
        //   defaultValue: '',
        //   // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: 'input',
          label: '日成功量提醒',
          key: 'daySendAlarm',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'select',
          label: '省份成功率低报警',
          key: 'isProvinceSucc',
          optionData: [
            {
              key: 0,
              value: '否',
            },
            {
              key: 1,
              value: '是',
            },
          ],
          rules: [{ required: true, message: '请选择必填项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '同一失败状态报警次数',
          key: 'errStatusNum',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'checkbox',
          label: '报警方式',
          key: 'alarmModes',
          defaultValue: [],
          optionData: [
            {
              key: 1,
              value: '短信',
            },
            {
              key: 2,
              value: '微信',
            },
            {
              key: 4,
              value: '邮箱',
            },
          ],
          rules: [{ required: true, message: '请选择必选项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '手机号',
          key: 'mobile',
          tips: '多个用英文逗号分隔',
          rules: [{ required: false, trigger: 'blur', validator: null }],
        },
        {
          type: 'input',
          label: '邮箱',
          key: 'email',
          tips: '多个用英文逗号分隔',
          rules: [{ required: false, trigger: 'blur', validator: null }],
        },
      ],
      alarmId: '',
    }
  },
  methods: {
    onChange({ val, item }) {
      if (item.label === '报警方式') {
        if (val.includes(1)) {
          this.formConfig[
            this.formConfig.length - 2
          ].rules = this.$publicValidators.phone
        } else {
          this.formConfig[this.formConfig.length - 2].rules = [
            { required: false, trigger: 'blur', validator: null },
          ]
        }
        if (val.includes(4)) {
          this.formConfig[
            this.formConfig.length - 1
          ].rules = this.$publicValidators.email
        } else {
          this.formConfig[this.formConfig.length - 1].rules = [
            { required: false, trigger: 'blur', validator: null },
          ]
        }
      }
    },
    submit(form) {
      let params = {}
      if (this.formTit == '新增') {
        params = {
          data: {
            ...form,
          },
        }
        this.$http.sysGatewayAlarm.addGatewayAlarm(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data)
            this._mxGetList()
            this.addChannel = false
          } else {
            this.$message.error(res.data || res.msg)
          }
        })
      } else {
        params = {
          data: {
            alarmId: this.alarmId,
            ...form,
          },
        }
        this.$http.sysGatewayAlarm.updateGatewayAlarm(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data)
            this._mxGetList()
            this.addChannel = false
          } else {
            this.$message.error(res.data || res.msg)
          }
        })
      }
    },
    create() {
      this.addChannel = true
      this.formTit = '新增'
      setTimeout(() => {
        this.$refs.formItem.resetForm()
      }, 0)
    },
    edit(row) {
      this.alarmId = row.alarmId
      this.formTit = '修改'
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (row[key] === true) {
            row[key] = 1
          }
          if (row[key] === false) {
            row[key] = 0
          }
          if (item.key === key) {
            this.$set(item, 'defaultValue', row[key])
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, 'defaultValue', '')
        }
      })
      setTimeout(() => {
        this.$refs.formItem.clearValidate()
      }, 0)
      this.addChannel = true
    },
    cancel() {
      this.addChannel = false
    },
  },
}
</script>
