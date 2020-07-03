<template>
  <!--分省路由-->
  <div class="sysProvinceRoute">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.type == 1
            ? "特服号"
            : scope.row.type == 2
            ? "客户ID"
            : "企业ID"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="provinceName" label="省份" />
      <el-table-column prop="cm" label="移动通道" />
      <el-table-column prop="cu" label="联通通道" />
      <el-table-column prop="ct" label="电信通道" />
      <el-table-column prop="modifyTime" label="修改时间" />
      <el-table-column prop="modifier" label="修改人" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('routeId', scope.row.routeId)"
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
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
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
      //接口地址
      searchAPI: {
        namespace: "sysProvinceRoute",
        list: "listProvinceRouteByPage",
        detele: "deleteProvinceRoute"
      },
      // 列表参数
      namespace: "provinceRoute",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          placeholder: "请选择省份",
          optionData: []
        },
        {
          type: "select",
          label: "运营商",
          key: "operator",
          placeholder: "请选择运营商",
          optionData: [
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" }
          ]
        },
        {
          type: "input",
          label: "通道号",
          key: "route",
          placeholder: "请输入通道号"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          placeholder: "请选择类型",
          optionData: [
            { key: "1", value: "特服号" },
            { key: "2", value: "客户ID" },
            { key: "3", value: "企业ID" }
          ]
        },
        {
          type: "input",
          label: "通道特服号",
          key: "code",
          placeholder: "请输入通道特服号"
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
          key: "corporateId",
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
          key: "type",
          optionData: [
            { key: 1, value: "特服号" },
            { key: 2, value: "客户ID" },
            { key: 3, value: "企业ID" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: []
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: []
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ct"
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark"
        }
      ],
      routeId: "",
      ProvinceList: [], //省列表
      GatewayList: [], //通道列表
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway("cu", "1", "", "");
    this.gateway("ct", "", "1", "");
    this.gateway("cm", "", "", "1");
    this.listSysProvince();
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
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "province",
          "provinceId",
          "provinceName"
        );
        //province
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "province",
          "provinceId",
          "provinceName"
        );
      });
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
        this.$http.sysProvinceRoute.addProvinceRoute(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          data: {
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysProvinceRoute.updateProvinceRoute(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
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
      });
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    /*
     * 表格数据处理
     * */
    _mxFormListData(list) {
      list.forEach(item => {
        item.province &&
          this.ProvinceList.forEach(t => {
            if (item.province == t.provinceId) {
              this.$set(item, "provinceName", t.provinceName);
              // item.province = t.provinceName;
            }
          });
      });
      return list;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysProvinceRoute {
}
</style>
