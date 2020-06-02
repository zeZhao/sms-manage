<template>
  <div class="sysResendConfig">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item label="企业ID">
          <el-input v-model="search.corporateId" clearable placeholder="请输入企业ID"/>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="search.userId" clearable placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="search.userName" clearable placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="search.sign" clearable placeholder="请输入签名"/>
        </el-form-item>
        <el-form-item label="特服号">
          <el-input v-model="search.code" clearable placeholder="请输入特服号"/>
        </el-form-item>
        <el-form-item label="类型">
          <el-select style="width: 100%" v-model="search.type" clearable placeholder="请选择类型" popper-class="select-option">
            <el-option value="1" label="特服号"/>
            <el-option value="2" label="用户ID"/>
            <el-option value="3" label="企业ID"/>
          </el-select>
        </el-form-item>
        <el-form-item label="移动通道编号">
          <el-input v-model="search.cm" clearable placeholder="请输入移动通道编号"/>
        </el-form-item>
        <el-form-item label="联通通道编号">
          <el-input v-model="search.cu" clearable placeholder="请输入联通通道编号"/>
        </el-form-item>
        <el-form-item label="电信通道编号">
          <el-input v-model="search.ct" clearable placeholder="请输入电信通道编号"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="add">新增签名路由</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      :data="dataList"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column prop="corporateId" label="企业ID"/>
      <el-table-column prop="userId" label="用户ID"/>
      <el-table-column prop="userName" label="用户名"/>
      <el-table-column prop="code" label="特服号"/>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type == '1'?'特服号':( scope.row.type == '2'?'用户ID':'企业ID')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sign" show-overflow-tooltip label="签名"/>
      <el-table-column prop="cm" label="移动通道"/>
      <el-table-column prop="ct" label="联通通道"/>
      <el-table-column prop="modifyTime" label="电信通道"/>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deletes(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" style="margin: 0 auto">
      <el-form ref="addForm" label-width="120px" :model="addInfo" :rules="updateFormRules" class="demo-ruleForm">
        <el-form-item label="企业ID" prop="corporateId">
          <el-select style="width: 100%" v-model="addInfo.corporateId" filterable placeholder="请选择企业ID" @change="corporateChange" popper-class="select-option">
            <el-option v-for="(item,index) in corporateList" :key="item.corpId" :value="item.corpId" :label="item.corpName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="addInfo.userId" clearable disabled placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="特服号" prop="code">
          <el-input v-model="addInfo.code" clearable disabled placeholder="请输入特服号"/>
        </el-form-item>
        <el-form-item label="商户签名" prop="sign">
          <el-input v-model="addInfo.sign" clearable placeholder="输入多个请用“,”隔开"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select style="width: 100%" v-model="addInfo.type" placeholder="请选择类型" popper-class="select-option">
            <el-option value="1" label="特服号"/>
            <el-option value="2" label="用户ID"/>
            <el-option value="3" label="企业ID"/>
          </el-select>
        </el-form-item>
        <el-form-item label="移动通道" prop="cm">
          <el-select style="width: 100%" v-model="addInfo.cm" filterable placeholder="请选择" popper-class="select-option">
            <el-option value="1" label="直客"/>
            <el-option value="2" label="代理商"/>
          </el-select>
        </el-form-item>
        <el-form-item label="联通通道" prop="cu">
          <el-select style="width: 100%" v-model="addInfo.cu" filterable placeholder="请选择" popper-class="select-option">
            <el-option value="1" label="直客"/>
            <el-option value="2" label="代理商"/>
          </el-select>
        </el-form-item>
        <el-form-item label="电信通道" prop="ct">
          <el-select style="width: 100%" v-model="addInfo.ct" filterable placeholder="请选择" popper-class="select-option">
            <el-option value="1" label="直客"/>
            <el-option value="2" label="代理商"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomerInfo('addForm')">{{formTit}}</el-button>
        <el-button @click.native="addChannel = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageObj: {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
        search:{
          userId:"",
          userName:"",
          corporateId:"",
          type:"",
          cm:"",
          cu:"",
          ct:"",
          sign:"",
          code:"",
        },
        dataList:[],
        addChannel:false,
        formTit:'新增',
        addInfo: {
          userId: '',
          corporateId: '',
          code: '',
          sign: '',
          type:"",
          cm:"",
          cu:"",
          ct:"",
          routeId:""
        },
        updateFormRules: {
          userId: [
            {required: true, message: '请输入必填项', trigger: 'change'},
          ],
          gateway: [
            {required: true, message: '请输入必填项', trigger: 'blur'},
          ],
          destGateway: [
            {required: true, message: '请输入必填项', trigger: 'change'},
          ],
          status: [
            {required: true, message: '请输入必填项', trigger: 'change'}
          ],
        },
        type:'add',
        corporateList:[],
        searchAPI:{
          namespace:'sysSignRoute',
          child:'listSignRouteByPage'
        }
      }
    },
    created() {
      this.getCorpData()
    },
    mounted() {
      this.getListData()

      console.log()
    },
    computed: {},
    methods: {
      corporateChange(val){
        this.corporateList.forEach(item=>{
          if(item.corpId === val){
            this.$nextTick(()=>{
              this.addInfo.userId = item.userId
              this.addInfo.code = item.code
            })
          }
        })
      },
      getCorpData(){
        const params = {
          data: {
            corp: {
              corpId: "",
              corpName: "",
              reductModel: "",
              contact: "",
            },
            pageNumber: 1,
            pageSize: 99999,
          }
        }
        // this.$http.corp.queryByPage(params).then(res=>{
        //   this.corporateList = res.data.list
        // })
      },
      getListData(){
        const {currentPage,pageSize} = this.pageObj
        const params = {
          data:{
            signRoute:{
              ...this.search
            },
            pageNumber: currentPage,
            pageSize: pageSize,
          },
          version:"1.0"
        }
        this.$http.sysSignRoute.listSignRouteByPage(params).then(res=>{
          const {code,data,msg} = res
          this.dataList = data.list
          this.pageObj.total = data.total
        })
      },
      queryOrderList(){
        this.getListData()
      },
      add(){
        this.addChannel = true
        this.type = "add"
        this.formTit = "添加"
        this.$refs.addForm.resetFields()
      },
      deletes({routeId}){
        const h = this.$createElement;
        this.$msgbox({
          title: '删除',
          message: h('div', null, [
            h('p', null, '您确定要删除重发配置吗？'),
            h('p', { style: 'color: red' }, '删除后，将不再执行重发，请谨慎操作')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(action => {
          const params = {
            data:{
              routeId:routeId.toString()
            },
            version: "1.0"
          }
          this.$http.sysSignRoute.deleteSignRoute(params).then(res=>{
            const {code, msg} = res
            if(code === "200" || code === 200){
              this.$message.success(msg)
              this.getListData()
            }
          })
        });
      },
      edit(row){
        this.addChannel = true
        this.type = "edit"
        this.formTit = "修改"
        for(let key in row){
          if(row[key]){
            if(!isNaN(row[key])){
              row[key] = row[key].toString()
            }
          }
          for (let item in this.addInfo){
            if(key === item){
              this.addInfo[key] = row[key]
              this.addInfo["cm"] = "196"
            }
          }
        }
      },
      addCustomerInfo(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              data:{
                ...this.addInfo
              },
              version: "1.0"
            }
            if(this.type === "add"){
              this.$http.sysSignRoute.addSignRoute(params).then(res=>{
                if(resOk(res)){
                  this.$message.success("添加成功")
                }
              })
            }else{
              this.$http.sysSignRoute.updateSignRoute(params).then(res=>{
                if(resOk(res)){
                  this.$message.success("修改成功")
                }
              })
            }
            this.getListData()
            this.addChannel = false
            this.$refs[formName].resetFields()
          } else {
            this.$message.error("请输入必填项")
            return false;
          }
        });

      },

      handleSizeChange(pageSize) {
        this.pageObj.pageSize = pageSize
        this.queryOrderList()
      },
      handleCurrentChange(currentPage) {
        this.pageObj.currentPage = currentPage
        this.queryOrderList()
      },
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
  .sysResendConfig {

  }
</style>
