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
                    <el-button type="primary"   @click="customerAddInfo = true;deleteCustomer()">新增企业信息</el-button>
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
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <!--修改 初始 禁用 启用-->
                    <el-button  @click="infoShow(scope.row)" type="text" size="small">修改</el-button>
                    <el-button v-if="scope.row.reductModel == 1" @click="setType(scope.row)" type="text" size="small">初始</el-button>
                    <el-button v-if="scope.row.reductModel == 2" @click="setType(scope.row)" style="color: #ec5858" type="text" size="small">禁用</el-button>
                    <el-button v-if="scope.row.reductModel == 3" @click="setType(scope.row)" type="text" size="small">启用</el-button>
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
            <el-form  ref="addForm" label-width="100px" :model="addInfo" :rules="updateFormRules" class="demo-ruleForm">
                <el-form-item label="账号">
                    <el-input maxlength="15" show-word-limit v-model="addInfo.account" clearable placeholder="账号" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="addInfo.pwd" type="password" clearable placeholder="密码" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input maxlength="15" show-word-limit v-model="addInfo.name" clearable placeholder="姓名" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="addInfo.mobile" type="phone"  clearable placeholder="手机号" />
                </el-form-item>
                <el-form-item label="选择角色">
                    <el-select style="width: 100%" v-model="addInfo.roleId" placeholder="选择角色" popper-class="select-option">
                        <el-option v-for="item in navList" :key="item.roleName"  :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 100%" v-model="addInfo.state" placeholder="状态" clearable>
                        <el-option value="1" label="正常" />
                        <el-option value="2" label="停用" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCustomerInfo('addForm')">新增</el-button>
                <el-button @click.native="customerAddInfo = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="企业信息修改" :visible.sync="customerInfo" :close-on-click-modal="false" style="margin: 0 auto">
            <el-form  ref="updateCustomForm" label-width="120px" :model="setInfo" :rules="updateFormRules" class="demo-ruleForm">
                <el-form-item label="账号">
                    <el-input maxlength="15" show-word-limit v-model="setInfo.account" clearable placeholder="账号" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="setInfo.number" type="password" clearable placeholder="密码" />
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input maxlength="15" show-word-limit v-model="setInfo.name" clearable placeholder="姓名" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="setInfo.mobile" type="phone"  clearable placeholder="手机号" />
                </el-form-item>
                <el-form-item label="选择角色">
                    <el-select style="width: 100%" v-model="setInfo.roleId" placeholder="选择角色" popper-class="select-option">
                        <el-option v-for="item in navList" :key="item.roleName"  :label="item.roleName" :value="item.roleId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select style="width: 100%" v-model="setInfo.state" placeholder="状态" clearable>
                        <el-option value="1" label="正常" />
                        <el-option value="2" label="停用" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setCustomerInfo('updateCustomForm')">保存</el-button>
                <el-button @click.native="customerInfo = false">取消</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
  import checkPermission from '@/utils/permission'
  import Util from '@/utils/reg'
  export default {
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
        orderMoney: '0',
        count: '',
        totalAmount: '',
        allOrderStatusInfo: false, // 推送界面是否显示
        orderStatusInfo: false, // 推送界面是否显示
        shopInfo: false,		// 状态界面是否显示
        cityList: [],
        dataList: [],
        productId: '',
        contactMobile: '',
        contactName: '',
        supplierId: '',
        supplierName: '',
        customerAddInfo:false,
        customerInfo: false,
        setRoleMenu: false,
        defaultProps: {
          children: 'childMenu',
          label: 'name'
        },
        search:{
          corpId:'',
          corpName:'',
          reductModel:'',
          contact:''
        },
        navList: [],
        navListId: [],
        setInfo:{

        },
        addInfo:{
          pwd: '',
          account: '',
          number: '',
          name: '',
          mobile: '',
          state: '',
          roleId: '',
        },
        updateFormRules: {
          contactMobile: [
            { validator: validatePhone, trigger: 'blur' }
          ],
        },
        companyOptions: [], // 企业全称下拉项
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        }
      }
    },
    mounted() {
      this.orderList()
    },
    filters: {
      formatDate: function (value) {
        // var val = JSON.parse(value)
        var date = new Date(value);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())+' ';
        var h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes()< 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
        return Y+M+D+h+m+s;
      }
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
      // 条件批量推送
      allPushrderList: function() {
        this.allOrderStatusInfo = true
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
      addCustomerInfo(){
        let params = {
          account: this.addInfo.account,
          pwd: this.addInfo.pwd,
          name: this.addInfo.name,
          state: parseInt(this.addInfo.state),
          mobile: this.addInfo.mobile,
        };
        if(this.addInfo.account == ''){
          return this.$message.error('请填写账号');
        }else if(this.addInfo.pwd == ''){
          return this.$message.error('请填写密码');
        }else if(this.addInfo.name == ''){
          return this.$message.error('请填写姓名');
        }else if(this.addInfo.state == ''){
          return this.$message.error('请选择状态');
        }else if(this.addInfo.roleId == ''){
          return this.$message.error('请选择角色');
        }else if(this.addInfo.mobile == ''){
          return this.$message.error('请填写手机号');
        }else if(!Util.isPoneAvailable(this.addInfo.mobile)){
          this.$message.error('手机号码规则错误')
          return false
        }
        this.$http.user.addOrUpdate(params).then(res => {
          if (res.code == '200') {
            // this.$message({
            //   showClose: true,
            //   message: '新增成功',
            //   type: 'success'
            // });
            this.addInfo.account = '';
            this.addInfo.pwd = '';
            this.addInfo.state = '';
            this.addInfo.name = '';
            this.addInfo.mobile = '';
            this.setNavuserList(res.data,this.addInfo.roleId)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      infoShow(row){
        console.log(row)
        this.customerInfo =  true;
        this.deleteCustomer()
        this.setInfo = row;
        this.setInfo.state = row.state.toString();
        this.setInfo.pwd = '';
      },
      setType(row){
        console.log(row)
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
    }
  }

</script>

<style scoped>

</style>
