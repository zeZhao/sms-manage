<template>
  <!--通道重发配置-->
  <div class="sysSendLimit">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    >
      <!-- <template slot="Other">
        <el-button type="primary" @click="bulkEditing">批量修改</el-button>
      </template> -->
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="gateway" label="通道">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.gateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="重发类型" width="100">
        <template slot-scope="{ row }">{{ renderType(row.type) }}</template>
      </el-table-column>
      <!-- <el-table-column prop="statusYes" label="重发状态" /> -->
      <el-table-column prop="status" label="不重发状态" />
      <el-table-column prop="destGateway" label="重发通道">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.destGatewayName"
            placement="top"
          >
            <span>{{ scope.row.destGateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="modifyUser" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间" width="135">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('resendId', scope.row.resendId)"
            type="text"
            size="small"
            >删除</el-button
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
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <el-dialog
      title="批量修改"
      :visible.sync="bulkEditingVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="editFormItem"
        :formConfig="editFormConfig"
        btnTxt="确定"
        @submit="submitBulkEdit"
        @cancel="cancel"
        @selectChange="selectChange"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      bulkEditingVisible: false,
      //接口地址
      searchAPI: {
        namespace: "sysResendConfig",
        list: "listResendConfigByPage",
        detele: "deleteResendConfig"
      },
      // 列表参数
      namespace: "resendConfig",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "inputNum",
          label: "通道",
          key: "gateway"
        },
        {
          type: "input",
          label: "不重发状态",
          key: "status"
        },
        {
          type: "inputNum",
          label: "重发通道",
          key: "destGateway"
        },
        {
          type: "select",
          label: "重发类型",
          key: "type",
          optionData: [
            { key: 1, value: "发送失败重发" },
            { key: 2, value: "提交失败重发" }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
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
          label: "通道",
          key: "gateway",
          optionData: [],
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
          label: "重发类型",
          key: "type",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "发送失败重发" },
            { key: 2, value: "提交失败重发" }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "input",
        //   label: "重发状态",
        //   key: "statusYes",
        //   defaultValue: "",
        //   maxlength: 30
        // },
        {
          type: "input",
          label: "不重发状态",
          key: "status",
          defaultValue: "",
          maxlength: 30
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ['blur', 'change']
          //   }
          // ]
        },
        {
          type: "select",
          label: "重发通道",
          key: "destGateway",
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
      //批量修改
      editFormConfig: [
        {
          type: "select",
          label: "修改类型",
          key: "gtype",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            { key: 2, value: "重发通道批量修改" },
            { key: 1, value: "原通道批量修改" }
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
          label: "重发原通道",
          key: "resendGorign",
          optionData: [],
          tag: "resend",
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
          label: "重发目标通道",
          key: "resendGdest",
          optionData: [],
          tag: "resend",
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
          label: "原通道",
          key: "gorign",
          optionData: [],
          tag: "raw",
          isShow: true,
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
          label: "目标通道",
          key: "gdest",
          optionData: [],
          tag: "raw",
          isShow: true,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "input",
        //   label: "重发状态",
        //   key: "statusYes",
        //   defaultValue: "",
        //   tag: "raw",
        //   isShow: true,
        //   maxlength: 30
        // },
        {
          type: "input",
          label: "不重发状态",
          key: "status",
          defaultValue: "",
          tag: "raw",
          isShow: true,
          maxlength: 30
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ['blur', 'change']
          //   }
          // ]
        }
      ],
      resendId: "",
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  activated() {
    this._mxGetList();
    this.gateway();
  },
  computed: {},
  methods: {
    selectChange({ val, item }) {
      const { key } = item;
      if (key === "gtype") {
        this.$http.sysResendConfig.getTtype(val).then(res => {
          this.editFormConfig.forEach(item => {
            const { key } = item;
            if (val === 2) {
              if (key === "resendGorign") {
                item.optionData = res.data.map(t => {
                  return { key: t, value: t };
                });
              }
            } else {
              if (key === "gorign") {
                item.optionData = res.data.map(t => {
                  return { key: t, value: t };
                });
              }
            }
          });
        });
        if (val === 2) {
          this._setTagDisplayShow(this.editFormConfig, "resend", false);
          this._setTagDisplayShow(this.editFormConfig, "raw", true);
          this.editFormConfig.forEach(item => {
            if (item.tag === "raw") {
              item.defaultValue = "";
            }
          });
        } else {
          this._setTagDisplayShow(this.editFormConfig, "resend", true);
          this._setTagDisplayShow(this.editFormConfig, "raw", false);
          this.editFormConfig.forEach(item => {
            if (item.tag === "resend") {
              item.defaultValue = "";
            }
          });
        }
      }
      // console.log(val, item);
    },
    bulkEditing() {
      this.bulkEditingVisible = true;
      this._setTagDisplayShow(this.editFormConfig, "raw", true);
      this._setTagDisplayShow(this.editFormConfig, "resend", false);
      setTimeout(() => {
        this.$refs.editFormItem.resetForm();
      }, 0);
    },
    submitBulkEdit(form) {
      console.log(form, "-------------");
      const { gtype, resendGdest, resendGorign } = form;
      let param = {};
      if (gtype === 2) {
        param = {
          data: {
            gorign: resendGorign,
            gdest: resendGdest
          }
        };
      } else {
        param = {
          data: {
            gorign: form.gorign,
            gdest: form.gdest,
            // statusYes: form.statusYes,
            status: form.status
          }
        };
      }
      this.$http.sysResendConfig.batchmd(gtype, param).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg || res.data);
          this.bulkEditingVisible = false;
          this._mxGetList();
        } else {
          this.$message.error(res.msg || res.data);
        }
        console.log(res, "============res");
      });
    },
    renderType(v) {
      switch (v) {
        case 1:
          return "发送失败重发";
        case 2:
          return "提交失败重发";
        default:
          return "-";
      }
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysResendConfig.addResendConfig(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          data: {
            resendId: this.resendId,
            ...form
          }
        };
        this.$http.sysResendConfig.updateResendConfig(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }

      this.addChannel = false;
    },
    create() {
      this.formTit = "新增";
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.resendId = row.resendId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key] !== "-" ? row[key] : "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
      this.bulkEditingVisible = false;
    },
    gateway() {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "gateway" || key === "destGateway") {
            item.optionData = res.data.map(t => {
              return { key: t.gatewayId, value: t.gateway };
            });
          }
        });
        this.editFormConfig.forEach(item => {
          const { key } = item;
          if (key === "resendGdest" || key === "gdest") {
            item.optionData = res.data.map(t => {
              return { key: t.gatewayId, value: t.gateway };
            });
          }
        });
      });
      this.$http.sysResendConfig.getTtype(2).then(res => {
        this.editFormConfig.forEach(item => {
          const { key } = item;
          if (key === "resendGorign") {
            item.optionData = res.data.map(t => {
              return { key: t, value: t };
            });
          }
        });
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSendLimit {
}
</style>
