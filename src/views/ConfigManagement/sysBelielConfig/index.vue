<template>
  <!--优化比例配置-->
  <div class="sysBelielConfig">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="optimizeType" label="优化类型">
        <template slot-scope="scope">
          <span v-if="scope.row.optimizeType === 1">正常</span>
          <span v-if="scope.row.optimizeType === 2">对比库</span>
          <span v-if="scope.row.optimizeType === 3">仅黑名单</span>
        </template>
      </el-table-column>
      <el-table-column prop="optimizePercent" label="优化比例" />
      <el-table-column prop="noOptimizeTemplate" label="不优化关键词" />
      <el-table-column prop="optimizeTemplate" label="优化关键词" />
      <el-table-column prop="noOptimizeCode" label="不优化特服号" />
      <el-table-column prop="startTime" label="开始时间(时:分)" />
      <el-table-column prop="endTime" label="结束时间(时:分)" />
      <el-table-column label="操作" width="200" fixed="right"
        >1458
        <template slot-scope="scope">
          <el-button @click="edit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
          >
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
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
        @onChange="onChange"
      >
        <template v-slot:isChooseProviceOrCity>
          <el-button
            style="float: right; margin-top: 5px"
            type="primary"
            size="small"
            @click="chooseCitys"
            >请选择
          </el-button>
        </template>
      </FormItem>
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
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
        @onChange="onChange"
      ></FormItem>
    </el-dialog> -->
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
    <el-dialog
      title="选择省份或城市"
      :visible.sync="isChoose"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
      <el-tree
        ref="tree"
        style="max-height: 400px; overflow-y: auto"
        :default-checked-keys="navListId"
        :data="navList"
        show-checkbox
        node-key="city"
        :props="{ label: 'city', children: 'children' }"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isChoose = false">取 消</el-button>
        <el-button type="primary" @click="handleChooseConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorSign = (rule, value, callback) => {
      // let regex = new RegExp("^([0]|[1-9][0-9]*)$");
      // if (value === "") {
      //   callback(new Error("此项不能为空"));
      // } else {
      //   if (!regex.test(value)) {
      //     callback(new Error("请输入不超过100的数字"));
      //   } else {
      //     if (value > 100 || value < 0) {
      //       callback(new Error("请输入不超过100的数字"));
      //     } else {
      //       callback();
      //     }
      //   }
      // }
      if (!value && value !== 0) {
        callback(new Error("请输入必填项"));
      } else {
        if (value == 100) {
          callback();
        }
        const reg = new RegExp("^([1-9]|[1-9][0-9])$");
        reg.test(value)
          ? callback()
          : callback(new Error("请输入大于0且不超过100的整数"));
      }
    };
    const validatorTemplate = (rule, value, callback) => {
      if (value) {
        let firstStr = value.substring(0, 1);
        let lastStr = value.substring(value.length, value.length - 1);
        if (firstStr === "|" || lastStr === "|") {
          callback(new Error("不能以'|'为开头结尾"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "corpUserOptimize",
        list: "queryByPage",
        detele: "delete"
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
          key: "corporateId"
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
          type: "inputNum",
          label: "特服号",
          key: "code"
        },
        {
          type: "input",
          label: "不优化词",
          key: "noOptimizeTemplate"
        },
        {
          type: "input",
          label: "优化词",
          key: "optimizeTemplate"
        },
        {
          type: "input",
          label: "不优化特服号",
          key: "noOptimizeCode"
        },
        {
          type: "select",
          label: "优化类型",
          optionData: [
            { key: "1", value: "正常" },
            { key: "2", value: "对比库" },
            {
              key: 3,
              value: "仅黑名单"
            },
          ],
          key: "optimizeType"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "客户特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "优化类型",
          // initDefaultValue: 1,
          // defaultValue: 1,
          key: "optimizeType",
          optionData: [
            {
              key: 1,
              value: "正常"
            },
            {
              key: 2,
              value: "对比库"
            },
            {
              key: 3,
              value: "仅黑名单"
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "优化比例",
          key: "optimizePercent",
          specialSymbols: "%",
          rules: [
            {
              required: true,
              validator: validatorSign,
              trigger: "blur"
            }
          ]
        },
        {
          type: "textarea",
          label: "不优化特服号",
          key: "noOptimizeCode",
          maxlength: 200,
          placeholder: "请输入模板内容，多条内容请用英文“,”隔开",
          rules: [
            // { required: true, message: "请输入必填项", trigger: "blur" },
            // {
            //   trigger: "change",
            //   validator: validatorTemplate
            // }
          ]
        },
        {
          type: "textarea",
          label: "不优化地区",
          key: "noOptimizeProvince",
          colSpan: 12,
          maxlength: 200,
          placeholder: "请选择不优化地区",
          disabled: true,
          // 可选择省份和城市进行赋值
          isChooseProviceOrCity: true
        },
        
        {
          type: "textarea",
          label: "不优化关键词",
          key: "noOptimizeTemplate",
          maxlength: 200,
          placeholder: "请输入模板内容，多条内容请用英文“,”隔开",
          rules: [
            // { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "change",
              validator: validatorTemplate
            }
          ]
        },
        {
          type: "textarea",
          label: "优化关键词",
          key: "optimizeTemplate",
          maxlength: 200,
          placeholder: "请输入模板内容，多条内容请用英文“,”隔开",
          rules: [
            // { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "change",
              validator: validatorTemplate
            }
          ]
        },
        {
          type: "time",
          label: "开始时间",
          key: "startTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "time",
          label: "结束时间",
          key: "endTime"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: "",
      isChooseUser: false,
      isParamsNotData: false,

      isChoose: false,
      navListId: [],
      navList: []
    };
  },
  mounted() {
    this.getProvinceTree();
  },
  activated() {
    //重新获取数据
    this._mxGetList();
  },
  methods: {
    chooseCitys() {
      this.getProvinceTree(); // 折叠tree
      this.isChoose = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]); // 先清空已经选中的数据
        const idx = this.formConfig.findIndex(v => v.key === "noOptimizeProvince");
        const val = this.formConfig[idx].defaultValue;
        this.navListId = val ? val.split(",") : [];
      })
    },
    handleChooseConfirm() {
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const idx = this.formConfig.findIndex(v => v.key === "noOptimizeProvince");
      this.$set(this.formConfig[idx], "defaultValue", checkedKeys.join(","));
      this.isChoose = false;
    },
    getProvinceTree() {
      this.$http.gateway.getProvinceTree().then(res => {
        this.navList = res.data.map(v => {
          return { city: v.provinceName, children: v.children };
        });
      });
    },
    onChange({ val, item }) {
      let time;
      if (item.key === "startTime") {
        time = { selectableRange: val ? `${val} - 23:59:59` : "" };
        this.formConfig[this.formConfig.length - 1].pickerOptions = time;
      } else if (item.key === "endTime") {
        time = { selectableRange: val ? `00:00:00 - ${val}` : "" };
        this.formConfig[this.formConfig.length - 2].pickerOptions = time;
      }
    },
    /**
     * 删除列表中项目
     * @param id
     * @private
     */
    _mxDeleteItem(key, id) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [
          h("p", null, "您确定要删除此项吗？")
          // h('p', {
          //     style: 'color: red'
          // }, '删除后，将不再执行重发，请谨慎操作')
        ]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(action => {
        const params = {};
        params[key] = id.toString();
        const { namespace, detele } = this.searchAPI;
        this.$http[namespace][detele](params).then(res => {
          if (resOk(res)) {
            this.$message.success("删除成功！");
            this._mxGetList();
          } else {
            this.$message.info("删除失败！");
          }
        });
      });
    },
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
    edit(row, ID) {
      // this.$router.push({
      //   name: "sysBelielConfigType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key] !== "-" ? row[key] : "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },

    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then(res => {
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
          id: this.id,
          ...form
        };
        this.$http.corpUserOptimize.addOrUpdate(params).then(res => {
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
      // this.$router.push({
      //   name: "sysBelielConfigType",
      //   query: { type: "create" }
      // });
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
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysBelielConfig {
}
</style>
