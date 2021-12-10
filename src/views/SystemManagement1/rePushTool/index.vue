<template>
  <!-- 重推工具 -->
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>

    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="startTime" label="日期" min-width="300">
        <template slot-scope="scope">
          {{scope.row.startTime | timeFormat}}~{{scope.row.endTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" show-overflow-tooltip />
      <el-table-column prop="pushType" label="推送类型">
        <template slot-scope="scope">{{ scope.row.pushType === 1 ? "报告推送" : "上行推送" }}</template>
      </el-table-column>
      <el-table-column prop="pushNumber" label="推送条数" />
      <el-table-column prop="createUser" label="操作人" />
      <el-table-column prop="createTime" label="操作时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="完成时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskStatus === 1" type="text" size="small">列队中</el-button>
          <el-button v-if="scope.row.taskStatus === 2" type="text" size="small">推送中…</el-button>
          <el-button v-if="scope.row.taskStatus === 3" type="text" size="small">推送完成</el-button>
          <el-button v-if="scope.row.taskStatus === 4" type="text" size="small" style="color: #D9001B">推送失败</el-button>
          <el-button v-if="scope.row.taskStatus === 5" type="text" size="small" style="color: #999999">已取消</el-button>
          <el-button v-if="scope.row.taskStatus === 1" type="text" size="small" @click="cancel(scope.row.id)">取消
          </el-button>
          <el-button v-if="scope.row.taskStatus === 4 || scope.row.taskStatus === 5" type="text" size="small"
            @click="_mxDeleteItem('id', scope.row.id, false, false, '删除后将不可找回，请谨慎操作。')">删除
          </el-button>
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
        list: "queryByPage",
        detele: "delete"
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
          key: "createTime"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "select",
          label: "推送类型",
          key: "pushType",
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
    this._mxGetList();
  },
  activated () {
    // 重新获取数据
    this._mxGetList();
  },
  methods: {
    create () {
      this.$router.push({ name: 'rePushToolType', query: { type: 'create' } });
    },
    // 取消队列中-操作
    cancel (id) {
      this.$confirm('是否取消此列队中的任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.pushToolTask.updateStatus({ id }).then(res => {
          this.$message.success(res.data || res.msg);
          this._mxGetList();
        })
      }).catch(() => { });
    }
  }
};
</script>