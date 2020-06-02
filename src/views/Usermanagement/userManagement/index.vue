<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item label="商户ID">
          <el-input v-model="search.corpId" clearable placeholder="商户ID"/>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="search.userId" clearable placeholder="用户ID"/>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="search.userName" clearable placeholder="用户名称"/>
        </el-form-item>
        <el-form-item label="用户特服号">
          <el-input v-model="search.code" clearable placeholder="用户特服号"/>
        </el-form-item>
        <el-form-item label="是否为直客">
          <el-select v-model="search.isDirectUser" placeholder="请选择" clearable>
            <el-option value="1" label="直客"/>
            <el-option value="2" label="代理商"/>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select v-model="search.accountType" placeholder="计费模式" clearable>
            <el-option value="1" label="行业"/>
            <el-option value="2" label="营销"/>
            <el-option value="3" label="vip"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="search.productType" placeholder="计费模式" clearable>
            <el-option value="1" label="短信"/>
            <el-option value="2" label="彩信"/>
            <el-option value="3" label="屏信"/>
            <el-option value="4" label="语音"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="search.proType" placeholder="计费模式" clearable>
            <el-option value="1" label="web前端"/>
            <el-option value="2" label="http接口"/>
            <el-option value="3" label="cmpp接口"/>
            <el-option value="7" label="音频接口"/>
          </el-select>
        </el-form-item>
        <el-form-item label="计费方式">
          <el-select v-model="search.reductModel" placeholder="计费模式" clearable>
            <!--1.预付提交计费，2.预付成功计费，3.后付提交计费，4.后付成功计费-->
            <el-option value="1" label="预付提交计费"/>
            <el-option value="2" label="预付成功计费"/>
            <el-option value="3" label="后付提交计费"/>
            <el-option value="4" label="后付成功计费"/>
          </el-select>
        </el-form-item>

        <el-form-item label="计费类型">
          <el-select v-model="search.reductType" placeholder="计费模式" clearable>
            <el-option value="1" label="为用户id计费"/>
            <el-option value="2" label="为企业id计费"/>
          </el-select>
        </el-form-item>
        <el-form-item label="销售人员">
          <el-select v-model="search.saleMan" placeholder="计费模式" clearable>
            <el-option value="1" label="预付提交计费"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="search.startDate"></el-date-picker>
          <el-date-picker type="date" placeholder="选择日期" v-model="search.endDate"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="newEnterprise">新增</el-button>
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
      <el-table-column prop="corpId" label="企业/代理ID"/>
      <el-table-column prop="userId" label="用户ID"/>
      <el-table-column prop="userName" label="用户名"/>
      <el-table-column prop="loginName" label="用户登录名"/>
      <el-table-column prop="password" label="密码"/>
      <el-table-column prop="accountType" label="业务类型">
        <template slot-scope="scope">
          <span>{{ scope.row.accountType == '1'?'行业':( scope.row.accountType == '2'?'营销':"vip")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="特服号"/>
      <el-table-column prop="sublong" label="扩展长度"/>
      <el-table-column prop="longCode" label="长号码"/>
      <el-table-column prop="productType" label="产品">
        <template slot-scope="scope">
          <span>{{ scope.row.productType == '1'?'短信':( scope.row.productType == '2'?'彩信':( scope.row.productType == '3'?'屏信':'语音'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="proType" label="产品类型">
        <template slot-scope="scope">
          <span>{{ scope.row.proType == '1'?'web前端':( scope.row.proType == '2'?'http接口':( scope.row.proType == '3'?'cmpp接口':'音频接口'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendType" label="发送运营商">
        <template slot-scope="scope">
          <span>{{ scope.row.sendType == '1'?'移动':( scope.row.reductModel == '2'?'联通 ':( scope.row.reductModel == '3'?'电信': (scope.row.reductModel == "4" ? '三网':(scope.row.reductModel == "5" ? '移动联通' : (scope.row.reductModel == "6"?'移动电信':'联通电信')))))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="计费方式">
        <template slot-scope="scope">
          <span>{{ scope.row.reductModel == '1'?'预付提交计费':( scope.row.reductModel == '2'?'预付成功计费':( scope.row.reductModel == '3'?'后付提交计费':'后付成功计费'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{ scope.row.reductType == '1'?'为用户id计费':'为企业id计费'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsBalance" label="短信余额"/>
      <el-table-column prop="debt" label="借款"/>
      <el-table-column prop="cardUnit" label="单价（分）"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status == '0'?'删除':( scope.row.status == '1'?'待审核':( scope.row.status == '2'?'正常':'停用'))}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="messageShow(scope.row)" type="text" size="small">信息</el-button>
          <el-button @click="infoShow(scope.row)" type="text" size="small">修改</el-button>
          <el-button :disabled="scope.row.status == '2'||scope.row.status == '3'" @click="setType(scope.row,'init','2')" type="text" size="small">审核</el-button>
          <el-button v-if="scope.row.status == 2" @click="setType(scope.row,'disable','3')" style="color: #ec5858"
                     type="text" size="small">停用
          </el-button>
          <el-button v-if="scope.row.status == 3" @click="setType(scope.row,'enabled','2')" type="text" size="small">
            启用
          </el-button>
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
    <el-dialog :title="formTit" :visible.sync="customerAddInfo" :close-on-click-modal="false" style="margin: 0 auto">
      <el-form ref="addForm" label-width="120px" :model="addInfo" :rules="updateFormRules" class="demo-ruleForm">
        <el-form-item label="企业ID" prop="corpId">
          <el-input v-model="addInfo.corpId" disabled placeholder="请选择企业ID" style="width: 130px"/>
          <el-button @click="selectCompany">请选择父企业</el-button>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId" style="display: none">
          <el-input v-model="addInfo.userId" clearable placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addInfo.userName" maxlength="30" show-word-limit clearable placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="用户登录名" prop="loginName">
          <el-input maxlength="30" show-word-limit v-model="addInfo.loginName" clearable placeholder="请输入用户登录名"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addInfo.password" clearable placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="用户特服号" prop="code">
          <el-input maxlength="21" show-word-limit v-model="addInfo.code" clearable placeholder="请输入用户特服号"/>
        </el-form-item>
        <el-form-item label="可扩展的位数" prop="sublong">
          <el-input maxlength="21" show-word-limit v-model="addInfo.sublong" clearable placeholder="请输入可扩展的位数"/>
        </el-form-item>
        <el-form-item label="计费类型" prop="reductType">
          <el-select style="width: 100%" v-model="addInfo.reductType" placeholder="请选择计费类型" popper-class="select-option">
            <el-option value="1" label="为用户id计费"/>
            <el-option value="2" label="为企业id计费"/>
          </el-select>
        </el-form-item>
        <el-form-item label="计费方式" prop="reductModel">
          <el-select style="width: 100%" v-model="addInfo.reductModel" placeholder="请选择计费方式" popper-class="select-option">
            <el-option value="1" label="预付提交计费"/>
            <el-option value="2" label="预付成功计费"/>
            <el-option value="3" label="后付提交计费"/>
            <el-option value="4" label="后付成功计费"/>
          </el-select>
        </el-form-item>
        <el-form-item label="返还类型" prop="returnBalance" v-if="addInfo.reductModel === '2'">
          <el-select style="width: 100%" v-model="addInfo.returnBalance" placeholder="请选择返还类型" popper-class="select-option">
            <el-option value="0" label="不返还"/>
            <el-option value="1" label="返失败"/>
            <el-option value="2" label="返失败和未知"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品" prop="productType">
          <el-select style="width: 100%" v-model="addInfo.productType" placeholder="请选择产品" popper-class="select-option">
            <el-option value="1" label="短信"/>
            <el-option value="2" label="彩信"/>
            <el-option value="3" label="屏信"/>
            <el-option value="4" label="语音"/>
          </el-select>
        </el-form-item>
        <el-form-item label="短信的单价" prop="cardUnit">
          <el-input maxlength="10" show-word-limit v-model="addInfo.cardUnit" clearable placeholder="请输入单价"/>
        </el-form-item>
        <el-form-item label="彩信的单价" prop="mmsCardUnit">
          <el-input maxlength="10" show-word-limit v-model="addInfo.mmsCardUnit" clearable placeholder="请输入单价"/>
        </el-form-item>
        <el-form-item label="产品类型" prop="proType">
          <el-select style="width: 100%" v-model="addInfo.proType" placeholder="请选择产品类型" popper-class="select-option">
            <el-option value="1" label="web前端"/>
            <el-option value="2" label="http接口"/>
            <el-option value="3" label="cmpp接口"/>
            <el-option value="7" label="音频接口"/>
          </el-select>
        </el-form-item>
        <el-form-item label="协议端口" prop="directPort">
          <el-select style="width: 100%" v-model="addInfo.directPort" placeholder="请选择协议端口" popper-class="select-option">
            <el-option value="" label="无"/>
            <el-option value="8090" label="8090"/>
            <el-option value="7890" label="7890"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态报告类型" prop="reportType">
          <el-select style="width: 100%" v-model="addInfo.reportType" placeholder="请选择状态报告类型" popper-class="select-option">
            <el-option value="0" label="无权限"/>
            <el-option value="1" label="推送"/>
            <el-option value="2" label="自取(批量)"/>
            <el-option value="3" label="自取(单条)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="上行类型" prop="moType">
          <el-select style="width: 100%" v-model="addInfo.moType" placeholder="请选择上行类型" popper-class="select-option">
            <el-option value="0" label="无权限"/>
            <el-option value="1" label="推送"/>
            <el-option value="2" label="自取(批量)"/>
          </el-select>
        </el-form-item>
        <el-form-item label="推动报告地址" prop="reportUrl">
          <el-input v-model="addInfo.reportUrl" clearable placeholder="请输入推动报告地址"/>
        </el-form-item>
        <el-form-item label="推送上行地址" prop="moUrl">
          <el-input v-model="addInfo.moUrl" clearable placeholder="请输入推送上行地址"/>
        </el-form-item>
        <el-form-item label="客户IP地址" prop="userIp">
          <el-input v-model="addInfo.userIp" clearable placeholder="请输入客户IP地址"/>
        </el-form-item>
        <el-form-item label="备份IP" prop="userIpBak">
          <el-input v-model="addInfo.userIpBak" clearable placeholder="请输入备份IP"/>
        </el-form-item>
        <el-form-item label="客户联系人" prop="contact">
          <el-input maxlength="30" show-word-limit v-model="addInfo.contact" clearable placeholder="请输入客户联系人"/>
        </el-form-item>
        <el-form-item label="客户联系人电话" prop="mobile">
          <el-input maxlength="11" v-model="addInfo.mobile" clearable placeholder="请输入客户联系人电话"/>
        </el-form-item>
        <el-form-item label="账号类型" prop="accountType">
          <el-select style="width: 100%" v-model="addInfo.accountType" placeholder="请选择账号类型" popper-class="select-option">
            <el-option value="1" label="行业"/>
            <el-option value="2" label="营销"/>
            <el-option value="3" label="vip"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为直客" prop="isDirectUser">
          <el-select style="width: 100%" v-model="addInfo.isDirectUser" placeholder="请选择是否为直客" popper-class="select-option">
            <el-option value="1" label="直客"/>
            <el-option value="2" label="代理商"/>
          </el-select>
        </el-form-item>
        <el-form-item label="黑名单类型" prop="blackLevel">
          <el-checkbox-group v-model="blackLevel">
            <el-checkbox key="系统级" label="系统级"></el-checkbox>
            <el-checkbox key="营销级" label="营销级"></el-checkbox>
            <el-checkbox key="客户级" label="客户级"></el-checkbox>
            <el-checkbox key="BSATS级" label="BSATS级"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否请求api黑名单接口" prop="isPostApi">
          <el-select style="width: 100%" v-model="addInfo.isPostApi" placeholder="请选择" popper-class="select-option">
            <el-option value="0" label="否"/>
            <el-option value="1" label="是"/>
          </el-select>
        </el-form-item>
        <el-form-item label="销售员" prop="saleMan">
          <el-select style="width: 100%" v-model="addInfo.saleMan" placeholder="请选择销售员" popper-class="select-option">
            <el-option value="1" label="预付提交计费"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优化类型" prop="deductType">
          <el-select style="width: 100%" v-model="addInfo.deductType" placeholder="请选择优化类型" popper-class="select-option">
            <el-option value="1" label="正常"/>
            <el-option value="2" label="对比库"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input maxlength="300" type="textarea" show-word-limit v-model="addInfo.remark" clearable placeholder="请输入备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomerInfo('addForm')">{{formBtn}}</el-button>
        <el-button @click.native="customerAddInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTit"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%">
      <span>{{information}}</span>
      <p v-show=" dialogTit === '停用' " style="color: #EC5858">停用后将无法使用，请谨慎操作！</p>
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateStatus">确 定</el-button>
          </span>
    </el-dialog>
    <ChooseEnterprise :isEnterprise="isEnterprise" @cancel="cancel" @getCorpId="getCorpId"></ChooseEnterprise>
  </section>
</template>
<script>
  import Util from '@/utils/reg'
  import ChooseEnterprise from "../components/ChooseEnterprise"
  import {isArray} from "@/utils/validate";

  export default {
    components: {ChooseEnterprise},
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
        count: '',
        dataList: [],
        customerAddInfo: false,
        search: {
          userId: '',
          corpId: '',
          userName: '',
          code: '',
          isDirectUser: '',
          accountType: '',
          productType: '',
          proType: '',
          reductModel: '',
          reductType: '',
          saleMan: '',
          startDate: '',
          endDate: '',
        },
        // 新增企业
        addInfo: {
          userId:"",
          // mqIp:"",
          corpId:"",
          loginName:"",
          userName:"",
          password:"",
          code:"",
          sublong:"",
          reductType:"",
          reductModel:"",
          returnBalance:"2",
          cardUnit:"",
          mmsCardUnit:"",
          productType:"",
          proType:"",
          reportType:"",
          moType:"",
          reportUrl:"",
          moUrl:"",
          userIp:"",
          userIpBak:"",
          contact:"",
          mobile:"",
          accountType:"",
          isDirectUser:"",
          blackLevel:[],
          saleMan:"朱小五",
          remark:"",
          directPort:"",
          // mmsAuditCallBack:"",
          // longCode:"",
          // maxSession:"",
          // introducer:"",
          // alertBalance:"",
          // alertMess:"",
          // alertMobile:"",
          // alertMail:"",
          // deductPercent:"",
          // httpSign:"",
          // faToSu:"",
          isPostApi:"",
          deductType:"",
        },
        updateFormRules: {
          userName: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          loginName: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          code: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          sublong: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          reductType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          reductModel: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          cardUnit: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          mmsCardUnit: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          productType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          proType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          reportType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          moType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          contact: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          mobile: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
            {validator: validatePhone, trigger: "blur"}
          ],
          accountType: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          isDirectUser: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ],
          saleMan: [
            {required: true, message: '必填项不能为空', trigger: 'blur'},
          ]
        },
        formTit:'新增企业用户',
        formBtn:"新增",
        // 初始/停用/启用 公共弹窗
        dialogVisible: false,
        dialogTit: "",
        information: "",
        dialogType: "disable",
        currentRowData: {},
        //选择企业
        isEnterprise: false,
        status:"",
        blackLevel:["系统级","客户级"]
      }
    },
    mounted() {
      this.orderList()
      this.getsysSalemanList()
    },
    methods: {
      getsysSalemanList(){
        this.$http.sysSaleman.queryAvailableSaleman().then(res=>{
          console.log(res,'销售')
        })
      },
      getCorpId(id) {
        this.addInfo.corpId = id
      },
      cancel(val) {
        this.isEnterprise = val
      },
      selectCompany() {
        this.isEnterprise = true
      },
      queryOrderList() {
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
      orderList: function () {
        const params = {
          data: {
            corpUser: {
              ...this.search
            },
            pageNumber: this.cur_page,
            pageSize: this.pageNum,
          }
        }
        this.$http.corpUser.queryByPage(params).then(res => {
          if (res.code == '200') {
            this.dataList = res.data.list
            this.totalCount = Number(res.data.total)
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      newEnterprise(){
        this.customerAddInfo = true
        this.formBtn = "新增"
        this.formTit = "新增企业用户"
        this.$refs.addForm.resetFields()
      },
      //新增企业
      addCustomerInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addInfo.blackLevel = this.blackLevel.join(",")
            this.addInfo.corpId = this.addInfo.corpId.toString()
            this.$http.corpUser.addOrUpdate({...this.addInfo}).then(res => {
              const {code, data, msg} = res
              if (code == 200) {
                this.$message.success(msg)
                this.orderList()
                this.customerAddInfo = false
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(data || msg)
              }
            })
          } else {
            this.$message.error("请输入必填项")
            return false;
          }
        });
      },
      infoShow(row) {
        this.formBtn = "修改"
        this.formTit = "修改企业用户"
        this.customerAddInfo = true;
        if(row.isDirectUser){
          row.isDirectUser = row.isDirectUser.toString()
        }
        if(row.reductModel){
          row.reductModel = row.reductModel.toString()
        }
        if(row.accountType){
          row.accountType = row.accountType.toString()
        }
        if(row.reductType){
          row.reductType = row.reductType.toString()
        }
        if(row.productType){
          row.productType = row.productType.toString()
        }
        if(row.proType){
          row.proType = row.proType.toString()
        }
        if(row.reportType){
          row.reportType = row.reportType.toString()
        }
        if(row.isPostApi){
          row.isPostApi = row.isPostApi.toString()
        }
        if(row.moType){
          row.moType = row.moType.toString()
        }

        this.addInfo = Object.assign(this.addInfo,row)
        console.log(this.addInfo,'xiugai------=====')
      },

      //修改状态
      setType(row, type,status) {
        this.dialogTitle(type)
        this.currentRowData = row
        this.dialogVisible = true
        this.status = status
        // "corpId":"7080", "status":"3"
      },
      dialogTitle(type) {
        let str = {}
        switch (type) {
          case "disable":
            str.title = "停用"
            str.information = "您确定要停用企业吗？"
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
      updateStatus() {
        const {userId} = this.currentRowData
        this.$http.corpUser.updateStatus({userId:userId, status:this.status}).then(res => {
          const {code, msg} = res
          if (code === 200) {
            this.$message.success(msg)
            this.orderList()
          }
        })
        this.dialogVisible = false
      },
      //信息弹框
      messageShow(row){
        const h = this.$createElement;
        this.$msgbox({
          title: '信息',
          message: this.createElement(h,row)
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          });
        });
      },

      createElement(h,row){
        console.log(row.proType,'--------123--')
        // switch (row.proType) {
        //   case 1:
        //     return row.proType = "web前端"
        //     break
        //   case 2:
        //     return row.proType = "http接口"
        //     break
        //   case 3:
        //     return row.proType = "cmpp接口"
        //     break
        // }
        if (row.proType === 1){
          return h("div",null,[
            h('p',null,[
              h('span', null, '产品类型: '),
              h('span', null, `${row.proType}`)
            ]),
            h('p',null,[
              h('span', null, '企业名称: '),
              h('span', null, `${row.userName}`)
            ]),
            h('p',null,[
              h('span', null, '登录账号: '),
              h('span', null, `${row.loginName}`)
            ]),
            h('p',null,[
              h('span', null, '密码: '),
              h('span', null, `${row.password}`)
            ]),
            h('p',null,[
              h('span', null, '网址: '),
              h('span', null, `${row.mmsAuditCallBack}`)
            ]),
          ])
        }
        if (row.proType === 2){
          return h("div",null,[
            h('p',null,[
              h('span', null, '产品类型: '),
              h('span', null, `${row.proType}`)
            ]),
            h('p',null,[
              h('span', null, '企业名称: '),
              h('span', null, `${row.userName}`)
            ]),
            h('p',null,[
              h('span', null, '登录账号: '),
              h('span', null, `${row.loginName}`)
            ]),
            h('p',null,[
              h('span', null, '密码: '),
              h('span', null, `${row.password}`)
            ]),h('p',null,[
              h('span', null, '客户端IP: '),
              h('span', null, `${row.userIp}`)
            ]),
            h('p',null,[
              h('span', null, '接口地址: '),
              h('span', null, `${row.mmsAuditCallBack}`)
            ]),
          ])
        }
        if (row.proType === 3){
          return  h('p',null,[
            h('span', null, '接口地址: '),
            h('span', null, `${row.mmsAuditCallBack}`)
          ])
        }
      }

    }
  }

</script>

<style scoped>

</style>
