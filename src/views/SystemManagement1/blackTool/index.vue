<template>
  <!-- 黑名单工具 -->
  <div class="blackTool">
    <Search
      :searchFormConfig="searchFormConfig"
      :add="false"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template slot="Other">
        <el-button type="primary" @click="Import">导入</el-button>
      </template>
    </Search>

    <el-table
      :data="listData"
      :height="tableHeight"
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userids" label="账户编号" />
      <el-table-column prop="count" label="转入条数" />
      <el-table-column prop="createUser" label="操作人" />
      <el-table-column prop="createTime" label="操作时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" fixed="right">
        <template>
          <el-button type="text" size="small">导入完成</el-button>
          <!-- <el-button v-if="scope.row.taskStatus === 2" type="text" size="small"
            >导入失败</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>

    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      title="转入"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <el-form
        :model="formData"
        :rules="ruleForm"
        ref="form"
        label-width="80px"
      >
        <el-form-item label="账户编号" prop="userId">
          <el-input
            v-model.trim="formData.userId"
            placeholder="请输入账户编号，多个用英文都还隔开"
            type="textarea"
          ></el-input>
        </el-form-item>
        <p
          v-show="noUserNum"
          style="color:#aaaaaa;padding-left: 80px;margin-top: -16px;"
        >
          中转库中共有{{ noUserNum }}个账户级黑名单
        </p>
        <p
          v-show="noUserList"
          style="color:red;padding-left: 80px;line-height:0"
        >
          中转库中无{{ noUserList }}账户编号，请重新输入
        </p>
        <el-form-item style="text-align: right;">
          <el-button @click="numShow('form')">数量显示</el-button>
          <el-button @click="addChannel = false">取消</el-button>
          <el-button type="primary" @click="shiftToSubmit('form')"
            >确定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="转入结果"
      width="80%"
      :visible.sync="visibleResults"
      :close-on-click-modal="false"
      top="45px"
    >
      <div class="results">
        <p class="results_head">
          <span style="vertical-align: bottom;"></span>
          <span v-for="item in resultsHead" :key="item">{{ item }}</span>
        </p>
        <p class="results_cnt">
          <span>成功数</span>
          <span v-for="(item, index) in resultsCnt" :key="index">{{
            item
          }}</span>
        </p>
      </div>
      <div style="text-align: right;margin-top: 16px;">
        <el-button type="primary" @click="visibleResults = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
const validateBlackNum = (rule, value, callback) => {
  if (value) {
    if (value.split(",").length > 10) {
      callback(new Error("账户编号不能超过10个~"));
    } else {
      callback();
    }
  } else {
    callback(new Error("请输入账户编号"));
  }
};
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "sysBlacklist",
        list: "queryTaskByPage",
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
          key: "userids"
        },
        {
          type: "date",
          label: "操作时间",
          key: "createTime"
        }
      ],
      formData: { userId: "" },
      ruleForm: {
        userId: [
          {
            required: true,
            trigger: ["change", "blur"],
            // message: "请输入账户编号"
            validator: validateBlackNum
          }
        ]
      },
      //转入结果
      visibleResults: false,
      //中转库中数据的条数
      noUserNum: 0,
      //中转库中没有的数据
      noUserList: 0,
      //导出结果表头
      resultsHead: [],
      //导出结果内容
      resultsCnt: []
    };
  },
  mounted() {
    this._mxGetList();
  },
  activated() {
    // 重新获取数据
    this._mxGetList();
  },
  methods: {
    shiftToSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.sysBlacklist
            .addSmartUserBlackToSms({ userIds: this.formData.userId })
            .then(res => {
              //账户编号不存在
              if (res.code === 1099) {
                this.noUserList = res.data.join("，");
              } else if (res.code === 200) {
                this.$message.success("转入成功！");
                this.resultsHead = Object.keys(res.data);
                this.resultsCnt = Object.values(res.data);
                this.visibleResults = true;
                // this.noUserNum = res.data.mobileCount;
                // this.noUserList = res.data.userId.join("，");
              } else {
                this.$message.error(res.data);
              }
              console.log(res, "--------res");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    numShow(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.sysBlacklist
            .queryBlackCountAndUserId({ userIds: this.formData.userId })
            .then(res => {
              if (res.code === 200) {
                this.noUserNum = res.data.mobileCount;
                this.noUserList = res.data.userId.join("，");
              } else {
                this.$message.error(res.data);
              }
              console.log(res, "--------res");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    Import() {
      this.addChannel = true;
    },
    cancelAddChannel() {
      this.addChannel = false;
    }
  }
};
</script>
<style scoped lang="scss">
.blackTool {
  .results {
    span {
      display: inline-block;
      width: 100px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid;
    }
    .results_head,
    .results_cnt {
      display: flex;
      margin: 0;
    }
  }
}
</style>
