<template>
  <!--免审管理-->
  <div class="sysExemptReviewManage">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      @exportData="exportData"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="batchModification"
          >批量修改</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="$refs.Search.handleExport()"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <!-- <el-table-column prop="exemptReviewType" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.exemptReviewType === 1
              ? "特服号"
              : scope.row.exemptReviewType === 2
              ? "账户编号"
              : "商户编号"
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="cmPassageway" label="移动通道" />
      <el-table-column prop="cuPassageway" label="联通通道" />
      <el-table-column prop="ctPassageway" label="电信通道" />
      <el-table-column prop="exemptReviewNum" label="免审数量" />
      <el-table-column prop="isTemplate" label="模板匹配">
        <template slot-scope="scope">
          <span v-if="scope.row.isTemplate === 0 || !scope.row.isTemplate"
            >不需要</span
          >
          <span v-if="scope.row.isTemplate === 1 || scope.row.isTemplate"
            >需要</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="isParallelDetection" label="并行检测" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.isParallelDetection ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="isLoss" label="是否亏损">
        <template slot-scope="scope">
          <span>{{ scope.row.isGatewayGroup === 0 ? (scope.row.isLoss == "1" ? "是" : "否") : '-' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="createBy" label="创建人" />
      <!-- <el-table-column prop="isadvice" label="配置方式">
        <template slot-scope="scope">
          <span v-if="!scope.row.isadvice">自定义</span>
          <span v-else-if="scope.row.isadvice">系统推荐</span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="updateBy" label="修改人" />
      <el-table-column prop="updateTime" label="修改时间" width="135">
        <template slot-scope="scope">{{
          scope.row.updateTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'exemptId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('exemptId', scope.row.exemptId)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-drawer
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-press-escape="false"
      :wrapperClosable="false"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @selectChange="selectChange"
        @onChange="onChange"
      ></FormItem>
    </el-drawer>
    <!-- <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @selectChange="selectChange"
        @onChange="onChange"
      ></FormItem>
    </el-dialog> -->
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancel"
    ></ChooseUser>
    <BatchModification
      :isOpen="isOpen"
      :title="title"
      @submit="batchSubmit"
      @cancel="cancelBatch"
    ></BatchModification>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data() {
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        callback();
        // callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
        } else {
          callback();
        }
      }
    };
    const validatorNum = (rule, value, callback) => {
      console.log(Number(value));
      if (Number(value) > 5000) {
        callback(new Error("免审数量不能超出5000"));
      } else {
        callback();
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "sysExemptReviewManage",
        list: "listExemptReviewManageByPage",
        detele: "deleteExemptReviewManage",
        add: "addExemptReviewManage",
        edit: "updateExemptReviewManage",
        exportUrl: "/sysExemptReviewManage/exportExemptReviewManage",
        fileName: "免审配置"
      },
      // 列表参数
      namespace: "",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "exemptReviewType",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "特服号"
        //     },
        //     {
        //       key: "2",
        //       value: "账户编号"
        //     },
        //     {
        //       key: "3",
        //       value: "商户编号"
        //     }
        //   ],
        //   placeholder: "请选择类型"
        // },
        // {
        //   type: "select",
        //   label: "免审类型",
        //   key: "type",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "短信"
        //     }
        //   ],
        //   placeholder: "请选择免审类型"
        // },
        {
          type: "select",
          label: "移动通道",
          key: "cmPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "联通通道",
          key: "cuPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "电信通道",
          key: "ctPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "查询类型",
          key: "isGatewayGroup",
          optionData: [
            {
              key: "1",
              value: "通道组"
            },
            {
              key: "0",
              value: "非通道组"
            }
          ],
          placeholder: "请选择查询类型"
        },
        {
          type: "select",
          label: "并行检测",
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
          placeholder: "请选择并行检测"
        },
        // {
        //   type: "select",
        //   label: "是否亏损",
        //   key: "isLoss",
        //   optionData: [
        //     {
        //       key: "",
        //       value: "全部"
        //     },
        //     {
        //       key: "0",
        //       value: "否"
        //     },
        //     {
        //       key: "1",
        //       value: "是"
        //     }
        //   ]
        // },
        {
          type: "select",
          label: "敏感词类别",
          key: "sensitiveWord",
          optionData: [],
          placeholder: "请选择敏感词类别"
        },
        {
          type: "checkbox",
          label: "特殊需求",
          key: "isSpecials",
          defaultValue: [],
          optionData: [
            {
              key: "1",
              value: "扩展位数"
            },
            {
              key: "2",
              value: "显示号码"
            },
            {
              key: "4",
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        }
        // {
        //   type: "select",
        //   label: "配置方式",
        //   key: "configuration",
        //   optionData: [
        //     {
        //       key: "",
        //       value: "全部"
        //     },
        //     {
        //       key: "0",
        //       value: "自定义"
        //     },
        //     {
        //       key: "1",
        //       value: "系统推荐"
        //     }
        //   ]
        // }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          // change: this.selectUser,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },

        {
          type: "input",
          label: "特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "input",
          label: "单价",
          key: "cardUnit",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            // {
            //   key: 1,
            //   value: "特服号"
            // },
            {
              key: 2,
              value: "账户编号"
            },
            {
              key: 3,
              value: "商户编号"
            }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "radio",
          label: "通道排序",
          key: "",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "按价格排序" },
            { key: 2, value: "按通道号排序" },
            { key: 3, value: "按通道名称排序" }
          ]
          // rules: [
          //   {
          //     required: true,
          //     message: "请输入必填项",
          //     trigger: ["blur", "change"]
          //   }
          // ]
        },
        {
          type: "selectGroup",
          label: "移动通道",
          key: "cmPassageway",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "备选移动通道",
        //   multiple: true,
        //   key: "spareCmPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "selectGroup",
          label: "联通通道",
          key: "cuPassageway",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "备选联通通道",
        //   multiple: true,
        //   key: "spareCuPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "selectGroup",
          label: "电信通道",
          optionData: [],
          key: "ctPassageway",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "备选电信通道",
        //   multiple: true,
        //   key: "spareCtPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        // {
        //   type: "select",
        //   label: "是否包含通道组",
        //   key: "isGatewayGroup",
        //   disabled: true,
        //   optionData: [
        //     {
        //       key: "0",
        //       value: "否"
        //     },
        //     {
        //       key: "1",
        //       value: "是"
        //     }
        //   ]
        //   // isShow: true
        // },
        {
          type: "input",
          label: "免审数量",
          key: "exemptReviewNum",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              pattern: /^\+?[1-9]\d*$/,
              message: "请输入大于0的正整数",
              trigger: ["blur", "change"]
            },
            {
              validator: validatorNum,
              trigger: ["blur", "change"]
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "组合长信息",
        //   initDefaultValue: "0",
        //   defaultValue: "0",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "是"
        //     },
        //     {
        //       key: "0",
        //       value: "否"
        //     }
        //   ],
        //   key: "isCombination",
        //   rules: [
        //     {
        //       required: true,
        //       message: "请输入必填项",
        //       trigger: ["blur", "change"]
        //     }
        //   ]
        // },
        {
          type: "select",
          label: "需要模板",
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
          key: "isTemplate",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },

        {
          type: "select",
          label: "拦截处理方式",
          key: "unqualifiedsms",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            {
              key: 2,
              value: "返回失败"
            },
            {
              key: 1,
              value: "人工审核"
            }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "并行检测",
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
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "checkbox",
          label: "特殊需求",
          key: "isSpecials",
          initDefaultValue: [],
          defaultValue: [],
          optionData: [
            {
              key: 1,
              value: "扩展位数"
            },
            {
              key: 2,
              value: "显示号码"
            },
            {
              key: 4,
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        },
        {
          type: "checkbox",
          label: "敏感词组",
          initDefaultValue: [],
          defaultValue: [],
          optionData: [],
          key: "sensitiveWord"
        }
        // {
        //   type: "textarea",
        //   label: "备注信息",
        //   maxlength: 300,
        //   key: "remarks",
        //   placeholder: "备注信息不能超过300字"
        //   // rules: [{ trigger: ['blur', 'change'], validator: validatorRemark }]
        // }
      ],
      GatewayList: [], // 通道列表
      isChooseUser: false, //选择用户
      isGatewayGroup: "0", // 是否包含通道组
      isOpen: false,
      title: "批量修改通道"
    };
  },
  mounted() {
    this.gateway("cmPassageway", "1", "1");
    this.gateway("cuPassageway", "2", "1");
    this.gateway("ctPassageway", "3", "1");
    this.getSensitiveWordGroup();
  },
  activated() {
    //重新获取数据
    this._mxGetList();
    this.getSensitiveWordGroup();
  },
  methods: {
    exportData(form) {
      this.$axios
        .post("/sysExemptReviewManage/exportExemptReviewManage", {
          data: { ...form }
        })
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
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
        this.$nextTick(() => {
          this.formConfig.forEach(item => {
            if (item.key === "sensitiveWord") {
              item.initDefaultValue = [];
              res.data.forEach(t => {
                item.initDefaultValue.push(t.groupId);
                // item.defaultValue.push(t.groupId);
              });
              //initDefaultValue
            }
          });
        });
      });
    },
    //提交批量修改
    batchSubmit(form) {
      this.$http.sysExemptReviewManage
        .batchUpdateExemptReviewManage(form)
        .then(res => {
          if (res.code === 200) {
            this.isOpen = false;
            this.$message.success("修改成功");
            this._mxGetList();
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    //关闭弹窗
    cancelBatch() {
      this.isOpen = false;
    },
    //批量修改
    batchModification() {
      this.isOpen = true;
    },
    /*
      status	string
      运营商 1.移动 2.联通 3.电信
      orderStatus	string
      排序字段 1.单价 2.网关号 3.网关名
      */
    listRecommendGatewayAndGroup(operator, orderStatus, userId) {
      let recommend = [];
      let noRecommend = [];
      let status = 1;
      if (operator === "cmPassageway") {
        status = 1;
      } else if (operator === "cuPassageway") {
        status = 2;
      } else if (operator === "ctPassageway") {
        status = 3;
      }
      let params = {
        orderStatus: orderStatus,
        status: status,
        userId: userId
      };
      this.$http.sysExemptReviewManage
        .listRecommendGatewayAndGroup(params)
        .then(res => {
          if (res.code === 200) {
            res.data.recommendGatewayAndGroupList.forEach(t => {
              let obj = {
                key: t.id,
                value: t.name
              };
              recommend.push(obj);
            });
            res.data.notRecommendGatewayAndGroupList.forEach(t => {
              let obj = {
                key: t.id,
                value: t.name
              };
              noRecommend.push(obj);
            });
            this.setGateway(operator, recommend, noRecommend);
          }
        });
    },
    setGateway(keys, systemGateway, gateway) {
      this.formConfig.forEach(item => {
        const { key } = item;
        if (key == keys) {
          let options = [
            { label: "系统推荐:", options: systemGateway },
            { label: "", options: gateway }
          ];
          item.optionData = options;
        }
      });
    },
    // 单选通道排序操作
    onChange({ val, item }) {
      console.log(val, item);

      if (item.label === "通道排序") {
        this.formConfig.forEach(item => {
          if (item.key === "userId") {
            this.listRecommendGatewayAndGroup(
              "cmPassageway",
              val,
              item.defaultValue
            );
            this.listRecommendGatewayAndGroup(
              "cuPassageway",
              val,
              item.defaultValue
            );
            this.listRecommendGatewayAndGroup(
              "ctPassageway",
              val,
              item.defaultValue
            );
          }
        });
      }
    },
    selectChange({ val, item }) {
      const { key, optionData } = item;
      if (
        key === "cuPassageway" ||
        key === "ctPassageway" ||
        key === "cmPassageway"
      ) {
        console.log(optionData, "------------optionData");
        optionData.forEach(el => {
          el.options.forEach(t => {
            if (t.key === val) {
              if (t.status === "1") {
                this.formConfig.forEach(item => {
                  if (item.key === "isGatewayGroup") {
                    item.defaultValue = "0";
                  }
                });
                this.isGatewayGroup = "0";
              } else {
                this.formConfig.forEach(item => {
                  if (item.key === "isGatewayGroup") {
                    item.defaultValue = "1";
                  }
                });
                this.isGatewayGroup = "1";
              }
            }
          });
        });
        // optionData[1].options
      }
      if (key === "sensitiveWord") {
        console.log(item, "------------------item");
        console.log(val, "------------------val");
      }
    },
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
        const { key, label } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
        if (key === "cardUnit") {
          // t.defaultValue = data.cardUnit;
          t.defaultValue =
            data.cardUnit && data.cardUnit !== "-" ? data.cardUnit : 0;
        }
        if (label === "通道排序") {
          data.sort = t.defaultValue;
        }
      });
      let sort = data.sort ? data.sort : 1;
      this.listRecommendGatewayAndGroup("cmPassageway", sort, data.userId);
      this.listRecommendGatewayAndGroup("cuPassageway", sort, data.userId);
      this.listRecommendGatewayAndGroup("ctPassageway", sort, data.userId);
    },
    /*
     * 获取通道列表
     * */
    gateway(keys, status, orderStatus) {
      const params = {
        data: {
          status: status,
          orderStatus: orderStatus
        }
      };
      this.$http.sysGatewayGroup.listGatewayAndGroup(params).then(res => {
        this.GatewayList = res.data;
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            item.optionData = [];
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.id);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      let obj = Object.assign({}, row);
      for (let key in obj) {
        if (
          key === "isParallelDetection" ||
          key === "isTemplate" ||
          key === "isCombination" ||
          key === "isGatewayGroup"
        ) {
          if (obj[key]) {
            obj[key] = "1";
          } else {
            obj[key] = "0";
          }
        }
        if (key === "isGatewayGroup") {
          if (Number(obj["exemptId"]) > 9000) {
            obj[key] = "1";
          } else {
            obj[key] = "0";
          }
        }
        if (key === "sensitiveWord") {
          if (obj.hasOwnProperty("sensitiveWord")) {
            if (
              typeof obj[key] === "string" &&
              obj[key] &&
              obj[key] !== "-" &&
              obj[key] != null
            ) {
              obj[key] = obj[key].split(",").map(item => {
                return Number(item);
              });
            } else {
              obj[key] = [];
            }
          } else {
            obj[key] = [];
          }
        }
      }
      return obj;
    },
    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      // this.$router.push({
      //   name: "sysExemptReviewManageType",
      //   query: { type: "create" }
      // });
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig[0].btnDisabled = false;
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      // this.$router.push({
      //   name: "sysExemptReviewManageType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "userId") {
          item.btnDisabled = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.listRecommendGatewayAndGroup("cmPassageway", "1", row.userId);
      this.listRecommendGatewayAndGroup("cuPassageway", "1", row.userId);
      this.listRecommendGatewayAndGroup("ctPassageway", "1", row.userId);
      this.addChannel = true;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      for (let key in formData) {
        if (key === "sensitiveWord") {
          if (
            formData[key] &&
            Array.isArray(formData[key]) &&
            formData[key].length
          ) {
            formData[key] = formData[key].join(",");
          } else {
            formData[key] = [];
          }
        }
      }
      this.$set(formData, "isGatewayGroup", this.isGatewayGroup);
      return formData;
    },

    /**
     * 提交成功后执行
     * @param res
     */
    _mxSuccess(res, params) {
      if (resOk(res)) {
        //如果是页面新增、修改，则返回列表页
        if (this.isPage) {
          window.history.back();
        }
        this.$message.success(res.msg || res.data);
        this._mxGetList();
        this.addChannel = false;
      } else {
        this.formConfig.forEach(item => {
          if (item.key === "sensitiveWord") {
            let arr = params.sensitiveWord.split(",");
            item.defaultValue = arr.map(item => Number(item));
          }
        });
        this.$message.error(res.data || res.msg);
      }
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysExemptReviewManage {
  // overflow-y: auto;
}
</style>
