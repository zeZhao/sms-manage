<template>
  <!--上行信息-->
  <div class="smsMoQueue">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="账号ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="mobile" label="上行手机号" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="city" label="城市" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.type === 1
            ? "移动 "
            : scope.row.type === 2
            ? "联通 "
            : "电信"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="gateway" label="上行网关" />
      <el-table-column prop="createTime" label="上行时间">
        <template slot-scope="scope">{{scope.row.createTime | timeFormat}}</template>
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
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "账号ID",
          key: "userId",
          placeholder: "请输入账号ID"
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
          label: "上行网关",
          key: "gateway",
          placeholder: "请输入上行网关"
        },
        {
          type: "daterange",
          label: "上行时间",
          key: ["", "startTime", "endTime"],
          placeholder: "请选择上行时间"
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
          "provinceId",
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
