<template>
  <!--销售员-->
  <div class="sysSales">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      max-height="500"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <!-- <el-table-column prop="userName" label="登录账号" /> -->
      <el-table-column prop="actualName" label="姓名" />
      <el-table-column prop="userName" label="手机号" width="150" />
      <el-table-column prop="groupName" label="所属组" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === 1
              ? "主管"
              : scope.row.type === 2
              ? "组长"
              : scope.row.type === 3
              ? "组员"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="135">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="sysName" label="修改人" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="
              val => {
                switchChange(val, scope.row);
              }
            "
          ></el-switch>
        </template>
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "正常" : "停用" }}</span>
        </template> -->
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <!-- <el-button
            @click="updateStatus(scope.row, '2')"
            type="text"
            size="small"
            v-if="scope.row.status === 1"
            style="color: red"
            >停用</el-button
          >
          <el-button
            @click="updateStatus(scope.row, '1')"
            type="text"
            size="small"
            v-else
            style="color: #3a835d"
            >启动</el-button
          > -->
          <el-button @click="checkCommand(scope.row)" type="text" size="small"
            >查看口令</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @selectChange="selectChange"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
    </el-dialog>
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
          <p>通过密码生成器输入密钥进行绑定</p>
        </div>

        <div></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import QRCode from "qrcodejs2";
import { isPassword } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    const validatorUserName = (rule, value, callback) => {
      let regex = /^[a-zA-Z0-9]{2,15}$/;
      if (value == "") {
        callback(new Error("真实姓名称不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-15位字符，支持数字、英文"));
        } else {
          callback();
        }
      }
    };
    const validatorPassword = (rule, value, callback) => {
      if (value) {
        if (!isPassword(value)) {
          callback(
            new Error(
              "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
            )
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatorActualName = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_a-zA-Z]{1,15}$/;
      if (value == "") {
        callback(new Error("姓名不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-15位字符，支持汉字、英文"));
        } else {
          callback();
        }
      }
    };
    const validatorMobile = (rule, value, callback) => {
      console.log(this.formTit, "-----this.formTit");
      let regex = /^1(3|4|5|6|7|8|9)\d{9}$/;
      if (this.formTit === "新增") {
        if (value == "") {
          callback(new Error("手机号不能为空"));
        } else {
          if (!regex.test(value)) {
            callback(new Error("手机号码格式错误"));
          } else {
            callback();
          }
        }
      } else {
        if (value.indexOf("*") === -1) {
          if (value && !/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
            callback(new Error("手机号码格式错误"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return {
      commandVisible: false, //管理员口令码
      command: "", //管理员口令码
      suId: "", //管理员口令码
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSales",
        beforeList: ["queryType"],
        list: "queryByPage"
      },
      // 列表参数
      namespace: "saleMan",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "手机号",
          key: "userName",
          placeholder: "请输入登录账号"
        },
        {
          type: "input",
          label: "姓名",
          key: "actualName",
          placeholder: "请输入姓名"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            }
            // {
            //   key: 4,
            //   value: "介绍人"
            // }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "姓名",
          key: "actualName",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            { trigger: ["blur", "change"], validator: validatorActualName }
          ]
        },
        {
          type: "input",
          label: "手机号",
          key: "userName",
          defaultValue: "",
          maxlength: 11,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            { trigger: ["blur", "change"], validator: validatorMobile }
          ]
        },
        {
          type: "password",
          label: "密码",
          key: "password",
          defaultValue: "",
          maxlength: 18,
          rules: [{ trigger: ["blur", "change"], validator: validatorPassword }]
        },
        // {
        //   type: "input",
        //   label: "真实姓名",
        //   key: "actualName",
        //   disabled: false,
        //   defaultValue: "",
        //   rules: [
        //     {
        //       required: true,
        //       message: "请输入必填项",
        //       trigger: ["blur", "change"]
        //     },
        //     { trigger: ["blur", "change"], validator: validatorUserName }
        //   ]
        // },
        {
          type: "select",
          label: "类型",
          key: "type",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            }
            // {
            //   key: 4,
            //   value: "介绍人"
            // }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "所属组",
          key: "groupId",
          defaultValue: "",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        }
      ],
      id: "",
      salesData: [],
      //请求列表数据之前的其他接口请求的存放数据
      beforeListData: {}
    };
  },
  watch: {
    beforeListData(val) {
      // 1:主管 2:组长 3:组员 5:超管
      this.searchFormConfig.forEach(item => {
        if (val.type === 2 && item.key === "type") {
          item.optionData = [
            { key: 2, value: "组长" },
            { key: 3, value: "组员" }
          ];
        }
      });
      this.formConfig.forEach(item => {
        if (val.type === 2 && item.key === "type") {
          // 组长角色选项下拉
          item.optionData = [
            { key: 2, value: "组长", disabled: true },
            { key: 3, value: "组员" }
          ];
        }
        if (item.key === "groupId") {
          item.optionData = val.data.map(t => {
            return { key: t.groupId, value: t.groupName };
          });
        }
      });
    }
  },
  // mounted() {
  //   this.getEditData();
  // },
  activated() {
    // this.getEditData();
    this._mxGetBeforeListData();
  },
  methods: {
    selectChange({ val, item }) {
      if (item.key === "type") {
        this._setDisplayShow(
          this.formConfig,
          "groupId",
          val === 1 ? true : false
        );
        if (val === 1) {
          this._deleteDefaultValue(this.formConfig, "groupId");
        }
      }
    },
    //操作修改开启或关闭通道
    beginUpdateStatus(val, row) {
      this.loading = true;
      let str = val === 1 ? "用户启用成功！" : "用户禁用成功";
      let str1 = val === 1 ? "用户启用失败！" : "用户禁用失败";
      const { id, userName } = row;
      this.$http.sysSales
        .updateStatus({ id, status: val, userName })
        .then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.$message.success(str);
            this._mxGetList();
          } else {
            this.$message.error(str1);
            this._mxGetList();
          }
        });
    },
    // 检验是否绑定商户账号
    switchChange(val, row) {
      if (val === 1) {
        this.beginUpdateStatus(val, row);
        return;
      }
      this.$http.sysSales.checkSysSales({ id: row.id }).then(res => {
        this.$confirm(res.msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            res.code === 200
              ? this.beginUpdateStatus(val, row)
              : this._mxGetList();
          })
          .catch(() => {
            this._mxGetList();
          });
      });
    },
    refresh() {
      this.$http.user.resetGoogleKey({ suId: this.suId }).then(res => {
        if (res.code === 200) {
          const { googleKey, googleKeyQrCode } = res.data;
          this.command = googleKey;
          this.qrcode(googleKeyQrCode);
        }
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
          this.$message.error(res.msg);
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
    // 获取销售组
    getEditData() {
      this.$http.sysSales.getEditData({}).then(res => {
        if (res.code === 200) {
          this.salesData = res.data;
          this.formConfig.forEach(item => {
            const { key } = item;
            if (key === "groupId") {
              item.optionData = res.data.map(t => {
                return { key: t.sid, value: t.groupName };
              });
            }
          });
        }
      });
    },
    //修改状态
    updateStatus(row, status) {
      this.$confirm(
        `此操作将立即${status === "2" ? "停用" : "启用"}, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const { id, userName } = row;
          this.$http.sysSales
            .updateStatus({ id, status, userName })
            .then(res => {
              if (res.code == 200) {
                this.$message.success("修改成功");
                this._mxGetList();
              }
            });
        })
        .catch(() => {});
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
            setTimeout(() => {
              this.checkCommand({ suId: res.data });
            }, 500);
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      let rule = {
        required: true,
        message: "请输入必填项",
        trigger: ["blur", "change"]
      };
      this.formConfig.forEach(item => {
        if (item.key === "actualName" || item.key === "userName") {
          item.disabled = false;
        }
        if (item.key === "password") {
          this.$set(item.rules, 1, rule);
        }
        if (item.key === "groupId") {
          this.$set(item, "isShow", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "password") {
          this.$set(item, "defaultValue", "");
          this.$set(item.rules, 1, {});
        }
        if (item.key === "actualName" || item.key === "userName") {
          item.disabled = true;
        }
        if (item.key === "groupId") {
          this.$set(item, "isShow", row["type"] === 1 ? true : false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    _mxFormListData(data) {
      // data.forEach(item => {
      //   if (item.modifyTime) {
      //     item.modifyTime = new Date(item.modifyTime).Format(
      //       "yyyy-MM-dd hh:mm:ss"
      //     );
      //   }
      // });
      return data;
    }
  }
};
</script>

<style scoped lang="scss">
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
</style>
