<template>
  <section class="user">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item label="姓名">
          <el-input v-model="name" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="mobile" clearable placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-select v-model="roleType" placeholder="请选择启用状态" clearable>
            <el-option value="1" label="正常" />
            <el-option value="2" label="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
          <el-button type="primary" @click="resetList">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-button type="primary" @click="addAccont()">新增运营账号</el-button>
    <el-table
      :data="dataList"
      highlight-current-row
      style="width: 100%;margin-top:20px"
    >
      <!--登录账户	姓名	手机号	状态	操作-->
      <el-table-column prop="suId" label="账户编号" />
      <!-- <el-table-column prop="account" label="登录账号" /> -->
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="roleName" label="角色" />
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime | timeFormat }}</template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <!--<span>{{scope.row.state == '1'?'正常':'停用'}}</span>-->
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="changSwitch($event, scope.row.suId)"
          ></el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column label="运营账号类型">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{scope.row.roleType == '1'?'商户端运营账号':'运营端运营账号'}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="memo" label="描述" />-->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="infoShow(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button @click="checkCommand(scope.row)" type="text" size="small"
            >查看口令</el-button
          >
          <el-button @click="delUser(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar page">
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
    <el-dialog
      title="查看口令"
      :visible.sync="commandVisible"
      :close-on-click-modal="false"
      width="520px"
      center
    >
      <div class="demo-input-suffix">
        <div style="text-align: center;">
          <div id="qrcode" ref="qrcode" style=""></div>
          <p style="margin-bottom:30px">通过密码生成器扫码进行绑定</p>
          <label for="command">管理员口令码：</label>
          <el-input
            style="width:60%;margin-right:10px"
            id="command"
            placeholder=""
            disabled
            v-model="command"
          />
          <el-button type="text" @click="refresh">重置口令</el-button>
          <p>通过密码生成器扫码进行绑定</p>
        </div>

        <div></div>
      </div>
    </el-dialog>

    <el-dialog
      title="新增运营账号"
      :visible.sync="customerAddInfo"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="addForm"
        label-width="100px"
        :model="addInfo"
        :rules="updateFormRules"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="addInfo.name"
            clearable
            placeholder="姓名"
          />
        </el-form-item>
        <!-- <el-form-item label="密码" prop="pwd">
          <el-input
            v-model="addInfo.pwd"
            type="password"
            clearable
            placeholder="密码"
          />
        </el-form-item> -->
        <!-- <el-form-item label="账户姓名" prop="name">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="addInfo.name"
            clearable
            placeholder="账户姓名"
          />
        </el-form-item> -->
        <el-form-item label="手机号" prop="account">
          <el-input
            v-model="addInfo.account"
            type="phone"
            clearable
            placeholder="手机号"
          />
        </el-form-item>
        <el-form-item label="选择角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="addInfo.roleId"
            placeholder="选择角色"
            popper-class="select-option"
          >
            <el-option
              v-for="item in navList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="启用状态" prop="state">
          <el-select
            style="width: 100%"
            v-model="addInfo.state"
            placeholder="启用状态"
            clearable
          >
            <el-option value="1" label="正常" />
            <el-option value="2" label="停用" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomerInfo('addForm')"
          >新增</el-button
        >
        <el-button @click.native="customerAddInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="运营账号修改"
      :visible.sync="customerInfo"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="updateCustomForm"
        label-width="120px"
        :model="setInfo"
        :rules="updateFormRules"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="setInfo.name"
            clearable
            :disabled="customerInfo"
            placeholder="姓名"
          />
        </el-form-item>
        <!-- <el-form-item label="密码">
          <el-input
            v-model="setInfo.pwd"
            type="password"
            clearable
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="账户姓名" prop="name">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="setInfo.name"
            clearable
            placeholder="账户姓名"
          />
        </el-form-item> -->
        <el-form-item label="手机号" prop="account">
          <el-input
            v-model="setInfo.account"
            type="phone"
            clearable
            :disabled="customerInfo"
            placeholder="手机号"
          />
        </el-form-item>
        <el-form-item label="选择角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="setInfo.roleId"
            placeholder="选择角色"
            popper-class="select-option"
          >
            <el-option
              v-for="item in navList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="启用状态" prop="state">
          <el-select
            style="width: 100%"
            v-model="setInfo.state"
            placeholder="启用状态"
            clearable
          >
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="停用" />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setCustomerInfo('updateCustomForm')"
          >保存</el-button
        >
        <el-button @click.native="canselCustomerInfo">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import checkPermission from "@/utils/permission";
import QRCode from "qrcodejs2";
import Util from "@/utils/reg";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (
        value &&
        (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value) || value.length !== 11)
      ) {
        callback(new Error("手机号码不符合规范"));
      } else {
        callback();
      }
    };
    return {
      // -------------------我-------------是------------的----------分------------界----------线----------------☺-------------------//
      cur_page: 1, // 默认在第一页
      pageNum: 10, // 默认每页显示1条数据
      totalCount: 1, // 默认总条数为一条
      show: true,
      orderMoney: "0",
      commandVisible: false, //管理员口令码
      command: "", //管理员口令码
      suId: "", //管理员口令码
      count: "",
      totalAmount: "",
      allOrderStatusInfo: false, // 推送界面是否显示
      orderStatusInfo: false, // 推送界面是否显示
      shopInfo: false, // 状态界面是否显示
      cityList: [],
      dataList: [],
      productId: "",
      contactMobile: "",
      contactName: "",
      supplierId: "",
      supplierName: "",
      roleId: "",
      roleName: "",
      name: "",
      mobile: "",
      roleType: "",
      customerAddInfo: false,
      customerInfo: false,
      setRoleMenu: false,
      defaultProps: {
        children: "childMenu",
        label: "name"
      },
      navList: [],
      navListId: [],
      setInfo: {},
      addInfo: {
        pwd: "",
        account: "",
        number: "",
        name: "",
        mobile: "",
        state: "",
        roleId: ""
      },
      updateFormRules: {
        account: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        name: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        roleId: [
          { required: true, message: "请选择必选项", trigger: "change" }
        ],
        state: [{ required: true, message: "请选择必选项", trigger: "change" }]
      },
      companyOptions: [] // 商户全称下拉项
    };
  },
  mounted() {
    this.orderList();
  },
  filters: {
    formatDate: function(value) {
      // var val = JSON.parse(value)
      var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  },
  methods: {
    refresh() {
      this.$http.user.resetGoogleKey({ suId: this.suId }).then(res => {
        if (res.code === 200) {
          const { googleKey, googleKeyQrCode } = res.data;
          this.command = googleKey;
          this.qrcode(googleKeyQrCode);
        }
        console.log(res, "-----------");
      });
    },
    checkCommand({ suId }) {
      this.commandVisible = true;
      this.suId = suId;
      this.$http.user.getGoogleKey({ suId }).then(res => {
        if (res.code === 200) {
          const { googleKey, googleKeyQrCode } = res.data;
          this.command = googleKey;
          this.qrcode(googleKeyQrCode);
        } else {
          this.$message.error("请求异常");
        }
      });
    },
    qrcode(url) {
      this.$refs.qrcode.innerHTML = ""; // 清空之前生成的二维码内容
      let qrcode = new QRCode("qrcode", {
        width: 200, // 设置宽度，单位像素
        height: 200, // 设置高度，单位像素
        text: url // 设置二维码内容或跳转地址(完整链接)
      });
    },
    checkPermission,
    queryOrderList() {
      this.cur_page = 1;
      this.orderList();
    },
    addAccont() {
      this.customerAddInfo = true;
      this.$nextTick(() => {
        this.deleteCustomer();
        this.$refs.addForm.clearValidate();
      });
    },
    //重置
    resetList() {
      this.name = "";
      this.mobile = "";
      this.roleType = "";
    },
    // 分页
    handleSizeChange(val) {
      this.page = val;
      this.orderList();
    },
    // 分页
    handleCurrentChange(val) {
      this.cur_page = val;
      this.orderList(); // 确定当前页面后刷新页面
    },
    // 条件批量推送
    allPushrderList: function() {
      this.allOrderStatusInfo = true;
    },
    // 列表
    orderList: function() {
      const params = {
        data: {
          sysUser: {
            name: this.name,
            mobile: this.mobile,
            state: this.roleType
          },
          pageNumber: this.cur_page,
          pageSize: this.pageNum
        }
      };
      this.$http.user.queryByPage(params).then(res => {
        if (res.code == "200") {
          this.dataList = res.data.list;
          this.totalCount = Number(res.data.total);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    updateStatus(e, id) {
      let params = {
        suId: id,
        state: e
      };
      this.$http.user.updateStatus(params).then(res => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 状态
    changSwitch(e, id) {
      console.log(e);
      let statu = 0;
      let tit = "";
      let txt = "";
      const h = this.$createElement;

      if (e === 2) {
        statu = 1;
        tit = "禁用";
        txt = "禁用后将无法登录，确定要禁用吗？";
      } else {
        statu = 2;
        tit = "提示";
        txt = "开启后将继续使用，确定要开启吗？";
      }
      this.$msgbox({
        title: tit,
        message: h("div", null, [h("p", null, txt)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(action => {
          this.updateStatus(e, id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
          this.orderList();
        });
    },
    addCustomerInfo() {
      this.$refs.addForm.validate();
      let params = {
        account: this.addInfo.account,
        // pwd: this.addInfo.pwd,
        name: this.addInfo.name
        // state: parseInt(this.addInfo.state),
        // mobile: this.addInfo.mobile
      };
      if (this.addInfo.account == "") {
        return this.$message.error("请填写手机号");
      }
      //  else if (this.addInfo.pwd == "") {
      //   return this.$message.error("请填写密码");
      // } else if (
      //   !/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]{8,16}$/.test(
      //     this.addInfo.pwd
      //   )
      // ) {
      //   return this.$message.error("密码为8-16位，数字、字母、英文符号");
      // }
      else if (this.addInfo.name == "") {
        return this.$message.error("请填写姓名");
      }
      //  else if (this.addInfo.state == "") {
      //   return this.$message.error("请选择状态");
      // } else if (this.addInfo.roleId == "") {
      //   return this.$message.error("请选择角色");
      // } else if (this.addInfo.mobile == "") {
      //   return this.$message.error("请填写手机号");
      // }
      else if (!Util.isPoneAvailable(this.addInfo.account)) {
        this.$message.error("手机号码规则错误");
        return false;
      }
      this.$http.user.addOrUpdate(params).then(res => {
        if (res.code == "200") {
          // this.$message({
          //   showClose: true,
          //   message: '新增成功',
          //   type: 'success'
          // });
          this.setNavuserList(res.data, this.addInfo.roleId, "add");
          this.checkCommand({ suId: res.data });
          this.addInfo.account = "";
          this.addInfo.pwd = "";
          this.addInfo.state = "";
          this.addInfo.name = "";
          this.addInfo.mobile = "";
          this.addInfo.roleId = "";
          this.customerAddInfo = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    infoShow(row) {
      this.customerInfo = true;
      this.$nextTick(() => {
        this.deleteCustomer();
        this.setInfo = Object.assign({}, row);
        //   this.setInfo.state = row.state;
        this.setInfo.pwd = "";
        this.$refs.updateCustomForm.clearValidate();
      });
    },
    delUser(row) {
      this.$confirm(
        "删除运营账号后，运营人员将无法登陆",
        "您确定要删除运营账号吗? ",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = {
            suId: row.suId
          };
          this.$http.user.delete(params).then(res => {
            if (res.code == "200") {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.orderList();
            } else {
              console.log(res);
              this.$message.error(res.data);
            }
          });
        })
        .catch(() => {});
    },
    deleteCustomer(id) {
      let params = {
        roleType: 2,
        status: 1
      };
      this.$http.role.getRoleByType(params).then(res => {
        if (res.code == "200") {
          this.navList = res.data;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    setCustomerInfo(formName) {
      this.$refs.updateCustomForm.validate();
      let params = {
        suId: this.setInfo.suId,
        account: this.setInfo.account,
        // pwd: this.setInfo.pwd,
        name: this.setInfo.name,
        state: this.setInfo.state
        // mobile: this.setInfo.mobile
      };
      if (this.setInfo.account == "") {
        return this.$message.error("请填写姓名");
      } else if (this.setInfo.name == "") {
        return this.$message.error("请填写姓名");
      }
      // else if (this.setInfo.pwd) {
      //   if (
      //     !/^[a-z_A-Z0-9-\.!@#\$%\\\^&\*\)\(\+=\{\}\[\]\/",'<>~\·`\?:;|]{8,16}$/.test(
      //       this.setInfo.pwd
      //     )
      //   ) {
      //     return this.$message.error("密码为8-16位，数字、字母、标点符号");
      //   }
      // } else if (this.setInfo.state == "") {
      //   return this.$message.error("请选择状态");
      // } else if (!this.setInfo.roleId && this.setInfo.roleId !== 0) {
      //   return this.$message.error("请选择角色");
      // }
      // if (this.setInfo.mobile == "") {
      //   return this.$message.error("请填写手机号");
      // }
      else if (!Util.isPoneAvailable(this.setInfo.account)) {
        this.$message.error("手机号码规则错误");
        return false;
      }
      this.$http.user.addOrUpdate(params).then(res => {
        if (res.code == "200") {
          this.setNavuserList(this.setInfo.suId, this.setInfo.roleId, "edit");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    canselCustomerInfo() {
      this.customerInfo = false;
      // this.orderList();
    },
    setNavuserList(userId, roleId, type) {
      let params = {
        userId: userId,
        roleId: roleId
      };
      this.$http.user.sysUseOrUpdate(params).then(res => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "成功",
            type: "success"
          });
          this.customerInfo = false;
          this.customerAddInfo = false;

          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    treeDataTranslate(res) {
      res.forEach((item, index) => {
        if (item.ifChecked == 1) {
          this.navListId.push(item.menuId);
        }
        if (item.childMenu) {
          this.treeDataTranslate(item.childMenu);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.user {
  #qrcode {
    width: 200px;
    height: 200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
  ::v-deep .el-dialog__header {
    border-bottom: 1px solid #909399;
  }
}
</style>
