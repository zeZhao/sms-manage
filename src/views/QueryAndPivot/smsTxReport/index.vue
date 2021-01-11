<template>
  <!--发送报告-->
  <div class="smsTxReport">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <el-table-column prop="code" label="特服号" show-overflow-tooltip />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="mobile" label="手机号" show-overflow-tooltip />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>{{
            scope.row.operaId == 1
              ? "移动"
              : scope.row.operaId == 2
              ? "联通 "
              : scope.row.operaId == 3
              ? "电信"
              : scope.row.operaId == 4
              ? "国际"
              : scope.row.operaId == 0
              ? "非法"
              : ""
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendTime" label="发送时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="platformTaking"
        label="平台耗时:秒"
        show-overflow-tooltip
      />
      <el-table-column prop="seqId" label="SEQID" show-overflow-tooltip />
      <el-table-column prop="cid" label="CID" show-overflow-tooltip />
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
      //接口地址
      searchAPI: {
        namespace: "smsTxReport",
        list: "searchSendReport"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "input",
          label: "网关编号",
          key: "gateway",
          placeholder: "请输入网关编号"
        },
        {
          type: "input",
          label: "SEQID",
          key: "seqId",
          placeholder: "请输入SEQID"
        },
        {
          type: "input",
          label: "状态",
          key: "status",
          placeholder: "请输入状态"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID"
        },

        {
          type: "select",
          label: "省份",
          key: "province",
          placeholder: "请选择省份",
          optionData: []
        },
        {
          type: "timerange",
          label: "发送时间",
          key: ["", "startTime", "endTime"]
        },
        {
          type: "date",
          label: "发送日期",
          key: "sendTime",
          placeholder: "发送日期"
        }
      ]
    };
  },
  mounted() {
    this.listSysProvince();
  },
  computed: {},
  methods: {
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
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceName,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },

    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.sendTime) {
        data.sendTime = new Date(data.sendTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsTxReport {
}
</style>
