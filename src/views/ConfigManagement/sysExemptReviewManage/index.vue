<template>
  <!--免审管理-->
  <div class="sysExemptReviewManage">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="exemptReviewType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.exemptReviewType === 1 ? "特服号" : (scope.row.exemptReviewType === 2 ? "客户ID" :'企业ID') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cmPassageway" label="移动通道" />
      <el-table-column prop="cuPassageway" label="联通通道" />
      <el-table-column prop="ctPassageway" label="电信通道" />
      <el-table-column prop="exemptReviewNum" label="免审数量" />
      <el-table-column prop="isTemplate" label="模板匹配">
        <template slot-scope="scope">
          <span>{{ scope.row.isTemplate===true ? "需要" :'不需要' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isParallelDetection" label="是否并行检测">
        <template slot-scope="scope">
          <span>{{ scope.row.isParallelDetection ? "是" : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="修改人" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'exemptId')" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('exemptId',scope.row.exemptId)"
            type="text"
            size="small"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancel"></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "sysExemptReviewManage",
        list: "listExemptReviewManageByPage",
        detele: "deleteExemptReviewManage",
        add: "addExemptReviewManage",
        edit: "updateExemptReviewManage"
      },
      // 列表参数
      namespace: "",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名",
          key: "userName",
          placeholder: "请输入用户名"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          optionData: [
            {
              key: "1",
              value: "特服号"
            },
            {
              key: "2",
              value: "客户ID"
            },
            {
              key: "3",
              value: "企业ID"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "免审类型",
          key: "type",
          optionData: [
            {
              key: "1",
              value: "短信"
            }
          ],
          placeholder: "请选择免审类型"
        },
        {
          type: "input",
          label: "移动通道编号",
          key: "ctPassageway",
          placeholder: "请输入移动通道编号"
        },
        {
          type: "input",
          label: "联通通道编号",
          key: "cuPassageway",
          placeholder: "请输入联通通道编号"
        },
        {
          type: "input",
          label: "电信通道编号",
          key: "cmPassageway",
          placeholder: "请输入电信通道编号"
        },
        {
          type: "select",
          label: "是否并行检测",
          key: "isSarallelDetection",
          optionData: [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ],
          placeholder: "请选择是否并行检测"
        },
        {
          type: "select",
          label: "关键字类别",
          key: "sensitiveWord",
          optionData: [],
          placeholder: "请选择关键字类别"
        },
        {
          type: "select",
          label: "特殊需求",
          key: "specialNeeds",
          optionData: [
            {
              key: "扩展位数",
              value: "扩展位数"
            },
            {
              key: "显示号码",
              value: "显示号码"
            },
            {
              key: "特殊内容",
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "客户ID"
            },
            {
              key: 3,
              value: "企业ID"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cmPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选移动通道",
        //   multiple: true,
        //   key: "spareCmPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "联通通道",
          key: "cuPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选联通通道",
        //   multiple: true,
        //   key: "spareCuPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ctPassageway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选电信通道",
        //   multiple: true,
        //   key: "spareCtPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "checkbox",
          label: "关键字类别",
          defaultValue: [],
          optionData: [],
          key: "sensitiveWord"
        },
        {
          type: "input",
          label: "免审数量",
          key: "exemptReviewNum",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否需要模板",
          optionData: [
            {
              key: "1",
              value: "需要"
            },
            {
              key: "0",
              value: "不需要"
            }
          ],
          key: "isTemplate"
        },
        {
          type: "select",
          label: "是否检测并行",
          initDefaultValue: "0",
          defaultValue: "0",
          optionData: [
            {
              key: "1",
              value: "是"
            },
            {
              key: "0",
              value: "否"
            }
          ],
          key: "isParallelDetection",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否组合长信息",
          initDefaultValue: "0",
          defaultValue: "0",
          optionData: [
            {
              key: "1",
              value: "是"
            },
            {
              key: "0",
              value: "否"
            }
          ],
          key: "isCombination",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "特殊需求",
          key: "specialNeeds",
          optionData: [
            {
              key: "扩展位数",
              value: "扩展位数"
            },
            {
              key: "显示号码",
              value: "显示号码"
            },
            {
              key: "特殊内容",
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remarks"
        }
      ],
      GatewayList: [], // 通道列表
      isChooseUser: false //选择用户
    };
  },
  mounted() {
    this.gateway("cuPassageway", "1", "", "");
    this.gateway("ctPassageway", "", "1", "");
    this.gateway("cmPassageway", "", "", "1");
    this.getSensitiveWordGroup();
  },
  computed: {},
  methods: {
    //显示选择用户弹窗
    choose() {
      this.isChooseUser = true;
    },
    //关闭选择用户弹窗
    cancel(val) {
      this.isChooseUser = val;
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    //获取敏感词组
    getSensitiveWordGroup() {
      this.$http.sysSensitiveWordGroup.listSensitiveWordGroup().then(res => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "sensitiveWord",
          "groupId",
          "groupName"
        );
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "sensitiveWord",
          "groupId",
          "groupName"
        );
        // this.formConfig.map(item => {
        //   if (item.key === "sensitiveWord") {
        //     res.data.forEach(t => {
        //       item.defaultValue.push(t.groupName);
        //     });
        //   }
        // });
      });
      // console.log(this.formConfig, "111111111111");
    },
    /*
     * 获取通道列表
     * */
    gateway(keys, isCu, isCt, isCm) {
      const params = {
        data: {
          gatewayName: "",
          isCu: isCu,
          isCt: isCt,
          isCm: isCm
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", `${t.gateway}_${t.gatewayName}`);
              item.optionData.push(t);
            });
          }
          //20000
        });
      });
    },
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (key === "isParallelDetection" || key === "isTemplate") {
          if (row[key]) {
            row[key] = "1";
          } else {
            row[key] = "0";
          }
        }
      }
      return row;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      for (let key in formData) {
        if (key === "sensitiveWord") {
          formData[key] = formData[key].join(",");
        }
      }
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysExemptReviewManage {
}
</style>
