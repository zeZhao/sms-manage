<template>
  <!--设置LOGO-->
  <div class="setLogo">
    <div id="searchPanel">
      <el-button type="primary" @click="_mxCreate" style="">新建</el-button>
    </div>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="masterLogoUrl" label="大LOGO" width="220">
        <template slot-scope="scope">
          <el-image
            style="width: 200px; height: 50px"
            :src="`${origin}${scope.row.masterLogoUrl}`"
            :preview-src-list="[`${origin}${scope.row.masterLogoUrl}`]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="slaveLogoUrl" label="小LOGO">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 50px"
            :src="`${origin}${scope.row.slaveLogoUrl}`"
            :preview-src-list="[`${origin}${scope.row.slaveLogoUrl}`]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="operater" label="操作人" />
      <el-table-column prop="operateTime" label="操作时间" width="135">
        <template slot-scope="scope">{{
          scope.row.operateTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="_mxDeleteItem('id', scope.row.id)"
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
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
        @handleExceed="handleExceed"
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
        namespace: "smsUserLogo",
        list: "listUserLogoByPage",
        detele: "deleteUserLogo",
        add: "addUserLogo",
        edit: ""
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        // {
        //   type: "inputNum",
        //   label: "商户编号",
        //   key: "corpId"
        // },
        // {
        //   type: "inputNum",
        //   label: "账户编号",
        //   key: "userId"
        // },
        // {
        //   type: "input",
        //   label: "账户名称",
        //   key: "userName"
        // },
        // {
        //   type: "inputNum",
        //   label: "特服号",
        //   key: "code"
        // },
        // {
        //   type: "input",
        //   label: "签名",
        //   key: "sign"
        // }
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
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "upload",
          label: "大LOGO",
          key: "masterLogoUrl",
          accept: ["png", "jpg", "jpeg"],
          defaultValue: "",
          tip: "支持jpg/jpeg/png,大小在200kb之内",
          defaultFileList: []
        },
        {
          type: "upload",
          label: "小LOGO",
          key: "slaveLogoUrl",
          accept: ["png", "jpg", "jpeg"],
          defaultValue: "",
          tip: "支持jpg/jpeg/png,大小在200kb之内",
          defaultFileList: []
        }
      ],
      isChooseUser: false,
      // origin: window.location.origin
      origin: "http://manage.sms.jvtdtest.top/"
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
    //文件上传成功
    handleSuccess({ response, file, fileList, item }) {
      if (response.code == 200) {
        const { accept, size, key } = item;
        let fileType = file.raw.name.split(".")[1];
        let fileSize = file.size;
        let isLt1M = size ? size * 1024 * 1024 : 0.2 * 1024 * 1024;
        if (accept && accept.lenght != 0) {
          if (!accept.includes(fileType) || fileSize > isLt1M) {
            this.$message.error("支持jpg/jpeg/png,大小在200kb之内");
            this.formConfig.forEach(item => {
              if (item.key === key) {
                item.defaultValue = "";
                item.defaultFileList = [];
              }
            });
            return false;
          }
        }
        this.formConfig.forEach(item => {
          if (item.key === key) {
            item.defaultValue = response.data;
            item.defaultFileList = [response.data];
          }
        });
      } else {
        this.$message.error(response.data);
      }
    },
    handleRemove({ file, fileList, item }) {
      const { key } = item;
      this.formConfig.forEach(item => {
        if (item.key === key) {
          item.defaultValue = "";
          item.defaultFileList = [];
        }
      });
    },
    handleExceed({ file, fileList }) {
      this.$message.error("仅允许上传一张！");
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.setLogo {
  #searchPanel {
    text-align: right;
    padding-bottom: 16px;
  }
}
</style>
