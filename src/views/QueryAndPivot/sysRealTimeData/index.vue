<template>
  <!--实时数据查询-->
  <div class="userDailyBill">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="gateway" label="通道编号" />
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
import { getDateToString } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "sysRealTimeData",
        list: "realTimeData"
      },
      // 列表参数
      namespace: "",
      // isParamsNotData: true,
      //搜索框数据
      searchParam: {
        userId: "",
        code: "",
        gateway: ""
      },
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
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
          placeholder: "请选择省份"
        },
        {
          type: "daterange",
          label: "统计日期",
          key: ["", "countDate", "endDate"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ],
      ProvinceList: []
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
        this.ProvinceList = res.data;
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
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      console.log(rows, "------------");
      if (rows) {
        rows = [rows];
        let str = "";
        if (this.searchParam.province) {
          this.ProvinceList.forEach(item => {
            if (item.provinceName === this.searchParam.province) {
              str = item.provinceName;
            }
          });
          this.searchParam.provinceName = str;
        }
        rows.forEach(item => {
          item.userId = this.searchParam.userId;
          item.code = this.searchParam.code;
          item.gateway = this.searchParam.gateway;
          item.provinceName = str;
        });
        rows = [Object.assign(rows[0], this.searchParam)];
      }

      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
