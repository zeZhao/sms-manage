<template>
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="createOrEdit('add')"
    ></Search>
    <el-table
      :data="listData"
      border
      max-height="500"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column prop="gatewayId" label="通道编号" />
      <el-table-column prop="name" label="通道名称" />
      <el-table-column prop="price" label="通道单价(分)" />
      <el-table-column prop="operator" label="支持运营商">
        <template slot-scope="scope">
          {{ renderOperator(scope.row.operator) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可用">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "可用" : "不可用" }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="createOrEdit('edit', scope.row.gatewayId)"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            @click="handleIsDisable(1, scope.row.gatewayId)"
            type="text"
            size="small"
            >启用</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            @click="handleIsDisable(0, scope.row.gatewayId)"
            type="text"
            size="small"
            style="color: #f56c6c"
            >禁用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    return {
      // 接口地址
      searchAPI: {
        namespace: "mmsGateway",
        list: "listMmsGatewayByPage"
      },
      // 列表参数
      namespace: "mmsGateway",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId"
        },
        {
          type: "input",
          label: "通道名称",
          key: "name"
        },
        {
          type: "select",
          label: "通道状态",
          key: "status",
          optionData: [
            {
              key: 1,
              value: "可用"
            },
            {
              key: 0,
              value: "不可用"
            }
          ]
        },
        {
          type: "select",
          label: "运营商",
          key: "operator",
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            }
          ]
        }
      ]
    };
  },
  activated() {
    this._mxGetList();
  },
  methods: {
    //创建或修改的页面跳转
    createOrEdit(type, gatewayId) {
      this.$router.push({ name: "MMSchannelType", query: { type, gatewayId } });
    },
    //启用/禁用通道
    handleIsDisable(status, gatewayId) {
      if (status === 1) {
        this.setStatus(status, gatewayId);
        return;
      }
      this.$confirm("禁用后所有通过此通道模板全部不可发送彩信", "禁用通道", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setStatus(status, gatewayId);
        })
        .catch(() => {});
    },
    setStatus(status, gatewayId) {
      const params = { data: { status, gatewayId } };
      this.$http.mmsGateway.setMmsGatewayStatus(params).then(res => {
        if (res.code === 200) {
          this._mxGetList();
          this.$message.success(status === 1 ? "启用成功" : "禁用成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    renderOperator(v) {
      if (v === 0) {
        return "三网";
      } else if (v === 1) {
        return "移动";
      } else if (v === 2) {
        return "联通";
      } else if (v === 3) {
        return "电信";
      } else if (v === 4) {
        return "移动、联通";
      } else if (v === 5) {
        return "移动、电信";
      } else if (v === 6) {
        return "联通、电信";
      }
    }
  }
};
</script>
