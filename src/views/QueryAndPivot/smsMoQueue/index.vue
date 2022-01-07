<template>
  <!--上行信息-->
  <div>
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      @exportData="exportData"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="exportExe"
          >导出</el-button
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
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column
        prop="content"
        label="内容"
        width="310"
        v-if="searchParam.showDecrypt === 1"
      />
      <el-table-column
        prop="mobile"
        label="上行手机号"
        width="100"
        v-if="searchParam.showDecrypt === 1"
      />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === 1">移动</span>
          <span v-if="scope.row.operaId === 2">联通</span>
          <span v-if="scope.row.operaId === 3">电信</span>
        </template>
      </el-table-column>

      <el-table-column prop="gateway" label="上行通道" />
      <el-table-column prop="createTime" label="上行时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status == "1" ? "已推送" : "未推送" }}</span>
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
import { getDateToString } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "smsMoQueue",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "moQueue",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "inputNum",
          label: "特服号",
          key: "code"
        },
        {
          type: "inputNum",
          label: "上行手机号",
          key: "mobile"
        },
        // {
        //   type: "input",
        //   label: "内容",
        //   key: "content"
        // },
        {
          type: "inputNum",
          label: "上行通道",
          key: "gateway"
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: []
        },
        {
          type: "input",
          label: "城市",
          key: "city"
        },
        {
          type: "select",
          label: "显示内容",
          key: "showDecrypt",
          defaultValue: -1,
          optionData: [
            {
              key: 1,
              value: "显示"
            },
            {
              key: -1,
              value: "不显示"
            }
          ]
        },
        {
          type: "daterange",
          label: "上行时间",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ]
    };
  },
  mounted() {
    this.listSysProvince();
  },
  methods: {
    //导出
    exportData(data) {
      this.$axios.post("/smsMoQueue/exportSmsMoQueue ", data).then(res => {
        if (res.data.code === 200) this.$exportToast();
      });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    /*
     * 获取省份列表
     * */
    listSysProvince() {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "province",
          "provinceName",
          "provinceName"
        );
      });
    }
  }
};
</script>
