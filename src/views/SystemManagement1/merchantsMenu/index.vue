<template>
  <!-- 商户端菜单 -->
  <div>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <!--<el-form-item>-->
        <!--<el-input v-model="custName" clearable placeholder="客户名称" />-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-input v-model="companyFullName" clearable placeholder="商户全称" />-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="queryOrderList">查询</el-button>-->
        <!--</el-form-item>-->
        <el-form-item style="float: right">
          <el-button type="primary" @click="customerAddInfo = true"
            >新增目录</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      :data="navList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="menuId"
      border
      :tree-props="{ children: 'childMenu', hasChildren: 'hasChildren' }"
      @cell-dblclick="dblclick"
    >
      <el-table-column prop="name" label="菜单名称"></el-table-column>
      <el-table-column label="菜单类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type == "1" ? "商戶端" : "运营端" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单路径">
        <template slot-scope="scope">
          <span>{{ scope.row.linkUrl ? scope.row.linkUrl : "---" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" width="250">
        <template slot-scope="scope">
          <span v-if="!scope.row.sortState">{{
            scope.row.sort ? scope.row.sort : "---"
          }}</span>
          <el-input-number
            style="width:130px"
            v-if="scope.row.sortState"
            v-model="scope.row.sort"
            :min="1"
            label="排序位置"
          ></el-input-number>
          <el-button
            size="small"
            @click="editSort(scope.row)"
            v-if="scope.row.sortState"
            >修改</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="changSwitch($event, scope.row.menuId)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.parentId == 0 && scope.row.status == 1"
            @click="AddShow(scope.row)"
            type="text"
            size="small"
            >新增</el-button
          >
          <el-button @click="infoShow(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button @click="deleteCustomer(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新增商户端菜单"
      :visible.sync="customerAddInfo"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="addForm"
        label-width="120px"
        :model="addInfo"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="菜单名称" prop="funcName">
          <el-input
            v-model="addInfo.funcName"
            clearable
            placeholder="菜单名称"
          />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input
            v-model="addInfo.funcUrl"
            clearable
            placeholder="菜单路径"
          />
        </el-form-item>
        <!-- <el-form-item label="请选择目录类型">
          <el-radio v-model="addInfo.isEnabled" label="1">商戶端</el-radio>
          <el-radio v-model="addInfo.isEnabled" label="2">运营端</el-radio>
        </el-form-item> -->
        <el-form-item label="排序">
          <el-input-number
            v-model="addInfo.seqNum"
            :min="1"
            label="排序"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="customerAddInfo = false">关闭</el-button>
        <el-button type="primary" @click="addNavInfo('addForm', 'catalog')"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="新增子菜单"
      :visible.sync="addNavList"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="addForm"
        label-width="120px"
        :model="addInfo"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item label="菜单名称" prop="funcName">
          <el-input
            v-model="addInfo.funcName"
            disabled
            clearable
            placeholder="菜单名称"
          />
        </el-form-item>
        <el-form-item label="子菜单名称" prop="funcChName">
          <el-input
            v-model="addInfo.funcChName"
            clearable
            placeholder="子菜单名称"
          />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input
            v-model="addInfo.funcUrl"
            clearable
            placeholder="菜单路径"
          />
        </el-form-item>
        <!-- <el-form-item label="请选择目录类型">
          <el-radio v-model="addInfo.isEnabled" label="1">商戶端</el-radio>
          <el-radio v-model="addInfo.isEnabled" label="2">运营端</el-radio>
        </el-form-item> -->
        <el-form-item label="排序">
          <el-input-number
            v-model="addInfo.seqNum"
            :min="1"
            label="排序"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addNavList = false">关闭</el-button>
        <el-button type="primary" @click="addNavInfo('addForm', 'menu')"
          >确认</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      :title="setTitle"
      :visible.sync="customerInfo"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="updateCustomForm"
        label-width="120px"
        :model="setInfo"
        class="demo-ruleForm"
        :rules="rules"
      >
        <!--<el-form-item label="目录名称">-->
        <!--<el-input v-model="setInfo.funcName" disabled clearable placeholder="目录名称" />-->
        <!--</el-form-item>-->
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="setInfo.name" clearable placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="目录路径">
          <el-input
            v-model="setInfo.linkUrl"
            clearable
            placeholder="目录路径"
          />
        </el-form-item>
        <!-- <el-form-item label="请选择目录类型">
          <el-radio
            v-model="setInfo.type"
            :label="1"
            :disabled="setInfo.type === 2"
            >商戶端</el-radio
          >
          <el-radio v-model="setInfo.type" :label="2">运营端</el-radio>
        </el-form-item> -->
        <el-form-item label="排序">
          <el-input-number
            v-model="setInfo.sort"
            :min="1"
            label="排序"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setCustomerInfo('updateCustomForm')"
          >保存</el-button
        >
        <el-button @click.native="customerInfo = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { limitMenuName } from '@/utils/validator';
export default {
  data() {
    return {
      navList: [],
      setTitle: "",
      customerAddInfo: false,
      customerInfo: false,
      addNavList: false,
      setInfo: {
        Id: "",
        funcName: "",
        parentId: "",
        funcChName: "",
        radio: "0",
        funcUrl: "",
        funcCode: "",
        seqNum: "",
        isEnabled: ""
      },
      addInfo: {
        funcName: "",
        parentId: "",
        funcChName: "",
        radio: "0",
        funcUrl: "",
        funcCode: "",
        seqNum: "",
        isEnabled: ""
      },
      value: [],
      optionProps: {
        value: "funcId",
        label: "funcName",
        children: "children",
        checkStrictly: true
      },
      options: [],
      rules: {
        funcName: [ { required: true, validator: limitMenuName, trigger: "blur" } ],
        funcChName: [ { required: true, validator: limitMenuName, trigger: "blur" } ],
        name: [ { required: true, validator: limitMenuName, trigger: "blur" } ]
      }
    };
  },
  mounted() {
    this.getNavList();
  },
  methods: {
    dblclick(row, column, cell, event) {
      if (column.label === "排序") {
        row.sortState = true;
      }
    },
    //修改排序确定提交
    editSort(row) {
      let params = {
        ...row,
        type: 1
      };
      this.$http.nav.addOrUpdate(params).then(res => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.getNavList();
          row.sortState = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getNavList() {
      let params = {
        status: "",
        type: 1
      };
      this.$http.nav.selectMenuList(params).then(res => {
        if (res.code == "200") {
          this.navList = res.data;
          this.setSortState(this.navList);
          // this.$refs.tree.setCheckedKeys(this.navListId);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 设置修改排序状态字段
    setSortState(list) {
      list.forEach(item => {
        if (item.childMenu && item.childMenu.length > 0) {
          this.setSortState(item.childMenu);
        }
        this.$set(item, "sortState", false);
      });
    },
    // 状态
    changSwitch(e, id) {
      let params = {
        menuId: id,
        status: e
      };
      this.$http.nav.updateStatus(params).then(res => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
          this.getNavList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    AddShow(row) {
      this.addNavList = true;
      console.log(row);
      this.addInfo.funcName = row.name;
      this.addInfo.parentId = row.menuId;
    },
    infoShow(row) {
      console.log(row);
      this.setTitle = row.parentId == "0" ? "目录修改" : "菜单修改";
      this.customerInfo = true;
      this.setInfo = row;
    },
    deleteCustomer(row) {
      this.$confirm(
        row.parentId == 0
          ? "删除后子级菜单也将被删除，请谨慎操作"
          : "删除后将不可找回，请谨慎操作",
        row.parentId == 0
          ? `您确定要删除“${row.name}”父级菜单吗？`
          : `您确定要删除“${row.name}”菜单吗？`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          let params = { menuId: row.menuId };
          this.$http.nav.delete(params).then(res => {
            if (res.code == "200") {
              this.$message.success("删除成功");
              this.getNavList();
            } else {
              this.$message.error(res.data);
            }
          });
        })
        .catch(() => {});
    },
    addNavInfo: function(formName, type) {
      console.log(this.addInfo.parentId);
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type == "catalog") {
            console.log(1);
            var params = {
              menuId: "",
              name: this.addInfo.funcName,
              parentId: "0",
              linkUrl: this.addInfo.funcUrl,
              node: "2",
              sort: this.addInfo.seqNum,
              type: this.addInfo.isEnabled,
              status: 1,
              type: 1
            };
          } else {
            console.log(2);
            var params = {
              menuId: "",
              name: this.addInfo.funcChName,
              parentId: this.addInfo.parentId,
              linkUrl: this.addInfo.funcUrl,
              node: "1",
              sort: this.addInfo.seqNum,
              type: this.addInfo.isEnabled,
              status: 1,
              type: 1
            };
          }
          this.$http.nav.addOrUpdate(params).then(res => {
            if (res.code == "200") {
              this.$message({
                showClose: true,
                message: "新增成功",
                type: "success"
              });
              this.customerAddInfo = false;
              this.addNavList = false;
              this.addInfo.funcName = "";
              this.addInfo.funcChName = "";
              this.addInfo.radio = "";
              this.addInfo.parentId = [];
              this.addInfo.funcUrl = "";
              this.addInfo.funcCode = "";
              this.addInfo.seqNum = "";
              this.addInfo.isEnabled = "";
              this.getNavList();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    setCustomerInfo(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.setInfo);
          let params = {
            menuId: this.setInfo.menuId,
            name: this.setInfo.name,
            parentId: this.setInfo.parentId,
            linkUrl: this.setInfo.linkUrl,
            node: this.setInfo.node,
            sort: this.setInfo.sort,
            type: this.setInfo.type,
            status: this.setInfo.status,
            type: 1
          };
          this.$http.nav.addOrUpdate(params).then(res => {
            if (res.code == "200") {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.customerInfo = false;
              this.setInfo = {};
              this.getNavList();
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请输入正确信息");
          return false;
        }
      });
    },
    treeDataTranslate(data, id = "id", pid = "parentId") {
      var res = [];
      var temp = {};
      for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i];
      }
      for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
          if (!temp[data[k][pid]]["children"]) {
            temp[data[k][pid]]["children"] = [];
          }
          if (!temp[data[k][pid]]["_level"]) {
            temp[data[k][pid]]["_level"] = 1;
          }
          data[k]["_level"] = temp[data[k][pid]]._level + 1;
          temp[data[k][pid]]["children"].push(data[k]);
        } else {
          res.push(data[k]);
        }
      }
      this.navList = res;
      console.log(this.navList);
      return res;
    }
  }
};
</script>

<style scoped></style>
