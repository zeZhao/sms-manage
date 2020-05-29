<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="search.corpId" clearable placeholder="企业ID" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="search.corpName" clearable placeholder="企业名称" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="search.contact" clearable placeholder="联系人" />
                </el-form-item>
                <el-form-item>
                    <el-select v-model="search.reductModel" placeholder="计费模式" clearable>
                        <!--1.预付提交计费，2.预付成功计费，3.后付提交计费，4.后付成功计费-->
                        <el-option value="1" label="预付提交计费" />
                        <el-option value="2" label="预付成功计费" />
                        <el-option value="3" label="后付提交计费" />
                        <el-option value="4" label="后付成功计费" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryOrderList">查询</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" @click="customerAddInfo = true">新增企业信息</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table
                :data="dataList"
                highlight-current-row
                height="750"
                style="width: 100%;"
        >
            <!--企业ID 特服号 用户企业名称 客户联系人姓名 客户联系人电话 扩展位数 计费方式 短信余额 状态 操作 -->
            <el-table-column prop="corpId" label="企业ID" />
            <el-table-column prop="code" label="特服号" />
            <el-table-column prop="corpName" label="用户企业名称" />
            <el-table-column prop="contact" label="客户联系人姓名" />
            <el-table-column prop="mobile" label="客户联系人电话" />
            <el-table-column prop="sublong" label="扩展位数" />
            <el-table-column prop="sublong" label="计费方式" >
                <template slot-scope="scope">
                    <span>{{ scope.row.reductModel == '1'?'预付提交计费':( scope.row.reductModel == '2'?'预付成功计费':( scope.row.reductModel == '3'?'后付提交计费':'后付成功计费'))}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="smsBalance" label="短信余额" />
            <el-table-column prop="sublong" label="状态" >
                <template slot-scope="scope">
                    <span>{{ scope.row.reductModel == '0'?'删除':( scope.row.reductModel == '1'?'初始':( scope.row.reductModel == '2'?'正常':'禁用'))}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
                <template slot-scope="scope">
                    <!--修改 初始 禁用 启用-->
                    <el-button  @click="infoShow(scope.row)" type="text" size="small">修改</el-button>
                    <el-button v-if="scope.row.reductModel == 1" @click="setType(scope.row,'init')" type="text" size="small">初始</el-button>
                    <el-button v-if="scope.row.reductModel == 2" @click="setType(scope.row,'disable')" style="color: #ec5858" type="text" size="small">禁用</el-button>
                    <el-button v-if="scope.row.reductModel == 3" @click="setType(scope.row,'enabled')" type="text" size="small">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-col :span="24" class="toolbar">
            <el-pagination
                    class="pull-right clearfix"
                    :current-page="cur_page"
                    :page-sizes="[1, 2, 3, 4]"
                    :page-size="pageNum"
                    layout="total, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
            />
        </el-col>

        <el-dialog title="新增企业信息" :visible.sync="customerAddInfo" :close-on-click-modal="false" style="margin: 0 auto">
            <el-form  ref="addForm" label-width="120px" :model="addInfo" :rules="updateFormRules" class="demo-ruleForm">
                <el-form-item label="企业ID" prop="corpId">
                    <el-input v-model="addInfo.corpId" clearable placeholder="企业ID" />
                </el-form-item>
                <el-form-item label="企业名" prop="corpName">
                  <el-input maxlength="30" show-word-limit v-model="addInfo.corpName" clearable placeholder="请输入企业名称" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd">
                    <el-input v-model="addInfo.pwd" type="password" clearable placeholder="请输入8-16位密码" />
                </el-form-item>
                <el-form-item label="特服号">
                    <el-input v-model="addInfo.code" maxlength="21" show-word-limit clearable placeholder="请输入特服号" />
                </el-form-item>
                <el-form-item label="可扩展位数">
                    <el-input maxlength="21" show-word-limit v-model="addInfo.sublong" clearable placeholder="请输入可扩展位数" />
                </el-form-item>
              <el-form-item label="计费方式" prop="reductModel">
                <el-select style="width: 100%" v-model="addInfo.reductModel" placeholder="请选择计费方式" popper-class="select-option">
                  <el-option v-for="item in navList" :key="item.roleName"  :label="item.roleName" :value="item.roleId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为直客">
                <el-select style="width: 100%" v-model="addInfo.isDirectUser" placeholder="请选择" popper-class="select-option">
                  <el-option v-for="item in navList" :key="item.roleName"  :label="item.roleName" :value="item.roleId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为商用">
                <el-select style="width: 100%" v-model="addInfo.isBusiness" placeholder="请选择" popper-class="select-option">
                  <el-option v-for="item in navList" :key="item.roleName"  :label="item.roleName" :value="item.roleId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="短信的单价" prop="cardUnit">
                <el-input maxlength="10" show-word-limit v-model="addInfo.cardUnit" clearable placeholder="以分为单位" />
              </el-form-item>
                <el-form-item label="客户联系人" prop="contact">
                    <el-input maxlength="30" show-word-limit v-model="addInfo.contact" type="phone"  clearable placeholder="请输入客户联系人" />
                </el-form-item>
              <el-form-item label="客户联系人电话" prop="mobile">
                <el-input v-model="addInfo.mobile" type="phone" clearable placeholder="请输入客户联系人电话" />
              </el-form-item>
              <el-form-item label="开户行信息">
                <el-input maxlength="300" show-word-limit v-model="addInfo.bankAccount" type="textarea"  clearable placeholder="请输入备注开户行信息" />
              </el-form-item>
              <el-form-item label="开户行信息">
                <el-input maxlength="300" show-word-limit v-model="addInfo.bankAccount" type="textarea"  clearable placeholder="请输入备注开户行信息" />
              </el-form-item>
              <el-form-item label="父企业ID">
                <el-button @click="">请选择父企业</el-button>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCustomerInfo('addForm')">新增</el-button>
                <el-button @click.native="customerAddInfo = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog
          :title="dialogTit"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          width="30%">
          <span>{{information}}</span>
          <p v-show=" dialogTit === '禁用' " style="color: #EC5858">禁用后将无法使用，请谨慎操作！</p>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateStatus">确 定</el-button>
          </span>
        </el-dialog>
        <ChooseEnterprise :isEnterprise="isEnterprise"></ChooseEnterprise>
    </section>
</template>
<script>
  import checkPermission from '@/utils/permission'
  import Util from '@/utils/reg'
  import ChooseEnterprise from "@/components/ChooseEnterprise"
  export default {
    components:{ChooseEnterprise},
    data() {
      var validatePhone = (rule, value, callback) => {
        if (value && (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/).test(value) || value.length !== 11)) {
          callback(new Error('手机号码不符合规范'))
        } else {
          callback()
        }
      };
      return {
        // -------------------我-------------是------------的----------分------------界----------线----------------☺-------------------//
        cur_page: 1, // 默认在第一页
        pageNum: 10, // 默认每页显示1条数据
        totalCount: 1, // 默认总条数为一条
        show: true,
        count: '',
        dataList: [],
        customerAddInfo:false,
        customerInfo: false,
        search:{
          corpId:'',
          corpName:'',
          reductModel:'',
          contact:''
        },
        navList: [],
        navListId: [],
        setInfo:{},
        // 新增企业
        addInfo:{
          corpId:'',
          corpName:'',
          pwd: '',
          code:'',
          sublong:'',
          reductModel:'',
          isDirectUser:'',
          isBusiness:'',
          cardUnit:'',
          contact:'',
          mobile:'',
          bankAccount:'',
        },
        //新增企业验证
        updateFormRules: {
          corpId: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          corpName: [
            { required: true, message: '请输入企业名称', trigger: 'blur' },
          ],
          pwd: [
            { required: true, message: '请输入8-16位密码', trigger: 'blur' },
          ],
          reductModel: [
            { required: true, message: '请至少选择一个计费方式', trigger: 'change' }
          ],
          cardUnit: [
            { required: true, message: '请输入短信单价', trigger: 'blur' },
          ],
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: '请输入联系电话', trigger: 'blur'},
            { validator:validatePhone, trigger: "blur"}

          ],
        },
        // 初始/禁用/启用 公共弹窗
        dialogVisible:false,
        dialogTit:"",
        information:"",
        dialogType:"disable",
        currentRowData:{},
        //选择企业
        isEnterprise:false
      }
    },
    mounted() {
      this.orderList()
    },
    methods: {
      checkPermission,
      queryOrderList(){
        this.cur_page = 1
        this.orderList()
      },
      // 分页
      handleSizeChange(val) {
        this.page = val
        this.orderList()
      },
      // 分页
      handleCurrentChange(val) {
        this.cur_page = val
        this.orderList()// 确定当前页面后刷新页面
      },
      // 列表
      orderList: function() {
        const params = {
          data: {
            corp: {
              corpId:this.search.corpId,
              corpName:this.search.corpName,
              reductModel:this.search.reductModel,
              contact:this.search.contact,
            },
            pageNumber: this.cur_page,
            pageSize: this.pageNum,
          }
        }
        this.$http.corp.queryByPage(params).then(res => {
          if (res.code == '200') {
            this.dataList = res.data.list
            this.totalCount = Number(res.data.total)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      // 状态
      changSwitch(e,id) {
        let params = {
          suId: id,
          state:e
        };
        this.$http.user.updateStatus(params).then(res => {
          if (res.code == '200') {
            this.$message({
              showClose: true,
              message: '修改成功',
              type: 'success'
            });
            this.orderList()
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //新增企业
      addCustomerInfo(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        // let params = {
        //   account: this.addInfo.account,
        //   pwd: this.addInfo.pwd,
        //   name: this.addInfo.name,
        //   state: parseInt(this.addInfo.state),
        //   mobile: this.addInfo.mobile,
        // };
        // if(this.addInfo.account == ''){
        //   return this.$message.error('请填写账号');
        // }else if(this.addInfo.pwd == ''){
        //   return this.$message.error('请填写密码');
        // }else if(this.addInfo.name == ''){
        //   return this.$message.error('请填写姓名');
        // }else if(this.addInfo.state == ''){
        //   return this.$message.error('请选择状态');
        // }else if(this.addInfo.roleId == ''){
        //   return this.$message.error('请选择角色');
        // }else if(this.addInfo.mobile == ''){
        //   return this.$message.error('请填写手机号');
        // }else if(!Util.isPoneAvailable(this.addInfo.mobile)){
        //   this.$message.error('手机号码规则错误')
        //   return false
        // }
        // this.$http.user.addOrUpdate(params).then(res => {
        //   if (res.code == '200') {
        //     // this.$message({
        //     //   showClose: true,
        //     //   message: '新增成功',
        //     //   type: 'success'
        //     // });
        //     this.addInfo.account = '';
        //     this.addInfo.pwd = '';
        //     this.addInfo.state = '';
        //     this.addInfo.name = '';
        //     this.addInfo.mobile = '';
        //     this.setNavuserList(res.data,this.addInfo.roleId)
        //   } else {
        //     this.$message.error(res.msg)
        //   }
        // })
      },
      infoShow(row){
        console.log(row)
        this.customerInfo =  true;
        this.deleteCustomer()
        this.setInfo = row;
        this.setInfo.state = row.state.toString();
        this.setInfo.pwd = '';
      },
      //修改状态
      setType(row,type){
        this.dialogTitle(type)
        this.currentRowData = row
        this.dialogVisible = true
        // "corpId":"7080", "status":"3"
      },
      delUser(row){
        this.$confirm("删除企业信息后，运营人员将无法登陆", "您确定要删除企业信息吗? ", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              suId: row.suId,
            };
            this.$http.user.delete(params).then(res => {
              if (res.code == '200') {
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                });
                this.orderList()
              } else {
                console.log(res)
                this.$message.error(res.data)
              }
            })
          })
          .catch(() => {});
      },
      deleteCustomer(id) {
        let params = {
          roleType: 2
        };
        this.$http.role.getRoleByType(params).then(res => {
          if (res.code == '200') {
            this.navList = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      setCustomerInfo(formName){
        this.customerInfo = true;
        let params = {
          suId: this.setInfo.suId,
          account: this.setInfo.account,
          pwd: this.setInfo.pwd,
          name: this.setInfo.name,
          state: this.setInfo.state,
          mobile: this.setInfo.mobile,
        };
        if(this.setInfo.account == ''){
          return this.$message.error('请填写账号');
        }else if(this.setInfo.name == ''){
          return this.$message.error('请填写姓名');
        }else if(this.setInfo.state == ''){
          return this.$message.error('请选择状态');
        }else if(this.setInfo.mobile == ''){
          return this.$message.error('请填写手机号');
        }else if(!Util.isPoneAvailable(this.setInfo.mobile)){
          this.$message.error('手机号码规则错误')
          return false
        }
        this.$http.user.addOrUpdate(params).then(res => {
          if (res.code == '200') {
            this.setNavuserList(this.setInfo.suId,this.setInfo.roleId)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      setNavuserList(userId,roleId){
        let params = {
          userId: userId,
          roleId: roleId,
        };
        this.$http.user.sysUseOrUpdate(params).then(res => {
          if (res.code == '200') {
            this.$message({
              showClose: true,
              message: '成功',
              type: 'success'
            });
            this.customerInfo = false;
            this.customerAddInfo = false;
            this.orderList()
          } else {
            console.log(res)
            this.$message.error(res.data)
          }
        })
      },
      treeDataTranslate(res){
        res.forEach((item, index) => {
          if (item.ifChecked == 1){
            this.navListId.push(item.menuId)
          }
          if (item.childMenu) {
            this.treeDataTranslate(item.childMenu)
          }
        })
      },
      dialogTitle(type){
        let str = {}
        switch (type) {
          case "disable":
            str.title = "禁用"
            str.information = "您确定要禁用企业吗？"
            break
          case "init":
            str.title = "初始"
            str.information = "初始后，企业将正常使用，您确认要初始吗？"
            break
          case "enabled":
            str.title = "启用"
            str.information = "启用后企业将正常使用，您确定要启用企业吗？"
            break
        }
        this.dialogTit = str.title
        this.information = str.information
      },
      updateStatus(){
        const { corpId, status } = this.currentRowData
        this.$http.corp.updateStatus({corpId,status}).then(res=>{
          const {code,msg} = res
          if(code === 200){
            this.$message.success(msg)
            this.orderList()
          }
        })
        this.dialogVisible = false
      }

    }
  }

</script>

<style scoped>

</style>
