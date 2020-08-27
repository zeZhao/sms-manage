<template>
  <!--签名管理-->
  <div class="sysSignCheck">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="code" label="签名特服号" />
      <el-table-column prop="licenceUrl" label="营业执照">
        <template slot-scope="scope">
          <a style="color:#1890ff" :href="`${origin}/${scope.row.licenceUrl}`" target="_blank">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="cardUrl" label="法人身份证">
        <template slot-scope="scope">
          <a style="color:#1890ff" :href="`${origin}/${scope.row.cardUrl}`" target="_blank">点击查看</a>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="150">
        <template slot-scope="scope">{{scope.row.createTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column prop="checkTime" label="审核时间" width="150">
        <template slot-scope="scope">{{scope.row.checkTime | timeFormat}}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1?'待审核':(scope.row.status === 2?'审核处理中':(scope.row.status === 4 ?'审核通过':'审核拒绝')) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('signCheckId',scope.row.signCheckId)"
            type="text"
            size="small"
          >删除</el-button>
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
        detele: "deleteSignCheck"
      },
      // 列表参数
      namespace: "signCheck",
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
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            { key: 1, value: "待审核" },
            { key: 2, value: "审核处理中" },
            { key: 4, value: "审核通过" },
            { key: 5, value: "审核拒绝" }
          ],
          placeholder: "请输入用户名称"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          disabled: true,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          defaultValue: "",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      signCheckId: "",
      origin:window.location.origin
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
      } else {
        params = {
          data: {
            signCheckId: this.signCheckId,
            ...form
          }
        };
        this.$http.sysSignCheck.updateSignCheck(params).then(res => {
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
    },
    edit(row) {
      this.signCheckId = row.signCheckId;
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
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSignCheck {
}
</style>
