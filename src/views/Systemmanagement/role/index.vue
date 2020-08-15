<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="roleIdSearch" type="number" clearable placeholder="角色ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="roleName" clearable placeholder="角色名称" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="roleType" placeholder="角色类型" clearable>
            <el-option value="1" label="前端角色" />
            <el-option value="2" label="后端角色" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="primary"
            @click="
              customerAddInfo = true;
              getNavList();
            "
          >新增角色</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="dataList" highlight-current-row height="680" style="width: 100%;">
      <!--角色id 	角色名称 角色类型 1是前端角色 2是后端角色 描述-->
      <el-table-column prop="roleId" label="ID" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column label="角色类型">
        <template slot-scope="scope">
          <span>{{ scope.row.roleType == "1" ? "前端角色" : "后端角色" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--<span>{{scope.row.state == '1'?'正常':'停用'}}</span>-->
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="changSwitch($event, scope.row.roleId)"
          ></el-switch>
        </template>
      </el-table-column>
      <!--<el-table-column prop="des" label="描述" />-->
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="infoShow(scope.row)" type="text" size="small">修改</el-button>
          <!--<el-button  @click="deleteCustomer(scope.row.roleId)" type="text" size="small">绑定权限</el-button>-->
          <el-button @click="delUser(scope.row)" type="text" size="small">删除</el-button>
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

    <el-dialog
      title="新增角色"
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
        <el-form-item label="角色名称">
          <el-input v-model="addInfo.custName" clearable placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select
            style="width: 100%"
            @change="getNavList"
            v-model="addInfo.roleType"
            placeholder="角色类型"
            clearable
          >
            <el-option value="1" label="前端角色" />
            <el-option value="2" label="后端角色" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="add"
            :default-checked-keys="navListId"
            :data="addNavList"
            show-checkbox
            node-key="menuId"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!--<el-form-item label="角色描述">-->
        <!--<el-input-->
        <!--type="textarea"-->
        <!--:rows="3"-->
        <!--placeholder="请输入内容"-->
        <!--v-model="addInfo.des">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomerInfo('addForm')">新增</el-button>
        <el-button @click.native="customerAddInfo = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="角色修改"
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
        <el-form-item label="角色名称">
          <el-input v-model="setInfo.custName" clearable placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-select style="width: 100%" v-model="setInfo.roleType" placeholder="角色类型" disabled>
            <el-option value="1" label="前端角色" />
            <el-option value="2" label="后端角色" />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :default-checked-keys="navListId"
            :data="navList"
            show-checkbox
            node-key="menuId"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <!--<el-form-item label="角色描述">-->
        <!--<el-input-->
        <!--type="textarea"-->
        <!--:rows="3"-->
        <!--placeholder="请输入内容"-->
        <!--v-model="setInfo.des">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setCustomerInfo('updateCustomForm')">保存</el-button>
        <el-button @click.native="customerInfo = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="绑定权限"
      :visible.sync="setRoleMenu"
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
        <el-form-item label="菜单">
          <el-tree
            ref="tree"
            :default-checked-keys="navListId"
            :data="navList"
            show-checkbox
            node-key="menuId"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setNavuserList('updateCustomForm')">保存</el-button>
        <el-button @click.native="setRoleMenu = false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import checkPermission from "@/utils/permission";
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
      roleIdSearch: "",
      roleId: "",
      roleName: "",
      roleType: "",
      customerAddInfo: false,
      customerInfo: false,
      setRoleMenu: false,
      defaultProps: {
        children: "childMenu",
        label: "name",
      },
      navList: [],
      addNavList: [],
      navListId: [],
      setInfo: {
        custId: "",
        custName: "",
        roleType: "",
        des: "",
      },
      addInfo: {
        custName: "",
        roleType: "1",
        des: "",
      },
      updateFormRules: {
        contactMobile: [{ validator: validatePhone, trigger: "blur" }],
      },
      companyOptions: [], // 企业全称下拉项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.orderList();
  },
  filters: {
    formatDate: function (value) {
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
    },
  },
  methods: {
    checkPermission,
    queryOrderList() {
      this.cur_page = 1;
      this.orderList();
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
    allPushrderList: function () {
      this.allOrderStatusInfo = true;
    },
    // 列表
    orderList: function () {
      const params = {
        data: {
          role: {
            roleId: this.roleIdSearch,
            roleName: this.roleName,
            roleType: this.roleType,
          },
          pageNumber: this.cur_page,
          pageSize: this.pageNum,
        },
      };
      this.$http.role.roleList(params).then((res) => {
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
        roleId: id,
        status: e,
      };
      this.$http.role.updateStatus(params).then((res) => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 状态
    changSwitch(e, id) {
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
        cancelButtonText: "取消",
      })
        .then((action) => {
          this.updateStatus(e, id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
          this.orderList();
        });
    },
    delUser(row) {
      this.$confirm(
        "删除角色后，拥有该角色的管理员将不能系统访问，请谨慎操作",
        "您确定要删除角色吗? ",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let params = {
            roleId: row.roleId,
          };
          this.$http.role.delete(params).then((res) => {
            if (res.code == "200") {
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
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
    addCustomerInfo() {
      let params = {
        roleName: this.addInfo.custName,
        roleType: this.addInfo.roleType,
        status: "1",
      };
      if (this.addInfo.custName == "") {
        return this.$message.error("请填写角色名称");
      } else if (this.addInfo.roleType == "") {
        return this.$message.error("请选择角色类型");
      }
      this.$http.role.addOrUpdate(params).then((res) => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "新增成功",
            type: "success",
          });
          this.addInfo.roleName = "";
          this.setNavuserList(res.data, 1);
          this.customerAddInfo = false;
          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    infoShow(row) {
      console.log(row);
      this.customerInfo = true;
      this.navListId = [];
      this.setInfo.custId = row.roleId;
      this.setInfo.custName = row.roleName;
      this.setInfo.roleType = row.roleType.toString();
      this.setInfo.des = row.des;
      this.deleteCustomer(this.setInfo.custId, this.setInfo.roleType);
    },
    setCustomerInfo(formName) {
      this.customerInfo = true;
      let params = {
        roleId: this.setInfo.custId,
        roleName: this.setInfo.custName,
        roleType: this.setInfo.roleType,
        des: this.setInfo.des,
      };
      if (this.setInfo.roleName == "") {
        return this.$message.error("请填写角色名称");
      } else if (this.setInfo.roleType == "") {
        return this.$message.error("请选择角色类型");
      }
      this.$http.role.addOrUpdate(params).then((res) => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
          this.setInfo.custId = "";
          this.setInfo.custName = "";
          this.setInfo.roleType = "";
          this.setInfo.des = "";
          this.setNavuserList(res.data, 2);
          this.customerInfo = false;
          this.orderList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    deleteCustomer(id, type) {
      this.roleId = id;
      let params = {
        roleId: id,
      };
      this.$http.role.queryRoleMenu(params).then((res) => {
        if (res.code == "200") {
          this.navList = res.data;
          this.treeDataTranslate(res.data);
          // this.$refs.tree.setCheckedKeys(this.navListId);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getNavList() {
      this.navListId = [];
      let params = {
        status: 1,
        type: this.addInfo.roleType,
      };
      this.$http.nav.selectMenuList(params).then((res) => {
        if (res.code == "200") {
          this.addNavList = res.data;
          // this.$refs.tree.setCheckedKeys(this.navListId);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    setNavuserList(id, type) {
      console.log(id, type);
      if (type == 1) {
        let CheckedKeys = this.$refs.add.getCheckedKeys();
        let HalfCheckedKeys = this.$refs.add.getHalfCheckedKeys();
        let menuIds = CheckedKeys.concat(HalfCheckedKeys);
        var params = {
          roleId: id,
          menuIds: menuIds,
        };
      } else {
        let CheckedKeys = this.$refs.tree.getCheckedKeys();
        let HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
        let menuIds = CheckedKeys.concat(HalfCheckedKeys);
        var params = {
          roleId: this.roleId,
          menuIds: menuIds,
        };
      }
      this.$http.role.updateRoleMenu(params).then((res) => {
        if (res.code == "200") {
          this.customerAddInfo = false;
          this.customerInfo = false;
          this.orderList();
        } else {
          this.$message.error(res.data);
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
    },
  },
};
</script>

<style scoped></style>
