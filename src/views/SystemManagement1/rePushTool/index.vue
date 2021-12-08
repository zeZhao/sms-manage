<template>
  <!-- 重推工具 -->
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="createTime" label="日期" min-width="150">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="手机号" show-overflow-tooltip />
      <el-table-column prop="code" label="推送类型" />
      <el-table-column prop="sign" label="推送条数" />
      <el-table-column prop="cm" label="操作人" />
      <el-table-column prop="createTime" label="操作时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="完成时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="_mxDeleteItem('routeId', scope.row.routeId)" type="text" size="small">删除</el-button>
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
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "pushToolTask",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "date",
          label: "操作时间",
          key: "sign"
        },
        {
          type: "input",
          label: "手机号",
          key: "sign"
        },
        {
          type: "select",
          label: "推送类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "报告推送"
            },
            {
              key: 2,
              value: "上行推送"
            }
          ]
        }
      ]
    };
  },
  mounted () {

  },
  activated () {
    // 重新获取数据
    this._mxGetList();
  },
  methods: {
    create () {
      this.$router.push({ name: 'rePushToolType', query: { type: 'create' } });
    }
  }
};
</script>