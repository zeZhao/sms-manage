<template>
  <div class="welinfo">
    <!-- <span
      ><img
        src="http://demo.cssmoban.com/cssthemes4/zwtp_2_gi/images/sun.png"
        alt="天气"
    /></span>
    <b>欢迎进入短信管理平台</b> -->
    <!-- <div style="background-color: rgb(24, 33, 49);width:500px;height:40px">
      <svg-icon icon-class="1" />
      <svg-icon icon-class="2" />

      <svg-icon icon-class="3" />
      <svg-icon icon-class="4" />

      <svg-icon icon-class="5" />
      <svg-icon icon-class="10" />

      <svg-icon icon-class="11" />
      <svg-icon icon-class="6" />

      <svg-icon icon-class="15" />
      <svg-icon icon-class="9" />

      <svg-icon icon-class="16" />
      <svg-icon icon-class="7" />

      <svg-icon icon-class="13" />
      <svg-icon icon-class="14" />

      <svg-icon icon-class="8" />
      <svg-icon icon-class="index" />
      <svg-icon icon-class="12" /> 
    </div> -->

    <el-row>
      <el-col :span="12" style="border-right:1px solid gray">
        <el-row>
          <el-col :span="14"><h3>运营商统计图（单位:万条）</h3></el-col>
          <el-col :span="5" :offset="4"
            ><el-select v-model="operator" @change="queryCountByOpera">
              <el-option value="0" label="本年"></el-option>
              <el-option value="1" label="本月"></el-option>
              <el-option value="2" label="本周"></el-option> </el-select
          ></el-col>
        </el-row>
        <div id="chart_operator"></div>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :offset="1" :span="14"
            ><h3>发送统计图（单位:万条）</h3></el-col
          >
          <el-col :span="5" :offset="4"
            ><el-select v-model="send" @change="querySendStaticByTime">
              <el-option value="0" label="本年"></el-option>
              <el-option value="1" label="本月"></el-option>
              <el-option value="2" label="本周"></el-option> </el-select
          ></el-col>
        </el-row>
        <div id="chart_send"></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="14"><h3>区域统计图（单位:万条）</h3></el-col>
          <el-col :span="5" :offset="5"
            ><el-select v-model="area" @change="queryCountByArea">
              <el-option value="0" label="本年"></el-option>
              <el-option value="1" label="本月"></el-option>
              <el-option value="2" label="本周"></el-option> </el-select
          ></el-col>
        </el-row>
        <div id="chart_area"></div>
      </el-col>
    </el-row>
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div slot="title" class="header-title">
        <span
          ><i
            class="el-icon-warning"
            style="color: #FF8800;font-size: 22px;"
          ></i>
        </span>
        <span>温馨提示</span>
      </div>
      <p>您的密码已经90天未更新，为了您的安全，请前往修改登录密码。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">稍后</el-button>
        <el-button
          type="primary"
          @click="
            editVisible = true;
            dialogVisible = false;
          "
          >前往修改</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="editVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form" ref="form" :rules="rulesForm" label-width="120px">
        <el-form-item label="姓名:">
          <span>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="手机号:">
          <span>{{ form.account }}</span>
        </el-form-item>
        <el-form-item label="原密码:" prop="oldPass">
          <el-input
            type="password"
            v-model="form.oldPass"
            placeholder="输入原登录密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码:" prop="newPass">
          <el-input
            type="password"
            v-model="form.newPass"
            placeholder="包含数字、大小写字母、符号中的三种，且长度在8-18位"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="pwd">
          <el-input
            type="password"
            placeholder="确认新密码"
            v-model="form.pwd"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapGetters } from "vuex";
import { isPassword } from "@/utils";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      //弹窗数据
      dialogVisible: false,

      //修改密码数据
      editVisible: false,
      rulesForm: {
        oldPass: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入必填项"));
              if (!isPassword(value)) {
                callback(
                  new Error(
                    "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                  )
                );
              }
              callback();
            }
          }
        ],
        newPass: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入必填项"));
              if (!isPassword(value)) {
                callback(
                  new Error(
                    "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                  )
                );
              }
              callback();
            }
          }
        ],
        pwd: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) callback(new Error("请输入必填项"));
              if (value !== this.form.newPass)
                callback(new Error("新密码请保持一致"));
              if (!isPassword(value)) {
                callback(
                  new Error(
                    "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                  )
                );
              }
              callback();
            }
          }
        ]
      },
      form: {
        account: "",
        name: "",
        suId: "",
        newPass: "",
        oldPass: "",
        pwd: ""
      },

      operator: "1",
      send: "1",
      area: "1",
      operatorList: [],
      sendList: [],
      areaList: [],
      operatorOption: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          bottom: 10,
          left: "center",
          data: ["移动", "联通", "电信"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "移动" },
              { value: 310, name: "联通" },
              { value: 234, name: "电信" }
            ]
          }
        ]
      },
      sendOption: {
        trigger: "axis",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true
          }
        ]
      },
      areaOption: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["status", "info"])
  },
  mounted() {
    this.querySendStaticByTime();
    this.queryCountByOpera();
    this.queryCountByArea();
    if (this.status == 0) {
      this.dialogVisible = true;
    }
    const { account, name, suId } = this.info;
    this.form.account = account;
    this.form.name = name;
    this.form.suId = suId;
    //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    // window.addEventListener("resize", function() {
    //   chartOperator.resize();
    // });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.user.addOrUpdate({ ...this.form }).then(res => {
            if (res.code === 200) {
              this.$message.success("修改成功，请重新登录!");
              this.editVisible = false;
              setTimeout(() => {
                Cookies.remove("Admin-Token");
                Cookies.remove("token");
                window.location.reload();
              }, 300);
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
      this.editVisible = false;
    },
    //发送统计
    querySendStaticByTime() {
      this.$http.sendReportStatistic
        .querySendStaticByTime({ timeId: this.send })
        .then(res => {
          // console.log(res, "---------------发送统计");
          if (res.code === 200) {
            let name = [];
            let data = [];
            res.data.forEach(item => {
              name.push(item.countDate);
              data.push(item.count);
            });
            this.sendOption.series[0].data = data;
            this.sendOption.xAxis.data = name;
            let chartOperator = echarts.init(
              document.getElementById("chart_send")
            );
            chartOperator.setOption(this.sendOption);
          }
        });
    },
    //运营商发送数量统计
    queryCountByOpera() {
      this.$http.sendReportStatistic
        .queryCountByOpera({ timeId: this.operator })
        .then(res => {
          if (res.code === 200) {
            res.data.forEach(item => {
              this.$set(item, "value", item.count);
              this.$set(
                item,
                "name",
                item.operaId === 1
                  ? "移动"
                  : item.operaId === 2
                  ? "联通"
                  : item.operaId === 3
                  ? "电信"
                  : "未知"
              );
            });
            this.operatorList = res.data;
            let operatorData = [];
            let operatorName = [];
            this.operatorList.forEach(item => {
              let obj = {
                value: item.value,
                name: item.name
              };
              operatorData.push(obj);
              operatorName.push(item.name);
            });
            this.operatorOption.series[0].data = operatorData;
            this.operatorOption.legend.data = operatorName;
            let chartOperator = echarts.init(
              document.getElementById("chart_operator")
            );
            chartOperator.setOption(this.operatorOption);
          }
        });
    },
    //区域统计
    queryCountByArea() {
      this.$http.sendReportStatistic
        .queryCountByArea({ timeId: this.area })
        .then(res => {
          // console.log(res, "---------------区域统计");
          if (res.code === 200) {
            let name = [];
            let data = [];
            res.data.forEach(item => {
              name.push(item.province);
              data.push(item.count);
            });
            this.areaOption.series[0].data = data;
            this.areaOption.xAxis[0].data = name;
            let chartOperator = echarts.init(
              document.getElementById("chart_area")
            );
            chartOperator.setOption(this.areaOption);
          }
        });
    }
  },
  watch: {},
  created() {}
};
</script>

<style scoped>
.welinfo {
  background: #fff;
  padding: 24px;
}
#chart_operator,
#chart_send {
  display: block;
  width: 100%;
  height: 300px;
  margin: 0 auto;
}
#chart_area {
  display: block;
  width: 100%;
  height: 400px;
  margin: 0 auto;
}
</style>
