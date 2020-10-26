<template>
  <!--通道组配置-->
  <div class="sysGatewayGroup">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="groupId" label="通道组ID" />
      <el-table-column prop="groupName" label="通道组名称" />
      <el-table-column prop="sendTo" label="发送对象" />
      <el-table-column prop="notes" label="备注" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('groupId',scope.row.groupId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
      >
        <div slot="Other">
          <el-button @click="addGatewayGroup">添加通道</el-button>
          <el-table :data="gatewayGroupList" v-if="gatewayGroupList.length">
            <el-table-column prop="gateway" label="通道组ID">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.gateway"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="分配比例">
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.ratio"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="deleteItem(scope)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorGroupName = (rule, value, callback) => {
      let regex = new RegExp(
        "^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,50}$"
      );
      if (value === "") {
        callback(new Error("此项不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-50位字符，只能输入中文、英文、数字"));
        } else {
          callback();
        }
      }
    };
    const validatorSendTo = (rule, value, callback) => {
      let regex = new RegExp(
        "^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,10}$"
      );
      if (value === "") {
        callback(new Error("此项不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-10位字符，只能输入中文、英文、数字"));
        } else {
          callback();
        }
      }
    };
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        // callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysGatewayGroup",
        list: "listGatewayGroupByPage",
        detele: "deleteGatewayGroup",
      },
      // 列表参数
      namespace: "gatewayGroup",
      //搜索框数据
      searchParam: {
        groupId: "",
        groupName: "",
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道组id",
          key: "groupId",
          placeholder: "请输入通道组id",
        },
        {
          type: "input",
          label: "通道组名称",
          key: "groupName",
          placeholder: "请输入通道组名称",
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "通道组ID",
          key: "groupId",
          maxlength: "4",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^9\d{3}$/,
              message: "9开头4位数",
              trigger: "change",
            },
          ],
        },
        {
          type: "input",
          label: "通道组名称",
          key: "groupName",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorGroupName },
          ],
        },
        {
          type: "input",
          label: "发送对象",
          key: "sendTo",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorSendTo },
          ],
        },
        {
          type: "input",
          label: "备注",
          maxlength: 300,
          key: "notes",
          // rules: [{ trigger: "blur", validator: validatorRemark }],
        },
      ],
      id: "",
      gatewayGroupList: [],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form,
            sysGatewayDistributionList: [...this.gatewayGroupList],
          },
        };
        this.$http.sysGatewayGroup.addGatewayGroup(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            id: this.id,
            ...form,
            sysGatewayDistributionList: [...this.gatewayGroupList],
          },
        };
        this.$http.sysGatewayGroup.updateGatewayGroup(params).then((res) => {
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
      this.gatewayGroupList = [];
      this.formConfig.forEach((item) => {
        if (item.key == "groupId") {
          this.$set(item, "disabled", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      const { id, groupId } = row;
      this.id = id;
      this.formTit = "修改";
      this.formConfig.forEach((item) => {
        if (item.key == "groupId") {
          this.$set(item, "disabled", true);
        }
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this.$http.sysGatewayGroup
        .selectGatewayGroup({ data: { groupId: groupId.toString() } })
        .then((res) => {
          this.gatewayGroupList = res.data;
        });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    addGatewayGroup() {
      this.$nextTick(() => {
        this.gatewayGroupList.push({ gateway: "", ratio: "" });
      });
    },
    deleteItem(scope) {
      this.gatewayGroupList.splice(scope.$index, 1);
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.sysGatewayGroup {
}
</style>
