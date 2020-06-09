<template>
  <!--彩信用户通道配置-->
  <div class="sysSignCheck">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="userId" label="用户ID"/>
      <el-table-column prop="sign" label="签名"/>
      <el-table-column prop="code" label="签名特服号"/>
      <el-table-column prop="licenceUrl" label="营业执照">
<!--        <template slot-scope="scope">-->
<!--          <a :href="`http://10.10.0.5:9091${scope.row.licenceUrl}`"></a>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="cardUrl" label="法人身份证"/>
      <el-table-column prop="creatrTime" label="申请时间"/>
      <el-table-column prop="checkTime" label="审核时间"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1?'待审核':(scope.row.status === 2?'审核处理中':(scope.row.status === 4 ?'审核通过':'审核拒绝')) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('signCheckId',scope.row.signCheckId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" style="margin: 0 auto">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"></FormItem>
    </el-dialog>
  </div>
</template>

<script>
  import listMixin from "@/mixin/listMixin"

  export default {
    mixins: [listMixin],
    data() {
      return {
        formTit: "新增",
        addChannel: false,
        //接口地址
        searchAPI: {
          namespace: "sysSignCheck",
          list: "listSignCheckByPage",
          detele: "deleteSignCheck"
        },
        // 列表参数
        namespace: "signCheck",
        //搜索框数据
        searchParam: {},
        //搜索框配置
        searchFormConfig: [
          {
            type: "input",
            label: "用户ID",
            key: "userId",
            placeholder: "请输入用户ID"
          },
          {
            type: "select",
            label: "用户名称",
            key: "status",
            optionData: [
              {key: 1, value: '待审核'},
              {key: 2, value: '审核处理中'},
              {key: 4, value: '审核通过'},
              {key: 5, value: '审核拒绝'}
            ],
            placeholder: "请输入用户名称"
          }
        ],
        // 表单配置
        formConfig: [
          {
            type: "input",
            label: "用户ID",
            key: "userId",
            disabled: true,
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "input",
            label: "签名",
            key: "sign",
            disabled: true,
            defaultValue: '',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "input",
            label: "特服号",
            key: "code",
            defaultValue: '',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
        ],
        signCheckId: "",
      }
    },
    mounted() {},
    computed: {},
    methods: {
      submit(form) {
        let params = {}
        if (this.formTit == "新增") {

        } else {
          params = {
            data: {
              signCheckId: this.signCheckId,
              ...form,
            }
          }
          this.$http.sysSignCheck.updateSignCheck(params).then(res => {
            if (resOk(res)) {
              this.$message.success(res.msg || res.data)
              this._mxGetList();
              this.addChannel = false
            } else {
              this.$message.error(res.msg || res.data)
            }
          })
        }

      },
      create() {
        this.addChannel = true
        this.formTit = "新增"
        setTimeout(() => {
          this.$refs.formItem.resetForm()
        }, 0)

      },
      edit(row) {
        this.signCheckId = row.signCheckId
        this.formTit = "修改"
        this.formConfig.forEach(item => {
          for (let key in row) {
            if (item.key === key) {
              this.$set(item, 'defaultValue', row[key])
            }
          }
        })
        this.addChannel = true
      },
      cancel() {
        this.addChannel = false
      },
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysSignCheck {

  }
</style>
