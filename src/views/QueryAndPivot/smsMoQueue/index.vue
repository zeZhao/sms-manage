<template>
  <!--上行信息-->
  <div class="smsMoQueue">
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
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账号编号" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="mobile" label="上行手机号" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === 1">移动</span>
          <span v-if="scope.row.operaId === 2">联通</span>
          <span v-if="scope.row.operaId === 3">电信</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="gateway" label="上行通道" />
      <el-table-column prop="createTime" label="上行时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 0 ? "初始 " : "已处理" }}</span>
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
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账号编号",
          key: "userId",
          placeholder: "请输入账号编号"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "上行手机号",
          key: "mobile",
          placeholder: "请输入上行手机号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "上行通道",
          key: "gateway",
          placeholder: "请输入上行通道"
        },

        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: [],
          placeholder: "请选择省份"
        },
        {
          type: "input",
          label: "城市",
          key: "city",
          placeholder: "请输入城市"
        },
        {
          type: "daterange",
          label: "上行时间",
          key: ["", "startTime", "endTime"]
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
        //province
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "province",
          "provinceName",
          "provinceName"
        );
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsMoQueue {
}
</style>
