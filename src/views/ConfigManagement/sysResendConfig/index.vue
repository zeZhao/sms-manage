<template>
    <div class="sysResendConfig">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true">
          <el-form-item label="用户ID">
            <el-input v-model="search.userId" clearable placeholder="请输入用户ID"/>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="search.userName" clearable placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="通道">
            <el-input v-model="search.gateway" clearable placeholder="请输入通道"/>
          </el-form-item>
          <el-form-item label="不重发状态">
            <el-input v-model="search.status" clearable placeholder="请输入不重发状态"/>
          </el-form-item>
          <el-form-item label="重发目标通道">
            <el-input v-model="search.destGateway" clearable placeholder="请输入重发目标通道"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOrderList">查询</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="add">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-table
        :data="dataList"
        highlight-current-row
        height="750"
        style="width: 100%;"
      >
        <el-table-column prop="userId" label="用户ID"/>
        <el-table-column prop="userName" label="用户名"/>
        <el-table-column prop="gateway" label="通道"/>
        <el-table-column prop="status" label="不重发状态"/>
        <el-table-column prop="destGateway" label="重发目标通道"/>
        <el-table-column prop="modifyTime" label="修改时间"/>
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
          <el-form-item label="用户ID" prop="userId">
            <el-select style="width: 100%" v-model="addInfo.userId" filterable placeholder="请选择用户ID" popper-class="select-option">
              <el-option value="1" label="预付提交计费"/>
            </el-select>
          </el-form-item>
          <el-form-item label="通道" prop="gateway">
            <el-input v-model="addInfo.gateway" clearable placeholder="请输入通道"/>
          </el-form-item>
          <el-form-item label="不重发状态" prop="status">
            <el-select style="width: 100%" v-model="addInfo.status" placeholder="请选择不重发状态" popper-class="select-option">
              <el-option value="未知" label="未知"/>
              <el-option value="DELIVERD" label="DELIVERD"/>
              <el-option value="UNDELIVERD" label="UNDELIVERD"/>
            </el-select>
          </el-form-item>
          <el-form-item label="重发目标通道" prop="destGateway">
            <el-select style="width: 100%" v-model="addInfo.destGateway" filterable placeholder="请选择重发目标通道" popper-class="select-option">
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
      <el-dialog
        title="删除"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        style="margin: 0 auto">
        <span>您确定要删除重发配置吗？</span>
        <p style="color: red">删除后，将不再执行重发，请谨慎操作</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import Page from "@/components/Page/index"
  export default {
    components: {Page},
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
          gateway:"",
          status:"",
          destGateway:"",
        },
        dataList:[],
        addChannel:false,
        formTit:'新增',
        addInfo: {
          gateway: '',
          userId: '',
          destGateway: '',
          status: '',
          resendId:"",
        },
        //新增企业验证
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
        dialogVisible:false,
        resendId:''
      }
    },
    mounted() {
      this.getListData()
    },
    computed: {},
    methods: {
      getUserData(){
        this.$http.corpUser.queryByPage().then(res=>{

        })
      },
      getListData(){
        const {currentPage,pageSize} = this.pageObj
        const params = {
          data:{
            resendConfig:{
              ...this.search
            },
            pageNumber: currentPage,
            pageSize: pageSize,
          }
        }
        this.$http.sysResendConfig.listResendConfigByPage(params).then(res=>{
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
      deletes({resendId}){
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
              resendId:resendId.toString()
            },
            version: "1.0"
          }
          this.$http.sysResendConfig.deleteResendConfig(params).then(res=>{
            const {code, data, msg} = res
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
          if(!isNaN(row[key])){
            row[key] = row[key].toString()
          }
          for (let item in this.addInfo){
            if(key === item){
              this.addInfo[key] = row[key]
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

            }else{
              this.$http.sysResendConfig.updateResendConfig(params).then(res=>{
                const {code, data, msg} = res
                this.$message.success("sss")
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
      }
    },
    watch: {},
  }
</script>

<style lang="scss" scoped>
    .sysResendConfig {

    }
</style>
