<template>
  <!--签名路由管理-->
  <div class="mmsUserGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="用户编号" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === 1
              ? "特服号"
              : scope.row.type === 2
              ? "用户编号"
              : "商户编号"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sign" label="签名" show-overflow-tooltip />
      <el-table-column prop="cm" label="移动通道" />
      <el-table-column prop="cu" label="联通通道" />
      <el-table-column prop="ct" label="电信通道" />
      <!-- <el-table-column prop="updateTime" label="修改时间">
            <template slot-scope="scope">{{scope.row.updateTime | timeFormat}}</template>
        </el-table-column> -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('routeId', scope.row.routeId)"
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
        @submit="submit"
        @cancel="cancel"
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
      let regex = /^[\u4e00-\u9fa5a-zA-Z0-9]{2,8}$/;
      if (value == "" || value == null || value == undefined) {
        callback(new Error("此项不能为空"));
      } else {
        let data = value.split(",");
        data.forEach((item, k) => {
          if (item.indexOf("，") !== -1) {
            callback(new Error("只可以用英文','分割"));
          } else if (!regex.test(item)) {
            callback(new Error("输入2-8位，只能输入中文、英文、数字"));
          } else {
            callback();
          }
        });
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSignRoute",
        list: "listSignRouteByPage",
        detele: "deleteSignRoute"
      },
      // 列表参数
      namespace: "signRoute",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "用户编号",
          key: "userId",
          placeholder: "请输入用户编号"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          placeholder: "请输入签名"
        },
        {
          type: "inputNum",
          label: "用户特服号",
          key: "code",
          placeholder: "请输入用户特服号"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "用户编号"
            },
            {
              key: 3,
              value: "商户编号"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "inputNum",
          label: "电信通道",
          key: "ct",
          placeholder: "请输入电信通道"
        },
        {
          type: "inputNum",
          label: "联通通道",
          key: "cu",
          placeholder: "请输入联通通道"
        },
        {
          type: "inputNum",
          label: "移动通道",
          key: "cm",
          placeholder: "请输入移动通道"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户编号",
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
              trigger: "blur"
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            }
          ]
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
              trigger: "blur"
            }
          ]
        },
        {
          type: "textarea",
          label: "商户签名",
          key: "sign",
          placeholder:
            "可输入多个签名，用','隔开每个签名为2-8个字符，支持汉字、数字、英文",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            },
            {
              trigger: "blur",
              validator: validatorSign
            }
          ]
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "用户编号"
            },
            {
              key: 3,
              value: "商户编号"
            }
          ]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            }
          ]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            }
          ]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ct",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: "blur"
            }
          ]
        }
      ],
      routeId: "",
      GatewayList: [], // 通道列表
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway("cu", "2", "1");
    this.gateway("ct", "3", "1");
    this.gateway("cm", "1", "1");
  },
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
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
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.name);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysSignRoute.addSignRoute(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSignRoute.updateSignRoute(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
      });
    },
    edit(row) {
      this.routeId = row.routeId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
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
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
