<template>
  <!--接口加强签名-->
  <div class="sysInterfaceSign">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <!-- <el-table-column prop="businessType" label="类型">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.businessType == 1
                ? "特服号"
                : scope.row.businessType == 2
                ? "账户编号"
                : "商户编号"
            }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="modifyUser" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'signId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('signId', scope.row.signId)"
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
    <el-dialog
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
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorSign = (rule, value, callback) => {
      let regex = new RegExp(
        "^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){2,8}$"
      );
      if (value === "") {
        callback(new Error("此项不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入2-8位，只能输入中文、英文、数字"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysInterfaceSign",
        list: "listInterfaceSignByPage",
        detele: "deleteInterfaceSign",
        add: "addInterfaceSign",
        edit: "updateInterfaceSign"
      },
      // 列表参数
      namespace: "",
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
          type: "input",
          label: "特服号",
          key: "code"
        },
        {
          type: "input",
          label: "签名",
          key: "sign"
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "businessType",
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
        //   placeholder: "类型"
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
          defaultValue: "",
          btnDisabled: false,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "businessType",
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "特服号"
        //     },
        //     {
        //       key: 2,
        //       value: "账户编号"
        //     },
        //     {
        //       key: 3,
        //       value: "商户编号"
        //     }
        //   ],
        //   rules: [
        //     {
        //       required: true,
        //       message: "请输入必填项",
        //       trigger: ['blur', 'change']
        //     }
        //   ]
        // },
        {
          type: "textarea",
          label: "签名",
          key: "sign",
          maxlength: "8",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            },
            {
              trigger: "change",
              validator: validatorSign
            }
          ]
        }
      ],
      isChooseUser: false
    };
  },
  mounted() {},
  computed: {},
  methods: {
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
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    _mxEdit(row, ID) {
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
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", true);
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
