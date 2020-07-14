<template>
  <!--选择用户-->
  <div class="ChooseUser">
    <el-dialog
      title="选择用户"
      :visible.sync="isChooseUser"
      top="45px"
      width="65%"
      @:before-close="cancel"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
      <el-table :data="listData" highlight-current-row style="width: 100%;">
        <el-table-column prop="corpId" label="企业ID" />
        <el-table-column prop="corpName" label="企业名" />
        <el-table-column prop="userId" label="用户ID" />
        <el-table-column prop="userName" label="用户名" />
        <el-table-column prop="code" label="特服号" />
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="selected(scope.row)" type="text" size="small">选中</el-button>
          </template>
        </el-table-column>
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
    }
  },
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "corpUser",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "corpUser",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "企业名称",
          key: "userName",
          placeholder: "请输入企业名称"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //选中
    selected(row) {
      this.$emit("cancel", false);
      this.$emit("chooseUserData", row);
      this.searchParam = {};
    },
    // 关闭
    cancel() {
      this.$emit("cancel", false);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
