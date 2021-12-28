<template>
  <!--通道组配置-->
  <div class="sysGatewayGroup">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="groupId" label="通道组编号" />
      <el-table-column prop="groupName" label="通道组名称" />
      <el-table-column prop="sendTo" label="发送对象" />
      <el-table-column prop="notes" label="备注" />
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('groupId', scope.row.groupId)"
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
      >
        <div slot="Other">
          <el-button class="m-b" @click="addGatewayGroup">添加通道</el-button>
          <el-table
            class="m-b"
            :data="gatewayGroupList"
            v-if="gatewayGroupList.length"
          >
            <el-table-column prop="gateway" label="通道编号">
              <template slot-scope="scope">
                <el-select v-model="scope.row.gateway">
                  <el-option
                    v-for="(item, index) in GatewayList"
                    :key="index"
                    :value="item.gatewayId"
                    :label="item.gateway"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="分配比例">
              <template slot-scope="scope">
                <el-input-number
                  style="width:160px"
                  :step="1"
                  step-strictly
                  v-model="scope.row.ratio"
                  controls-position="right"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="ratio" label="通道类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.type">
                  <el-option :value="1" label="动态调整"></el-option>
                  <el-option :value="2" label="固定比例"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="deleteItem(scope)" type="text" size="small"
                  >删除</el-button
                >
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
        callback();
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
        detele: "deleteGatewayGroup"
      },
      // 列表参数
      namespace: "gatewayGroup",
      //搜索框数据
      searchParam: {
        groupId: "",
        groupName: ""
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道组编号",
          key: "groupId"
        },
        {
          type: "input",
          label: "通道组名称",
          key: "groupName",
          placeholder: "请输入通道组名称"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "通道组编号",
          key: "groupId",
          maxlength: "4",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^9\d{3}$/,
              message: "9开头4位数",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "通道组名称",
          key: "groupName",
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
          label: "发送对象",
          key: "sendTo",
          optionData: [
            { key: "移动", value: "移动" },
            { key: "联通", value: "联通" },
            { key: "电信", value: "电信" },
            { key: "三网", value: "三网" },
            { key: "移动,联通", value: "移动,联通" },
            { key: "移动,电信", value: "移动,电信" },
            { key: "联通,电信", value: "联通,电信" }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
            // { trigger: ['blur', 'change'], validator: validatorSendTo }
          ]
        },
        {
          type: "input",
          label: "备注",
          maxlength: 300,
          key: "notes"
          // rules: [{ trigger: ['blur', 'change'], validator: validatorRemark }],
        }
      ],
      id: "",
      gatewayGroupList: [],
      GatewayList: []
    };
  },
  mounted() {
    this.gateway();
  },
  activated() {
    this.gateway();
  },
  computed: {},
  methods: {
    // 获取通道
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
        this.GatewayList = [];
        res.data.forEach(t => {
          this.$set(t, "key", t.gatewayId);
          this.$set(t, "value", t.gateway);
          this.GatewayList.push(t);
        });
      });
    },
    submit(form) {
      const isGateway = this.gatewayGroupList.every(v => v.gateway !== "");
      if (!isGateway) {
        this.$message.error("通道编号不能为空");
        return;
      }
      const isDecimal = this.gatewayGroupList.every(
        v => v.ratio > 0 && v.ratio <= 100
      );
      if (!isDecimal) {
        this.$message.error("分配比例应该大于0且不得大于100");
        return;
      }
      const isSameType1 = this.gatewayGroupList.every(v => v.type === 1);
      const isSameType2 = this.gatewayGroupList.every(v => v.type === 2);
      if (!isSameType1 && !isSameType2) {
        this.$message.error("通道类型只能为同一种类型");
        return;
      }
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form,
            sysGatewayDistributionList: [...this.gatewayGroupList]
          }
        };
        this.$http.sysGatewayGroup.addGatewayGroup(params).then(res => {
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
            // id: this.id,
            ...form,
            sysGatewayDistributionList: [...this.gatewayGroupList]
          }
        };
        this.$http.sysGatewayGroup.updateGatewayGroup(params).then(res => {
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
      this.formConfig.forEach(item => {
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
      // this.id = id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        if (item.key == "groupId") {
          this.$set(item, "disabled", true);
        }
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          } else if (item.key === key && row[key] === "-") {
            this.$set(item, "defaultValue", "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this.$http.sysGatewayGroup
        .selectGatewayGroup({ data: { groupId: groupId.toString() } })
        .then(res => {
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
        this.gatewayGroupList.push({ gateway: "", ratio: "", type: 1 });
      });
    },
    deleteItem(scope) {
      this.gatewayGroupList.splice(scope.$index, 1);
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.groupId) {
        data.groupId = Number(data.groupId);
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysGatewayGroup {
}
.m-b {
  margin-bottom: 20px;
}
</style>
