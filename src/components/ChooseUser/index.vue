<template>
  <!--选择用户-->
  <div class="ChooseUser">
    <el-dialog
      title="选择用户"
      :visible.sync="isChooseUser"
      top="45px"
      width="65%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span slot="title">
        <p style="float: left; font-size: 16px">选择用户</p>
        <i
          style="float: right; margin-top: 16px; cursor: pointer"
          class="el-icon-close"
          @click="cancel"
        ></i>
        <div style="clear: both"></div>
      </span>
      <Search
        ref="search"
        :searchFormConfig="searchFormConfig"
        @search="_mxDoSearch"
        :add="false"
      ></Search>
      <slot name="btnOther"></slot>
      <el-table
        :data="listData"
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          prop="corpId"
          label="商户编号"
          key="0"
        />
        <el-table-column
          align="center"
          prop="corpName"
          label="商户名称"
          key="1"
        />
        <el-table-column
          align="center"
          prop="userId"
          label="账户编号"
          key="2"
        />
        <el-table-column
          align="center"
          prop="userName"
          label="账户名称"
          key="3"
        />
        <el-table-column align="center" prop="code" label="特服号" key="4" />
        <el-table-column
          align="center"
          prop="cardUnit"
          label="短信单价"
          key="5"
        />
        <el-table-column
          align="center"
          prop="mmsCardUnit"
          label="彩信单价"
          key="6"
        />
        <el-table-column
          v-if="!isMultiple"
          align="center"
          fixed="right"
          label="操作"
          key="7"
        >
          <template slot-scope="scope">
            <el-button @click="selected(scope.row)" type="text" size="small"
              >选中</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          v-if="isMultiple"
          type="selection"
          width="55"
          key="8"
        />
      </el-table>
      <Page
        :pageObj="pageObj"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></Page>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  props: {
    isChooseUser: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    }
  },
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "corpUser",
        list: "queryMainInfo"
      },
      // 列表参数
      namespace: "corpUser",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "input",
          label: "商户名称",
          key: "corpName",
          placeholder: "请输入商户名称"
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
        }
      ],
      //选中的数组集合
      multipleSelection: []
    };
  },
  methods: {
    //选中
    selected(row) {
      this.$emit("cancel", false);
      this.$emit("chooseUserData", row);
      setTimeout(() => {
        this.$refs.search.resetForm();
      });
    },
    // 关闭
    cancel() {
      setTimeout(() => {
        this.$refs.search.resetForm();
      });
      this.$emit("cancel", false);
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //返回给父组件-多选的数据
    renderSelectArr() {
      this.$emit("cancel", false);
      this.$emit("selectArr", this.multipleSelection);
    }
  }
};
</script>

<style lang="scss" scoped>
.ChooseUser {
  >>> .el-dialog__body {
    padding: 5px 20px;
  }
  >>> .page {
    padding-bottom: 20px;
  }
}
</style>
