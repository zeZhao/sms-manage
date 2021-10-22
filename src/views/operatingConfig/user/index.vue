<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="roleId" clearable placeholder="登录账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="roleName" clearable placeholder="账户名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="roleType" placeholder="启用状态" clearable>
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
    <el-button
      type="primary"
      @click="
        customerAddInfo = true;
        deleteCustomer();
      "
      >新增运营账号</el-button
    >
    <el-table
      :data="dataList" max-height="430"
      highlight-current-row
      style="width: 100%;margin-top:20px"
    >
      <!--登录账户	姓名	手机号	状态	操作-->
      <el-table-column prop="suId" label="账户编号" />
      <el-table-column prop="account" label="登录账号" />
      <el-table-column prop="name" label="账户名称" />
      <el-table-column prop="mobile" label="账户手机号" />
      <el-table-column prop="roleName" label="角色" />
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
        <el-form-item label="登录账号">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="addInfo.account"
            clearable
            placeholder="登录账号"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="addInfo.pwd"
            type="password"
            clearable
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="账户姓名">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="addInfo.name"
            clearable
            placeholder="账户姓名"
          />
        </el-form-item>
        <el-form-item label="账户手机号">
          <el-input
            v-model="addInfo.mobile"
            type="phone"
            clearable
            placeholder="账户手机号"
          />
        </el-form-item>
        <el-form-item label="选择角色">
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
        <el-form-item label="启用状态">
          <el-select
            style="width: 100%"
            v-model="addInfo.state"
            placeholder="启用状态"
            clearable
          >
            <el-option value="1" label="正常" />
            <el-option value="2" label="停用" />
          </el-select>
        </el-form-item>
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
        <el-form-item label="登录账号">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="setInfo.account"
            clearable
            placeholder="登录账号"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="setInfo.pwd"
            type="password"
            clearable
            placeholder="密码"
          />
        </el-form-item>
        <el-form-item label="账户姓名">
          <el-input
            maxlength="15"
            show-word-limit
            v-model="setInfo.name"
            clearable
            placeholder="账户姓名"
          />
        </el-form-item>
        <el-form-item label="账户手机号">
          <el-input
            v-model="setInfo.mobile"
            type="phone"
            clearable
            placeholder="账户手机号"
          />
        </el-form-item>
        <el-form-item label="选择角色">
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
        <el-form-item label="启用状态">
          <el-select
            style="width: 100%"
            v-model="setInfo.state"
            placeholder="启用状态"
            clearable
          >
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="停用" />
          </el-select>
        </el-form-item>
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
        contactMobile: [{ validator: validatePhone, trigger: "blur" }]
      },
      companyOptions: [], // 商户全称下拉项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
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
    checkPermission,
    queryOrderList() {
      this.cur_page = 1;
      this.orderList();
    },
    //重置
    resetList() {
      this.roleType = "";
      this.roleName = "";
      this.roleId = "";
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
            account: this.roleId,
            name: this.roleName,
            state: this.roleType,
            roleName: "",
            roleId: ""
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
      let params = {
        account: this.addInfo.account,
        pwd: this.addInfo.pwd,
        name: this.addInfo.name,
        state: parseInt(this.addInfo.state),
        mobile: this.addInfo.mobile
      };
      if (this.addInfo.account == "") {
        return this.$message.error("请填写账号");
      } else if (this.addInfo.pwd == "") {
        return this.$message.error("请填写密码");
      } else if (!/^[\d0-9a-zA-Z!@#$%^&*~=+-]{8,16}$/.test(this.addInfo.pwd)) {
        return this.$message.error("密码为8-16位，数字、字母、英文符号");
      } else if (this.addInfo.name == "") {
        return this.$message.error("请填写姓名");
      } else if (this.addInfo.state == "") {
        return this.$message.error("请选择状态");
      } else if (this.addInfo.roleId == "") {
        return this.$message.error("请选择角色");
      } else if (this.addInfo.mobile == "") {
        return this.$message.error("请填写手机号");
      } else if (!Util.isPoneAvailable(this.addInfo.mobile)) {
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
          this.addInfo.account = "";
          this.addInfo.pwd = "";
          this.addInfo.state = "";
          this.addInfo.name = "";
          this.addInfo.mobile = "";
          this.setNavuserList(res.data, this.addInfo.roleId);
          this.customerAddInfo = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    infoShow(row) {
      console.log(row);
      this.customerInfo = true;
      this.deleteCustomer();
      this.setInfo = Object.assign({}, row);
      //   this.setInfo.state = row.state;
      this.setInfo.pwd = "";
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
      this.customerInfo = true;

      let params = {
        suId: this.setInfo.suId,
        account: this.setInfo.account,
        pwd: this.setInfo.pwd,
        name: this.setInfo.name,
        state: this.setInfo.state,
        mobile: this.setInfo.mobile
      };
      if (this.setInfo.account == "") {
        return this.$message.error("请填写账号");
      } else if (this.setInfo.name == "") {
        return this.$message.error("请填写姓名");
      } else if (this.setInfo.pwd) {
        if (!/^[\d0-9a-zA-Z!@#$%^&*~=+-]{8,16}$/.test(this.setInfo.pwd)) {
          return this.$message.error("密码为8-16位，数字、字母、标点符号");
        }
      } else if (this.setInfo.state == "") {
        return this.$message.error("请选择状态");
      } else if (!this.setInfo.roleId && this.setInfo.roleId !== 0) {
        return this.$message.error("请选择角色");
      }
      if (this.setInfo.mobile == "") {
        return this.$message.error("请填写手机号");
      } else if (!Util.isPoneAvailable(this.setInfo.mobile)) {
        this.$message.error("手机号码规则错误");
        return false;
      }
      this.$http.user.addOrUpdate(params).then(res => {
        if (res.code == "200") {
          this.setNavuserList(this.setInfo.suId, this.setInfo.roleId);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    canselCustomerInfo() {
      this.customerInfo = false;
      // this.orderList();
    },
    setNavuserList(userId, roleId) {
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

<style scoped></style>
