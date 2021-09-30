<template>
  <div class="sysSensitiveWord">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData" max-height="500"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="wordName" label="IP/域名" />
      <el-table-column prop="groupId" label="网址类型" />
      <el-table-column prop="groupName" label="拦截策略" />
      <el-table-column prop="remark" label="告警手机号" />
      <el-table-column prop="remark" label="告警邮箱" />
      <el-table-column prop="remark" label="创建时间" />
      <el-table-column prop="remark" label="创建人" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('wordId', scope.row.wordId)"
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
        @selectChange="selectChange"
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
        namespace: 'sysSensitiveWord',
        list: 'listSensitiveWordByPage',
        detele: 'deleteSensitiveWord',
      },
      // 列表参数
      namespace: 'sensitiveWord',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'select',
          label: '网址类型',
          key: 'wordName',
          optionData: [
            { key: '1', value: 'IP' },
            { key: '2', value: '域名' },
          ],
        },
        {
          type: 'select',
          label: '拦截策略',
          key: 'groupId',
          optionData: [
            { key: '1', value: '直接拦截' },
            { key: '2', value: '人工审核' },
            { key: '3', value: '告警' },
          ],
        },
        {
          type: 'input',
          label: 'IP/域名',
          key: 'IP',
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: 'input',
          label: 'IP/域名',
          key: 'wordName',
          defaultValue: '',
          rules: [
            {
              required: true,
              message: '请输入必填项',
              trigger: 'blur',
            },
          ],
        },
        {
          type: 'select',
          label: '网址类型',
          key: 'wordName1',
          defaultValue: '',
          optionData: [
            { key: '1', value: 'IP' },
            { key: '2', value: '域名' },
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
          type: 'select',
          label: '拦截策略',
          key: 'wordName2',
          defaultValue: '',
          optionData: [
            { key: '1', value: '直接拦截' },
            { key: '2', value: '人工审核' },
            { key: '3', value: '告警' },
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
          label: '告警手机',
          key: 'wordName3',
          defaultValue: '',
          placeholder: '多个用英文逗号分隔',
          disabled: true,
          rules: [
            {
              required: false,
              trigger: 'blur',
              validator: null,
            },
          ],
        },
        {
          type: 'input',
          label: '告警邮箱',
          key: 'wordName4',
          defaultValue: '',
          placeholder: '多个用英文逗号分隔',
          disabled: true,
          rules: [
            {
              required: false,
              trigger: 'blur',
              validator: null,
            },
          ],
        },
      ],
      wordId: undefined,
    }
  },
  methods: {
    //接受子组件传过来的值来更改必填项校验
    selectChange({ value, item }) {
      if (item.label === '拦截策略') {
        if (item.defaultValue === '3') {
          this.formConfig[3].disabled = false
          this.formConfig[4].disabled = false
          this.formConfig[3].rules[0].required = true
          this.formConfig[4].rules[0].required = true
          this.formConfig[3].rules[0].validator = this.$publicValidators.phone[0].validator
          this.formConfig[4].rules[0].validator = this.$publicValidators.email[0].validator
        } else {
          this.formConfig[3].disabled = true
          this.formConfig[4].disabled = true
          this.formConfig[3].rules[0].required = false
          this.formConfig[4].rules[0].required = false
          this.formConfig[3].rules[0].validator = null
          this.formConfig[4].rules[0].validator = null
          //同时把已经输入过的值清空掉
          this.formConfig[3].defaultValue = ''
          this.formConfig[4].defaultValue = ''
        }
      }
    },
    submit(form) {
      let params = {}
      const { wordName, groupId } = form
      if (this.formTit == '新增') {
        this.$http.sysSensitiveWord
          .checkSensitiveWord({
            data: {
              wordName,
              groupId,
            },
          })
          .then((res) => {
            //判断敏感词是否存在
            if (res.data === 1) {
              this.$message.error('敏感词存在！')
            } else {
              params = {
                data: {
                  ...form,
                },
              }
              this.$http.sysSensitiveWord
                .addSensitiveWord(params)
                .then((res) => {
                  if (resOk(res)) {
                    this.$message.success(res.msg || res.data)
                    this._mxGetList()
                    this.addChannel = false
                  } else {
                    this.$message.error(res.data || res.msg)
                  }
                })
            }
          })
      } else {
        params = {
          data: {
            wordId: this.wordId,
            ...form,
          },
        }
        this.$http.sysSensitiveWord.updateSensitiveWord(params).then((res) => {
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
        this.formConfig[2].defaultValue = '2'
      }, 0)
    },
    edit(row) {
      this.wordId = row.wordId
      this.formTit = '修改'
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, 'defaultValue', row[key])
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, 'defaultValue', '')
        }
        if (item.key == 'wordName') {
          this.$set(item, 'disabled', true)
        }
      })
      this.listSensitiveWordGroup()
      this.$nextTick(() => {
        this.$refs['formItem'].clearValidate()
      })
      this.addChannel = true
    },
    cancel() {
      this.addChannel = false
    },
  },
}
</script>