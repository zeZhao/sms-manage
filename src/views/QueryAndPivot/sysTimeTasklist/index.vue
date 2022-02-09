<template>
  <!--定时-->
  <div class="sysTimeTasklist">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="edit"
          >批量修改通道</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" width="120" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" width="310" />
      <el-table-column prop="mobile" label="手机号" width="100" />
      <el-table-column prop="gateway" label="通道"
        ><template slot-scope="scope">
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
      <el-table-column prop="operaid" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaid === 0">非法</span>
          <span v-else-if="scope.row.operaid === 1">移动</span>
          <span v-else-if="scope.row.operaid === 2">联通</span>
          <span v-else-if="scope.row.operaid === 3">电信</span>
          <span v-else-if="scope.row.operaid === 4">国际</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="status" label="状态(是否发送)" width="110">
        <template slot-scope="scope">
          <span>{{
            scope.row.status === 0
              ? "未发"
              : scope.row.status === 1
              ? "已发"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="definiteTime" label="定时时间" width="150">
        <template slot-scope="scope">{{
          scope.row.definiteTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog title="批量修改通道" :visible.sync="editGateway" width="50%">
      <FormItem
        :colSpan="12"
        ref="formItem"
        :formConfig="formConfig"
        btnTxt="修改"
        labelWidth="100"
        @submit="submitGateway"
        @cancel="_mxCancel"
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
import { getDateTime } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      isChooseUser: false,
      //接口地址
      searchAPI: {
        namespace: "sysTimeTasklist",
        list: "listTimeTasklistByPage"
      },
      // 列表参数
      namespace: "sysTimeTasklist",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "CID",
          key: "cId",
          placeholder: "请输入CID"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "inputNum",
          label: "通道",
          key: "gateway",
          placeholder: "请输入通道"
        },
        // {
        //   type: "input",
        //   label: "特服号",
        //   key: "code",
        //   placeholder: "请输入特服号"
        // },

        {
          type: "select",
          label: "是否发送",
          key: "status",
          optionData: [
            {
              key: "0",
              value: "未发送"
            },
            {
              key: "1",
              value: "已发送"
            }
          ],
          placeholder: "是否发送"
        },
        {
          type: "datetime",
          label: "定时时间",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateTime("start"), getDateTime("end")]
        }
      ],

      formConfig: [
        {
          type: "select",
          label: "修改条件",
          key: "editCondition",
          colSpan: 24,
          optionData: [
            { key: 1, value: "账户编号" },
            { key: 2, value: "CID" },
            { key: 3, value: "内容" }
          ],
          tip: "账户编号选填，未选择时改变所有账户的原通道，请确认后再修改"
        },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          isShow: true,
          colSpan: 24
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          isShow: true,
          colSpan: 24
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          colSpan: 24,
          isShow: true
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "原通道",
          key: "gateway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "改成",
          key: "toGateway",
          optionData: [],
          placeholder: "请选择"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "dataTime",
          label: "定时时间",
          initDefaultValue: "",
          defaultValue: "",
          key: "definiteTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "dataTime",
          label: "改成",
          initDefaultValue: "",
          defaultValue: "",
          placeholder: "请选择",
          key: "updateDefiniteTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
        // {
        //   type: "time",
        //   label: "开始时间",
        //   key: "startTime",
        //   initDefaultValue: "00:00:00",
        //   defaultValue: "00:00:00",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "time",
        //   label: "结束时间",
        //   key: "endTime",
        //   initDefaultValue: "23:59:59",
        //   defaultValue: "23:59:59",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "select",
        //   label: "是否处理长短信",
        //   initDefaultValue: "1",
        //   defaultValue: "1",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "是"
        //     },
        //     {
        //       key: "0",
        //       value: "否"
        //     }
        //   ],
        //   key: "udhi",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "inputNum",
        //   label: "特服号",
        //   key: "code"
        // }
      ],
      editGateway: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    selectChange({ val, item }) {
      if (item.key === "editCondition") {
        if (val == 1) {
          this._setDisplayShow(this.formConfig, "content", true);
          this._setDisplayShow(this.formConfig, "cid", true);
          this._setDisplayShow(this.formConfig, "userId", false);
        } else if (val == 2) {
          this._setDisplayShow(this.formConfig, "content", true);
          this._setDisplayShow(this.formConfig, "cid", false);
          this._setDisplayShow(this.formConfig, "userId", true);
        } else if (val == 3) {
          this._setDisplayShow(this.formConfig, "content", false);
          this._setDisplayShow(this.formConfig, "cid", true);
          this._setDisplayShow(this.formConfig, "userId", true);
        } else {
          this._setDisplayShow(this.formConfig, "content", true);
          this._setDisplayShow(this.formConfig, "cid", true);
          this._setDisplayShow(this.formConfig, "userId", true);
        }
      }
    },
    //获取通道
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

          if (key === "gateway" || key === "toGateway") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    _mxArrangeSubmitData(form) {
      const { editCondition } = form;
      if (editCondition === 1) {
        form.cid = "";
        form.content = "";
      } else if (editCondition === 2) {
        form.userId = "";
        form.content = "";
      } else if (editCondition === 3) {
        form.userId = "";
        form.cid = "";
      } else {
        form.content = "";
        form.cid = "";
        form.userId = "";
      }
      return form;
    },
    submitGateway(form) {
      form = this._mxArrangeSubmitData(form);
      const params = {
        data: {
          ...form
        }
      };
      this.$http.sysTimeTasklist.updateTimeTasklist(params).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg || res.data);
          this._mxGetList();
          this.editGateway = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          this.$set(t, "defaultValue", data.userId);
        }
        if (key === "corporateId") {
          this.$set(t, "defaultValue", data.corpId);
        }
      });
    },
    // 批量修改通道
    edit() {
      this.editGateway = true;
      this._setDisplayShow(this.formConfig, "content", true);
      this._setDisplayShow(this.formConfig, "cid", true);
      this._setDisplayShow(this.formConfig, "userId", true);
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxCancel() {
      this.editGateway = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.sysTimeTasklist {
}
</style>
