<template>
  <!--报警类别管理-->
  <div class="sysAlarmType">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
      :add="false"
    ></Search>
    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%">
      <el-table-column prop="errNum" label="错误码" />
      <el-table-column prop="useModule" label="应用模块" />
      <el-table-column prop="alerType" label="报警类型" width="120" />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="115"
        show-overflow-tooltip
      />
      <el-table-column
        prop="email"
        label="邮箱"
        width="115"
        show-overflow-tooltip
      />
      <el-table-column prop="alarmLevel" label="报警级别">
        <template slot-scope="scope">
          <span>{{
            scope.row.alarmLevel === 0
              ? '提醒'
              : scope.row.alarmLevel === 1
              ? '一般'
              : scope.row.alarmLevel === 2
              ? '重要'
              : '严重'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarmModes" label="报警方式">
        <template slot-scope="scope">
          {{ renderAlarmModes(scope.row.alarmModes) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="smsContentTemp"
        label="短信报警模板"
        show-overflow-tooltip
      />
      <el-table-column
        prop="wetContentTemp"
        label="微信报警模板"
        show-overflow-tooltip
      />
      <el-table-column
        prop="emailContentTemp"
        label="邮件报警模板"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('typeId', scope.row.typeId)"
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
        :formConfig="formConfig"
        :btnTxt="formTit"
        @onChange="onChange"
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
        namespace: 'sysAlarmType',
        list: 'listAlarmTypeByPage',
        detele: 'deleteAlarmType',
      },
      // 列表参数
      namespace: 'alarmType',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'inputNum',
          label: '错误码',
          key: 'errNum',
          placeholder: '请输入错误码',
        },
        {
          type: 'input',
          label: '应用模块',
          key: 'useModule',
          placeholder: '请输入应用模块',
        },
        {
          type: 'input',
          label: '手机号',
          key: 'mobile',
          placeholder: '请输入手机号',
        },
        {
          type: 'select',
          label: '报警级别',
          key: 'alarmLevel',
          placeholder: '请选择报警级别',
          optionData: [
            {
              key: 0,
              value: '提醒',
            },
            {
              key: 1,
              value: '一般',
            },
            {
              key: 2,
              value: '重要',
            },
            {
              key: 3,
              value: '严重',
            },
          ],
        },
        {
          type: 'input',
          label: '报警类型',
          key: 'alerType',
          placeholder: '请输入报警类型',
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: '错误码',
          key: 'errNum',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '应用模块',
          key: 'useModule',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'input',
          label: '报警类型',
          key: 'alerType',
          defaultValue: '',
          rules: [{ required: true, message: '请输入必填项', trigger: 'blur' }],
        },
        {
          type: 'select',
          label: '报警级别',
          key: 'alarmLevel',
          optionData: [
            {
              key: 0,
              value: '提醒',
            },
            {
              key: 1,
              value: '一般',
            },
            {
              key: 2,
              value: '重要',
            },
            {
              key: 3,
              value: '严重',
            },
          ],
          rules: [
            {
              required: true,
              message: '请选择必选项',
              trigger: 'change',
            },
          ],
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
          rules: [
            {
              required: true,
              message: '请选择必选项',
              trigger: 'change',
            },
          ],
        },
        {
          type: 'input',
          label: '手机号',
          key: 'mobile',
          defaultValue: '',
          tips: '多个用英文逗号分隔',
          rules: [{ required: false, trigger: 'blur', validator: null }],
        },
        {
          type: 'input',
          label: '邮箱',
          key: 'email',
          defaultValue: '',
          tips: '多个用英文逗号分隔',
          rules: [{ required: false, trigger: 'blur', validator: null }],
        },
        {
          type: 'textarea',
          label: '短信报警模版',
          key: 'smsContentTemp',
          disabled: true,
          rules: [
            { required: false, message: '请输入必填项', trigger: 'blur' },
          ],
        },
        {
          type: 'textarea',
          label: '微信报警模版',
          key: 'wetContentTemp',
          disabled: true,
          rules: [
            { required: false, message: '请输入必填项', trigger: 'blur' },
          ],
        },
        {
          type: 'textarea',
          label: '邮件报警模板',
          key: 'emailContentTemp',
          disabled: true,
          rules: [
            { required: false, message: '请输入必填项', trigger: 'blur' },
          ],
        },
      ],
      typeId: '',
    }
  },
  methods: {
    renderAlarmModes(arr) {
      const str = arr.reduce((pre, cur) => {
        return pre + this.formatStr(cur) + '，'
      }, '')
      return str.substring(0, str.length - 1)
    },
    formatStr(v) {
      if (v === 1) {
        return '短信'
      } else if (v === 2) {
        return '微信'
      } else {
        return '邮箱'
      }
    },
    //接受子组件传过来的值来更改必填项校验
    onChange({ value, item }) {
      if (item.label === '报警方式') {
        //短信
        if (item.defaultValue.includes(1)) {
          this.formConfig[this.formConfig.length - 3].disabled = false
          this.formConfig[this.formConfig.length - 3].rules[0].required = true
          this.formConfig[
            this.formConfig.length - 5
          ].rules = this.$publicValidators.phone
        } else {
          this.formConfig[this.formConfig.length - 3].disabled = true
          this.formConfig[this.formConfig.length - 3].rules[0].required = false
          this.formConfig[this.formConfig.length - 5].rules = [
            { required: false, trigger: 'blur', validator: null },
          ]
        }
        //微信
        if (item.defaultValue.includes(2)) {
          this.formConfig[this.formConfig.length - 2].disabled = false
          this.formConfig[this.formConfig.length - 2].rules[0].required = true
        } else {
          this.formConfig[this.formConfig.length - 2].disabled = true
          this.formConfig[this.formConfig.length - 2].rules[0].required = false
        }
        //邮箱
        if (item.defaultValue.includes(4)) {
          this.formConfig[this.formConfig.length - 1].disabled = false
          this.formConfig[this.formConfig.length - 1].rules[0].required = true
          this.formConfig[
            this.formConfig.length - 4
          ].rules = this.$publicValidators.email
        } else {
          this.formConfig[this.formConfig.length - 1].disabled = true
          this.formConfig[this.formConfig.length - 1].rules[0].required = false
          this.formConfig[this.formConfig.length - 4].rules = [
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
        this.$http.sysAlarmType.addAlarmType(params).then((res) => {
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
            typeId: this.typeId,
            ...form,
          },
        }
        this.$http.sysAlarmType.updateAlarmType(params).then((res) => {
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

    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      if (row.alarmMode) {
        // "".substring;
        let length = row.alarmMode.length
        row.alarmMode = row.alarmMode.substring(1, length - 1).split(',')
        row.alarmMode = row.alarmMode.map((item) => {
          return item.substring(1, 2)
        })
      }
      return row
    },
    edit(row) {
      // row = this._mxArrangeEditData(row)
      this.typeId = row.typeId
      this.formTit = '修改'
      
      //编辑时  前四个默认不可修改
      let indexSymbol = 3;
      while (indexSymbol >= 0) {
        this.formConfig[indexSymbol].disabled = true;
        indexSymbol --;
      }

      //短信
      if (row.alarmModes.includes(1)) {
        this.formConfig[this.formConfig.length - 3].disabled = false
        this.formConfig[this.formConfig.length - 3].rules[0].required = true
        this.formConfig[
          this.formConfig.length - 5
        ].rules = this.$publicValidators.phone
      } else {
        this.formConfig[this.formConfig.length - 3].disabled = true
        this.formConfig[this.formConfig.length - 3].rules[0].required = false
        this.formConfig[this.formConfig.length - 5].rules = [
          { required: false, trigger: 'blur', validator: null },
        ]
      }
      //微信
      if (row.alarmModes.includes(2)) {
        this.formConfig[this.formConfig.length - 2].disabled = false
        this.formConfig[this.formConfig.length - 2].rules[0].required = true
      } else {
        this.formConfig[this.formConfig.length - 2].disabled = true
        this.formConfig[this.formConfig.length - 2].rules[0].required = false
      }
      //邮箱
      if (row.alarmModes.includes(4)) {
        this.formConfig[this.formConfig.length - 1].disabled = false
        this.formConfig[this.formConfig.length - 1].rules[0].required = true
        this.formConfig[
          this.formConfig.length - 4
        ].rules = this.$publicValidators.email
      } else {
        this.formConfig[this.formConfig.length - 1].disabled = true
        this.formConfig[this.formConfig.length - 1].rules[0].required = false
        this.formConfig[this.formConfig.length - 4].rules = [
          { required: false, trigger: 'blur', validator: null },
        ]
      }

      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
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