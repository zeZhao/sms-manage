<template>
  <!--审核跟进管理-->
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>

    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="text" label="审核状态">
        <template slot-scope="{row}">{{ renderText(row.text) }}</template>
      </el-table-column>
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column label="操作" width="100">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data () {
    return {
      // 接口地址
      searchAPI: {
        namespace: "YtCheckFollow",
        list: "list"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "select",
          label: "审核状态",
          key: "text",
          optionData: [
            {
              key: "checkPass",
              value: "审核通过"
            },
            {
              key: "checkRefuse",
              value: "审核拒绝"
            }
          ]
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "内容",
          key: "content"
        }
      ]
    };
  },
  methods: {
    // 格式化字段
    renderText (v) {
      switch (v) {
        case "checkPass":
          return "审核通过";
        case "checkRefuse":
          return "审核拒绝";
        default:
          return "-";
      }
    },
    // 删除
    handleDelete (row) {
      const h = this.$createElement;
      const tip = "您确定要删除此项吗？";
      this.$msgbox({
        title: "删除",
        message: h("div", null, [h("p", null, tip)]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        this.$http.YtCheckFollow.del(row).then(res => {
          if (res.code === 200) {
            this._mxGetList();
            this.$message.success("删除成功");
          } else {
            this.$message.error(res.msg || res.data);
          }
        })
      }).catch(() => { });
    }
  }
};
</script>