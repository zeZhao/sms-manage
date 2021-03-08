<template>
  <!--待审签名-->
  <div class="sysSignCheck">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="userId" label="用户计费" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="licenceUrl" label="营业执照">
        <template slot-scope="scope">
          <a
            style="color: #1890ff"
            :href="`${origin}${scope.row.licenceUrl}`"
            target="_blank"
            v-if="scope.row.licenceUrl"
            >点击查看</a
          >
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="cardUrl" label="法人身份证">
        <template slot-scope="scope">
          <a
            style="color: #1890ff"
            :href="`${origin}${scope.row.cardUrl}`"
            target="_blank"
            v-if="scope.row.cardUrl"
            >点击查看</a
          >
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{
            scope.row.status === 1
              ? "待审核"
              : scope.row.status === 2
              ? "审核处理中"
              : scope.row.status === 4
              ? "审核通过"
              : "审核拒绝"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'signCheckId')"
            type="text"
            size="small"
            >审核</el-button
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
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
      ></FormItem>
    </el-dialog>
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
        namespace: "sysSignCheck",
        list: "listSignCheckByPage",
        edit: "checkSignCheck"
      },
      // 列表参数
      namespace: "signCheck",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "用户计费",
          key: "userId",
          placeholder: "请输入用户计费"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户计费",
          key: "userId",
          disabled: true,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          disabled: true,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "签名特服号",
          key: "code",
          defaultValue: ""
        },
        {
          type: "radio",
          label: "状态",
          key: "status",
          initDefaultValue: 4,
          defaultValue: 4,
          optionData: [
            { key: 4, value: "通过" },
            { key: 5, value: "拒绝" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      signCheckId: "",
      origin: window.location.origin
    };
  },
  mounted() {},
  computed: {},
  methods: {
    _mxEdit(row, 编号) {
      row = this._mxArrangeEditData(row);
      this.id = row[编号];
      this.editId = 编号;
      this.formTit = "审核";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    //调整提交的参数
    _formatRequestData(data) {
      data["status"] = 1;
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSignCheck {
}
</style>
