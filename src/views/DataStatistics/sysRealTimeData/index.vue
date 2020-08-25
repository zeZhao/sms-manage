<template>
  <!--实时数据查询-->
  <div class="userDailyBill">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="sendNum" label="发送数" />
      <el-table-column prop="reportNum" label="返回报告数" />
      <el-table-column prop="successNum" label="成功数" />
      <el-table-column prop="failNum" label="失败数" />
      <el-table-column prop="unknownNum" label="未知数" />
      <el-table-column prop="provinceName" label="省份" />
    </el-table>
    <!-- <p
      style="color:red"
    >用户总发送条数: {{statistics.sendNum}}&nbsp;&nbsp;用户总成功条数: {{statistics.successNum}}&nbsp;&nbsp;用户总成功率: {{statistics.successRate}}%&nbsp;&nbsp;用户总失败条数: {{statistics.failNum}}&nbsp;&nbsp;用户总失败率: {{statistics.failRate}}%&nbsp;&nbsp;用户总未知条数: {{statistics.unknownNum}}&nbsp;&nbsp;用户总未知率: {{statistics.unknownRate}}%</p>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>-->
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
        namespace: "sysRealTimeData",
        list: "realTimeData",
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号",
        },
        {
          type: "input",
          label: "网关",
          key: "gateway",
          placeholder: "请输入网关",
        },
        // {
        //   type: "input",
        //   label: "省份",
        //   key: "provinceName",
        // },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: [],
          placeholder: "请选择省份",
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"],
        },
      ],
      ProvinceList: [],
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
          provinceName: "",
        },
      };
      this.$http.listSysProvince(params).then((res) => {
        this.ProvinceList = res.data;
        this.searchFormConfig.forEach((item) => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach((t) => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName,
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { countDate, endDate } = data;
      if (countDate) {
        data.countDate = new Date(countDate).Format("yyyy-MM-dd");
      }
      if (endDate) {
        data.endDate = new Date(endDate).Format("yyyy-MM-dd");
      }
      return data;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
