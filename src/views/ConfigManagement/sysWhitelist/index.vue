<template>
  <!--白名单管理-->
  <div class="sysWhitelist">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? "用户" : "通道" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="modifyUser" label="修改人">
        <template slot-scope="scope">
          <span>{{
            scope.row.modifyUser ? scope.row.modifyUser : scope.row.createUser
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" />
      <!-- <template slot-scope="scope">
          <span>{{ scope.row.code  ? scope.row.code  : scope.row.createUser }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('whiteId', scope.row.whiteId)"
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
        @selectChange="selectChange"
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
      //接口地址
      searchAPI: {
        namespace: "sysWhitelist",
        list: "listWhitelistByPage",
        detele: "deleteSysWhiteList"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "手机号码",
          key: "mobile",
          placeholder: "请输入手机号码"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          placeholder: "请选择类型",
          optionData: [
            {
              key: "1",
              value: "用户"
            },
            {
              key: "2",
              value: "通道"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "类型",
          key: "type",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "用户"
            }
            // {
            //   key: 2,
            //   value: "通道",
            // },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          // disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "通道ID",
          key: "userId",
          isShow: true,
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "手机号码",
          key: "mobile",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      whiteId: "",
      GatewayList: [], //通道列表
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    //选择控制
    selectChange({ val, item }) {
      if (item.key === "type") {
        if (val === 2) {
          this._setLabelDisplayShow(this.formConfig, "通道ID", false);
          this._setLabelDisplayShow(this.formConfig, "用户ID", true);
        } else {
          this._setLabelDisplayShow(this.formConfig, "通道ID", true);
          this._setLabelDisplayShow(this.formConfig, "用户ID", false);
        }
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
        this.$http.sysWhitelist.addSysWhiteList(params).then(res => {
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
            whiteId: this.whiteId,
            ...form
          }
        };
        this.$http.sysWhitelist.updateSysWhiteList(params).then(res => {
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
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this._setLabelDisplayShow(this.formConfig, "通道ID", true);
      this._setLabelDisplayShow(this.formConfig, "用户ID", false);
    },
    edit(row) {
      this.whiteId = row.whiteId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "type") {
          if (item.defaultValue === 2) {
            this._setLabelDisplayShow(this.formConfig, "通道ID", false);
            this._setLabelDisplayShow(this.formConfig, "用户ID", true);
          } else {
            this._setLabelDisplayShow(this.formConfig, "通道ID", true);
            this._setLabelDisplayShow(this.formConfig, "用户ID", false);
          }
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
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    },
    //获取通道
    gateway() {
      const params = {
        data: {
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { label } = item;

          if (label === "通道ID") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gateway);
              this.$set(t, "value", t.gatewayName);
              item.optionData.push(t);
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
.sysWhitelist {
}
</style>
