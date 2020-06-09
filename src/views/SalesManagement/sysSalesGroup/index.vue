<template>
  <!--销售组管理-->
  <div class="sysSalesGroup">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="sid" label="ID"/>
      <el-table-column prop="groupName" label="组名称"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="modifyTime" label="修改时间"/>
      <el-table-column prop="modifyer" label="修改人"/>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status === 1 ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="updateStatus(scope.row,'2')" type="text" size="small" v-if="scope.row.status === 1" style="color: red">停用</el-button>
          <el-button @click="updateStatus(scope.row,'1')" type="text" size="small" v-else style="color: #3a835d">启动</el-button>
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
          namespace: "sysSalesGroup",
          list: "queryByPage",
        },
        // 列表参数
        namespace: "saleGroup",
        //搜索框数据
        searchParam: {},
        //搜索框配置
        searchFormConfig: [
          {
            type: "input",
            label: "组名称",
            key: "groupName",
            placeholder: "请输入组名称"
          },
          {
            type: "input",
            label: "备注",
            key: "remark",
            placeholder: "请输入备注"
          }
        ],
        // 表单配置
        formConfig: [

          {
            type: "input",
            label: "组名称",
            key: "groupName",
            defaultValue:'',
            rules: [
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type: "textarea",
            label: "备注",
            key: "remark",
          },

        ],
        sid: "",
      }
    },
    mounted() {
    },
    computed: {},
    methods: {
      updateStatus(row,status){
        const { sid } = row
        this.$http.sysSalesGroup.updateStatus({sid,status}).then(res=>{
          if(res.code == 200){
            this.$message.success('修改成功')
            this._mxGetList();
          }
        })
      },
      submit(form) {
        let params = {}
        if (this.formTit == "新增") {
          params = {
            ...form
          }
          this.$http.sysSalesGroup.addOrUpdate(params).then(res => {
            if (resOk(res)) {
              this.$message.success(res.msg || res.data)
              this._mxGetList();
              this.addChannel = false
            } else {
              this.$message.error(res.msg || res.data)
            }
          })
        } else {
          params = {
            sid: this.sid,
            ...form,
          }
          this.$http.sysSalesGroup.addOrUpdate(params).then(res => {
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
        this.sid = row.sid
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
      _mxFormListData(data){
        data.forEach(item=>{
          if(item.modifyTime){
            item.modifyTime = new Date(item.modifyTime).Format('yyyy-MM-dd hh:mm:ss')
          }
        })
        return data
      }
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysSalesGroup {

  }
</style>
