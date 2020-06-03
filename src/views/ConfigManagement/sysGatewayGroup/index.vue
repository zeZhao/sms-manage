<template>
  <div class="sysGatewayGroup">
    <!--      <h1>白名单 接口与原型不符</h1>-->
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table
      :data="listData"
      highlight-current-row
      height="750"
      style="width: 100%;"
    >
      <el-table-column prop="groupId" label="通道组ID"/>
      <el-table-column prop="groupName" label="通道组名称"/>
      <el-table-column prop="sendTo" label="发送对象"/>
      <el-table-column prop="notes" label="备注"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('groupId',scope.row.groupId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" style="margin: 0 auto">
      <FormItem ref="form" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"></FormItem>
    </el-dialog>
  </div>
</template>

<script>
  import listMixin from "@/mixin/listMixin"
  export default {
    mixins: [ listMixin ],
    data() {
      return {
        formTit:"新增",
        addChannel:false,
        //接口地址
        searchAPI:{
          namespace:"sysGatewayGroup",
          list:"listGatewayGroupByPage",
          detele:"deleteGatewayGroup"
        },
        // 列表参数
        namespace:"gatewayGroup",
        //搜索框数据
        searchParam: {
          userId:"",
        },
        //搜索框配置
        searchFormConfig:[
          {
            type:"input",
            label:"通道组id",
            key:"groupId",
            placeholder:"请输入通道组id"
          },
          {
            type:"input",
            label:"通道组名称",
            key:"groupName",
            placeholder:"请输入通道组名称"
          },
        ],
        // 表单配置
        formConfig:[
          {
            type:"input",
            label: "通道组名称",
            key:"groupName",
            rules:[
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type:"input",
            label: "发送对象",
            key:"sendTo",
            rules:[
              {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
          {
            type:"input",
            label: "备注",
            key:"notes",
            rules:[
              // {required: true, message: '请输入必填项', trigger: 'blur'},
            ]
          },
        ],
        limitId:""
      }
    },
    mounted() {
      this.getUserList()
    },
    computed: {},
    methods: {
      getUserList(){
        const params = {
          data: {
            corpUser: {},
            pageNumber: 1,
            pageSize: 99999,
          }
        }
        this.$http.corpUser.queryByPage(params).then(res=>{
          this.formConfig.forEach(item=>{
            if(item.key === 'userId'){
              res.data.list.forEach(t=>{
                let obj = {
                  key:t.userId,
                  value:t.userName
                }
                item.optionData.push(obj)
              })
            }
          })
        })
      },
      submit(form){
        let params = {}
        if(this.formTit == "新增"){
          params = {
            data:{
              ...form
            }
          }
          this.$http.sysSendLimit.addSendLimit(params).then(res=>{
            if(resOk(res)){
              this.$message.success(res.msg || res.data)
              this._mxGetList();
            }
          })
        }else{
          params = {
            data:{
              limitId:this.limitId,
              ...form
            }
          }
          this.$http.sysSendLimit.updateSendLimit(params).then(res=>{
            if(resOk(res)){
              this.$message.success(res.msg || res.data)
              this._mxGetList();
            }
          })
        }


        this.addChannel = false
      },
      create(){
        this.addChannel = true
        this.formTit = "新增"
        // await
        setTimeout(()=>{
          this.$refs.form.resetForm()
        })

      },
      edit(row){
        this.limitId = row.limitId
        this.formTit = "修改"
        this.formConfig.forEach(item=>{
          for (let key in row){
            if(item.key == key){
              this.$set(item,'defaultValue',row[key])
            }
          }
        })
        console.log(this.formConfig,'----formConfig------')
        this.addChannel = true
      },
      cancel(){
        this.addChannel = false
      }
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysGatewayGroup {

  }
</style>
